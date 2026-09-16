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
import { getArtifactNeedFromText } from './artifact-needs.mjs';

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
const wordCount = (value) => value.trim().split(/\s+/).filter(Boolean).length;
const articleFor = (value) => /^[aeiou]/i.test(value.trim()) ? 'an' : 'a';
function createScenarioContext(context, evidence, overlay, layer) {
  const lines = [
    `Scenario: ${context.label} needs ${articleFor(context.deliverable)} ${context.deliverable}.`,
    `Use: ${context.source}.`,
    `Rule: ${context.constraint}`,
    `Risk: ${context.consequence}`,
    `Evidence: ${evidence}`,
  ];
  if (overlay) lines.push(`Extra ${layer === 'executive' ? 'leadership' : layer} cue: ${overlay[0]}`);
  return lines.join('\n');
}

function createRecommendedFormat(layer, difficulty, variant, questionPrompt, selected, overlay) {
  if (overlay && ['proficient', 'advanced'].includes(difficulty)) {
    return {
      format: 'multi-part scenario',
      interaction: 'parts',
      reason: 'The item asks for both a competency decision and a role/profile action, so users should answer those as separate steps.',
      rewritePrompt: 'Split into two short questions: first diagnose the AI issue, then choose the safest role/profile action.',
      sampleParts: [
        { prompt: questionPrompt, expectedEvidence: selected[2] },
        { prompt: `What should the ${layer === 'executive' ? 'leader' : 'role'} do next?`, expectedEvidence: overlay[3] },
      ],
    };
  }
  if (difficulty === 'advanced') {
    return {
      format: 'ranked decision',
      interaction: 'rank',
      reason: 'Advanced items should test sequencing, tradeoffs, and control priority rather than only recognition.',
      rewritePrompt: 'Ask the user to put 3-4 actions in the best order, then explain the highest-risk step.',
    };
  }
  if (difficulty === 'proficient') {
    return {
      format: 'compare and choose',
      interaction: 'single',
      reason: 'Proficient items should make users compare evidence and diagnose why one explanation is better.',
      rewritePrompt: 'Show two plausible interpretations, then ask which one is better supported and why.',
    };
  }
  if (difficulty === 'applied' && variant % 2 === 1) {
    return {
      format: 'select all safe actions',
      interaction: 'multi',
      reason: 'Applied items can be more practical when users identify all safe next steps, not just one best label.',
      rewritePrompt: 'Convert options into actions and allow multiple correct choices with partial credit.',
    };
  }
  if (difficulty === 'awareness' && variant % 2 === 1) {
    return {
      format: 'matching',
      interaction: 'match',
      reason: 'Awareness items can be less repetitive when users match a simple observation to the right AI concept.',
      rewritePrompt: 'Ask users to match 2-3 observations to concepts such as retrieval, generation, privacy, or approval.',
    };
  }
  return {
    format: 'scenario choice',
    interaction: 'single',
    reason: 'A compact single-choice scenario is acceptable when the item tests one clear decision.',
    rewritePrompt: 'Keep the scenario short and make the answer choices concrete actions a user can picture.',
  };
}

function cleanSentence(value) {
  return value.replace(/\s+/g, ' ').replace(/\.$/, '').trim();
}

function splitCombinedChoice(label) {
  const parts = label.split('; ');
  if (parts.length < 2) return null;
  return {
    decision: cleanSentence(parts[0]),
    action: cleanSentence(parts.slice(1).join('; ')),
  };
}

function uniqueChoices(values) {
  return Array.from(new Set(values.filter(Boolean))).map((label, index) => ({
    id: String.fromCharCode(97 + index),
    label,
  }));
}

function softenRule(rule) {
  return rule
    .replace('must', 'has to')
    .replace('may', 'can')
    .replace('require', 'need')
    .replace('requires', 'needs');
}

