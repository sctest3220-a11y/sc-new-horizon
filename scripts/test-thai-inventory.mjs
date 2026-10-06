import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {fields} from './lib/thai-inventory-text.mjs';
import {translate,englishProjection} from './lib/translate-thai-inventory.mjs';
import {englishWordingCheckpoints} from '../inventory/english-wording-checkpoints.mjs';
import {feedbackBatch, feedbackSignature} from '../inventory/feedback-checkpoints.mjs';
const root=new URL('../',import.meta.url);
for(const [file,count] of [['questions.json',3328],['live-questions.json',634]]) {
  const relative=`exports/review-inventory/${file}`;
  const current=JSON.parse(fs.readFileSync(new URL(relative,root),'utf8'));
  test(`${file}: audit source, keys, scores, order and review history unchanged`,()=>{
    const original=JSON.parse(execFileSync('git',['show',`0f844b6:${relative}`],{cwd:fileURLToPath(root),maxBuffer:128*1024*1024,encoding:'utf8'}));
    // Artifact planning metadata is independently versioned; source audit text,
    // answer keys, scores and provenance must remain exactly as archived.
    const auditProjection=bank=>englishProjection({...bank,questions:bank.questions.map(({userFacingDraft,artifactNeed,...q})=>q)});
    assert.deepEqual(auditProjection(current),auditProjection(original));
    if(file==='questions.json'){
      const history=JSON.parse(fs.readFileSync(new URL('exports/review-inventory/english-rewrite-history.json',root),'utf8'));
      const byId=new Map(history.items.map(x=>[x.questionId,x.previousDraft]));
      for(const q of original.questions)assert.deepEqual(byId.get(q.id),q.userFacingDraft,`${q.id}: original draft archived exactly`);
      const shape=d=>({interaction:d.interaction,format:d.format,keys:d.correctOptionIds,options:d.options?.map(o=>o.id),parts:d.parts?.map(p=>({id:p.id,keys:p.correctOptionIds,options:p.options.map(o=>o.id)}))});
      for(const q of current.questions)assert.deepEqual(shape(q.userFacingDraft),shape(byId.get(q.id)),`${q.id}: format, order and keys preserved`);
    }else {
      const sourceById=new Map(original.questions.map(q=>[q.id,q]));
      for(const q of current.questions){
        const feedback = feedbackBatch.items[q.id];
        if (feedback) {
          assert.deepEqual(feedbackSignature(q.userFacingDraft), feedbackSignature(sourceById.get(q.id).userFacingDraft), q.id);
          for (const [key,value] of Object.entries(feedback.patch)) assert.deepEqual(q.userFacingDraft[key], value, `${q.id}:${key}`);
          continue;
        }
        const checkpoint = englishWordingCheckpoints[q.id];
        if (checkpoint) {
          const d = q.userFacingDraft, old = sourceById.get(q.id).userFacingDraft;
          assert.equal(d.context, checkpoint.context);
          assert.equal(d.prompt, checkpoint.prompt);
          assert.equal(d.explanation, checkpoint.explanation);
          assert.deepEqual(d.options.map(o=>o.label), checkpoint.labels);
          assert.deepEqual(d.options.map(o=>[o.id,o.score,o.thLabel,o.thFeedback]), old.options.map(o=>[o.id,o.score,o.thLabel,o.thFeedback]));
          assert.deepEqual(d.correctOptionIds, old.correctOptionIds);
          assert.equal(d.interaction, old.interaction);
          assert.equal(d.format, old.format);
          assert.deepEqual(d.th, old.th);
          assert.equal(d.englishWordingReview.thaiStatus, 'previous-revision-pending-sync');
          continue;
        }
        const {rewriteVersion,rewriteRulesVersion,rewriteReviewStatus,ruleApplication,...draft}=q.userFacingDraft;
        assert.deepEqual(englishProjection(draft),englishProjection(sourceById.get(q.id).userFacingDraft),`${q.id}: live review wording preserved`);
      }
    }
  });
  test(`${file}: every inventory text field has Thai`,()=>{
    assert.equal(current.questions.length,count);
    for(const q of current.questions)for(const f of fields(q)) {
      const th=f.thaiObj[f.thaiKey];
      if (file === 'live-questions.json' && englishWordingCheckpoints[q.id] && q.userFacingDraft.englishWordingReview?.thaiStatus === 'previous-revision-pending-sync' && f.obj === q.userFacingDraft && f.key === 'explanation' && th === undefined) continue;
      assert.ok(typeof th==='string'&&/[\u0e00-\u0e7f]/.test(th),`${q.id}:${f.key}`);
      assert.doesNotMatch(th,/\{\{|\uFFFD/,`${q.id}:${f.key}`);
    }
  });
  if(file==='questions.json')test('all draft numeric evidence and distractor values preserved',()=>{
    for(const q of current.questions)for(const f of fields(q)) {
      const numbers=s=>(s.match(/\d+(?:\.\d+)?/g)??[]).sort();
      assert.deepEqual(numbers(f.thaiObj[f.thaiKey]),numbers(f.text),`${q.id}:${f.key}`);
    }
  });
}
test('unknown source text is rejected instead of translated by fragments',()=>{
  assert.throws(()=>translate('A brand new unreviewed sentence.'),/Missing complete Thai sentence/);
});
test('numeric distractors and uncertainty keep their original distinctions',()=>{
  assert.match(translate('Report a 25% reduction from the original time.'),/25%/);
  assert.match(translate('Report a 5% reduction from the original time.'),/5%/);
  assert.match(translate('A prior refund may already have completed despite a timeout.'),/อาจเสร็จแล้ว/);
  assert.match(translate('The source supports an association, while the project update asserts causation.'),/ความสัมพันธ์.*เหตุและผล/);
});
