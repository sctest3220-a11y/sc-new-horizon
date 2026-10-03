'use client';

import { useEffect, useState } from 'react';

type FeedbackState = {
  decision: string;
  rating: string;
  clarity: string;
  artifact: string;
  format: string;
  comment: string;
  suggestedChange: string;
};

type SavedFeedbackEntry = FeedbackState & {
  id: string;
  savedAt: string;
};

const emptyFeedback: FeedbackState = {
  decision: 'pending',
  rating: '',
  clarity: '',
  artifact: '',
  format: '',
  comment: '',
  suggestedChange: '',
};

function blankFeedback(): FeedbackState {
  return { ...emptyFeedback };
}

export function ReviewerFeedback({ questionId }: { questionId: string }) {
  // Start empty on both server and client, then load from localStorage after
  // mount: reading it during render made the hydrated HTML differ from the
  // server's whenever this browser already held feedback for the question.
  const [feedback, setFeedback] = useState<FeedbackState>(blankFeedback);
  const [entries, setEntries] = useState<SavedFeedbackEntry[]>([]);
  const [savedAt, setSavedAt] = useState('');
  const [historyOrder, setHistoryOrder] = useState<'newest' | 'oldest'>('newest');

  useEffect(() => {
    fetch(`/api/results?questionId=${encodeURIComponent(questionId)}`).then((response) => response.ok ? response.json() : null).then((data) => {
      if (!data) return;
      const next = ((data as { entries?: SavedFeedbackEntry[] }).entries ?? []);
      setEntries(next); setSavedAt(next[0]?.savedAt ?? '');
    }).catch(() => undefined);
  }, [questionId]);

  function update(patch: Partial<FeedbackState>) {
    const next = { ...feedback, ...patch };
    setFeedback(next);
  }

  function saveEntry() {
    const timestamp = new Date().toISOString();
    const nextEntries = [{ ...feedback, id: timestamp, savedAt: timestamp }, ...entries];
    const nextDraft = blankFeedback();
    setEntries(nextEntries);
    setFeedback(nextDraft);
    setSavedAt(timestamp);
    fetch('/api/results', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ kind: 'question_feedback', questionId, ...feedback }) })
      .then(() => window.dispatchEvent(new CustomEvent('new-horizon-review-updated', { detail: { questionId } })))
      .catch(() => undefined);
  }

  return (
    <section className="reviewer-feedback">
      <div className="reviewer-feedback-heading">
        <div>
          <span>Reviewer feedback</span>
          <strong>Hosted feedback for this question</strong>
        </div>
        <small>{savedAt ? `Draft autosaved ${new Date(savedAt).toLocaleString()}` : 'No draft yet'}</small>
      </div>
      <div className="reviewer-rating-panel" aria-label="Question rating">
        <span>Question rating</span>
        <div>
          {[1, 2, 3, 4, 5].map((rating) => (
            <button
              type="button"
              key={rating}
              className={Number(feedback.rating) >= rating ? 'is-active' : undefined}
              onClick={() => update({ rating: String(rating) })}
              aria-pressed={Number(feedback.rating) === rating}
            >
              ★
            </button>
          ))}
        </div>
        <small>{feedback.rating ? `${feedback.rating}/5 latest draft rating` : 'Select 1-5 stars before saving review'}</small>
      </div>
      <div className="reviewer-feedback-grid">
        <label>
          Decision
          <select value={feedback.decision} onChange={(event) => update({ decision: event.target.value })}>
            <option value="pending">Pending</option>
            <option value="approve">Approve for pilot</option>
            <option value="revise">Revise</option>
            <option value="reject">Reject</option>
          </select>
        </label>
        <label>
          Clarity
          <select value={feedback.clarity} onChange={(event) => update({ clarity: event.target.value })}>
            <option value="">Not checked</option>
            <option value="clear">Clear</option>
            <option value="wordy">Too wordy</option>
            <option value="confusing">Confusing</option>
            <option value="ambiguous">Ambiguous answer</option>
          </select>
        </label>
        <label>
          Artifact
          <select value={feedback.artifact} onChange={(event) => update({ artifact: event.target.value })}>
            <option value="">Not checked</option>
            <option value="not-needed">Not needed</option>
            <option value="needed">Needed</option>
            <option value="irrelevant">Irrelevant</option>
            <option value="unclear">Hard to read</option>
          </select>
        </label>
        <label>
          Format
          <select value={feedback.format} onChange={(event) => update({ format: event.target.value })}>
            <option value="">Not checked</option>
            <option value="single">Single choice works</option>
            <option value="multi">Use select-all</option>
            <option value="parts">Use multi-part</option>
            <option value="rank">Use ranking</option>
            <option value="artifact">Use artifact review</option>
          </select>
        </label>
      </div>
      <label>
        Reviewer comment
        <textarea value={feedback.comment} onChange={(event) => update({ comment: event.target.value })} placeholder="What is unclear, stale, too easy, or missing?" />
      </label>
      <label>
        Suggested change
        <textarea value={feedback.suggestedChange} onChange={(event) => update({ suggestedChange: event.target.value })} placeholder="Rewrite idea, artifact request, scoring note, or reason to reject." />
      </label>
      <div className="reviewer-feedback-actions">
        <button type="button" onClick={saveEntry}>Save review</button>
        <span>Saving records this review in the hosted database and clears the editable fields.</span>
      </div>
      {entries.length ? (
        <details className="reviewer-feedback-history-disclosure">
          <summary>Saved feedback history · {entries.length} review{entries.length === 1 ? '' : 's'} · hosted</summary>
          <div className="reviewer-feedback-history">
            <label className="reviewer-feedback-history-sort">Order
              <select value={historyOrder} onChange={(event) => setHistoryOrder(event.target.value as 'newest' | 'oldest')}>
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
              </select>
            </label>
            {[...entries].sort((a, b) => historyOrder === 'newest' ? b.savedAt.localeCompare(a.savedAt) : a.savedAt.localeCompare(b.savedAt)).slice(0, 5).map((entry) => (
              <article key={entry.id}>
                <small>{new Date(entry.savedAt).toLocaleString()}</small>
                <p>{[entry.decision, entry.rating ? `${entry.rating} stars` : '', entry.clarity, entry.artifact, entry.format].filter(Boolean).join(' · ')}</p>
                {entry.comment ? <p>{entry.comment}</p> : null}
                {entry.suggestedChange ? <p><b>Suggested:</b> {entry.suggestedChange}</p> : null}
              </article>
            ))}
          </div>
        </details>
      ) : null}
    </section>
  );
}
