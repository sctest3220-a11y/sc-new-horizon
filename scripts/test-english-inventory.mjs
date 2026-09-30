import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const bank=JSON.parse(fs.readFileSync(new URL('../exports/review-inventory/questions.json',import.meta.url),'utf8'));
test('every draft records the current English wording pass and retains evidence',()=>{
  assert.equal(bank.questions.length,3328);
  for(const q of bank.questions){
    const d=q.userFacingDraft;
    assert.equal(d.rewriteRulesVersion,'2.1 + provisional 2.2-draft');
    if(d.reviewedWordingSource)continue;
    for(const p of d.parts??[])assert.doesNotMatch(p.prompt,/extra detail|profile cue/i);
    const cue=q.sourceScenario?.overlayEvidence;
    if(cue)assert.ok([d.context,...d.parts.map(p=>p.prompt)].join('\n').includes(cue),q.id);
  }
});
test('agreed checkpoints preserve uncertainty and do not reveal the finance answer',()=>{
  assert.equal(bank.questions.filter(q=>q.userFacingDraft.reviewedWordingSource).length,6);
  const draft=id=>bank.questions.find(q=>q.id===id).userFacingDraft;
  const finance=draft('NH-FUNCTION-FINANCE-D1-AI-SYSTEMS-AWARENESS-01');
  assert.match(finance.context,/no longer sees some earlier instructions/);
  assert.doesNotMatch(finance.context,/context (window|limit)/i);
  const refund=draft('NH-FUNCTION-CUSTOMERSERVICE-D1-CAPABILITY-LIMITS-AWARENESS-02');
  assert.match(refund.context,/refund may already be complete/);
  assert.match(refund.parts[0].options[1].label,/may give made-up/);
});
