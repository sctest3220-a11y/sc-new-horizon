'use client';

import { useEffect, useMemo, useState } from 'react';

type Dashboard = { configured: boolean; message?: string; summary?: { total: number; completed: number; averageOverall: number | null; latestAt: string | null }; versions?: Array<{ version: string; total: number; completed: number; averageOverall: number | null }> };
type Question = { id: string; domain?: string; competencyLabel?: string; difficulty?: string; layer?: string; functionTracks?: string[]; industryTracks?: string[]; executiveRoles?: string[] };
type FeedbackEntry = { rating?: string; decision?: string; comment?: string; suggestedChange?: string };
type Breakdown = { questions: number; reviewed: number; ratings: number[]; decisions: Record<string, number> };

const dimensions = [
  ['Domain', (q: Question) => q.domain || 'Unspecified'],
  ['Competency', (q: Question) => q.competencyLabel || 'Unspecified'],
  ['Difficulty', (q: Question) => q.difficulty || 'Unspecified'],
  ['Level', (q: Question) => q.layer || 'Unspecified'],
  ['Role', (q: Question) => q.functionTracks?.length ? q.functionTracks : ['General / all roles']],
  ['Industry', (q: Question) => q.industryTracks?.length ? q.industryTracks : ['General / all industries']],
  ['Executive', (q: Question) => q.executiveRoles?.length ? q.executiveRoles : ['Not role-specific']],
] as const;

function add(map: Record<string, Breakdown>, key: string, question: Question, feedback: FeedbackEntry[]) {
  const row = map[key] ??= { questions: 0, reviewed: 0, ratings: [], decisions: {} };
  row.questions += 1;
  if (feedback.length) row.reviewed += 1;
  feedback.forEach((entry) => { const rating = Number(entry.rating); if (rating >= 1 && rating <= 5) row.ratings.push(rating); if (entry.decision && entry.decision !== 'pending') row.decisions[entry.decision] = (row.decisions[entry.decision] ?? 0) + 1; });
}

export default function ResultsDashboard() {
  const [data, setData] = useState<Dashboard | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [feedback, setFeedback] = useState<Record<string, FeedbackEntry[]>>({});
  useEffect(() => {
    let active = true;
    const load = () => Promise.all([fetch('/api/results', { cache: 'no-store' }).then((r) => r.json() as Promise<Dashboard>), fetch('/review-inventory/index.json', { cache: 'no-store' }).then((r) => r.json() as Promise<Question[]>)]).then(([summary, inventory]) => {
      if (!active) return; setData(summary); setQuestions(inventory);
      const stored: Record<string, FeedbackEntry[]> = {};
      for (let i = 0; i < localStorage.length; i += 1) { const key = localStorage.key(i); if (!key || (!key.startsWith('new-horizon-review:') && !key.startsWith('new-horizon-review-v2:'))) continue; try { const value = JSON.parse(localStorage.getItem(key) || '{}'); const id = key.startsWith('new-horizon-review-v2:') ? key.split(':').slice(2).join(':') : key.slice('new-horizon-review:'.length); if (Array.isArray(value.entries) && value.entries.length) stored[id] = value.entries; } catch { /* ignore malformed browser data */ } }
      setFeedback(stored);
    }).catch(() => { if (active) setData({ configured: false, message: 'Dashboard could not reach results storage.' }); });
    load(); const timer = window.setInterval(load, 15000); return () => { active = false; window.clearInterval(timer); };
  }, []);
  const reports = useMemo(() => dimensions.map(([label, getter]) => { const map: Record<string, Breakdown> = {}; questions.forEach((question) => { const values = getter(question); (Array.isArray(values) ? values : [values]).forEach((value) => add(map, value, question, feedback[question.id] ?? [])); }); return { label, rows: Object.entries(map).sort((a, b) => b[1].questions - a[1].questions || a[0].localeCompare(b[0])) }; }), [feedback, questions]);
  const feedbackSummary = useMemo(() => { const entries = Object.values(feedback).flat(); const comments = entries.filter((entry) => entry.comment?.trim() || entry.suggestedChange?.trim()).length; const decisions = entries.reduce<Record<string, number>>((out, entry) => { if (entry.decision && entry.decision !== 'pending') out[entry.decision] = (out[entry.decision] ?? 0) + 1; return out; }, {}); const ratings = entries.map((entry) => Number(entry.rating)).filter((value) => value >= 1 && value <= 5); return { questionsReviewed: Object.keys(feedback).length, entries: entries.length, comments, decisions, averageRating: ratings.length ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1) : '--' }; }, [feedback]);
  return <main className="inventory-page"><header className="inventory-app-header"><a href="/admin/question-inventory" className="inventory-app-brand"><span>NH</span><strong>Question inventory</strong></a><nav><a href="/admin/question-inventory">Inventory</a><strong>Testing results</strong></nav></header><section className="inventory-hero"><div><p className="eyebrow">Anonymous testing results</p><h1>Testing dashboard</h1><p>Aggregate result events refresh every 15 seconds. Feedback analysis uses saved browser reviews and does not identify testers.</p></div></section>{!data || !data.configured ? <section className="inventory-panel"><h2>Results storage is not configured</h2><p>{data?.message ?? 'Loading results…'}</p><p>Configure the Cloudflare D1 <code>RESULTS_DB</code> binding before collecting score events.</p></section> : <><section className="inventory-kpis"><div><span>Result events</span><strong>{data.summary?.total ?? 0}</strong></div><div><span>Completed</span><strong>{data.summary?.completed ?? 0}</strong></div><div><span>Average score</span><strong>{data.summary?.averageOverall ?? '--'}</strong></div><div><span>Questions reviewed</span><strong>{feedbackSummary.questionsReviewed}</strong></div><div><span>Average rating</span><strong>{feedbackSummary.averageRating}/5</strong></div></section><section className="inventory-panel"><h2>Feedback analysis</h2><p>{feedbackSummary.entries} saved review entries across {feedbackSummary.questionsReviewed} questions; {feedbackSummary.comments} include comments or suggested changes.</p><p><strong>Decisions:</strong> {Object.entries(feedbackSummary.decisions).map(([key, count]) => `${key} ${count}`).join(' · ') || 'No submitted decisions yet.'}</p></section><section className="inventory-panel"><h2>Results by question version</h2><table><thead><tr><th>Version</th><th>Events</th><th>Completed</th><th>Average score</th></tr></thead><tbody>{(data.versions ?? []).map((row) => <tr key={row.version}><td>{row.version}</td><td>{row.total}</td><td>{row.completed}</td><td>{row.averageOverall ?? '--'}</td></tr>)}</tbody></table></section>{reports.map((report) => <section className="inventory-panel" key={report.label}><h2>{report.label}</h2><div className="inventory-table-wrap"><table><thead><tr><th>{report.label}</th><th>Questions</th><th>Reviewed</th><th>Rating</th><th>Decisions</th></tr></thead><tbody>{report.rows.map(([name, row]) => <tr key={name}><td>{name}</td><td>{row.questions}</td><td>{row.reviewed}</td><td>{row.ratings.length ? (row.ratings.reduce((a, b) => a + b, 0) / row.ratings.length).toFixed(1) : '--'}</td><td>{Object.entries(row.decisions).map(([key, count]) => `${key}: ${count}`).join(' · ') || '--'}</td></tr>)}</tbody></table></div></section>)}</>}</main>;
}
