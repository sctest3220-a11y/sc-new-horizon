import { createHash } from 'node:crypto';
import { foundations } from './foundations.mjs';
import { application } from './application.mjs';
import { evaluation } from './evaluation.mjs';
import { governance } from './governance.mjs';
import { strategy } from './strategy.mjs';
import { collaboration } from './collaboration.mjs';
import { coreContexts, functionContexts, industryContexts, executiveContexts } from './contexts.mjs';
import { overlayCases } from './overlays.mjs';
import { specificDistractors } from './distractors.mjs';

export const difficulties = ['awareness', 'applied', 'proficient', 'advanced'];
export const blueprints = { ...foundations, ...application, ...evaluation, ...governance, ...strategy, ...collaboration };
export const layerTargets = { core: 768, function: 1296, industry: 320, executive: 944 };
export const inventoryVersion = '2026-09-10.1';
const digest = (value) => createHash('sha256').update(value).digest('hex');
const numberHash = (value) => Number.parseInt(digest(value).slice(0, 8), 16);
const cognitiveTasks = {
  awareness: 'Recognize the issue or mechanism from supplied evidence.',
  applied: 'Choose an appropriate action for a bounded work scenario.',
  proficient: 'Interpret conflicting evidence, diagnose a failure, or compare outcomes.',
  advanced: 'Select an evaluation or system-level control for a recurring or interacting risk.',
};

function substitute(text, context) {
  return text.replace(/\{\{(\w+)\}\}/g, (_, key) => {
    if (!(key in context)) throw new Error(`Unknown content placeholder: ${key}`);
    return context[key];
  });
}

