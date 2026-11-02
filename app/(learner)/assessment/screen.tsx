'use client';

import {
  type Audience,
  audienceLabels,
} from '../../learner-app';
import { useApp } from '../../learner-app-context';

export default function OnboardingScreen() {
  const {
    audience,
    openProfileSurvey,
    setAudience,
    setStep,
  } = useApp();

  return (
    <section className="workspace">
      <div className="workspace-header">
        <p className="eyebrow">Free assessment</p>
        <h1>Start with a broad profile.</h1>
        <p>No enterprise setup. Choose the option that best describes you today.</p>
      </div>
      <div className="audience-grid" role="radiogroup" aria-label="Audience type">
        {(Object.keys(audienceLabels) as Audience[]).map((id) => (
          <button
            key={id}
            className={audience === id ? 'audience-card selected' : 'audience-card'}
            onClick={() => setAudience(id)}
            role="radio"
            aria-checked={audience === id}
          >
            <strong>{audienceLabels[id]}</strong>
            <span>{id === 'team' ? 'Benchmark readiness with a group lens.' : 'Discover your individual AI readiness.'}</span>
          </button>
        ))}
      </div>
      <article className="profile-builder-card">
        <div>
          <p className="eyebrow">Profile builder and signals</p>
          <h2>Profile is built before, during, and after the assessment.</h2>
          <p>
            Before the test, New Horizon asks optional role-aware questions about tools, workflows, peer-tool awareness, risk concerns, and learning interests.
            During the test, every item adds evidence signals for domains, competencies, skills, difficulty, item type, and knowing-vs-doing behavior.
          </p>
        </div>
        <div className="profile-builder-steps">
          <span>Before: survey tags</span>
          <span>During: answer signals</span>
          <span>After: confidence gaps</span>
          <span>Next: learning personalization</span>
        </div>
      </article>
      <div className="workspace-actions">
        <button className="secondary dark" onClick={() => setStep('home')}>Back</button>
        <button className="primary" onClick={() => openProfileSurvey('free')}>Build Profile and Begin 12-Question Assessment</button>
      </div>
    </section>
  );
}
