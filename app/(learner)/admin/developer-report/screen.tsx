'use client';

import { useTranslations } from 'next-intl';
import {
  type DomainId,
  RadarChart,
  domains,
  fullStackDeveloperReport,
} from '../../../learner-app';
import { useApp } from '../../../learner-app-context';

export default function DeveloperReportScreen() {
  const t = useTranslations('developerReport');
  const {
    selectedDemoDomain,
    setSelectedDemoDomain,
  } = useApp();

  return (
    <section className="results-shell demo-report-shell">
      <div className="results-hero demo-report-hero">
        <div>
          <p className="eyebrow">{t('generatedReportPreview')}</p>
          <h1>{fullStackDeveloperReport.overall}</h1>
          <p className="result-level">{t('aiReadiness', { level: fullStackDeveloperReport.level })}</p>
          <p>{t('simulatedPremiumTechnicalTrackReport', { profile: fullStackDeveloperReport.profile.toLowerCase(), confidence: fullStackDeveloperReport.confidence })}</p>
          <p className="context-line">
            
            {t('strongestSignalD2PracticalTooling')}
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
              <p className="eyebrow">{t('personalizedAiReport')}</p>
              <h2>{t('fullStackDeveloperAppliedReadiness')}</h2>
            </div>
            <span>{t('demoUser')}</span>
          </div>
          <div className="evidence-grid">
            {fullStackDeveloperReport.interpretation.map((item) => <p key={item}>{item}</p>)}
          </div>
        </article>

        <article className="result-card demo-report-card">
          <span>{t('strengths')}</span>
          <h2>{t('whatIsWorking')}</h2>
          <div className="agent-list">
            {fullStackDeveloperReport.strengths.map((strength) => <p key={strength}>{strength}</p>)}
          </div>
        </article>

        <article className="result-card demo-report-card">
          <span>{t('priorityGaps')}</span>
          <h2>{t('whatToImprove')}</h2>
          <div className="agent-list">
            {fullStackDeveloperReport.gaps.map((gap) => <p key={gap}>{gap}</p>)}
          </div>
        </article>

        <article className="result-card wide demo-report-card">
          <h2>{t('domainScorecard')}</h2>
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
                  <small>{gap > 0 ? `${gap} points below target` : t('atOrAboveTarget')}</small>
                </button>
              );
            })}
          </div>
        </article>

        <article className="result-card wide demo-report-card">
          <h2>{t('personalizedLearningPath')}</h2>
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
          <h2>{t('coursesFromLatestTrainingScout')}</h2>
          <div className="course-list">
            {fullStackDeveloperReport.courses.map((course) => (
              <article key={course.url}>
                <span>{course.provider} · {course.domains.join(', ')}</span>
                <h3>{course.title}</h3>
                <p>{course.fit}</p>
                <a href={course.url} target="_blank" rel="noreferrer">{t('openCourse')}</a>
              </article>
            ))}
          </div>
        </article>

        <article className="result-card wide demo-report-card">
          <h2>{t('toolsAndPlatformsToExplore')}</h2>
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
          <h2>{t('practiceProjects')}</h2>
          <div className="improvement-brief">
            {fullStackDeveloperReport.projects.map((project, index) => (
              <div key={project}>
                <span>{t('project', { value: index + 1 })}</span>
                <strong>{project}</strong>
              </div>
            ))}
          </div>
          <p className="context-line">
            
            {t('mvpPreviewThisReportUses')}
          </p>
        </article>
      </div>
    </section>
  );
}