function buildItem(competency, layer, scope, difficulty, variant) {
  const contextSets = { function: functionContexts, industry: industryContexts, executive: executiveContexts };
  const context = layer === 'core' ? coreContexts[variant] : contextSets[layer][scope];
  const [questionPrompt, cases] = blueprints[competency.id][difficulty];
  const group = `${layer}-${scope}-${competency.id}-${difficulty}`;
  const caseIndex = (variant + numberHash(`${group}-case`)) % 4;
  const selected = cases[caseIndex];
  const resolve = (text) => substitute(text, context);
  const baseRationale = resolve(selected[2]);
  const caseEvidence = resolve(selected[0]);
  const authoredDistractors = specificDistractors[competency.id]?.[difficulty]?.[caseIndex];
  const overlay = layer === 'core' ? null : overlayCases[layer][scope][variant];
  const baseContext = `Setting: ${context.label}. Task: prepare a ${context.deliverable} using ${context.source}. Accountable role: ${context.owner}. Exercise constraint: ${context.constraint} Consequence to consider: ${context.consequence}`;
  const evidence = `${caseEvidence}${overlay ? ` Additional ${layer === 'executive' ? 'leadership' : layer} evidence: ${overlay[0]}` : ''}`;
  const stem = `${baseContext}\n\nEvidence: ${evidence}`;
  let choices;
  if (overlay) {
    // A balanced 2x2 combination prevents answer-component frequency from revealing the key.
    const alternativeIndex = numberHash(`${group}-${variant}-distractor`) % 3;
    const alternative = authoredDistractors
      ? { label: authoredDistractors[alternativeIndex][0], explanation: authoredDistractors[alternativeIndex][1] }
      : { label: cases[(caseIndex + alternativeIndex + 1) % 4][1], explanation: baseRationale };
    const combine = (action, scopeAction) => `${resolve(action).replace(/\.$/, '')}; ${scopeAction}.`;
    choices = [
      { label: combine(selected[1], overlay[1]), score: 100, feedback: `${baseRationale} ${overlay[3]}` },
      { label: combine(selected[1], overlay[2]), score: 0, feedback: `The competency decision fits, but the specialized action does not. ${overlay[3]}` },
      { label: combine(alternative.label, overlay[1]), score: 0,
        feedback: `The specialized action fits, but the competency decision does not. ${resolve(alternative.explanation)}` },
      { label: combine(alternative.label, overlay[2]), score: 0,
        feedback: `Both parts need revision. ${resolve(alternative.explanation)} ${overlay[3]}` },
    ];
  } else {
    choices = authoredDistractors ? [
      { label: resolve(selected[1]), score: 100, feedback: baseRationale },
      ...authoredDistractors.map(([label, feedback]) => ({ label: resolve(label), score: 0, feedback: resolve(feedback) })),
    ] : cases.map((candidate, index) => ({
      label: resolve(candidate[1]), score: index === caseIndex ? 100 : 0,
      feedback: index === caseIndex ? baseRationale : `This choice fits a different evidence pattern: ${resolve(candidate[0])} Here, ${baseRationale.charAt(0).toLowerCase()}${baseRationale.slice(1)}`,
    }));
  }
  const id = `NH-${layer.toUpperCase()}-${scope.toUpperCase()}-${competency.id.toUpperCase()}-${difficulty.toUpperCase()}-${String(variant + 1).padStart(2, '0')}`;
  const correct = choices.find(choice => choice.score === 100);
  const distractors = choices.filter(choice => choice.score !== 100)
    .sort((a, b) => digest(`${id}-${a.label}`).localeCompare(digest(`${id}-${b.label}`)));
  // Exactly balanced answer positions within every mapped competency/difficulty cell.
  const correctPosition = (numberHash(`${group}-position`) + variant) % 4;
  distractors.splice(correctPosition, 0, correct);
  const options = distractors.map((option, index) => ({ id: 'ABCD'[index].toLowerCase(), ...option }));
  const prompt = overlay
    ? `${resolve(questionPrompt)} Choose the combined decision and ${layer === 'executive' ? 'leadership' : 'specialized'} action that both fit the evidence.`
    : resolve(questionPrompt);
  const question = {
    id, version: inventoryVersion, locale: 'en', layer, scope,
    scopeLabel: layer === 'core' ? 'Core / general' : context.label,
    domain: competency.domain, competencyIds: [competency.id], competencyLabel: competency.label,
    skillIds: competency.skills, difficulty, difficultyStatus: 'provisional', cognitiveTask: cognitiveTasks[difficulty],
    type: 'scenario', interaction: 'single', evidenceMode: 'knowing',
    functionTracks: layer === 'function' ? [scope] : [],
    industryTracks: layer === 'industry' ? [scope] : [],
    executiveRoles: layer === 'executive' ? [scope] : [],
    familyId: `${competency.id}-${difficulty}`,
    casePatternId: `${competency.id}-${difficulty}-${caseIndex + 1}`,
    variant: variant + 1,
    context: stem, prompt, options,
    correctOptionIds: [options[correctPosition].id],
    rationale: correct.feedback,
    scoring: { model: 'single-best-answer', correct: 100, incorrect: 0, calibration: 'not-piloted' },
    review: {
      status: 'draft', answerKey: 'pending', difficulty: 'pending', language: 'pending',
      specialization: layer === 'core' ? 'not-applicable' : 'pending',
      similarity: 'pending', reviewer: null, notes: '',
    },
    qualityFlags: [
      'related-variants-require-family-review',
      ...(layer === 'core' ? [] : ['check-specialized-distractor-and-difficulty']),
    ],
    provenance: {
      author: 'AI-assisted', evidence: 'synthetic exercise',
      blueprint: `${competency.id}/${difficulty}/${caseIndex + 1}`,
      overlay: overlay ? `${layer}/${scope}/${variant + 1}` : null,
    },
  };
  question.contentHash = digest(JSON.stringify({ context: question.context, prompt: question.prompt, options: question.options }));
  return question;
}

export function expectedCells(model) {
  const cells = Object.keys(model.competencyDefinitions).flatMap(competency => difficulties.map(difficulty => ({
    layer: 'core', scope: 'general', competency, difficulty, target: 8,
  })));
  for (const [layer, mappings] of Object.entries({
    function: model.functionPriorityCompetencies,
    industry: model.industryPriorityCompetencies,
    executive: model.executivePriorityCompetencies,
  })) {
    for (const [scope, competencies] of Object.entries(mappings)) {
      for (const competency of competencies) {
        for (const difficulty of difficulties) cells.push({ layer, scope, competency, difficulty, target: 4 });
      }
    }
  }
  return cells;
}

export function generateInventory(model) {
  return expectedCells(model).flatMap(cell => Array.from({ length: cell.target }, (_, variant) =>
    buildItem(model.competencyDefinitions[cell.competency], cell.layer, cell.scope, cell.difficulty, variant),
  ));
}

