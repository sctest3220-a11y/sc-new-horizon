import test from 'node:test';
import assert from 'node:assert/strict';
import { mergeFeedback } from './lib/inventory-feedback.mjs';
import { sha256, hashTree } from './lib/inventory-release.mjs';
import { mkdtemp, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
const version = sha256('questions-v1');
const entry = { id: 'review-1', savedAt: '2026-09-28T00:00:00Z', decision: 'revise', rating: '3', clarity: '', artifact: '', format: '', comment: 'Rewrite this', suggestedChange: '' };
const sample = () => ({ schemaVersion: 2, batches: [{ contentVersion: version, release: { contentVersion: version }, questions: { Q1: { entries: [entry], draft: { comment: 'Do not import' } } } }] });
test('reimport is idempotent and drafts are excluded', () => {
 const first = mergeFeedback(null, sample(), 'tester');
 assert.equal(first.added, 1);
 const second = mergeFeedback(first.store, sample(), 'tester');
 assert.equal(second.added, 0);
 assert.deepEqual(second.store, first.store);
 assert.ok(!JSON.stringify(first.store).includes('Do not import'));
});
test('rewritten questions retain separate histories', () => {
 const first = mergeFeedback(null, sample(), 'tester');
 const next = sample(); next.batches[0].contentVersion = sha256('questions-v2'); next.batches[0].release.contentVersion = sha256('questions-v2');
 assert.equal(Object.keys(mergeFeedback(first.store, next, 'tester').store.questions).length, 2);
});
test('conflicts and unsafe identities fail without mutating input', () => {
 const first = mergeFeedback(null, sample(), 'tester');
 const next = sample(); next.batches[0].questions.Q1.entries = [{ ...entry, comment: 'changed' }];
 assert.throws(() => mergeFeedback(first.store, next, 'tester'), /Conflicting/);
 assert.equal(first.store.questions[`${version}:Q1`].entries[0].comment, 'Rewrite this');
 assert.throws(() => mergeFeedback(null, sample(), '../escape'), /alias/);
 const bad = sample(); bad.batches[0].release.contentVersion = sha256('other');
 assert.throws(() => mergeFeedback(null, bad, 'tester'), /mismatch/);
});
test('legacy exports are explicitly unversioned', () => {
 const result = mergeFeedback(null, { release: { sourceCommit: 'old' }, questions: { Q1: { entries: [entry] } } }, 'tester');
 assert.ok(result.store.questions['legacy-unversioned:Q1']);
});
test('content fingerprints are stable and change on edits', async () => {
 const directory = await mkdtemp(path.join(tmpdir(), 'inventory-hash-'));
 try {
  await writeFile(path.join(directory, 'q.json'), 'one');
  const first = await hashTree(directory);
  assert.equal(first, await hashTree(directory));
  await writeFile(path.join(directory, 'q.json'), 'two');
  assert.notEqual(first, await hashTree(directory));
 } finally { await rm(directory, { recursive: true }); }
});
