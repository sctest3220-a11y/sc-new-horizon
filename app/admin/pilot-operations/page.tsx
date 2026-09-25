'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

type PilotStatus = 'draft' | 'ready' | 'running' | 'paused' | 'closed';
type PilotTab = 'overview' | 'setup' | 'testers' | 'readiness' | 'issues';

type PilotConfig = {
  name: string;
  owner: string;
  status: PilotStatus;
  startsOn: string;
  endsOn: string;
  accessCode: string;
  cohort: string;
  defaultLanguage: 'English' | 'Thai';
  mandatoryQuestions: number;
  maximumQuestions: number;
  adaptiveContinuation: boolean;
  answerReveal: boolean;
  quickFeedback: boolean;
  reportSurvey: boolean;
};

type ReadinessGate = {
  id: string;
  label: string;
  owner: string;
  detail: string;
  complete: boolean;
  blocking: boolean;
};

type Tester = {
  id: string;
  name: string;
  cohort: string;
  persona: string;
  language: string;
  status: 'Invited' | 'In progress' | 'Completed' | 'Abandoned';
  progress: number;
  score: number | null;
  lastActive: string;
};

type PilotIssue = {
  id: string;
  source: string;
  category: string;
  severity: 'High' | 'Medium' | 'Low';
  summary: string;
  signals: number;
  status: 'Open' | 'Investigating' | 'Resolved';
};

const STORAGE_KEY = 'new-horizon-pilot-operations-v1';

const defaultConfig: PilotConfig = {
  name: 'Assessment quality pilot - Round 1',
  owner: 'Assessment team',
  status: 'draft',
  startsOn: '2026-10-05',
  endsOn: '2026-10-19',
  accessCode: 'NH-PILOT-01',
  cohort: 'Mixed-role pilot testers',
  defaultLanguage: 'English',
  mandatoryQuestions: 12,
  maximumQuestions: 30,
  adaptiveContinuation: true,
  answerReveal: true,
  quickFeedback: true,
  reportSurvey: true,
};

const defaultGates: ReadinessGate[] = [
  { id: 'content', label: 'Question review', owner: 'Content lead', detail: 'Pilot questions have an approved reviewer decision and current rubric.', complete: false, blocking: true },
  { id: 'thai', label: 'Thai equivalence', owner: 'Localization lead', detail: 'Thai and English versions preserve the same evidence and difficulty.', complete: false, blocking: true },
  { id: 'artifacts', label: 'Artifact QA', owner: 'Content lead', detail: 'Required artifacts are relevant, legible, realistic, and enlarge correctly.', complete: false, blocking: true },
  { id: 'scoring', label: 'Scoring verification', owner: 'Assessment lead', detail: 'Correct, partial, incorrect, and blank cases have been checked.', complete: true, blocking: true },
  { id: 'telemetry', label: 'Telemetry notice', owner: 'Privacy lead', detail: 'Pilot testers can see what is tracked, why, and how feedback is used.', complete: true, blocking: true },
  { id: 'support', label: 'Pilot support route', owner: 'Pilot owner', detail: 'Testers have a named contact and a route for access or assessment problems.', complete: true, blocking: false },
];

const defaultTesters: Tester[] = [
  { id: 'P-001', name: 'Tester 001', cohort: 'General', persona: 'General user', language: 'Thai', status: 'Completed', progress: 100, score: 63, lastActive: 'Today, 10:42' },
  { id: 'P-002', name: 'Tester 002', cohort: 'Functional', persona: 'Marketing', language: 'English', status: 'In progress', progress: 58, score: null, lastActive: 'Today, 09:18' },
  { id: 'P-003', name: 'Tester 003', cohort: 'Technical', persona: 'IT / Developer', language: 'Thai', status: 'Abandoned', progress: 33, score: null, lastActive: 'Yesterday, 17:05' },
  { id: 'P-004', name: 'Tester 004', cohort: 'Leadership', persona: 'Executive', language: 'English', status: 'Invited', progress: 0, score: null, lastActive: 'Not started' },
  { id: 'P-005', name: 'Tester 005', cohort: 'Functional', persona: 'HR / People', language: 'Thai', status: 'Completed', progress: 100, score: 71, lastActive: 'Yesterday, 14:31' },
];

