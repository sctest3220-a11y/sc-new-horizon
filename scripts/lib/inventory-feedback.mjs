import { sha256 } from './inventory-release.mjs';
const object = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const safeKey = value => typeof value === 'string' && /^[A-Za-z0-9][A-Za-z0-9._-]{0,199}$/.test(value) && !['constructor', 'prototype', '__proto__'].includes(value);
const stable = value => JSON.stringify(value, Object.keys(value).sort());
export function mergeFeedback(existing, incoming, reviewer) {
  if (!safeKey(reviewer)) throw new Error('Use a reviewer alias with letters, numbers, dots, underscores or hyphens.');
  if (!object(incoming)) throw new Error('Invalid feedback export.');
  const batches = incoming.schemaVersion === 2 ? incoming.batches : [{ release: incoming.release ?? null, contentVersion: 'legacy-unversioned', questions: incoming.questions }];
  if (!Array.isArray(batches) || batches.length > 1000) throw new Error('Invalid batches.');
  const result = structuredClone(existing ?? { schemaVersion: 2, reviewer, releases: {}, questions: {} });
  if (result.reviewer !== reviewer || result.schemaVersion !== 2) throw new Error('Reviewer store mismatch.');
  let added = 0;
  for (const batch of batches) {
    if (!object(batch) || !object(batch.questions)) throw new Error('Invalid question map.');
    const version = batch.contentVersion;
    if (version !== 'legacy-unversioned' && !/^[a-f0-9]{64}$/.test(version)) throw new Error('Invalid content version.');
    if (version !== 'legacy-unversioned' && batch.release?.contentVersion !== version) throw new Error('Release/version mismatch.');
    if (batch.release) {
      // Store every observed manifest; reviews are grouped by question content version.
      const digest = sha256(JSON.stringify(batch.release));
      result.releases[digest] = batch.release;
    }
    for (const [questionId, question] of Object.entries(batch.questions)) {
      if (!safeKey(questionId) || !object(question) || !Array.isArray(question.entries)) throw new Error('Invalid question feedback.');
      const key = `${version}:${questionId}`;
      const target = result.questions[key] ??= { contentVersion: version, questionId, entries: [] };
      for (const entry of question.entries) {
        if (!object(entry) || typeof entry.id !== 'string' || !entry.id || entry.id.length > 200 || typeof entry.savedAt !== 'string' || !Number.isFinite(Date.parse(entry.savedAt))) throw new Error('Invalid feedback entry.');
        const clean = { id: entry.id, savedAt: entry.savedAt };
        for (const field of ['decision', 'rating', 'clarity', 'artifact', 'format', 'comment', 'suggestedChange']) {
          if (typeof entry[field] !== 'string' || entry[field].length > 100000) throw new Error(`Invalid ${field}.`);
          clean[field] = entry[field];
        }
        const previous = target.entries.find(item => item.id === clean.id);
        if (previous && stable(previous) !== stable(clean)) throw new Error(`Conflicting review ${questionId}/${clean.id}; existing review was not overwritten.`);
        if (!previous) { target.entries.push(clean); added++; }
      }
      target.entries.sort((a,b) => a.id.localeCompare(b.id));
    }
  }
  result.questions = Object.fromEntries(Object.entries(result.questions).sort(([a],[b]) => a.localeCompare(b)));
  return { store: result, added };
}
