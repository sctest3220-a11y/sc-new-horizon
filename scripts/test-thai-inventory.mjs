import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {fields} from './lib/thai-inventory-text.mjs';
import {translate,englishProjection} from './lib/translate-thai-inventory.mjs';
const root=new URL('../',import.meta.url);
for(const [file,count] of [['questions.json',3328],['live-questions.json',634]]) {
  const relative=`exports/review-inventory/${file}`;
  const current=JSON.parse(fs.readFileSync(new URL(relative,root),'utf8'));
  test(`${file}: English, keys, scores, order and review history unchanged`,()=>{
    const original=JSON.parse(execFileSync('git',['show',`HEAD:${relative}`],{cwd:fileURLToPath(root),maxBuffer:128*1024*1024,encoding:'utf8'}));
    assert.deepEqual(englishProjection(current),englishProjection(original));
  });
  test(`${file}: every inventory text field has Thai`,()=>{
    assert.equal(current.questions.length,count);
    for(const q of current.questions)for(const f of fields(q)) {
      const th=f.thaiObj[f.thaiKey];
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
