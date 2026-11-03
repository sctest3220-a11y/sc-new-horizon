'use client';

import { useTranslations } from 'next-intl';
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
  const t = useTranslations('premium');
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
        <p className="eyebrow">{t('premiumDiagnostic')}</p>
        <h1>{t('addContextForADeeper')}</h1>
        <p>{t('premiumUsesTheSameAilf')}</p>
      </div>
      <div className="setup-columns">
        <div>
          <h2>{t('function')}</h2>
          <div className="choice-grid" role="radiogroup" aria-label={t('functionTrack')}>
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
          <h2>{t('industry')}</h2>
          <div className="choice-grid" role="radiogroup" aria-label={t('industryTrack')}>
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
          <h2>{t('roleContext')}</h2>
          <div className="choice-grid executive-grid" role="radiogroup" aria-label={t('roleContext')}>
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
        <strong>{t('premiumPilotIncludes')}</strong>
        <span>{t('n20AdaptiveQuestionsFunctionIndustry')}</span>
      </div>
      <article className="profile-builder-card compact">
        <div>
          <p className="eyebrow">{t('profileBuilder')}</p>
          <h2>{t('premiumProfileSignals')}</h2>
          <p>
            
            {t('beforeTheDiagnosticStartsNew')}
          </p>
        </div>
        <div className="profile-builder-steps">
          <span>{functionLabels[functionTrack]}</span>
          <span>{industryLabels[industryTrack]}</span>
          <span>{executiveLabels[executiveRole]}</span>
          <span>{t('toolAwareness')}</span>
          <span>{t('learningIntent')}</span>
        </div>
      </article>
      <div className="workspace-actions">
        <button className="secondary dark" onClick={() => setStep('home')}>{t('back')}</button>
        <button className="primary" onClick={() => openProfileSurvey('premium')}>{t('buildProfileAndBeginPremium')}</button>
      </div>
    </section>
  );
}
