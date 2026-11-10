import assert from 'node:assert/strict';
import test from 'node:test';
import { generateQuestionDrafts, validateQuestionBank } from '../agent/question-bank-agent.mjs';

test('generates bilingual drafts across every supported format', () => {
  const bank = generateQuestionDrafts();
  assert.equal(bank.drafts.length, 6);
  assert.deepEqual(validateQuestionBank(bank), { valid: true, errors: [], count: 6 });
  for (const draft of bank.drafts) {
    assert.equal(draft.status, 'draft');
    assert.equal(draft.liveIntegration, undefined);
    assert.ok(draft.artifact.en.evidence.length > 0);
    assert.ok(draft.artifact.th.evidence.length > 0);
  }
});

test('supports bounded format selection and keeps publication disabled', () => {
  const bank = generateQuestionDrafts({ formats: ['multi', 'written'] });
  assert.deepEqual(bank.drafts.map((draft) => draft.format), ['multi', 'written']);
  assert.equal(bank.safety.published, false);
  assert.equal(bank.humanApprovalRequired, true);
});

test('rejects incomplete bilingual artifacts', () => {
  const bank = generateQuestionDrafts({ formats: ['single'] });
  bank.drafts[0].artifact.th = null;
  const validation = validateQuestionBank(bank);
  assert.equal(validation.valid, false);
  assert.match(validation.errors[0], /missing th artifact/);
});
