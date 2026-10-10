import fs from 'node:fs';
import assert from 'node:assert/strict';
import {candidates} from '../inventory/english-review-candidates.mjs';
import {translate} from './lib/translate-thai-inventory.mjs';

const root=new URL('../',import.meta.url);
const read=p=>JSON.parse(fs.readFileSync(new URL(p,root),'utf8'));
const write=(p,v)=>fs.writeFileSync(new URL(p,root),JSON.stringify(v,null,2)+'\n');
const file='exports/review-inventory/questions.json';
const bank=read(file);
const log=fs.readFileSync(new URL('docs/QUESTION_REWRITE_RULE_REVIEW_LOG.md',root),'utf8').replace(/\r\n/g,'\n');
const version='2026-09-30.1';
const historyPath='exports/review-inventory/english-rewrite-history.json';
const history=fs.existsSync(new URL(historyPath,root))?read(historyPath):{version,sourceCommit:'0f844b6',rules:'2.1 + 2.2-draft',status:'draft-for-localisation-audit',items:[]};
const archived=new Set(history.items.map(x=>x.questionId));
const fullTextPath='inventory/th/reviewed-rewrites.json';
const fullText=fs.existsSync(new URL(fullTextPath,root))?read(fullTextPath):{};
const reports=[];
const structure=d=>JSON.stringify({interaction:d.interaction,format:d.format,options:d.options?.map(o=>o.id),keys:d.correctOptionIds,parts:d.parts?.map(p=>({id:p.id,options:p.options.map(o=>o.id),keys:p.correctOptionIds}))});

for(const q of bank.questions){
  if(q.userFacingDraft?.rewriteVersion>=version)continue;
  const d=q.userFacingDraft;
  if(!d)continue;
  const before=structuredClone(d), signature=structure(d);
  // Put each operational cue beside the decision it supports. Do not manufacture
  // a new scenario, change the selected interaction, or invent partial scoring.
  const cue=q.sourceScenario?.overlayEvidence;
  const action=d.parts?.find(p=>p.id==='action');
  if(cue&&action?.prompt.match(/do about the extra detail\?$/)){
    const leader=q.layer==='executive';
    action.prompt=`${cue}\nWhat should the ${leader?'leader':'team'} do next?`;
    action.thPrompt=`${translate(cue)}\n${leader?'ผู้นำ':'ทีม'}ควรทำอะไรต่อไป`;
    d.context=d.context.replace(`\nAdditional detail: ${cue}`,'');
    d.th.context=translate(d.context);
  }
  if(d.interaction==='parts'){
    d.prompt='Answer both questions. Choose one answer for each.';
    d.th.prompt='ตอบทั้งสองข้อ โดยเลือกคำตอบข้อละหนึ่งตัวเลือก';
  }else if(d.interaction==='multi'){
    // A one-key multi-select remains a content issue; do not invent another key.
    d.prompt=d.prompt.replace('Select all that apply.',`Select ${d.correctOptionIds.length} answer${d.correctOptionIds.length===1?'':'s'}.`);
    d.th.prompt=before.th.prompt.replace(/เลือกทุกข้อที่ถูกต้อง|เลือกทุกข้อที่ใช่|เลือกทุกข้อที่เหมาะสม/g,`เลือก ${d.correctOptionIds.length} คำตอบ`);
    if(!d.th.prompt.includes(String(d.correctOptionIds.length)))d.th.prompt=translate(before.prompt.replace(' Select all that apply.',''))+` เลือก ${d.correctOptionIds.length} คำตอบ`;
  }
  const candidate=candidates.find(c=>{
    const section=log.split(`## ${c.heading}\n`)[1]?.split('\n## ')[0];
    return section?.includes('`'+q.id+'`');
  });
  if(candidate){
    const section=log.split(`## ${candidate.heading}\n`)[1].split('\n## ')[0];
    d.context=section.split('\n').filter(l=>l.startsWith('>')).map(l=>l.replace(/^> ?/,'')).join('\n').trim();
    d.th.context=candidate.context;
    const questions=[...section.matchAll(/^\d\. (.+)$/gm)].map(m=>m[1]);
    const choices=[...section.matchAll(/^   - [AB]\. (.+)$/gm)].map(m=>m[1]);
    assert.equal(questions.length,2,q.id);assert.equal(choices.length,4,q.id);
    d.parts.forEach((p,i)=>{
      p.prompt=questions[i];p.thPrompt=candidate.prompts[i];
      p.options.forEach((o,j)=>{o.label=choices[i*2+j];o.thLabel=candidate.options[i][j];});
    });
    if(candidate.explanation){
      d.explanation=section.match(/Explanation: ([^\n]+)/)[1];
      if(candidate.explanationEnd)d.explanation=d.explanation.split(candidate.explanationEnd)[0];
      d.th.explanation=candidate.explanation;
    }
    d.reviewedWordingSource=`docs/QUESTION_REWRITE_RULE_REVIEW_LOG.md#${candidate.heading.toLowerCase().replaceAll(' ','-')}`;
  }
  assert.equal(structure(d),signature,`${q.id}: selected format/order/key changed`);
  // Keep complete bilingual rewrites reusable by the strict translation command.
  const pair=(en,th)=>{if(en&&th)fullText[en]=th;};
  pair(d.context,d.th.context);pair(d.prompt,d.th.prompt);pair(d.explanation,d.th.explanation);
  for(const p of d.parts??[]){pair(p.prompt,p.thPrompt);for(const o of p.options)pair(o.label,o.thLabel);}
  d.rewriteVersion=version;d.rewriteRulesVersion='2.1 + provisional 2.2-draft';
  d.rewriteReviewStatus='pending-human-audit';
  if(!archived.has(q.id))history.items.push({questionId:q.id,previousDraft:before,preferredVersion:null});
}
const contentIssues=bank.questions.flatMap(q=>{
  const d=q.userFacingDraft, issues=[];
  if(d.interaction==='rank')issues.push('Full ranking key and scoring are not defined.');
  if(d.interaction==='multi'&&d.correctOptionIds.length===1)issues.push('Selected multi-select format currently has only one correct answer.');
  if(d.interaction==='parts')issues.push('Per-part scoring is not defined; the audit 100/0 scoring must not be transferred.');
  return issues.map(issue=>({questionId:q.id,issue}));
});
for(const candidate of candidates){
  if(!candidate.issue)continue;
  const q=bank.questions.find(q=>q.userFacingDraft.reviewedWordingSource?.endsWith('#'+candidate.heading.toLowerCase().replaceAll(' ','-')));
  if(q)reports.push({questionId:q.id,issue:candidate.issue});
}
assert.equal(bank.questions.filter(q=>q.userFacingDraft?.reviewedWordingSource).length,candidates.length,'All agreed checkpoints must be applied');
write(fullTextPath,fullText);
write(historyPath,history);
write(file,bank);
write('exports/review-inventory/english-rewrite-qa.json',{version,rules:'2.1 + provisional 2.2-draft',questions:bank.questions.length,agreedTextCandidatesApplied:candidates.length,status:'pending-human-audit',auditSourceAndScoringPreserved:true,contentIssues:[...reports,...contentIssues],artifactDependentCandidates:'Marketing agreed image candidates remain in the review log pending bilingual artifact integration; their original evidence is retained.'});
console.log(JSON.stringify({questions:bank.questions.length,agreedCandidates:candidates.length,archived:history.items.length,contentIssues:reports.length+contentIssues.length}));