function createNaturalScenario(context, caseEvidence, overlay) {
  const deliverable = context.deliverable;
  const source = context.source;
  const rule = softenRule(context.constraint);
  const setting = `${context.label} is preparing ${articleFor(deliverable)} ${deliverable} with AI.`;

  let scenario;
  if (/creates new sentences from learned patterns; it has no connection to/i.test(caseEvidence)) {
    scenario = `${setting} The AI composes new draft wording from learned patterns instead of retrieving text from ${source}. That matters because ${rule.charAt(0).toLowerCase()}${rule.slice(1)}`;
  } else if (/returns unchanged passages with record identifiers/i.test(caseEvidence)) {
    scenario = `${setting} The AI returns exact passages from ${source}, including record identifiers, rather than writing a new explanation. The team still has to follow this rule: ${rule}`;
  } else if (/follows an explicit if-then rule/i.test(caseEvidence)) {
    scenario = `${setting} The AI is not really interpreting the request; it follows a fixed if-then rule and copies an approved sentence. The output still has to respect this rule: ${rule}`;
  } else if (/workspace combines a model, a search index, permissions, and a review screen/i.test(caseEvidence)) {
    scenario = `${setting} The workflow uses several parts together: a model, a search index, permissions, and a review screen. The team needs to understand which setup fits the work because ${rule.charAt(0).toLowerCase()}${rule.slice(1)}`;
  } else {
    scenario = `${setting} ${caseEvidence} The team has to handle the AI output carefully because ${rule.charAt(0).toLowerCase()}${rule.slice(1)}`;
  }

  return [scenario, ...(overlay ? [`Additional detail: ${overlay[0]}`] : [])].join('\n');
}

