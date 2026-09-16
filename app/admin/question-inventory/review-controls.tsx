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
  const [filter, setFilter] = useState('all');
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
        const matches =
          filter === 'all' ||
          (filter === 'unreviewed' && summary.count === 0) ||
          (filter === 'reviewed' && summary.count > 0) ||
          (filter === 'fewest-reviewed' && (summary.count === 0 || summary.count === minReviewed)) ||
          (filter === 'problem' && summary.problemCount > 0) ||
          (filter === 'low-rated' && summary.latestRating > 0 && summary.latestRating <= 2) ||
          (filter === 'approved' && summary.latestDecision === 'approve') ||
          (filter === 'revise' && summary.latestDecision === 'revise') ||
          (filter === 'reject' && summary.latestDecision === 'reject');
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
  }, [filter, ids]);

  return (
    <section className="inventory-panel inventory-review-filter-panel">
      <label>
        <span>Review status filter</span>
        <select value={filter} onChange={(event) => setFilter(event.target.value)}>
          <option value="all">All shown questions</option>
          <option value="unreviewed">Not reviewed yet</option>
          <option value="reviewed">Reviewed at least once</option>
          <option value="fewest-reviewed">Fewest reviews</option>
          <option value="problem">Most/problem flags</option>
          <option value="low-rated">Low rating, 1-2 stars</option>
          <option value="approved">Latest status: approved</option>
          <option value="revise">Latest status: revise</option>
          <option value="reject">Latest status: reject</option>
        </select>
      </label>
      <strong>{visible} visible after review filter</strong>
      <small>Counts are based on reviewer feedback saved in this browser.</small>
    </section>
  );
}
