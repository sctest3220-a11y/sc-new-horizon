import fs from 'node:fs/promises';
import { readPlatformModel } from './lib/read-platform-model.mjs';
import { getArtifactNeedFromText } from '../inventory/artifact-needs.mjs';

const model = await readPlatformModel();
const outDir = new URL('../exports/review-inventory/', import.meta.url);

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function expandCompetencyIds(ids = []) {
  return unique(ids.flatMap((id) => model.broadCompetencyMap?.[id] ?? [id]));
}

function inferProfiles(expandedCompetencyIds) {
  const functionTracks = Object.entries(model.functionPriorityCompetencies)
    .filter(([, ids]) => expandedCompetencyIds.some((id) => ids.includes(id)))
    .map(([id]) => id);
  const industryTracks = Object.entries(model.industryPriorityCompetencies)
    .filter(([, ids]) => expandedCompetencyIds.some((id) => ids.includes(id)))
    .map(([id]) => id);
  const executiveRoles = Object.entries(model.executivePriorityCompetencies)
    .filter(([, ids]) => expandedCompetencyIds.some((id) => ids.includes(id)))
    .map(([id]) => id);
  return {
    functionTracks,
    functionLabels: functionTracks.map((id) => model.functionLabels[id] ?? id),
    industryTracks,
    industryLabels: industryTracks.map((id) => model.industryLabels[id] ?? id),
    executiveRoles,
    executiveLabels: executiveRoles.map((id) => model.executiveLabels[id] ?? id),
  };
}

function optionSummary(question) {
  if (question.parts?.length) {
    return question.parts.flatMap((part) => (part.options ?? []).map((option) => ({ ...option, id: `${part.id}:${option.id}` })));
  }
  if (question.matchPairs?.length) {
    return question.matchPairs.map((pair, index) => ({
      id: pair.id ?? `match-${index + 1}`,
      label: `${pair.left} -> ${pair.correct}`,
      score: 100,
    }));
  }
  if (question.rankItems?.length) {
    return question.rankItems.map((item, index) => ({ id: item.id, label: `${index + 1}. ${item.label}`, score: 100 }));
  }
  return question.options ?? [];
}

function correctOptionIds(question, options) {
  if (question.correctOptionIds?.length) return question.correctOptionIds;
  if (question.parts?.length) return question.parts.map((part) => `${part.id}:${part.correctOptionId}`).filter(Boolean);
  if (question.idealOrder?.length) return question.idealOrder;
  if (question.matchPairs?.length) return options.map((option) => option.id);
  return options.filter((option) => option.score >= 82).map((option) => option.id);
}

function formatLabel(question) {
  if (question.interaction === 'parts') return 'multi-part live item';
  if (question.interaction === 'multi') return 'select all live item';
  if (question.interaction === 'rank') return 'ranked live item';
  if (question.interaction === 'match') return 'matching live item';
  if (question.interaction === 'text') return 'written response live item';
  return 'scenario choice live item';
}

const questions = model.allAssessmentItems.map((question) => {
  const expandedCompetencyIds = expandCompetencyIds(question.competencyIds);
  const profiles = inferProfiles(expandedCompetencyIds);
  const options = optionSummary(question);
  const correctIds = correctOptionIds(question, options);
  const competencyLabels = expandedCompetencyIds.map((id) => model.competencyDefinitions[id]?.label ?? id);
  const artifactNeed = question.stimulus || question.visualStimulus
    ? {
        need: 'existing artifact',
        artifactType: 'existing-live-artifact',
        artifactLabel: question.stimulus?.label ?? question.visualStimulus?.title ?? 'Existing live artifact',
        artifactBrief: question.stimulus?.caption ?? question.visualStimulus?.summary ?? 'Existing live assessment artifact.',
        generationPrompt: `Existing artifact path: ${question.stimulus?.src ?? question.visualStimulus?.src ?? 'embedded visual stimulus'}`,
      }
    : getArtifactNeedFromText([
        question.context,
        question.prompt,
        question.exemplarAnswer,
        ...(question.options ?? []).filter((option) => (option.score ?? 0) >= 82).map((option) => `${option.label} ${option.feedback ?? ''}`),
      ].filter(Boolean).join(' '));

  return {
    id: question.id,
    sourceInventory: 'live',
    sourceBank: 'Existing live assessment bank',
    version: 'live-bank',
    locale: 'en',
    layer: 'live',
    scope: 'live',
    scopeLabel: 'Existing live bank',
    domain: question.domain,
    competencyIds: expandedCompetencyIds,
    competencyLabel: competencyLabels.join(', '),
    skillIds: question.skillIds ?? [],
    difficulty: question.difficulty,
    difficultyStatus: 'live',
    cognitiveTask: question.type ?? 'Live assessment item',
    type: question.type ?? 'scenario',
    interaction: question.interaction ?? 'single',
    evidenceMode: question.evidenceMode ?? '',
    recommendedFormat: {
      format: formatLabel(question),
      interaction: question.interaction ?? 'single',
      reason: 'This item already exists in the live bank. Review for clarity, relevance, artifacts, and scoring behavior.',
      rewritePrompt: 'Revise only if reviewer feedback or pilot data shows confusion, weak artifact fit, guessing risk, or stale wording.',
    },
    functionTracks: unique([...(question.functionTracks ?? []), ...profiles.functionTracks]),
    functionLabels: unique([...(question.functionTracks ?? []).map((id) => model.functionLabels[id] ?? id), ...profiles.functionLabels]),
    industryTracks: unique([...(question.industryTracks ?? []), ...profiles.industryTracks]),
    industryLabels: unique([...(question.industryTracks ?? []).map((id) => model.industryLabels[id] ?? id), ...profiles.industryLabels]),
    executiveRoles: profiles.executiveRoles,
    executiveLabels: profiles.executiveLabels,
    context: question.context,
    prompt: question.prompt,
    options,
    correctOptionIds: correctIds,
    rationale: question.exemplarAnswer || (question.options ?? []).find((option) => correctIds.includes(option.id))?.feedback || '',
    userFacingDraft: {
      status: 'live-item',
      interaction: question.interaction ?? 'single',
      format: formatLabel(question),
      context: question.context,
      prompt: question.prompt,
      options,
      correctOptionIds: correctIds,
      explanation: question.exemplarAnswer || '',
      rewriteNotes: 'Existing live item shown for reviewer inspection.',
    },
    artifactNeed,
    review: { status: 'live-review' },
  };
});

const payload = {
  schemaVersion: 1,
  inventoryVersion: 'live-bank',
  status: 'live',
  liveIntegration: true,
  questions,
  labels: {
    functionLabels: model.functionLabels,
    industryLabels: model.industryLabels,
    executiveLabels: model.executiveLabels,
  },
};

await fs.mkdir(outDir, { recursive: true });
await fs.writeFile(new URL('live-questions.json', outDir), `${JSON.stringify(payload, null, 2)}\n`);
console.log(JSON.stringify({ questions: questions.length, out: 'exports/review-inventory/live-questions.json' }, null, 2));
