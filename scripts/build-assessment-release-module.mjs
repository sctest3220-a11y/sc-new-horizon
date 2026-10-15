import fs from 'node:fs';

const release = JSON.parse(fs.readFileSync('exports/production/releases/2026-10-07.1/release-questions.json', 'utf8'));
const allowedTypes = new Set(['scenario', 'media', 'judgment', 'multi-select', 'drag-order', 'matching', 'report-review', 'narrative', 'fraud-detection', 'reliance-decision', 'concept-cluster']);
const questions = release.map(({ question: q }) => {
  const draft = q.userFacingDraft ?? {};
  const thai = draft.th ?? q.th ?? {};
  const options = Array.isArray(draft.options) && draft.options.length ? draft.options : (q.options ?? []);
  const correctOptionIds = draft.correctOptionIds ?? q.correctOptionIds ?? [];
  const parts = q.parts ?? (draft.interaction === 'parts'
    ? [0, 1].map((partIndex) => {
        const clauses = options.map((option) => String(option.label).split(';').map((item) => item.trim())[partIndex] ?? option.label);
        const unique = [...new Set(clauses)];
        const correctLabel = options.find((option) => correctOptionIds.includes(option.id))?.label;
        const correctClause = correctLabel ? String(correctLabel).split(';').map((item) => item.trim())[partIndex] : '';
        return {
          id: `part-${partIndex + 1}`,
          domain: q.domain,
          prompt: partIndex === 0 ? 'Which finding best explains the situation?' : 'Which action best fits the situation?',
          correctOptionId: `answer-${unique.indexOf(correctClause)}`,
          options: unique.map((label, index) => ({ id: `answer-${index}`, label, score: label === correctClause ? 100 : 0, feedback: label === correctClause ? 'Correct.' : 'This does not match the strongest evidence for this part.' })),
        };
      })
    : undefined);
  return {
    id: `${q.id}@2026-10-07.1`,
    sourceQuestionId: q.id,
    domain: q.domain,
    difficulty: q.difficulty,
    type: allowedTypes.has(q.type) ? q.type : 'scenario',
    interaction: draft.interaction ?? q.interaction ?? 'single',
    competencyIds: q.competencyIds ?? [],
    skillIds: q.skillIds ?? [],
    evidenceMode: q.evidenceMode ?? 'hybrid',
    functionTracks: q.functionTracks ?? [],
    industryTracks: q.industryTracks ?? [],
    context: draft.context ?? q.context ?? '',
    prompt: draft.prompt ?? q.prompt ?? '',
    contextTh: thai.context ?? q.contextTh ?? '',
    promptTh: thai.prompt ?? q.promptTh ?? '',
    translationStatus: 'reviewed',
    options: options.map((option) => ({ ...option, labelTh: option.thLabel ?? option.labelTh, feedbackTh: option.thFeedback ?? option.feedbackTh })),
    parts: parts?.map((part) => ({ ...part, promptTh: thai.prompt ?? part.prompt, options: part.options.map((option) => ({ ...option, labelTh: option.thLabel ?? option.labelTh, feedbackTh: option.thFeedback ?? option.feedbackTh })) })),
    correctOptionIds,
    rationale: draft.explanation ?? q.rationale ?? '',
    typeVersion: '2026-10-07.1',
  };
});
fs.writeFileSync('app/productionQuestionRelease.ts', `// Generated from the append-only 2026-10-07.1 production release.\nexport const productionQuestionRelease = ${JSON.stringify(questions, null, 2)} as const;\n`);
console.log(JSON.stringify({ questions: questions.length, translated: questions.filter((q) => q.contextTh && q.promptTh).length }));
