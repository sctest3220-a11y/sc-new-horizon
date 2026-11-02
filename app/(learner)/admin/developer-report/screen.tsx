'use client';

import {
  type DomainId,
  RadarChart,
  domains,
  fullStackDeveloperReport,
} from '../../../learner-app';
import { useApp } from '../../../learner-app-context';

export default function DeveloperReportScreen() {
  const {
    selectedDemoDomain,
    setSelectedDemoDomain,
  } = useApp();

  return (
    <section className="results-shell demo-report-shell">
      <div className="results-hero demo-report-hero">
        <div>
          <p className="eyebrow">Generated report preview</p>
          <h1>{fullStackDeveloperReport.overall}</h1>
          <p className="result-level">{fullStackDeveloperReport.level} AI readiness</p>
          <p>
            Simulated premium technical-track report for a {fullStackDeveloperReport.profile.toLowerCase()}.
            Evidence confidence is pilot-grade: {fullStackDeveloperReport.confidence}%.
          </p>
          <p className="context-line">
            Strongest signal: D2 practical tooling. Priority development area: D4 risk, governance, permissions, audit logs, and production controls.
          </p>
        </div>
        <RadarChart
          scores={fullStackDeveloperReport.scores}
          benchmarks={fullStackDeveloperReport.benchmarks}
          selectedDomain={selectedDemoDomain}
          onSelectDomain={setSelectedDemoDomain}
        />
      </div>

      <div className="result-grid">
        <article className="result-card wide demo-report-card">
          <div className="report-heading">
            <div>
              <p className="eyebrow">Personalized AI report</p>
              <h2>Full-stack developer: applied readiness, production governance gap.</h2>
            </div>
            <span>Demo user</span>
          </div>
          <div className="evidence-grid">
            {fullStackDeveloperReport.interpretation.map((item) => <p key={item}>{item}</p>)}
          </div>
        </article>

        <article className="result-card demo-report-card">
          <span>Strengths</span>
          <h2>What is working</h2>
          <div className="agent-list">
            {fullStackDeveloperReport.strengths.map((strength) => <p key={strength}>{strength}</p>)}
          </div>
        </article>

        <article className="result-card demo-report-card">
          <span>Priority gaps</span>
          <h2>What to improve</h2>
          <div className="agent-list">
            {fullStackDeveloperReport.gaps.map((gap) => <p key={gap}>{gap}</p>)}
          </div>
        </article>

        <article className="result-card wide demo-report-card">
          <h2>Domain scorecard</h2>
          <div className="demo-domain-grid">
            {(Object.keys(fullStackDeveloperReport.scores) as DomainId[]).map((domain) => {
              const target = fullStackDeveloperReport.benchmarks[1].scores[domain];
              const gap = target - fullStackDeveloperReport.scores[domain];
              return (
                <button
                  key={domain}
                  className={selectedDemoDomain === domain ? 'selected' : ''}
                  type="button"
                  onClick={() => setSelectedDemoDomain(domain)}
                >
                  <span style={{ color: domains[domain].color }}>{domain} · {domains[domain].short}</span>
                  <strong>{fullStackDeveloperReport.scores[domain]}/100</strong>
                  <meter min="0" max="100" value={fullStackDeveloperReport.scores[domain]} />
                  <small>{gap > 0 ? `${gap} points below target` : 'At or above target'}</small>
                </button>
              );
            })}
          </div>
        </article>

        <article className="result-card wide demo-report-card">
          <h2>Personalized learning path</h2>
          <div className="demo-learning-path">
            {fullStackDeveloperReport.learningPath.map((phase) => (
              <div key={phase.phase}>
                <span>{phase.phase}</span>
                <strong>{phase.title}</strong>
                {phase.actions.map((action) => <p key={action}>{action}</p>)}
              </div>
            ))}
          </div>
        </article>

        <article className="result-card wide demo-report-card">
          <h2>Courses from latest Training Scout crawl</h2>
          <div className="course-list">
            {fullStackDeveloperReport.courses.map((course) => (
              <article key={course.url}>
                <span>{course.provider} · {course.domains.join(', ')}</span>
                <h3>{course.title}</h3>
                <p>{course.fit}</p>
                <a href={course.url} target="_blank" rel="noreferrer">Open course</a>
              </article>
            ))}
          </div>
        </article>

        <article className="result-card wide demo-report-card">
          <h2>Tools and platforms to explore</h2>
          <div className="personalized-exploration">
            {fullStackDeveloperReport.tools.map((group) => (
              <div key={group.category}>
                <span>{group.category}</span>
                <div className="profile-tag-grid">
                  {group.items.map((item) => <span key={item}>{item}</span>)}
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="result-card wide demo-report-card">
          <h2>Practice projects</h2>
          <div className="improvement-brief">
            {fullStackDeveloperReport.projects.map((project, index) => (
              <div key={project}>
                <span>Project {index + 1}</span>
                <strong>{project}</strong>
              </div>
            ))}
          </div>
          <p className="context-line">
            MVP preview: this report uses simulated assessment evidence plus the local Playwright course crawl. Production should generate reports server-side with consented user data, stored report versions, audit logs, and provider-key controls.
          </p>
        </article>
      </div>
    </section>
  );
}
