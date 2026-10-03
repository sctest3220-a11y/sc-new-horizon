'use client';

import { useEffect, useState } from 'react';
// Generated and embedded at build time: an open old tab must keep its own release.
// @ts-expect-error release.json exists only in the isolated deployment build.
import release from './release.json';
export const syncedEvent = 'new-horizon-review-synced';
const manifestPrefix = 'new-horizon-review-release:';

export function ReviewSync() {
  const [error, setError] = useState('');
  const [reviewer, setReviewer] = useState('');
  const [newRelease, setNewRelease] = useState(false);
  useEffect(() => {
    try { localStorage.setItem(`${manifestPrefix}${release.contentVersion}`, JSON.stringify(release)); }
    catch { queueMicrotask(() => setError('Browser storage is unavailable. Feedback cannot be retained.')); }
    async function check() {
      try {
        const response = await fetch('/review-release.json', { cache: 'no-store' });
        if (response.ok) setNewRelease((await response.json()).releaseId !== release.releaseId);
      } catch { /* Offline reviewers may still export locally saved feedback. */ }
    }
    void check();
    window.addEventListener('focus', check);
    return () => window.removeEventListener('focus', check);
  }, []);
  function download() {
    try {
      const versions: Record<string, Record<string, unknown>> = {};
      const legacy: Record<string, unknown> = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (!key || (!key.startsWith('new-horizon-review-v2:') && !key.startsWith('new-horizon-review:'))) continue;
        const stored = JSON.parse(localStorage.getItem(key) || '{}');
        if (!Array.isArray(stored.entries) || !stored.entries.length) continue;
        const question = { entries: stored.entries, updatedAt: stored.updatedAt };
        if (key.startsWith('new-horizon-review:')) legacy[key.slice('new-horizon-review:'.length)] = question;
        else {
          const [, version, ...id] = key.split(':');
          (versions[version] ??= {})[id.join(':')] = question;
        }
      }
      const batches = Object.entries(versions).map(([version, questions]) => ({
        release: version === release.contentVersion ? release : JSON.parse(localStorage.getItem(`${manifestPrefix}${version}`) || 'null'),
        contentVersion: version, questions,
      }));
      if (Object.keys(legacy).length) batches.push({ release: null, contentVersion: 'legacy-unversioned', questions: legacy });
      const blob = new Blob([JSON.stringify({ schemaVersion: 2, reviewer: reviewer.trim(), exportedAt: new Date().toISOString(), batches }, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `inventory-feedback-${new Date().toISOString().slice(0, 10)}.json`;
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      setError('');
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Feedback download failed.');
    }
  }
  return <section className="inventory-panel inventory-review-sync-panel">
    <div><span>Cloudflare testing preview · Draft content</span>
      <strong>Feedback is saved in the hosted review database</strong>
      <small>Release {release.releaseId} · Questions {release.contentVersion.slice(0, 12)}</small>
      <small>Reviews stay with their question version. Download includes saved reviews from older versions; unsubmitted drafts are excluded.</small>
      <small>Saved reviews are shared across browsers and sandbox sessions.</small>
      {newRelease && <small role="status">An updated inventory is available. <a href="/admin/question-inventory">Reload inventory</a>; your saved reviews remain available for download.</small>}
      <label>Reviewer name or alias <input value={reviewer} onChange={event => setReviewer(event.target.value)} maxLength={100} /></label>
      {error && <small role="alert">{error}</small>}
    </div>
    <button type="button" onClick={download}>Download feedback JSON</button>
  </section>;
}
