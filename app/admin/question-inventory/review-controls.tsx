'use client';

import { useEffect, useMemo, useState } from 'react';

type ReviewSummary = {
  count: number;
  latestDecision: string;
  latestRating: number;
  problemCount: number;
  updatedAt: string;
};

const emptySummary: ReviewSummary = {
  count: 0,
  latestDecision: 'pending',
  latestRating: 0,
  problemCount: 0,
  updatedAt: '',
};

function readSummary(questionId: string): ReviewSummary {
  if (typeof window === 'undefined') return emptySummary;
  const saved = window.localStorage.getItem(`new-horizon-review:${questionId}`);
  if (!saved) return emptySummary;
  try {
    const parsed = JSON.parse(saved) as {
      entries?: Array<{ decision?: string; rating?: string; clarity?: string; artifact?: string; savedAt?: string }>;
      updatedAt?: string;
    };
    const entries = parsed.entries ?? [];
    const latest = entries[0];
    return {
      count: entries.length,
      latestDecision: latest?.decision || 'pending',
      latestRating: Number(latest?.rating || 0),
      problemCount: entries.filter((entry) => ['revise', 'reject'].includes(entry.decision || '') || ['wordy', 'confusing', 'ambiguous'].includes(entry.clarity || '') || ['irrelevant', 'unclear'].includes(entry.artifact || '')).length,
      updatedAt: latest?.savedAt || parsed.updatedAt || '',
    };
  } catch {
    return emptySummary;
  }
}

export function QuestionReviewStats({ questionId }: { questionId: string }) {
  const [summary, setSummary] = useState<ReviewSummary>(emptySummary);

  useEffect(() => {
    function refresh() {
      setSummary(readSummary(questionId));
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
  const [reviewCountFilter, setReviewCountFilter] = useState('all');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [decisionFilter, setDecisionFilter] = useState('all');
  const [visible, setVisible] = useState(questionIds.length);
  const ids = useMemo(() => questionIds, [questionIds]);

  useEffect(() => {
    function applyFilter() {
      let shown = 0;
      const summaries = new Map(ids.map((id) => [id, readSummary(id)]));
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
    }

    applyFilter();
    window.addEventListener('new-horizon-review-updated', applyFilter);
    window.addEventListener('storage', applyFilter);
    return () => {
      window.removeEventListener('new-horizon-review-updated', applyFilter);
      window.removeEventListener('storage', applyFilter);
    };
  }, [decisionFilter, ids, ratingFilter, reviewCountFilter]);

  return (
    <section className="inventory-panel inventory-review-filter-panel">
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
        <strong>{visible} of {questionIds.length} visible</strong>
        <small>Combined filters use the latest saved rating and decision in this browser for questions on the current page.</small>
      </div>
    </section>
  );
}