const defaultIssues: PilotIssue[] = [
  { id: 'ISS-014', source: '6 question reviews', category: 'Question clarity', severity: 'High', summary: 'Scenario wording is too dense before the decision point.', signals: 6, status: 'Open' },
  { id: 'ISS-013', source: '4 artifact events', category: 'Artifact relevance', severity: 'High', summary: 'Artifact receives long viewing time but adds little evidence.', signals: 4, status: 'Investigating' },
  { id: 'ISS-012', source: '3 Thai reviews', category: 'Translation', severity: 'Medium', summary: 'Mixed-language phrases remain in answer choices.', signals: 3, status: 'Open' },
  { id: 'ISS-011', source: '2 assessment surveys', category: 'Report UX', severity: 'Low', summary: 'Users want learning recommendations before technical analysis.', signals: 2, status: 'Resolved' },
];

function downloadCsv(filename: string, rows: Array<Record<string, string | number | boolean | null>>) {
  if (!rows.length) return;
  const headers = Object.keys(rows[0]);
  const escape = (value: unknown) => `"${String(value ?? '').replaceAll('"', '""')}"`;
  const csv = [headers.map(escape).join(','), ...rows.map((row) => headers.map((header) => escape(row[header])).join(','))].join('\n');
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export default function PilotOperationsPage() {
  const [tab, setTab] = useState<PilotTab>('overview');
  const [config, setConfig] = useState(defaultConfig);
  const [gates, setGates] = useState(defaultGates);
  const [testers] = useState(defaultTesters);
  const [issues, setIssues] = useState(defaultIssues);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved) as { config?: PilotConfig; gates?: ReadinessGate[]; issues?: PilotIssue[] };
          if (parsed.config) setConfig(parsed.config);
          if (parsed.gates) setGates(parsed.gates);
          if (parsed.issues) setIssues(parsed.issues);
        } catch {
          window.localStorage.removeItem(STORAGE_KEY);
        }
      }
      setReady(true);
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!ready) return;
    const timestamp = new Date().toLocaleString();
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ config, gates, issues, savedAt: timestamp }));
  }, [config, gates, issues, ready]);

  const metrics = useMemo(() => {
    const completed = testers.filter((tester) => tester.status === 'Completed');
    const started = testers.filter((tester) => tester.status !== 'Invited');
    const unresolved = issues.filter((issue) => issue.status !== 'Resolved');
    const blockingOpen = gates.filter((gate) => gate.blocking && !gate.complete);
    return {
      invited: testers.length,
      started: started.length,
      completed: completed.length,
      completionRate: started.length ? Math.round((completed.length / started.length) * 100) : 0,
      unresolved: unresolved.length,
      blockingOpen: blockingOpen.length,
      averageScore: completed.length ? Math.round(completed.reduce((sum, tester) => sum + (tester.score ?? 0), 0) / completed.length) : null,
    };
  }, [gates, issues, testers]);

  const canStart = metrics.blockingOpen === 0;
  const setField = <K extends keyof PilotConfig>(field: K, value: PilotConfig[K]) => setConfig((current) => ({ ...current, [field]: value }));
  const tabs: Array<{ id: PilotTab; label: string; count?: number }> = [
    { id: 'overview', label: 'Overview' },
    { id: 'setup', label: 'Pilot setup' },
    { id: 'testers', label: 'Testers', count: testers.length },
    { id: 'readiness', label: 'Readiness', count: metrics.blockingOpen },
    { id: 'issues', label: 'Issues', count: metrics.unresolved },
  ];

  return (
    <main className="pilot-ops-shell">
      <header className="pilot-ops-topbar">
        <div>
          <Link className="pilot-ops-brand" href="/?view=admin"><span>NH</span> New Horizon Admin</Link>
          <nav aria-label="Admin navigation">
            <Link href="/?view=admin">Dashboard</Link>
            <strong>Pilot operations</strong>
            <Link href="/admin/question-inventory">Question inventory</Link>
          </nav>
        </div>
        <div className="pilot-save-state"><span /> Auto-saved in this browser</div>
      </header>

      <section className="pilot-ops-heading">
        <div>
          <p>Assessment operations</p>
          <h1>{config.name}</h1>
          <span>Configure the pilot, monitor participation, and hold release decisions behind explicit human gates.</span>
        </div>
        <div className="pilot-heading-actions">
          <label className={`pilot-status pilot-status-${config.status}`}>
            <span>Status</span>
            <select value={config.status} onChange={(event) => setField('status', event.target.value as PilotStatus)}>
              <option value="draft">Draft</option>
              <option value="ready" disabled={!canStart}>Ready</option>
              <option value="running" disabled={!canStart}>Running</option>
              <option value="paused">Paused</option>
              <option value="closed">Closed</option>
            </select>
          </label>
          <button className="pilot-button secondary" type="button" onClick={() => downloadCsv('new-horizon-pilot-config.csv', [{ ...config, blockingGates: metrics.blockingOpen }])}>Export config</button>
        </div>
      </section>

      <nav className="pilot-tabs" aria-label="Pilot operations sections">
        {tabs.map((item) => (
          <button key={item.id} type="button" className={tab === item.id ? 'active' : ''} onClick={() => setTab(item.id)}>
            {item.label}{item.count !== undefined && <span>{item.count}</span>}
          </button>
        ))}
      </nav>

      <section className="pilot-ops-content">
        {tab === 'overview' && (
          <>
            <div className="pilot-kpis">
              <article><span>Invited</span><strong>{metrics.invited}</strong><small>{metrics.started} have started</small></article>
              <article><span>Completion</span><strong>{metrics.completionRate}%</strong><small>{metrics.completed} completed runs</small></article>
              <article><span>Average score</span><strong>{metrics.averageScore ?? '--'}</strong><small>completed testers only</small></article>
              <article><span>Open issues</span><strong>{metrics.unresolved}</strong><small>{issues.filter((issue) => issue.severity === 'High' && issue.status !== 'Resolved').length} high priority</small></article>
            </div>

            <div className="pilot-overview-grid">
              <section className="pilot-panel pilot-panel-wide">
                <div className="pilot-panel-heading"><div><p>Release decision</p><h2>{canStart ? 'Required gates are complete' : `${metrics.blockingOpen} blocking gates remain`}</h2></div><button type="button" className="pilot-text-button" onClick={() => setTab('readiness')}>Review gates</button></div>
                <div className="pilot-gate-progress"><span style={{ width: `${Math.round((gates.filter((gate) => gate.complete).length / gates.length) * 100)}%` }} /></div>
                <p className="pilot-muted">A pilot can move to Ready or Running only after every blocking gate is explicitly completed. This browser prototype does not publish content to live users.</p>
                <div className="pilot-compact-list">
                  {gates.filter((gate) => gate.blocking && !gate.complete).slice(0, 4).map((gate) => <button key={gate.id} type="button" onClick={() => setTab('readiness')}><span className="pilot-dot attention" /><strong>{gate.label}</strong><small>{gate.owner}</small></button>)}
                  {canStart && <div className="pilot-empty"><strong>Ready for a human launch decision</strong><span>Confirm dates, tester access, and support coverage before changing status.</span></div>}
                </div>
              </section>

              <section className="pilot-panel">
                <div className="pilot-panel-heading"><div><p>Participation</p><h2>Tester flow</h2></div><button type="button" className="pilot-text-button" onClick={() => setTab('testers')}>View testers</button></div>
                <div className="pilot-funnel">
                  <div><span>Invited</span><strong>{testers.length}</strong></div>
                  <div><span>Started</span><strong>{metrics.started}</strong></div>
                  <div><span>Completed</span><strong>{metrics.completed}</strong></div>
                  <div><span>Abandoned</span><strong>{testers.filter((tester) => tester.status === 'Abandoned').length}</strong></div>
                </div>
              </section>

              <section className="pilot-panel">
                <div className="pilot-panel-heading"><div><p>Quality signals</p><h2>Issue queue</h2></div><button type="button" className="pilot-text-button" onClick={() => setTab('issues')}>Triage issues</button></div>
                <div className="pilot-compact-list">
                  {issues.filter((issue) => issue.status !== 'Resolved').slice(0, 3).map((issue) => <button key={issue.id} type="button" onClick={() => setTab('issues')}><span className={`pilot-severity ${issue.severity.toLowerCase()}`}>{issue.severity}</span><strong>{issue.category}</strong><small>{issue.signals} signals</small></button>)}
                </div>
              </section>

              <section className="pilot-panel pilot-panel-wide">
                <div className="pilot-panel-heading"><div><p>Pilot boundary</p><h2>What this MVP controls</h2></div></div>
                <div className="pilot-boundary-grid">
                  <div><strong>Working now</strong><p>Local pilot configuration, readiness gates, issue status, tester preview, and CSV exports.</p></div>
                  <div><strong>Required for go-live</strong><p>Role-based access, shared database, invitation delivery, audited version publishing, consent records, and server analytics.</p></div>
                  <div><strong>Human authority</strong><p>Agents may suggest changes, but admins approve pilot status, content releases, scoring changes, and remediation.</p></div>
                </div>
              </section>
            </div>
          </>
        )}

        {tab === 'setup' && (
          <div className="pilot-settings-layout">
            <section className="pilot-panel">
              <div className="pilot-panel-heading"><div><p>Identity and access</p><h2>Pilot details</h2></div></div>
              <div className="pilot-form-grid">
                <label className="full">Pilot name<input value={config.name} onChange={(event) => setField('name', event.target.value)} /></label>
                <label>Owner<input value={config.owner} onChange={(event) => setField('owner', event.target.value)} /></label>
                <label>Cohort<input value={config.cohort} onChange={(event) => setField('cohort', event.target.value)} /></label>
                <label>Start date<input type="date" value={config.startsOn} onChange={(event) => setField('startsOn', event.target.value)} /></label>
                <label>End date<input type="date" value={config.endsOn} onChange={(event) => setField('endsOn', event.target.value)} /></label>
                <label>Access code<input value={config.accessCode} onChange={(event) => setField('accessCode', event.target.value)} /></label>
                <label>Default language<select value={config.defaultLanguage} onChange={(event) => setField('defaultLanguage', event.target.value as 'English' | 'Thai')}><option>English</option><option>Thai</option></select></label>
              </div>
            </section>

            <section className="pilot-panel">
              <div className="pilot-panel-heading"><div><p>Assessment delivery</p><h2>Question policy</h2></div></div>
              <div className="pilot-form-grid">
                <label>Mandatory questions<input type="number" min="6" max="40" value={config.mandatoryQuestions} onChange={(event) => setField('mandatoryQuestions', Number(event.target.value))} /></label>
                <label>Maximum questions<input type="number" min={config.mandatoryQuestions} max="80" value={config.maximumQuestions} onChange={(event) => setField('maximumQuestions', Number(event.target.value))} /></label>
              </div>
              <div className="pilot-toggle-list">
                <Toggle label="Adaptive continuation" detail="Offer more questions when relevant competencies still lack evidence." checked={config.adaptiveContinuation} onChange={(value) => setField('adaptiveContinuation', value)} />
                <Toggle label="Answer reveal" detail="Show the expected evidence and score explanation after submission." checked={config.answerReveal} onChange={(value) => setField('answerReveal', value)} />
                <Toggle label="Question feedback" detail="Allow useful, unclear, rating, and optional comment signals." checked={config.quickFeedback} onChange={(value) => setField('quickFeedback', value)} />
                <Toggle label="Report survey" detail="Prompt for a short survey before detailed analysis is unlocked." checked={config.reportSurvey} onChange={(value) => setField('reportSurvey', value)} />
              </div>
            </section>
          </div>
        )}

        {tab === 'testers' && (
          <section className="pilot-panel">
            <div className="pilot-panel-heading"><div><p>Participation monitor</p><h2>Pilot testers</h2></div><button className="pilot-button secondary" type="button" onClick={() => downloadCsv('new-horizon-pilot-testers.csv', testers)}>Export testers</button></div>
            <p className="pilot-muted">Names are pseudonymous in this prototype. Production access must enforce role, tenant, purpose, and minimum-cohort privacy rules.</p>
            <div className="pilot-table-wrap"><table className="pilot-table"><thead><tr><th>Tester</th><th>Profile</th><th>Language</th><th>Status</th><th>Progress</th><th>Score</th><th>Last active</th></tr></thead><tbody>{testers.map((tester) => <tr key={tester.id}><td><strong>{tester.name}</strong><small>{tester.id} · {tester.cohort}</small></td><td>{tester.persona}</td><td>{tester.language}</td><td><span className={`pilot-row-status ${tester.status.toLowerCase().replace(' ', '-')}`}>{tester.status}</span></td><td><div className="pilot-progress-cell"><span><b style={{ width: `${tester.progress}%` }} /></span>{tester.progress}%</div></td><td>{tester.score ?? '--'}</td><td>{tester.lastActive}</td></tr>)}</tbody></table></div>
          </section>
        )}

        {tab === 'readiness' && (
          <section className="pilot-panel">
            <div className="pilot-panel-heading"><div><p>Human release gate</p><h2>Content and pilot readiness</h2></div><span className={canStart ? 'pilot-readiness ready' : 'pilot-readiness blocked'}>{canStart ? 'Ready for decision' : `${metrics.blockingOpen} blockers`}</span></div>
            <p className="pilot-muted">Checking a gate records the decision in this browser only. Go-live requires reviewer identity, evidence links, timestamps, version history, and an immutable audit event.</p>
            <div className="pilot-gate-list">
              {gates.map((gate) => <label key={gate.id} className={gate.complete ? 'complete' : ''}><input type="checkbox" checked={gate.complete} onChange={(event) => setGates((current) => current.map((item) => item.id === gate.id ? { ...item, complete: event.target.checked } : item))} /><span><strong>{gate.label}{gate.blocking && <b>Required</b>}</strong><small>{gate.detail}</small></span><em>{gate.owner}</em></label>)}
            </div>
          </section>
        )}

        {tab === 'issues' && (
          <section className="pilot-panel">
            <div className="pilot-panel-heading"><div><p>Feedback and telemetry</p><h2>Quality issue queue</h2></div><button className="pilot-button secondary" type="button" onClick={() => downloadCsv('new-horizon-pilot-issues.csv', issues)}>Export issues</button></div>
            <p className="pilot-muted">Signals are grouped for investigation. They are not automatic proof that content should change; a reviewer checks the question, rubric, artifact, route, and affected responses first.</p>
            <div className="pilot-issue-list">
              {issues.map((issue) => <article key={issue.id}><span className={`pilot-severity ${issue.severity.toLowerCase()}`}>{issue.severity}</span><div><small>{issue.id} · {issue.category}</small><strong>{issue.summary}</strong><p>{issue.source} · {issue.signals} related signals</p></div><select aria-label={`Status for ${issue.id}`} value={issue.status} onChange={(event) => setIssues((current) => current.map((item) => item.id === issue.id ? { ...item, status: event.target.value as PilotIssue['status'] } : item))}><option>Open</option><option>Investigating</option><option>Resolved</option></select></article>)}
            </div>
          </section>
        )}
      </section>
    </main>
  );
}

function Toggle({ label, detail, checked, onChange }: { label: string; detail: string; checked: boolean; onChange: (value: boolean) => void }) {
  return <label className="pilot-toggle"><span><strong>{label}</strong><small>{detail}</small></span><input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} /><i aria-hidden="true" /></label>;
}
