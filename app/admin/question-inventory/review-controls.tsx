'use client';

import { useEffect, useMemo, useState } from 'react';

type ReviewSummary = {
  count: number;
  latestDecision: string;
  latestRating: number;
  problemCount: number;
  updatedAt: string;
};
type FullQuestion = { id: string; context?: string; prompt?: string; rationale?: string; options?: Array<{ id?: string; text?: string; label?: string }>; correctOptionIds?: string[] };

const emptySummary: ReviewSummary = {
  count: 0,
  latestDecision: 'pending',
  latestRating: 0,
  problemCount: 0,
  updatedAt: '',
};

async function readSummary(questionId: string): Promise<ReviewSummary> {
  if (typeof window === 'undefined') return emptySummary;
  try {
    const response = await fetch(`/api/results?questionId=${encodeURIComponent(questionId)}`);
    if (!response.ok) return emptySummary;
    const parsed = await response.json() as { entries?: Array<{ decision?: string; rating?: string; clarity?: string; artifact?: string; savedAt?: string }> };
    const entries = parsed.entries ?? [];
    const latest = entries[0];
    return {
      count: entries.length,
      latestDecision: latest?.decision || 'pending',
      latestRating: Number(latest?.rating || 0),
      problemCount: entries.filter((entry) => ['revise', 'reject'].includes(entry.decision || '') || ['wordy', 'confusing', 'ambiguous'].includes(entry.clarity || '') || ['irrelevant', 'unclear'].includes(entry.artifact || '')).length,
      updatedAt: latest?.savedAt || '',
    };
  } catch {
    return emptySummary;
  }
}

export function QuestionReviewStats({ questionId }: { questionId: string }) {
  const [summary, setSummary] = useState<ReviewSummary>(emptySummary);

  useEffect(() => {
    function refresh() {
      readSummary(questionId).then(setSummary);
    }
    refresh();
    window.addEventListener('new-horizon-review-updated', refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener('new-horizon-review-updated', refresh);
      window.removeEventListener('storage', refresh);
    };
  }, [questionId]);

  return (
    <div className="inventory-review-stats" data-review-stats={questionId}>
      <span>{summary.count} review{summary.count === 1 ? '' : 's'}</span>
      <span>{summary.latestRating ? `${summary.latestRating}/5 stars` : 'No rating'}</span>
      <span>{summary.latestDecision}</span>
      {summary.problemCount ? <span>{summary.problemCount} problem flag{summary.problemCount === 1 ? '' : 's'}</span> : null}
    </div>
  );
}