function createUserFacingDraft(questionBase, context, caseEvidence, overlay, prompt, options, correctOptionId) {
  const correctOption = options.find((option) => option.id === correctOptionId);
  const naturalScenario = createNaturalScenario(context, caseEvidence, overlay);
  const basePrompt = prompt.replace(' Also apply the profile cue.', '').trim();
  const friendlyPrompt = basePrompt
    .replace('Which description best matches the system used for', 'What is the AI tool doing in')
    .replace('Which next evaluation best addresses the identified uncertainty?', 'What should the team test first?')
    .replace('Which implementation fits the stated requirement for', 'What setup best fits')
    .replace('Which check should resolve the specific evidence gap first?', 'What should they check first?');

  if (overlay) {
    const splitOptions = options.map((option) => ({ option, split: splitCombinedChoice(option.label) })).filter((item) => item.split);
    const correctSplit = splitOptions.find((item) => item.option.id === correctOptionId)?.split;
    const decisionChoices = uniqueChoices(splitOptions.map((item) => item.split?.decision));
    const actionChoices = uniqueChoices(splitOptions.map((item) => item.split?.action));
    const correctDecision = decisionChoices.find((choice) => choice.label === correctSplit?.decision)?.id;
    const correctAction = actionChoices.find((choice) => choice.label === correctSplit?.action)?.id;
    return {
      status: 'draft-rewrite',
      interaction: 'parts',
      format: 'multi-part scenario',
      context: naturalScenario,
      prompt: 'Answer both parts.',
      parts: [
        {
          id: 'diagnosis',
          prompt: friendlyPrompt,
          options: decisionChoices,
          correctOptionIds: correctDecision ? [correctDecision] : [],
        },
        {
          id: 'action',
          prompt: `What should the ${questionBase.layer === 'executive' ? 'leader' : 'team'} do about the extra detail?`,
          options: actionChoices,
          correctOptionIds: correctAction ? [correctAction] : [],
        },
      ],
      explanation: correctOption?.feedback ?? questionBase.rationale,
      rewriteNotes: 'Split the original combined answer into two decisions so users do not have to decode long compound options.',
    };
  }

  if (questionBase.recommendedFormat.format === 'select all safe actions') {
    return {
      status: 'draft-rewrite',
      interaction: 'multi',
      format: 'select all safe actions',
      context: naturalScenario,
      prompt: `${friendlyPrompt} Select all that apply.`,
      options: options.map(({ id, label }) => ({ id, label })),
      correctOptionIds: [correctOptionId],
      explanation: correctOption?.feedback ?? questionBase.rationale,
      rewriteNotes: 'This is still a draft: reviewers should add one more defensible correct action before live use.',
    };
  }

  if (questionBase.recommendedFormat.format === 'ranked decision') {
    const correctLabel = correctOption?.label ?? '';
    return {
      status: 'draft-rewrite',
      interaction: 'rank',
      format: 'ranked decision',
      context: naturalScenario,
      prompt: friendlyPrompt,
      options: options.map(({ id, label }) => ({ id, label })),
      correctOptionIds: [correctOptionId],
      explanation: correctOption?.feedback ?? questionBase.rationale,
      rewriteNotes: `The best first check is "${correctLabel}". Reviewers should convert sibling options into an explicit sequence before live use.`,
    };
  }

  return {
    status: 'draft-rewrite',
    interaction: 'single',
    format: questionBase.recommendedFormat.format,
    context: naturalScenario,
    prompt: friendlyPrompt,
    options: options.map(({ id, label }) => ({ id, label })),
    correctOptionIds: [correctOptionId],
    explanation: correctOption?.feedback ?? questionBase.rationale,
    rewriteNotes: 'Plain-language draft generated from the coverage item; still requires human review before pilot use.',
  };
}

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
  const evidence = caseEvidence;
  const stem = createScenarioContext(context, evidence, overlay, layer);
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
    ? `${resolve(questionPrompt)} Also apply the profile cue.`
    : resolve(questionPrompt);
  const recommendedFormat = createRecommendedFormat(layer, difficulty, variant, resolve(questionPrompt), selected, overlay);
  const questionBaseForRewrite = { layer, recommendedFormat, rationale: correct.feedback };
  const userFacingDraft = createUserFacingDraft(questionBaseForRewrite, context, caseEvidence, overlay, prompt, options, options[correctPosition].id);
  const readability = {
    contextWords: wordCount(stem),
    promptWords: wordCount(prompt),
    longestOptionWords: Math.max(...choices.map(choice => wordCount(choice.label))),
    target: 'Keep context under 85 words, prompt under 22 words, and each option under 24 words before pilot release.',
  };
  const question = {
    id, version: inventoryVersion, locale: 'en', layer, scope,
    scopeLabel: layer === 'core' ? 'Core / general' : context.label,
    domain: competency.domain, competencyIds: [competency.id], competencyLabel: competency.label,
    skillIds: competency.skills, difficulty, difficultyStatus: 'provisional', cognitiveTask: cognitiveTasks[difficulty],
    type: 'scenario', interaction: 'single', evidenceMode: 'knowing',
    recommendedFormat,
    userFacingDraft,
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
      ...(readability.contextWords > 85 || readability.promptWords > 22 || readability.longestOptionWords > 24
        ? ['readability-review']
        : []),
    ],
    readability,
    sourceScenario: {
      setting: context.label,
      deliverable: context.deliverable,
      source: context.source,
      owner: context.owner,
      constraint: context.constraint,
      consequence: context.consequence,
      evidence: caseEvidence,
      overlayEvidence: overlay?.[0] ?? null,
    },
    provenance: {
      author: 'AI-assisted', evidence: 'synthetic exercise',
      blueprint: `${competency.id}/${difficulty}/${caseIndex + 1}`,
      overlay: overlay ? `${layer}/${scope}/${variant + 1}` : null,
    },
  };
  const artifactNeed = getArtifactNeedFromText([
    question.context,
    question.prompt,
    question.rationale,
    question.sourceScenario.source,
    question.sourceScenario.evidence,
    question.sourceScenario.overlayEvidence,
    question.options.find((option) => option.id === question.correctOptionIds[0])?.label,
    question.options.find((option) => option.id === question.correctOptionIds[0])?.feedback,
  ].filter(Boolean).join(' '));
  if (artifactNeed) {
    question.artifactNeed = {
      ...artifactNeed,
      questionId: question.id,
      prompt: `${artifactNeed.generationPrompt} Tailor it to this question: ${question.userFacingDraft.context.replace(/\n/g, ' ')} ${question.userFacingDraft.prompt}`,
    };
  }
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
  const readabilityFlags = [];
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
    if (!item.readability || typeof item.readability.contextWords !== 'number' || typeof item.readability.promptWords !== 'number') errors.push(`Missing readability metadata: ${item.id}`);
    if (!item.sourceScenario?.setting || !item.sourceScenario?.evidence) errors.push(`Missing source scenario metadata: ${item.id}`);
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
    if (item.qualityFlags.includes('readability-review')) readabilityFlags.push(item.id);
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
    readabilityReviewCount: readabilityFlags.length, readabilityReviewIds: readabilityFlags,
    liveInventoryCount: liveIds.size,
  };
}
