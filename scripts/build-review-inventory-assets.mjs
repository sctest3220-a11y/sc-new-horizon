// Turns the large review-inventory exports into static assets the admin page can
// load at request time.
//
// The app renders inside the Cloudflare `workerd` runtime, which has no access to
// the host filesystem, so `fs.readFileSync(process.cwd() + '/exports/...')` always
// fails there. The exports are also far too large (~28 MB minified) to inline into
// the worker bundle. Instead we emit:
//
//   public/review-inventory/summary.json     totals + artifact counts
//   public/review-inventory/index.json       one light record per question, enough
//                                            for filtering, counting and search
//   public/review-inventory/detail/<id>.json full record for a single question
//
// The page filters against the index and then fetches detail only for the handful
// of questions it actually renders.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const exportsDir = path.join(projectRoot, 'exports/review-inventory');
const outputDir = path.join(projectRoot, 'public/review-inventory');
const detailDir = path.join(outputDir, 'detail');

const draftPath = path.join(exportsDir, 'questions.json');
const livePath = path.join(exportsDir, 'live-questions.json');
const artifactNeedsPath = path.join(exportsDir, 'artifact-needs.json');

// Only the fields the admin page actually reads. Dropping the rest (provenance,
// readability, contentHash, sourceScenario, ...) keeps the detail files small.
const detailFields = [
  'id',
  'sourceInventory',
  'sourceBank',
  'layer',
  'scope',
  'scopeLabel',
  'domain',
  'competencyIds',
  'competencyLabel',
  'difficulty',
  'cognitiveTask',
  'prompt',
  'context',
  'options',
  'correctOptionIds',
  'rationale',
  'recommendedFormat',
  'userFacingDraft',
  'artifactNeed',
  'th',
  'functionTracks',
  'functionLabels',
  'industryTracks',
  'industryLabels',
  'executiveRoles',
  'executiveLabels',
];

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function pick(source, fields) {
  const result = {};
  for (const field of fields) {
    if (source[field] !== undefined) result[field] = source[field];
  }
  return result;
}

// Question ids are `[A-Za-z0-9-]` today; stay defensive so a future id can never
// escape the output directory.
function safeFileName(id) {
  return id.replace(/[^A-Za-z0-9._-]/g, '_');
}

function isUpToDate() {
  const summaryPath = path.join(outputDir, 'summary.json');
  if (!fs.existsSync(summaryPath)) return false;
  const builtAt = fs.statSync(summaryPath).mtimeMs;
  return [draftPath, livePath, artifactNeedsPath]
    .filter((input) => fs.existsSync(input))
    .every((input) => fs.statSync(input).mtimeMs <= builtAt);
}

function buildDetail(question, sourceInventory, sourceBank, artifactNeedsById) {
  const detail = pick(question, detailFields);
  detail.sourceInventory = question.sourceInventory ?? sourceInventory;
  detail.sourceBank = question.sourceBank ?? sourceBank;
  // The page falls back to the standalone artifact-needs export when a question
  // carries no embedded need; merge it once here so the page needs one lookup.
  if (!detail.artifactNeed && artifactNeedsById.has(question.id)) {
    detail.artifactNeed = artifactNeedsById.get(question.id);
  }
  if (question.review?.status) detail.review = { status: question.review.status };
  return detail;
}

// Mirrors the shape the page filters on, so the existing filter/count code keeps
// working against index records unchanged.
function buildIndexRecord(detail) {
  const record = {
    id: detail.id,
    domain: detail.domain,
    difficulty: detail.difficulty,
    layer: detail.layer,
    scopeLabel: detail.scopeLabel,
    competencyLabel: detail.competencyLabel,
    prompt: detail.prompt,
    sourceInventory: detail.sourceInventory,
    sourceBank: detail.sourceBank,
  };
  if (detail.functionTracks?.length) record.functionTracks = detail.functionTracks;
  if (detail.industryTracks?.length) record.industryTracks = detail.industryTracks;
  if (detail.executiveRoles?.length) record.executiveRoles = detail.executiveRoles;
  if (detail.recommendedFormat?.format) record.recommendedFormat = { format: detail.recommendedFormat.format };
  if (detail.userFacingDraft?.format) record.userFacingDraft = { format: detail.userFacingDraft.format };
  return record;
}

function main() {
  if (!fs.existsSync(draftPath)) {
    throw new Error(`Missing ${path.relative(projectRoot, draftPath)}. Run the review inventory export scripts first.`);
  }
  if (isUpToDate()) {
    console.log('review-inventory assets are up to date');
    return;
  }

  const draft = readJson(draftPath);
  const live = fs.existsSync(livePath) ? readJson(livePath) : null;
  const artifactNeeds = fs.existsSync(artifactNeedsPath) ? readJson(artifactNeedsPath) : null;
  const artifactNeedsById = new Map((artifactNeeds?.candidates ?? []).map((candidate) => [candidate.id, candidate]));

  fs.rmSync(outputDir, { recursive: true, force: true });
  fs.mkdirSync(detailDir, { recursive: true });

  const index = [];
  const writeAll = (questions, sourceInventory, sourceBank) => {
    for (const question of questions) {
      const detail = buildDetail(question, sourceInventory, sourceBank, artifactNeedsById);
      fs.writeFileSync(path.join(detailDir, `${safeFileName(detail.id)}.json`), JSON.stringify(detail));
      index.push(buildIndexRecord(detail));
    }
  };

  writeAll(draft.questions, 'draft', 'New draft review inventory');
  writeAll(live?.questions ?? [], 'live', 'Existing live bank');

  const summary = {
    inventoryVersion: draft.inventoryVersion,
    status: draft.status,
    liveIntegration: draft.liveIntegration ?? false,
    draftCount: draft.questions.length,
    liveCount: live?.questions.length ?? 0,
    artifactCounts: artifactNeeds?.counts ?? null,
  };

  fs.writeFileSync(path.join(outputDir, 'index.json'), JSON.stringify(index));
  fs.writeFileSync(path.join(outputDir, 'summary.json'), JSON.stringify(summary));

  const indexBytes = fs.statSync(path.join(outputDir, 'index.json')).size;
  console.log(
    `review-inventory assets: ${summary.draftCount} draft + ${summary.liveCount} live questions, ` +
      `index ${(indexBytes / 1048576).toFixed(2)} MB`,
  );
}

main();
