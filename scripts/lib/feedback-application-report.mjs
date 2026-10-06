import assert from 'node:assert/strict';
import { feedbackBatch } from '../../inventory/feedback-checkpoints.mjs';

function textFields(draft, thai = false) {
  const result = {};
  for (const key of ['context', 'prompt', 'explanation']) result[key] = thai ? draft.th?.[key] : draft[key];
  const options = (values, prefix) => {
    for (const option of values ?? []) {
      result[`${prefix}.${option.id}.label`] = thai ? option.thLabel : option.label;
      result[`${prefix}.${option.id}.feedback`] = thai ? option.thFeedback : option.feedback;
    }
  };
  options(draft.options, 'options');
  for (const part of draft.parts ?? []) {
    result[`parts.${part.id}.prompt`] = thai ? part.thPrompt : part.prompt;
    options(part.options, `parts.${part.id}.options`);
  }
  return result;
}

export function feedbackApplicationReport(questions, history) {
  const byId = new Map(questions.map(q => [q.id, q]));
  const historyById = new Map(history.items.map(item => [item.questionId, item]));
  const items = Object.entries(feedbackBatch.items).map(([id, item]) => {
    const question = byId.get(id);
    const saved = historyById.get(id);
    const before = saved?.revisions?.find(r => r.revision === feedbackBatch.revision)?.previousDraft;
    assert.ok(before, `${id}: missing pre-feedback draft history`);
    const changedFields = thai => {
      const oldText = textFields(before, thai), newText = textFields(question.userFacingDraft, thai);
      return [...new Set([...Object.keys(oldText), ...Object.keys(newText)])].filter(key => oldText[key] !== newText[key]);
    };
    return {
      id, feedbackIds: item.feedbackIds, recordedDecision: item.decision, disposition: item.disposition,
      englishChangedFields: changedFields(false), thaiChangedFields: changedFields(true),
      reviewedClassification: item.patch.reviewedClassification ?? null,
      reviewedFormat: item.patch.reviewedFormat ?? null,
      artifactNeed: question.artifactNeed?.need ?? null,
      notes: item.notes, remainingIssues: item.issues,
      status: item.patch.feedbackReview.status, thaiStatus: item.patch.feedbackReview.thaiStatus,
    };
  });
  return {
    revision: feedbackBatch.revision, source: feedbackBatch.source, sourceSha256: feedbackBatch.sourceSha256,
    scope: 'Local English/Thai review drafts. Original audit records, scored production bank and dated snapshots are preserved.',
    summary: {
      feedbackRecords: items.reduce((sum, item) => sum + item.feedbackIds.length, 0), questionIds: items.length,
      englishTextChanged: items.filter(item => item.englishChangedFields.length).length,
      thaiTextChanged: items.filter(item => item.thaiChangedFields.length).length,
      reviewedClassifications: items.filter(item => item.reviewedClassification).length,
      reviewedFormats: items.filter(item => item.reviewedFormat).length,
      withRemainingIssues: items.filter(item => item.remainingIssues.length).length,
    },
    releaseStatus: 'Local drafts only; Thai native review and calibration of substantively revised alternatives remain pending.',
    items,
  };
}
