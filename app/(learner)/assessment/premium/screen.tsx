'use client';

import {
  type ExecutiveRole,
  type FunctionTrack,
  type IndustryTrack,
  executiveLabels,
  functionLabels,
  industryLabels,
} from '../../../learner-app';
import { useApp } from '../../../learner-app-context';

export default function PremiumOnboardingScreen() {
  const {
    executiveRole,
    functionTrack,
    industryTrack,
    openProfileSurvey,
    setExecutiveRole,
    setFunctionTrack,
    setIndustryTrack,
    setStep,
  } = useApp();

  return (
    <section className="workspace">
      <div className="workspace-header">
        <p className="eyebrow">Premium diagnostic</p>
        <h1>Add context for a deeper profile.</h1>
        <p>Premium uses the same AILF spine, then adapts interpretation by function and industry.</p>
      </div>
      <div className="setup-columns">
        <div>
          <h2>Function</h2>
          <div className="choice-grid" role="radiogroup" aria-label="Function track">
            {(Object.keys(functionLabels) as FunctionTrack[]).map((id) => (
              <button
                key={id}
                className={functionTrack === id ? 'choice-card selected' : 'choice-card'}
                onClick={() => setFunctionTrack(id)}
                role="radio"
                aria-checked={functionTrack === id}
              >
                {functionLabels[id]}
              </button>
            ))}
          </div>
        </div>
        <div>
          <h2>Industry</h2>
          <div className="choice-grid" role="radiogroup" aria-label="Industry track">
            {(Object.keys(industryLabels) as IndustryTrack[]).map((id) => (
              <button
                key={id}
                className={industryTrack === id ? 'choice-card selected' : 'choice-card'}
                onClick={() => setIndustryTrack(id)}
                role="radio"
                aria-checked={industryTrack === id}
              >
                {industryLabels[id]}
              </button>
            ))}
          </div>
        </div>
        <div>
          <h2>Role context</h2>
          <div className="choice-grid executive-grid" role="radiogroup" aria-label="Role context">
            {(Object.keys(executiveLabels) as ExecutiveRole[]).map((id) => (
              <button
                key={id}
                className={executiveRole === id ? 'choice-card selected' : 'choice-card'}
                onClick={() => setExecutiveRole(id)}
                role="radio"
                aria-checked={executiveRole === id}
              >
                {executiveLabels[id]}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="premium-summary">
        <strong>Premium pilot includes</strong>
        <span>20 adaptive questions, function/industry/role context, research-informed target comparison, evidence summary, domain radar, skill-gap signals, and a premium learning path.</span>
      </div>
      <article className="profile-builder-card compact">
        <div>
          <p className="eyebrow">Profile builder</p>
          <h2>Premium profile signals</h2>
          <p>
            Before the diagnostic starts, New Horizon asks about current tools, similar-role tools, workflows, risks, and learning interests.
            Those tags personalize item routing, artifacts, tool suggestions, and the learning path.
          </p>
        </div>
        <div className="profile-builder-steps">
          <span>{functionLabels[functionTrack]}</span>
          <span>{industryLabels[industryTrack]}</span>
          <span>{executiveLabels[executiveRole]}</span>
          <span>Tool awareness</span>
          <span>Learning intent</span>
        </div>
      </article>
      <div className="workspace-actions">
        <button className="secondary dark" onClick={() => setStep('home')}>Back</button>
        <button className="primary" onClick={() => openProfileSurvey('premium')}>Build Profile and Begin Premium Diagnostic</button>
      </div>
    </section>
  );
}
