import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { checkpoints, rulesVersion, artifactVersion } from '../inventory/wording-refinements.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const directory = path.join(root, 'exports/review-inventory');
const version = process.argv[2];
if (!/^\d{4}\.\d{2}\.\d{2} V\.\d+$/.test(version ?? '')) throw new Error('Use a version such as "2026.10.05 V.0".');
const id = version.replace(' V.', '-V.');
const registryPath = path.join(directory, 'versions.json');
const registry = fs.existsSync(registryPath) ? JSON.parse(fs.readFileSync(registryPath, 'utf8')) : { latest: null, versions: [] };
if (registry.versions.some(v => v.version === version)) throw new Error('This version already exists. Use a new date or revision number; saved versions are immutable.');
const banks = ['questions.json', 'live-questions.json'].map(name => JSON.parse(fs.readFileSync(path.join(directory, name), 'utf8')));
const questions = banks.flatMap((bank, i) => bank.questions.map(q => ({ ...q, sourceInventory: q.sourceInventory ?? (i ? 'live' : 'draft'), sourceBank: q.sourceBank ?? (i ? 'Existing live bank' : 'New draft review inventory') })));
if (new Set(questions.map(q => q.id)).size !== questions.length) throw new Error('Duplicate question ID in version.');
const reviewed = questions.filter(q => q.userFacingDraft?.englishWordingReview || q.userFacingDraft?.reviewedWordingSource || checkpoints[q.id]);
const feedbackQuestions = questions.filter(q => q.userFacingDraft?.feedbackReview);
const synchronizedThaiIds = feedbackQuestions.filter(q => q.userFacingDraft.feedbackReview.thaiStatus === 'synchronized-needs-native-review').map(q => q.id).sort();
const payload = JSON.stringify({ version, questions }) + '\n';
const entry = {
  id, version, createdAt: new Date().toISOString(), status: 'local-review-snapshot',
  scope: 'Complete draft and live review inventory with the latest saved wording. Unreviewed items remain pending; this is not scored-release approval.',
  rulesVersion, artifactVersion, snapshot: `versions/${id}.json`,
  sha256: createHash('sha256').update(payload).digest('hex'),
  questionCount: questions.length, draftCount: banks[0].questions.length, liveCount: banks[1].questions.length,
  artifactCounts: JSON.parse(fs.readFileSync(path.join(directory, 'artifact-needs.json'), 'utf8')).counts,
  reviewedQuestionIds: reviewed.map(q => q.id).sort(),
  thaiPendingQuestionIds: questions.filter(q => q.userFacingDraft?.englishWordingReview?.thaiStatus === 'previous-revision-pending-sync').map(q => q.id).sort(),
  localization: {
    languages: ['en', 'th'],
    status: 'machine-assisted-needs-review',
    feedbackRevisions: [...new Set(feedbackQuestions.map(q => q.userFacingDraft.feedbackReview.revision))].sort(),
    feedbackQuestionIds: feedbackQuestions.map(q => q.id).sort(),
    synchronizedThaiQuestionIds: synchronizedThaiIds,
    synchronizedThaiNativeReviewPendingIds: synchronizedThaiIds,
    note: 'Synchronization records inclusion of the saved English/Thai feedback drafts, not native-language approval. Other questions retain their existing translation status inside the snapshot.',
  },
};
fs.mkdirSync(path.join(directory, 'versions'), { recursive: true });
fs.writeFileSync(path.join(directory, entry.snapshot), payload, { flag: 'wx' });
registry.latest = version;
registry.versions.push(entry);
fs.writeFileSync(registryPath, JSON.stringify(registry, null, 2) + '\n');
console.log(`Created immutable local review version ${version}.`);