export function validateInventory(items, model) {
  const errors = [];
  const counts = new Map();
  const ids = new Set();
  const signatures = new Set();
  const liveIds = new Set(model.allAssessmentItems.map(item => item.id));
  const letters = { a: 0, b: 0, c: 0, d: 0 };
  const layerCounts = {};
  const casePatterns = new Set();
  const familyIds = new Set();
  const maxLengthFlags = [];
  for (const item of items) {
    if (ids.has(item.id) || liveIds.has(item.id)) errors.push(`Duplicate or live ID: ${item.id}`);
    ids.add(item.id);
    const signature = JSON.stringify([item.context, item.prompt, item.options.map(option => option.label).sort()]);
    if (signatures.has(signature)) errors.push(`Duplicate content: ${item.id}`);
    signatures.add(signature);
    if (item.review.status !== 'draft' || item.scoring.calibration !== 'not-piloted') errors.push(`Unreviewed publication: ${item.id}`);
    if (item.locale !== 'en' || item.difficultyStatus !== 'provisional') errors.push(`Invalid language/difficulty status: ${item.id}`);
    const competency = model.competencyDefinitions[item.competencyIds[0]];
    if (item.competencyIds.length !== 1 || !competency || competency.domain !== item.domain) errors.push(`Invalid competency: ${item.id}`);
    if (item.options.length !== 4 || new Set(item.options.map(option => option.label)).size !== 4) errors.push(`Invalid options: ${item.id}`);
    const best = item.options.filter(option => option.score === 100);
    if (best.length !== 1 || item.correctOptionIds.length !== 1 || best[0]?.id !== item.correctOptionIds[0]) errors.push(`Invalid key: ${item.id}`);
    for (const option of item.options) {
      if (!option.label?.trim() || !option.feedback?.trim() || ![0, 100].includes(option.score)) errors.push(`Invalid option content: ${item.id}`);
    }
    if (!item.context.trim() || !item.prompt.trim() || !item.rationale.trim() || /\{\{|\}\}|\bTODO\b/.test(signature)) errors.push(`Unresolved content: ${item.id}`);
    const trackField = { function: 'functionTracks', industry: 'industryTracks', executive: 'executiveRoles' }[item.layer];
    for (const field of ['functionTracks', 'industryTracks', 'executiveRoles']) {
      if (JSON.stringify(item[field]) !== JSON.stringify(field === trackField ? [item.scope] : [])) errors.push(`Invalid profile tag: ${item.id}`);
    }
    const cellKey = [item.layer, item.scope, item.competencyIds[0], item.difficulty].join('|');
    const cell = counts.get(cellKey) ?? { actual: 0, positions: { a: 0, b: 0, c: 0, d: 0 } };
    cell.actual++;
    cell.positions[item.correctOptionIds[0]]++;
    counts.set(cellKey, cell);
    letters[item.correctOptionIds[0]]++;
    layerCounts[item.layer] = (layerCounts[item.layer] ?? 0) + 1;
    casePatterns.add(item.casePatternId);
    familyIds.add(item.familyId);
    const lengths = item.options.map(option => option.label.length);
    if (best[0]?.label.length > Math.min(...lengths) * 1.8) maxLengthFlags.push(item.id);
  }
  const coverage = expectedCells(model).map(cell => {
    const key = [cell.layer, cell.scope, cell.competency, cell.difficulty].join('|');
    const actual = counts.get(key)?.actual ?? 0;
    if (actual !== cell.target) errors.push(`Coverage mismatch ${key}: ${actual}/${cell.target}`);
    const positions = counts.get(key)?.positions;
    if (positions && Object.values(positions).some(count => count !== cell.target / 4)) errors.push(`Answer-position imbalance: ${key}`);
    counts.delete(key);
    return { ...cell, actual };
  });
  if (counts.size) errors.push('Unexpected coverage cells.');
  for (const [layer, target] of Object.entries(layerTargets)) {
    if (layerCounts[layer] !== target) errors.push(`Layer mismatch ${layer}: ${layerCounts[layer]}/${target}`);
  }
  if (items.length !== 3328) errors.push(`Expected 3328, found ${items.length}`);
  if (errors.length) throw new Error(errors.join('\n'));
  return {
    total: items.length, uniqueIds: ids.size, layerCounts,
    byDifficulty: Object.fromEntries(difficulties.map(difficulty => [difficulty, items.filter(item => item.difficulty === difficulty).length])),
    answerPositions: letters, competencyDifficultyFamilies: familyIds.size,
    baseEvidencePatterns: casePatterns.size,
    coverageCells: coverage.length, coverage,
    longestAnswerReviewCount: maxLengthFlags.length, longestAnswerReviewIds: maxLengthFlags,
    liveInventoryCount: liveIds.size,
  };
}
