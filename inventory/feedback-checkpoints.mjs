import fs from 'node:fs';
import assert from 'node:assert/strict';

export const feedbackBatch = JSON.parse(fs.readFileSync(new URL('./feedback/applied-2026-10-06.json', import.meta.url), 'utf8'));
export const feedbackThai = JSON.parse(fs.readFileSync(new URL('./feedback/thai-2026-10-06.json', import.meta.url), 'utf8'));
export const feedbackSignature = d => JSON.parse(JSON.stringify({ interaction: d.interaction, format: d.format, keys: d.correctOptionIds, options: d.options?.map(o => [o.id, o.score]), parts: d.parts?.map(p => ({ id: p.id, keys: p.correctOptionIds, options: p.options.map(o => [o.id, o.score]) })) }));

export function applyFeedbackCheckpoint(question, register = () => {}) {
  const item = feedbackBatch.items[question.id];
  if (!item) return null;
  assert.deepEqual(feedbackSignature(question.userFacingDraft), item.signature, `${question.id}: feedback cannot change the selected template, option order, keys or scores`);
  const changes = [];
  for (const [key, value] of Object.entries(item.patch)) {
    if (JSON.stringify(question.userFacingDraft[key]) !== JSON.stringify(value)) changes.push(key);
    question.userFacingDraft[key] = structuredClone(value);
  }
  for (const [en, th] of Object.entries(feedbackThai)) register(en, th);
  return changes;
}
