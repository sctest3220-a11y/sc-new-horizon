import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {fields} from './lib/thai-inventory-text.mjs';
import {translate,englishProjection} from './lib/translate-thai-inventory.mjs';

const root=new URL('../exports/review-inventory/',import.meta.url);
const payload=JSON.parse(await fs.readFile(new URL('questions.json',root),'utf8'));
const before=englishProjection(payload);
const missing=[];let translatedFields=0;
const contentIssues=[];
for(const q of payload.questions) {
  const pendingEnglishSync = q.userFacingDraft?.englishWordingReview?.thaiStatus === 'previous-revision-pending-sync';
  const draftObjects = pendingEnglishSync ? new Set([q.userFacingDraft, ...(q.userFacingDraft.options??[]), ...(q.userFacingDraft.parts??[]).flatMap(p=>[p,...p.options])]) : new Set();
  if(pendingEnglishSync)contentIssues.push({id:q.id,type:'thai-wording-sync-pending',note:'English wording was accepted separately. Preserve the prior Thai draft until its translation is explicitly synchronized.'});
  for(const f of fields(q)) {
    if(draftObjects.has(f.obj))continue;
    try {
      const thai=translate(f.text);
      f.thaiObj[f.thaiKey]=f.key==='feedback' && f.obj.score===100 && !thai.startsWith('ดีที่สุด') ? `ดีที่สุด ${thai}` : thai;
      translatedFields++;
    }
    catch(error) {missing.push({id:q.id,field:f.key,source:f.text,error:error.message});}
  }
  q.locale='en-th';
  if(/with a highlighted mismatch|with marked failure|claim highlighted|one misleading metric|one risky ambiguity/i.test(q.artifactNeed?.generationPrompt??''))contentIssues.push({id:q.id,type:'artifact-answer-cue',note:'Source brief requests highlighting or marking evidence. Review against the neutral-evidence artifact standard before producing an assessment image.'});
}
assert.deepEqual(englishProjection(payload),before);
if(missing.length) {
  await fs.writeFile(new URL('thai-translation-missing.json',root),JSON.stringify(missing,null,2)+'\n');
  throw new Error(`${missing.length} missing fields; inventory was not changed.`);
}
const allowed=new Set(['AI','Model','Prompt','Workflow','Dashboard','Agent','RAG','CRM','HR','CEO','API','ROI','KPI','IT','LLM','Large','Language','token','embedding','fine-tuning','A','B','C','D','Competency','Assessment','Platform']);
const issues=[];
for(const q of payload.questions)for(const f of fields(q)) {
  const text=f.thaiObj[f.thaiKey];
  const fragments=[...new Set((text.match(/[A-Za-z]+(?:-[A-Za-z]+)*/g)??[]).filter(x=>!allowed.has(x)))];
  if(fragments.length||/\{\{|\uFFFD/.test(text))issues.push({id:q.id,field:f.key,fragments,text});
}
if(issues.length)console.error(JSON.stringify({fragments:[...new Set(issues.flatMap(i=>i.fragments))],examples:issues.slice(0,2)},null,2));
assert.equal(issues.length,0,'Untranslated or corrupted fragments remain; inventory was not changed.');
const generatedAt=new Date().toISOString();
payload.translation={thStatus:'machine-assisted-needs-review',generatedAt,qaIssueCount:0,translatedQuestions:payload.questions.length,translatedFields,rulesVersion:'2.1 + provisional 2.2-draft; English/Thai refinements 2026-10-01.1',method:'Complete sentence templates with explicit context terms; no fragment substitution or English fallback.',note:'Thai translation is complete for the inventoried text fields. Human linguistic review, semantic spot checks and artifact review remain required before production assessment use.'};
await fs.writeFile(new URL('questions.json',root),JSON.stringify(payload,null,2)+'\n');
await fs.writeFile(new URL('thai-translation-qa.json',root),JSON.stringify({generatedAt,issueCount:issues.length,translatedQuestions:payload.questions.length,translatedFields,scope:'Audit context, prompt, rationale, option labels and feedback; user-facing context, prompt, explanation, rewrite notes, options and parts; artifact brief and generation prompt.',topFragments:[],issues,contentReviewIssueCount:contentIssues.length,contentReviewIssues:contentIssues,note:'Zero scanner findings is not human approval. Artifact images are not altered by this text translation.'},null,2)+'\n');
console.log(JSON.stringify(payload.translation,null,2));
