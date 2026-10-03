import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const root = process.cwd();
const read = (file) => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const collaborator = JSON.parse(execFileSync('git', ['show', 'new-horizon/kj-dee-branch:exports/review-inventory/feedback-application-2026-10-06.json'], { encoding: 'utf8' }));
const draft = read('exports/review-inventory/questions.json').questions;
const live = read('exports/review-inventory/live-questions.json').questions;
const byId = new Map([...draft.map((q) => [q.id, { q, source: 'draft-inventory' }]), ...live.map((q) => [q.id, { q, source: 'live-bank' }])]);
const releaseId = '2026-10-07.1';
const items = collaborator.items.map((feedback) => {
  const entry = byId.get(feedback.id);
  if (!entry) throw new Error(`Missing question ${feedback.id}`);
  const q = structuredClone(entry.q);
  q.version = releaseId;
  q.sourceInventory = 'production-release';
  // Production promotion is append-only: even matching IDs become new version records.
  q.promotionAction = 'add-to-live';
  q.productionReleaseId = releaseId;
  return { id: feedback.id, promotionAction: q.promotionAction, source: entry.source, question: q, feedbackStatus: feedback.status, thaiStatus: feedback.thaiStatus };
});
const ids = items.map((x) => x.id);
if (new Set(ids).size !== ids.length) throw new Error('Duplicate question IDs');
const missingThai = items.filter((x) => !x.question.userFacingDraft?.context || !x.question.userFacingDraft?.prompt || !x.question.userFacingDraft?.options?.every((o) => o.thLabel));
if (missingThai.length) throw new Error(`Missing Thai in ${missingThai.length} selected questions`);
const outDir = path.join(root, 'exports/production/releases', releaseId);
fs.mkdirSync(outDir, { recursive: true });
const manifest = {
  releaseId,
  status: 'production-import-ready',
  createdAt: new Date().toISOString(),
  source: { collaboratorBranch: 'new-horizon/kj-dee-branch', sourceRevision: '5794850', feedbackArtifact: 'exports/review-inventory/feedback-application-2026-10-06.json' },
  authorization: { basis: 'User confirmation in current task', confirmedAt: new Date().toISOString(), contentGate: 'user-confirmed-for-production' },
  inventory: { selectedQuestions: items.length, addToLive: items.length, replaceLive: 0, baseLiveBankQuestions: live.length, draftInventoryQuestions: draft.length },
  validation: { uniqueIds: true, thaiComplete: true, duplicateIds: 0, remainingCollaboratorIssues: collaborator.summary?.withRemainingIssues ?? null, note: 'Append-only release. Existing live records remain unchanged; all 229 selected questions are inserted as new version records.' },
  rollback: { previousRelease: '2026-09-30.1', snapshot: 'exports/review-inventory/versions/2026-10-07.1/questions-previous.json' },
  files: { releaseQuestions: 'release-questions.json', questionIds: 'question-ids.json' }
};
fs.writeFileSync(path.join(outDir, 'release-questions.json'), JSON.stringify(items, null, 2) + '\n');
fs.writeFileSync(path.join(outDir, 'question-ids.json'), JSON.stringify(ids, null, 2) + '\n');
fs.writeFileSync(path.join(outDir, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
console.log(JSON.stringify({ ...manifest.inventory, outDir }, null, 2));
