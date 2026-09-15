import fs from 'node:fs/promises';
import { readPlatformModel } from './lib/read-platform-model.mjs';
import { generateInventory, validateInventory, inventoryVersion } from '../inventory/build-bank.mjs';

const model = await readPlatformModel();
const questions = generateInventory(model);
const audit = validateInventory(questions, model);
const flagged = new Set(audit.longestAnswerReviewIds);
for (const question of questions) {
  if (flagged.has(question.id)) question.qualityFlags.push('correct-answer-length-review');
}
const out = new URL('../exports/review-inventory/', import.meta.url);
await fs.mkdir(out, { recursive: true });
const payload = {
  schemaVersion: 1, inventoryVersion, status: 'draft', liveIntegration: false,
  description: '3,328 AI-assisted draft item variants. Separate from the existing live bank. Related forms share 96 competency/difficulty families and 384 base evidence patterns. No pilot calibration or human approval is implied.',
  locale: 'en', targetCounts: audit.layerCounts,
  reviewDimensions: ['answer key', 'difficulty', 'specialization', 'language', 'similarity', 'pilot performance'],
  questions,
};
await fs.writeFile(new URL('questions.json', out), `${JSON.stringify(payload, null, 2)}\n`);
await fs.writeFile(new URL('coverage.json', out), `${JSON.stringify(audit, null, 2)}\n`);
const samples = Object.keys(model.competencyDefinitions).flatMap(competency => {
  const core = questions.find(q => q.layer === 'core' && q.competencyIds[0] === competency && q.difficulty === 'applied');
  const overlay = questions.find(q => q.layer !== 'core' && q.competencyIds[0] === competency && q.difficulty === 'advanced');
  return [core, overlay].filter(Boolean);
});
const markdown = ['# New Horizon draft question samples', '', '48 examples from the 3,328-item review inventory. All items are unreviewed, English-only drafts with provisional difficulty. The full workbook and JSON contain every item.', ''];
for (const q of samples) {
  markdown.push(`## ${q.id}`, '', `${q.competencyLabel} · ${q.difficulty} · ${q.scopeLabel}`, '', q.context, '', q.prompt, '', ...q.options.map(o => `- **${o.id.toUpperCase()}.** ${o.label}`), '', `**Answer: ${q.correctOptionIds[0].toUpperCase()}.** ${q.rationale}`, '');
}
await fs.writeFile(new URL('samples.md', out), markdown.join('\n'));
console.log(JSON.stringify({ total: audit.total, layers: audit.layerCounts, difficulty: audit.byDifficulty, answerPositions: audit.answerPositions, coverageCells: audit.coverageCells, liveInventoryUnchanged: audit.liveInventoryCount, lengthReviewCandidates: audit.longestAnswerReviewCount }, null, 2));
