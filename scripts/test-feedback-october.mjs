import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {feedbackBatch, feedbackSignature, applyFeedbackCheckpoint} from '../inventory/feedback-checkpoints.mjs';
import {fields} from './lib/thai-inventory-text.mjs';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const bank=['questions.json','live-questions.json'].flatMap(f=>read('exports/review-inventory/'+f).questions);
const byId=new Map(bank.map(q=>[q.id,q]));

test('original bilingual audit text remains identical to the saved source snapshot',()=>{
 const saved=new Map(read('exports/review-inventory/versions/2026.10.05-V.0.json').questions.map(q=>[q.id,q]));
 for(const q of bank){
  const original=saved.get(q.id);
  for(const key of ['context','prompt','rationale','options','th'])assert.deepEqual(q[key],original[key],`${q.id}:${key}`);
 }
});

test('every imported feedback entry has an ID-bound disposition and immutable source digest',()=>{
 const raw=fs.readFileSync(new URL('../'+feedbackBatch.source,import.meta.url));
 assert.equal(createHash('sha256').update(raw).digest('hex'),feedbackBatch.sourceSha256);
 const feedback=JSON.parse(raw);
 assert.equal(Object.keys(feedback.questions).length,229);
 assert.equal(Object.values(feedback.questions).flat().length,238);
 assert.deepEqual(Object.keys(feedbackBatch.items).sort(),Object.keys(feedback.questions).sort());
 for(const [id,item] of Object.entries(feedbackBatch.items)){
  assert.ok(item.disposition&&item.notes.length,id);
  assert.deepEqual(new Set(item.feedbackIds),new Set(feedback.questions[id].map(r=>r.id)),id);
  const d=byId.get(id).userFacingDraft;
  assert.deepEqual(feedbackSignature(d),item.signature,id);
  for(const [key,value] of Object.entries(item.patch))assert.deepEqual(d[key],value,`${id}:${key}`);
  for(const f of fields({userFacingDraft:structuredClone(d)})){
   assert.match(f.thaiObj[f.thaiKey],/[\u0e00-\u0e7f]/,`${id}:${f.key}`);
   assert.doesNotMatch(f.thaiObj[f.thaiKey],/\uFFFD|\{\{/);
   const numbers=s=>(s.match(/\d+(?:\.\d+)?/g)??[]).sort();
   assert.deepEqual(numbers(f.text),numbers(f.thaiObj[f.thaiKey]),`${id}:${f.key}`);
  }
 }
});
test('mismatched pasted scenarios cannot replace the saved question',()=>{
 const d=byId.get('NH-FUNCTION-CUSTOMERSERVICE-D2-OUTPUT-REFINEMENT-ADVANCED-02').userFacingDraft;
 assert.match(d.context,/categorize/);assert.doesNotMatch(d.context,/average ratings/);
 assert.match(byId.get('TREND-D1-GENAI-MECHANICS-APPLIED-02').userFacingDraft.context,/RAG/);
 assert.match(byId.get('DEPTH-EXP-D1-D2-086').userFacingDraft.context,/stale memory/);
 assert.match(byId.get('NH-FUNCTION-MARKETING-D2-PROMPT-DESIGN-APPLIED-02').userFacingDraft.context,/inconsistent/);
});
test('feedback replay rejects template or key drift and retains classification provenance',()=>{
 const q=structuredClone(byId.get('ADV-D3-DATA-CHART-JUDGMENT-01'));
 assert.equal(q.domain,'D3');assert.equal(q.userFacingDraft.reviewedClassification.domain,'D4');
 q.userFacingDraft.correctOptionIds=['speed-first'];
 assert.throws(()=>applyFeedbackCheckpoint(q),/feedback cannot change/);
});

test('generated review assets expose the applied bilingual draft and reviewed classifications',()=>{
 const index=new Map(read('public/review-inventory/index.json').map(q=>[q.id,q]));
 for(const [id,item] of Object.entries(feedbackBatch.items)){
  const detail=read(`public/review-inventory/detail/${id}.json`);
  for(const [key,value] of Object.entries(item.patch))assert.deepEqual(detail.userFacingDraft[key],value,`${id}:${key}`);
  if(item.patch.reviewedClassification){
   assert.equal(index.get(id).domain,item.patch.reviewedClassification.domain,id);
   assert.deepEqual(detail.auditClassification,item.patch.reviewedClassification.original,id);
  }
  if(item.patch.reviewedFormat){
   assert.equal(index.get(id).recommendedFormat.format,item.patch.reviewedFormat.format,id);
   assert.deepEqual(detail.recommendedFormat.sampleParts.map(p=>p.prompt),detail.userFacingDraft.parts.map(p=>p.prompt),id);
  }
 }
 const report=read('exports/review-inventory/feedback-application-2026-10-06.json');
 assert.equal(report.summary.feedbackRecords,238);
 assert.equal(report.items.length,229);
 assert.ok(report.items.every(i=>i.thaiStatus==='synchronized-needs-native-review'));
});
