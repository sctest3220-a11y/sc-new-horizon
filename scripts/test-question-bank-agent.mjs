import assert from 'node:assert/strict';
import test from 'node:test';
import { generateQuestionDrafts, QUESTION_BANKS, validateQuestionBank } from '../agent/question-bank-agent.mjs';

test('generates bilingual drafts across every supported format', () => {
  const bank = generateQuestionDrafts();
  assert.equal(bank.drafts.length, 10);
  assert.equal(bank.bank, 'agent-generated');
  assert.equal(bank.storage.exportPath, QUESTION_BANKS.agentGenerated);
  assert.deepEqual(bank.storage.excludedFrom, [QUESTION_BANKS.live, QUESTION_BANKS.existingDraft]);
  assert.equal(bank.storage.mergePolicy, 'never-merge-automatically');
  assert.deepEqual(validateQuestionBank(bank), { valid: true, errors: [], count: 10 });
  for (const draft of bank.drafts) {
    assert.equal(draft.status, 'draft');
    assert.equal(draft.liveIntegration, undefined);
    assert.ok(draft.artifact.en.evidence.length > 0);
    assert.ok(draft.artifact.th.evidence.length > 0);
    assert.ok(draft.category);
    assert.ok(draft.difficulty);
    assert.ok(draft.role);
    assert.ok(draft.scoring.maxPoints > 0);
  }
});

test('rejects a result relabelled as live or existing review inventory', () => {
  const bank = generateQuestionDrafts();
  bank.bank = 'live';
  const validation = validateQuestionBank(bank);
  assert.equal(validation.valid, false);
  assert.ok(validation.errors.includes('bank: must be agent-generated'));
});

test('supports bounded format selection and keeps publication disabled', () => {
  const bank = generateQuestionDrafts({ formats: ['multi', 'written'] });
  assert.deepEqual(bank.drafts.map((draft) => draft.format), ['multi', 'written', 'multi', 'written']);
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
