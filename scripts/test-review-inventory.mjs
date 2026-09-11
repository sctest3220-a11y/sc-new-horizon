import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { readPlatformModel } from './lib/read-platform-model.mjs';
import { generateInventory, validateInventory, blueprints } from '../inventory/build-bank.mjs';

const model = await readPlatformModel();
const bank = generateInventory(model);

test('platform mappings match the agreed milestone', () => {
  assert.equal(Object.keys(model.competencyDefinitions).length, 24);
  const sum = mappings => Object.values(mappings).reduce((total, values) => total + values.length, 0);
  assert.equal(sum(model.functionPriorityCompetencies), 81);
  assert.equal(sum(model.industryPriorityCompetencies), 20);
  assert.equal(sum(model.executivePriorityCompetencies), 59);
});

test('all coverage cells and answer positions meet their exact quotas', () => {
  const audit = validateInventory(bank, model);
  assert.deepEqual(audit.layerCounts, { core: 768, function: 1296, industry: 320, executive: 944 });
  assert.deepEqual(audit.byDifficulty, { awareness: 832, applied: 832, proficient: 832, advanced: 832 });
  assert.deepEqual(audit.answerPositions, { a: 832, b: 832, c: 832, d: 832 });
  assert.equal(audit.coverageCells, 736);
  assert.equal(audit.baseEvidencePatterns, 384);
  assert.equal(audit.competencyDifficultyFamilies, 96);
});

test('generation is reproducible and does not mutate platform data', () => {
  const before = JSON.stringify(model);
  assert.deepEqual(generateInventory(model), bank);
  assert.equal(JSON.stringify(model), before);
});

test('every family has four different evidence patterns and decisions', () => {
  for (const levels of Object.values(blueprints)) {
    for (const [prompt, cases] of Object.values(levels)) {
      assert.ok(prompt.trim());
      assert.equal(cases.length, 4);
      assert.equal(new Set(cases.map(row => row[0])).size, 4);
      assert.equal(new Set(cases.map(row => row[1])).size, 4);
      assert.ok(cases.every(row => row.length === 3 && row.every(value => value.trim().length > 10)));
    }
  }
});

test('overlays require the profile boundary as well as the competency decision', () => {
  for (const question of bank.filter(q => q.layer !== 'core')) {
    assert.match(question.context, /Additional (function|industry|leadership) evidence:/);
    const key = question.options.find(option => option.id === question.correctOptionIds[0]);
    const boundaryDistractor = question.options.find(option => option.feedback.startsWith('The competency decision fits'));
    assert.equal(boundaryDistractor.score, 0);
    assert.equal(key.label.slice(0, key.label.lastIndexOf('; ')), boundaryDistractor.label.slice(0, boundaryDistractor.label.lastIndexOf('; ')));
    assert.notEqual(key.label, boundaryDistractor.label);
    const decisions = question.options.map(option => option.label.slice(0, option.label.lastIndexOf('; ')));
    const actions = question.options.map(option => option.label.slice(option.label.lastIndexOf('; ') + 2));
    assert.equal(new Set(decisions).size, 2);
    assert.equal(new Set(actions).size, 2);
    assert.ok(decisions.every(value => decisions.filter(other => other === value).length === 2));
    assert.ok(actions.every(value => actions.filter(other => other === value).length === 2));
  }
});

test('review drafts do not enter the existing live bank', async () => {
  assert.equal(model.allAssessmentItems.length, 634);
  const liveIds = new Set(model.allAssessmentItems.map(q => q.id));
  assert.ok(bank.every(q => !liveIds.has(q.id) && q.review.status === 'draft'));
  const source = await fs.readFile(new URL('../app/page.tsx', import.meta.url), 'utf8');
  assert.doesNotMatch(source, /from ['"].*(?:inventory|review-inventory)/);
});

test('arithmetic examples use independently verified keys', () => {
  const roiCases = blueprints['D5-roi-metrics'].applied[1];
  assert.equal((120 - 80) / 80, 0.5);
  assert.match(roiCases[0][1], /40 units net benefit and 50% ROI/);
  assert.equal(7 + 5 - 10, 2);
  assert.match(roiCases[1][1], /increase of 2/);
  const chartCases = blueprints['D3-data-chart-judgment'].applied[1];
  assert.equal((20 - 15) / 20, 0.25);
  assert.match(chartCases[0][1], /25%/);
  assert.equal(8 / 200, 0.04);
  assert.equal(12 / 600, 0.02);
  assert.match(chartCases[1][1], /4% for A with 2% for B/);
});

test('validator rejects a duplicate ID, missing coverage, wrong key, and wrong profile', () => {
  const duplicate = structuredClone(bank);
  duplicate[1].id = duplicate[0].id;
  assert.throws(() => validateInventory(duplicate, model), /Duplicate or live ID/);
  assert.throws(() => validateInventory(bank.slice(1), model), /Coverage mismatch/);
  const badKey = structuredClone(bank);
  badKey[0].correctOptionIds = [badKey[0].options.find(option => option.score === 0).id];
  assert.throws(() => validateInventory(badKey, model), /Invalid key/);
  const badScope = structuredClone(bank);
  badScope.find(q => q.layer === 'function').functionTracks = ['not-a-track'];
  assert.throws(() => validateInventory(badScope, model), /Invalid profile tag/);
});
