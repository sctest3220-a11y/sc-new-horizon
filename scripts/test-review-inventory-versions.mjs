import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = new URL('../', import.meta.url);
const registryPath = new URL('exports/review-inventory/versions.json', root);
const registry = JSON.parse(fs.readFileSync(registryPath, 'utf8'));
test('saved inventory versions have complete membership, review status and stable content hashes', () => {
  assert.ok(registry.versions.some(v => v.version === registry.latest));
  assert.equal(new Set(registry.versions.map(v => v.version)).size, registry.versions.length);
  for (const entry of registry.versions) {
    assert.match(entry.version, /^\d{4}\.\d{2}\.\d{2} V\.\d+$/);
    const content = fs.readFileSync(new URL(`exports/review-inventory/${entry.snapshot}`, root), 'utf8');
    assert.equal(createHash('sha256').update(content).digest('hex'), entry.sha256);
    const snapshot = JSON.parse(content);
    assert.equal(snapshot.version, entry.version);
    assert.equal(snapshot.questions.length, entry.questionCount);
    assert.equal(new Set(snapshot.questions.map(q => q.id)).size, entry.questionCount);
    assert.equal(snapshot.questions.filter(q => q.sourceInventory === 'draft').length, entry.draftCount);
    assert.equal(snapshot.questions.filter(q => q.sourceInventory === 'live').length, entry.liveCount);
    const ids = new Set(snapshot.questions.map(q => q.id));
    for (const id of [...entry.reviewedQuestionIds, ...entry.thaiPendingQuestionIds]) assert.ok(ids.has(id), id);
    for (const q of snapshot.questions) {
      assert.ok(q.version, `${q.id}: original audit version missing`);
      assert.ok(q.userFacingDraft, `${q.id}: rewrite missing`);
      for (const p of q.userFacingDraft.parts ?? [q.userFacingDraft]) {
        const optionIds = new Set((p.options ?? []).map(o => o.id));
        for (const key of p.correctOptionIds ?? []) assert.ok(optionIds.has(key), `${q.id}: invalid key`);
      }
    }
  }
});
test('creating an existing version fails without changing its snapshot or registry', () => {
  const before = fs.readFileSync(registryPath);
  const entry = registry.versions.find(v => v.version === registry.latest);
  const snapshotPath = new URL(`exports/review-inventory/${entry.snapshot}`, root);
  const snapshotBefore = fs.readFileSync(snapshotPath);
  const result = spawnSync(process.execPath, ['scripts/create-review-inventory-version.mjs', registry.latest], { cwd: fileURLToPath(root), encoding: 'utf8' });
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /already exists/);
  assert.deepEqual(fs.readFileSync(registryPath), before);
  assert.deepEqual(fs.readFileSync(snapshotPath), snapshotBefore);
});
