'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

// Keeps the browser's reviewer feedback and exports/review-feedback/<reviewer>.json
// in step, via the dev-only endpoint added in scripts/lib/review-feedback-sync-plugin.mjs.
// On load it pulls the committed file into localStorage (so reviews follow the
// repo, not the browser), then every change is pushed back after a short debounce.

const endpoint = '/__review-feedback';
const storagePrefix = 'new-horizon-review:';
const reloadGuardKey = 'new-horizon-review-sync-reloaded';

type SavedEntry = { id?: string; savedAt?: string };
type StoredQuestion = { draft?: unknown; entries?: SavedEntry[]; updatedAt?: string | null };
type SyncResponse = { reviewer: string; file: string; store: { questions: Record<string, StoredQuestion> } };
type Status = 'checking' | 'unavailable' | 'idle' | 'saving' | 'saved' | 'error';

function safeParse(value: string | null): StoredQuestion | null {
  if (!value) return null;
  try {
    return JSON.parse(value) as StoredQuestion;
  } catch {
    return null;
  }
}

function readLocal() {
  const questions: Record<string, StoredQuestion> = {};
  for (let index = 0; index < window.localStorage.length; index += 1) {
    const key = window.localStorage.key(index);
    if (!key?.startsWith(storagePrefix)) continue;
    const parsed = safeParse(window.localStorage.getItem(key));
    if (parsed) questions[key.slice(storagePrefix.length)] = parsed;
  }
  return questions;
}

function newestFirst(left: SavedEntry, right: SavedEntry) {
  return String(right.savedAt ?? right.id ?? '').localeCompare(String(left.savedAt ?? left.id ?? ''));
}

// Union of entries by id. The local draft is kept if there is one, because the
// reviewer may be mid-edit; otherwise the committed draft is restored.
function mergeIntoLocal(remoteQuestions: Record<string, StoredQuestion>) {
  let changed = false;
  for (const [id, remote] of Object.entries(remoteQuestions)) {
    const key = `${storagePrefix}${id}`;
    const localRaw = window.localStorage.getItem(key);
    const local = safeParse(localRaw);
    const byId = new Map<string, SavedEntry>();
    for (const entry of [...(local?.entries ?? []), ...(remote.entries ?? [])]) {
      if (entry?.id && !byId.has(entry.id)) byId.set(entry.id, entry);
    }
    const next: StoredQuestion = {
      draft: local?.draft ?? remote.draft ?? undefined,
      entries: [...byId.values()].sort(newestFirst),
      updatedAt: [local?.updatedAt, remote.updatedAt].filter(Boolean).sort().pop() ?? undefined,
    };
    const serialized = JSON.stringify(next);
    if (serialized !== localRaw) {
      window.localStorage.setItem(key, serialized);
      changed = true;
    }
  }
  return changed;
}

async function fetchSync(init?: RequestInit): Promise<SyncResponse | null> {
  const response = await fetch(endpoint, { cache: 'no-store', ...init });
  if (!response.ok || !response.headers.get('content-type')?.includes('application/json')) return null;
  return (await response.json()) as SyncResponse;
}

export function ReviewSync() {
  const [status, setStatus] = useState<Status>('checking');
  const [file, setFile] = useState('');
  const [reviewer, setReviewer] = useState('');
  const [lastSaved, setLastSaved] = useState('');
  const [error, setError] = useState('');
  const timer = useRef<number | null>(null);
  const available = useRef(false);

  const push = useCallback(async () => {
    if (!available.current) return;
    setStatus('saving');
    try {
      const result = await fetchSync({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questions: readLocal() }),
      });
      if (!result) throw new Error('Sync endpoint did not accept the update.');
      setLastSaved(new Date().toLocaleTimeString());
      setStatus('saved');
      setError('');
    } catch (caught) {
      setStatus('error');
      setError(caught instanceof Error ? caught.message : String(caught));
    }
  }, []);

  const schedulePush = useCallback(() => {
    if (!available.current) return;
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      timer.current = null;
      void push();
    }, 1000);
  }, [push]);

  useEffect(() => {
    let cancelled = false;

    async function start() {
      try {
        const result = await fetchSync();
        if (cancelled) return;
        if (!result) {
          setStatus('unavailable');
          return;
        }
        available.current = true;
        setFile(result.file);
        setReviewer(result.reviewer);
        const changed = mergeIntoLocal(result.store.questions);
        if (changed && !window.sessionStorage.getItem(reloadGuardKey)) {
          // Feedback cards read localStorage once on mount; reload so the pulled
          // reviews appear. The guard keeps a bad merge from looping.
          window.sessionStorage.setItem(reloadGuardKey, '1');
          window.location.reload();
          return;
        }
        window.sessionStorage.removeItem(reloadGuardKey);
        setStatus('idle');
        // Push once so reviews that only exist in this browser reach the file.
        await push();
      } catch {
        if (!cancelled) setStatus('unavailable');
      }
    }

    void start();
    window.addEventListener('new-horizon-review-updated', schedulePush);
    return () => {
      cancelled = true;
      window.removeEventListener('new-horizon-review-updated', schedulePush);
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, [push, schedulePush]);

  const label: Record<Status, string> = {
    checking: 'Checking repo sync…',
    unavailable: 'Repo sync unavailable',
    idle: 'Repo sync on',
    saving: 'Saving to repo…',
    saved: lastSaved ? `Saved to repo at ${lastSaved}` : 'Saved to repo',
    error: 'Repo sync failed',
  };

  return (
    <section className="inventory-panel inventory-review-sync-panel" data-review-sync={status}>
      <div>
        <span>Reviewer feedback file</span>
        <strong>{label[status]}</strong>
        {status === 'unavailable' ? (
          <small>Feedback stays in this browser only. Run <code>pnpm dev</code> to write it into the repository.</small>
        ) : file ? (
          <small>
            {reviewer ? `${reviewer} · ` : ''}every rating and comment is written to <code>{file}</code>. Commit and push that file to share your review.
          </small>
        ) : null}
        {error ? <small className="inventory-review-sync-error">{error}</small> : null}
      </div>
      <button type="button" onClick={() => void push()} disabled={status === 'checking' || status === 'unavailable' || status === 'saving'}>
        Sync now
      </button>
    </section>
  );
}