export function ReviewFilterControls({ questionIds }: { questionIds: string[] }) {
  // A fresh/reset inventory view should open the next review queue first.
  const [reviewCountFilter, setReviewCountFilter] = useState('0');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [decisionFilter, setDecisionFilter] = useState('all');
  const [visible, setVisible] = useState(questionIds.length);
  const [reviewedElsewhere, setReviewedElsewhere] = useState<string[]>([]);
  const [globalMatchCount, setGlobalMatchCount] = useState(0);
  const [globalMatches, setGlobalMatches] = useState<string[]>([]);
  const [globalQuestions, setGlobalQuestions] = useState<FullQuestion[]>([]);
  const [showGlobalIds, setShowGlobalIds] = useState(false);
  const ids = useMemo(() => questionIds, [questionIds]);

  useEffect(() => {
    async function applyFilter() {
      let shown = 0;
      const results = await Promise.all(ids.map(async (id) => [id, await readSummary(id)] as const));
      const summaries = new Map(results);
      const reviewedCounts = [...summaries.values()].filter((summary) => summary.count > 0).map((summary) => summary.count);
      const minReviewed = reviewedCounts.length ? Math.min(...reviewedCounts) : 0;

      for (const id of ids) {
        const card = document.querySelector<HTMLElement>(`[data-question-id="${CSS.escape(id)}"]`);
        if (!card) continue;
        const summary = summaries.get(id) ?? emptySummary;
        const matchesReviewCount =
          reviewCountFilter === 'all' ||
          (reviewCountFilter === '0' && summary.count === 0) ||
          (reviewCountFilter === '1' && summary.count === 1) ||
          (reviewCountFilter === '2' && summary.count === 2) ||
          (reviewCountFilter === '3-plus' && summary.count >= 3) ||
          (reviewCountFilter === 'fewest' && (summary.count === 0 || summary.count === minReviewed));
        const matchesRating =
          ratingFilter === 'all' ||
          (ratingFilter === 'unrated' && summary.latestRating === 0) ||
          (ratingFilter === 'low' && summary.latestRating >= 1 && summary.latestRating <= 2) ||
          (ratingFilter === 'high' && summary.latestRating >= 4) ||
          Number(ratingFilter) === summary.latestRating;
        const matchesDecision =
          decisionFilter === 'all' ||
          (decisionFilter === 'attention' && summary.problemCount > 0) ||
          summary.latestDecision === decisionFilter;
        const matches = matchesReviewCount && matchesRating && matchesDecision;
        card.hidden = !matches;
        if (matches) shown += 1;
      }
      setVisible(shown);
      setReviewedElsewhere([]);
      setGlobalMatchCount(shown);
    }

    applyFilter();
    window.addEventListener('new-horizon-review-updated', applyFilter);
    window.addEventListener('storage', applyFilter);
    return () => {
      window.removeEventListener('new-horizon-review-updated', applyFilter);
      window.removeEventListener('storage', applyFilter);
    };
  }, [decisionFilter, ids, ratingFilter, reviewCountFilter]);

  useEffect(() => {
    fetch('/api/results?feedback=all', { cache: 'no-store' }).then((response) => response.ok ? response.json() : null).then((data: { entries?: Array<{ questionId?: string; rating?: number; decision?: string }> } | null) => {
      if (!data) return;
      const grouped = new Map<string, Array<{ rating?: number; decision?: string }>>();
      for (const entry of data.entries ?? []) if (entry.questionId) (grouped.get(entry.questionId) ?? (grouped.set(entry.questionId, []), grouped.get(entry.questionId)!)).push(entry);
      const matches: string[] = [];
      for (const [id, entries] of grouped) {
        const latest = entries[0]; const count = entries.length; const rating = Number(latest?.rating ?? 0); const decision = latest?.decision ?? 'pending';
        const countMatch = reviewCountFilter === 'all' || (reviewCountFilter === '0' && count === 0) || (reviewCountFilter === '1' && count === 1) || (reviewCountFilter === '2' && count === 2) || (reviewCountFilter === '3-plus' && count >= 3);
        const ratingMatch = ratingFilter === 'all' || (ratingFilter === 'unrated' && !rating) || (Number(ratingFilter) === rating) || (ratingFilter === 'low' && rating >= 1 && rating <= 2) || (ratingFilter === 'high' && rating >= 4);
        const decisionMatch = decisionFilter === 'all' || decision === decisionFilter;
        if (countMatch && ratingMatch && decisionMatch) matches.push(id);
      }
      setGlobalMatches(matches); setGlobalMatchCount(matches.length);
      fetch('/review-inventory/index.json', { cache: 'no-store' }).then((response) => response.ok ? response.json() : []).then((all: FullQuestion[]) => {
        const wanted = new Set(matches); const selected = all.filter((question) => wanted.has(question.id)).slice(0, 25);
        setGlobalQuestions(selected);
        return Promise.all(selected.map((question) => fetch(`/review-inventory/detail/${encodeURIComponent(question.id)}.json`, { cache: 'no-store' }).then((response) => response.ok ? response.json() : question).then((detail) => detail?.prompt ? detail : question).catch(() => question)));
      }).then((selected) => setGlobalQuestions(selected as FullQuestion[]))
      .catch(() => setGlobalQuestions([]));
    }).catch(() => setGlobalMatches([]));
  }, [decisionFilter, ratingFilter, reviewCountFilter]);

  return (
    <div className="inventory-review-filter-panel">
      <div className="inventory-review-filter-heading">
        <strong>Review filters</strong>
        <small>Filter the questions on this page by saved reviewer activity.</small>
      </div>
      <label>
        <span>Number of reviews</span>
        <select value={reviewCountFilter} onChange={(event) => setReviewCountFilter(event.target.value)}>
          <option value="all">Any review count</option>
          <option value="0">Not reviewed</option>
          <option value="1">Exactly 1 review</option>
          <option value="2">Exactly 2 reviews</option>
          <option value="3-plus">3 or more reviews</option>
          <option value="fewest">Fewest reviews on this page</option>
        </select>
      </label>
      <label>
        <span>Question rating</span>
        <select value={ratingFilter} onChange={(event) => setRatingFilter(event.target.value)}>
          <option value="all">Any latest rating</option>
          <option value="unrated">Not rated</option>
          <option value="1">1 star</option>
          <option value="2">2 stars</option>
          <option value="3">3 stars</option>
          <option value="4">4 stars</option>
          <option value="5">5 stars</option>
          <option value="low">Low rating, 1-2 stars</option>
          <option value="high">High rating, 4-5 stars</option>
        </select>
      </label>
      <label>
        <span>Decision status</span>
        <select value={decisionFilter} onChange={(event) => setDecisionFilter(event.target.value)}>
          <option value="all">Any latest decision</option>
          <option value="pending">Pending</option>
          <option value="approve">Approve for pilot</option>
          <option value="revise">Revise</option>
          <option value="reject">Reject</option>
          <option value="attention">Any problem flag</option>
        </select>
      </label>
      <div className="inventory-review-filter-summary">
        <strong>{globalMatches.length} matching question{globalMatches.length === 1 ? '' : 's'} across the bank</strong>
        <small><b>Current page:</b> {visible} matching. <b>Entire bank:</b> {globalMatches.length} matching.</small>
{globalMatches.length ? <><button type="button" className="inventory-reviewed-elsewhere-toggle" aria-expanded={showGlobalIds} onClick={() => setShowGlobalIds((open) => !open)}>Matching question IDs across the bank ({globalMatches.length}) {showGlobalIds ? "▴" : "▾"}</button>{showGlobalIds ? <div className="inventory-reviewed-elsewhere"><ul>{globalMatches.slice(0, 25).map((id) => <li key={id}>{id}</li>)}</ul></div> : null}</> : null}
      </div>
    </div>
  );
}
