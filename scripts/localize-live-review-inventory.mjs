import fs from 'node:fs/promises';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {stripTypeScriptTypes} from 'node:module';
import {englishProjection,translate} from './lib/translate-thai-inventory.mjs';
const root=new URL('../',import.meta.url);
await fs.mkdir(new URL('work/thai-inventory/',root),{recursive:true});
const source=await fs.readFile(new URL('app/page.tsx',root),'utf8');
const translations=await fs.readFile(new URL('app/questionTranslations.th.ts',root),'utf8');
const data=source.slice(0,source.indexOf('const learningCatalog:')).replace(/^import .*?;\s*/gmu,'');
const localizer=source.slice(source.indexOf('const thaiStimulusSources:'),source.indexOf('function localizeAnswerOption('));
const js=stripTypeScriptTypes(translations.replace(/^export /gm,'')+'\n'+data+'\n'+localizer);
const model=vm.runInNewContext(js+'\nJSON.parse(JSON.stringify({pairs:allAssessmentItems.map(q=>({en:q,th:localizeQuestion(q,"th",true)})),marketTrendFrames,competencyDefinitions,competencyLabelsTh,skillLabelsTh}))',{}, {timeout:10000});
const pairs=model.pairs;
const overrides=JSON.parse(await fs.readFile(new URL('inventory/th/live-review-overrides.json',root),'utf8'));
function translateLive(text) {
  if(overrides[text])return overrides[text];
  const m=text.match(/^(.*?) Focus competency: (.*?)\. The user should show they (recognizes|uses|handles tradeoffs in|designs scalable controls for) (.*?) using practical signals such as (.*?)\.$/);
  if(m){
    const frame=Object.values(model.marketTrendFrames).flat().find(f=>f.context===m[1]);
    const competency=Object.values(model.competencyDefinitions).find(c=>c.label===m[2]);
    const skillNames=m[5].split(', ');
    if(frame?.contextTh&&competency&&skillNames.every(s=>model.skillLabelsTh[s])) {
      const lead={recognizes:'รู้จัก',uses:'ประยุกต์ใช้','handles tradeoffs in':'พิจารณาข้อแลกเปลี่ยนเกี่ยวกับ','designs scalable controls for':'ออกแบบมาตรการที่รองรับการขยายสำหรับ'}[m[3]];
      const label=model.competencyLabelsTh[competency.id];
      return `${frame.contextTh} Competency ที่วัด: ${label} ผู้ใช้ควรแสดงให้เห็นว่า${lead}${label} โดยมีแนวทางปฏิบัติที่ชัดเจน เช่น ${skillNames.map(s=>model.skillLabelsTh[s]).join(', ')}`;
    }
  }
  return translate(text);
}
const byId=new Map(pairs.map(p=>[p.en.id,p]));
function options(q) {
  if(q.parts?.length)return q.parts.flatMap(p=>p.options.map(o=>({...o,id:`${p.id}:${o.id}`})));
  if(q.matchPairs?.length)return q.matchPairs.map((p,i)=>({id:p.id??`match-${i+1}`,label:`${p.left} -> ${p.correct}`}));
  if(q.rankItems?.length)return q.rankItems.map((p,i)=>({id:p.id,label:`${i+1}. ${p.label}`}));
  return q.options??[];
}
const path=new URL('exports/review-inventory/live-questions.json',root);
const payload=JSON.parse(await fs.readFile(path,'utf8'));
const before=englishProjection(payload);const missing=[];let reused=0;
const fill=(obj,key,target,targetKey,english,thai,id)=>{
  if(!obj[key])return;
  if(obj[key]===english && thai && thai!==english){target[targetKey]=thai;reused++;}
  else {try{target[targetKey]=translateLive(obj[key]);}catch{missing.push({id,field:key,en:obj[key]});}}
};
for(const q of payload.questions){
  const pair=byId.get(q.id);if(!pair)throw new Error(`Live source missing ${q.id}`);
  const {en,th}=pair;q.th??={};
  fill(q,'context',q.th,'context',en.context,th.context,q.id);
  fill(q,'prompt',q.th,'prompt',en.prompt,th.prompt,q.id);
  const enOpts=options(en),thOpts=options(th);
  const rationale=x=>x.exemplarAnswer||(x.options??[]).find(o=>q.correctOptionIds.includes(o.id))?.feedback||'';
  fill(q,'rationale',q.th,'rationale',rationale(en),rationale(th),q.id);
  const fillOpts=arr=>{for(const o of arr??[]){const eo=enOpts.find(x=>x.id===o.id),to=thOpts.find(x=>x.id===o.id);fill(o,'label',o,'thLabel',eo?.label,to?.label,q.id);fill(o,'feedback',o,'thFeedback',eo?.feedback,to?.feedback,q.id);}};
  fillOpts(q.options);
  const d=q.userFacingDraft;
  if(d){d.th??={};fill(d,'context',d.th,'context',en.context,th.context,q.id);fill(d,'prompt',d.th,'prompt',en.prompt,th.prompt,q.id);fill(d,'explanation',d.th,'explanation',en.exemplarAnswer||'',th.exemplarAnswer||'',q.id);d.th.rewriteNotes='คำถามที่ใช้งานอยู่ แสดงเพื่อให้ผู้ตรวจทาน';fillOpts(d.options);}
  const a=q.artifactNeed;
  if(a){a.th??={};for(const k of ['need','artifactLabel','artifactBrief','generationPrompt','prompt']){
    if(!a[k])continue;
    const known={need:'หลักฐานประกอบที่มีอยู่',artifactLabel:th.stimulus?.label??th.visualStimulus?.title,artifactBrief:th.stimulus?.caption??th.visualStimulus?.summary};
    const enKnown={artifactLabel:en.stimulus?.label??en.visualStimulus?.title,artifactBrief:en.stimulus?.caption??en.visualStimulus?.summary};
    if(a[k].startsWith('Existing artifact path: '))a.th[k]='ตำแหน่งหลักฐานประกอบที่มีอยู่: '+a[k].slice(24);
    else if(k==='need'&&a[k]==='existing artifact')a.th[k]=known.need;
    else fill(a,k,a.th,k,enKnown[k],known[k],q.id);
  }}
  q.locale='en-th';
}
assert.deepEqual(englishProjection(payload),before);
await fs.writeFile(new URL('work/thai-inventory/live-missing.json',root),JSON.stringify(missing,null,2));
await fs.writeFile(new URL('work/thai-inventory/live-staged.json',root),JSON.stringify(payload,null,2));
console.log(JSON.stringify({questions:payload.questions.length,modelQuestions:pairs.length,reused,missing:missing.length,uniqueMissing:[...new Set(missing.map(m=>m.en))].length,extraModelIds:pairs.filter(p=>!payload.questions.some(q=>q.id===p.en.id)).map(p=>p.en.id)}));
if(missing.length===0){payload.translation={thStatus:'machine-assisted-needs-review',generatedAt:new Date().toISOString(),translatedQuestions:payload.questions.length,note:'Reuses id-matched source Thai where English text matches, with new translations for historical export wording. Review-export translations do not change live question scoring or approval.'};await fs.writeFile(path,JSON.stringify(payload,null,2)+'\n');}
