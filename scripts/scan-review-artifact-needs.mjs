import fs from 'node:fs/promises';
import { getArtifactNeedFromText } from '../inventory/artifact-needs.mjs';

const inventoryPath = new URL('../exports/review-inventory/questions.json', import.meta.url);
const outputDir = new URL('../exports/review-inventory/', import.meta.url);
const payload = JSON.parse(await fs.readFile(inventoryPath, 'utf8'));
const questions = payload.questions;

function textFor(question) {
  const correctOption = question.options.find((option) => question.correctOptionIds.includes(option.id));
  return [
    question.context,
    question.prompt,
    question.rationale,
    question.sourceScenario?.source,
    question.sourceScenario?.evidence,
    question.sourceScenario?.overlayEvidence,
    correctOption?.label,
    correctOption?.feedback,
  ].filter(Boolean).join(' ');
}

function getArtifactNeed(question) {
  if (question.artifactNeed) return question.artifactNeed;
  const text = textFor(question);
  return getArtifactNeedFromText(text);
}

const candidates = questions.flatMap((question) => {
  const need = getArtifactNeed(question);
  if (!need) return [];
  return [{
    id: question.id,
    domain: question.domain,
    competencyIds: question.competencyIds.join('; '),
    competencyLabel: question.competencyLabel,
    difficulty: question.difficulty,
    layer: question.layer,
    scope: question.scopeLabel,
    familyId: question.familyId,
    casePatternId: question.casePatternId,
    prompt: question.prompt,
    context: question.context,
    ...need,
  }];
});

const artifactFamilies = new Map();
for (const candidate of candidates) {
  const key = [candidate.artifactType, candidate.domain, candidate.competencyLabel, candidate.difficulty].join('|');
  const existing = artifactFamilies.get(key) ?? {
    artifactType: candidate.artifactType,
    artifactLabel: candidate.artifactLabel,
    domain: candidate.domain,
    competencyLabel: candidate.competencyLabel,
    difficulty: candidate.difficulty,
    priority: candidate.need === 'requires artifact' ? 'high' : 'medium',
    candidateCount: 0,
    sampleQuestionIds: [],
    artifactBrief: candidate.artifactBrief,
    generationPrompt: candidate.generationPrompt,
  };
  existing.candidateCount += 1;
  if (existing.sampleQuestionIds.length < 8) existing.sampleQuestionIds.push(candidate.id);
  if (candidate.need === 'requires artifact') existing.priority = 'high';
  artifactFamilies.set(key, existing);
}

const familyRows = Array.from(artifactFamilies.values())
  .sort((left, right) => right.candidateCount - left.candidateCount || left.artifactType.localeCompare(right.artifactType));

function toCsv(rows) {
  const headers = Object.keys(rows[0] ?? {});
  const escape = (value) => `"${String(value ?? '').replaceAll('"', '""')}"`;
  return [headers.join(','), ...rows.map((row) => headers.map((header) => escape(Array.isArray(row[header]) ? row[header].join('; ') : row[header])).join(','))].join('\n');
}

const counts = {
  totalQuestions: questions.length,
  artifactCandidates: candidates.length,
  byNeed: {},
  byType: {},
  byDomain: {},
};

for (const candidate of candidates) {
  counts.byNeed[candidate.need] = (counts.byNeed[candidate.need] || 0) + 1;
  counts.byType[candidate.artifactType] = (counts.byType[candidate.artifactType] || 0) + 1;
  counts.byDomain[candidate.domain] ??= {};
  counts.byDomain[candidate.domain][candidate.artifactType] = (counts.byDomain[candidate.domain][candidate.artifactType] || 0) + 1;
}

const markdown = [
  '# Review Inventory Artifact Needs',
  '',
  `Scanned ${questions.length.toLocaleString()} draft review questions.`,
  '',
  `- Artifact candidates: ${candidates.length.toLocaleString()}`,
  `- Requires artifact: ${(counts.byNeed['requires artifact'] ?? 0).toLocaleString()}`,
  `- Artifact helpful: ${(counts.byNeed['artifact helpful'] ?? 0).toLocaleString()}`,
  `- Reusable artifact families: ${familyRows.length.toLocaleString()}`,
  '',
  '## Counts By Artifact Type',
  '',
  '| Artifact type | Questions |',
  '| --- | ---: |',
  ...Object.entries(counts.byType).sort((a, b) => b[1] - a[1]).map(([key, value]) => `| ${key} | ${value.toLocaleString()} |`),
  '',
  '## Top Artifact Families To Generate First',
  '',
  '| Priority | Artifact type | Domain | Competency | Difficulty | Candidate questions | Brief |',
  '| --- | --- | --- | --- | --- | ---: | --- |',
  ...familyRows.slice(0, 40).map((row) => `| ${row.priority} | ${row.artifactLabel} | ${row.domain} | ${row.competencyLabel} | ${row.difficulty} | ${row.candidateCount} | ${row.artifactBrief} |`),
  '',
  '## Generation Notes',
  '',
  'Generate reusable artifact templates first, not one-off visuals per question. Each template should have legible text, realistic metadata, a clear evidence signal, and a direct relationship to the question decision.',
  '',
];

await fs.mkdir(outputDir, { recursive: true });
await fs.writeFile(new URL('artifact-needs.json', outputDir), `${JSON.stringify({ counts, families: familyRows, candidates }, null, 2)}\n`);
await fs.writeFile(new URL('artifact-needs.csv', outputDir), `${toCsv(candidates)}\n`);
await fs.writeFile(new URL('artifact-family-backlog.csv', outputDir), `${toCsv(familyRows)}\n`);
await fs.writeFile(new URL('artifact-needs.md', outputDir), markdown.join('\n'));
console.log(JSON.stringify({ ...counts, reusableArtifactFamilies: familyRows.length }, null, 2));
