'use client';

import { useTranslations } from 'next-intl';
import {
  type Audience,
  audienceLabels,
} from '../../learner-app';
import { useApp } from '../../learner-app-context';

export default function OnboardingScreen() {
  const t = useTranslations('onboarding');
  const {
    audience,
    openProfileSurvey,
    setAudience,
    setStep,
  } = useApp();

  return (
    <section className="workspace">
      <div className="workspace-header">
        <p className="eyebrow">{t('freeAssessment')}</p>
        <h1>{t('startWithABroadProfile')}</h1>
        <p>{t('noEnterpriseSetupChooseThe')}</p>
      </div>
      <div className="audience-grid" role="radiogroup" aria-label={t('audienceType')}>
        {(Object.keys(audienceLabels) as Audience[]).map((id) => (
          <button
            key={id}
            className={audience === id ? 'audience-card selected' : 'audience-card'}
            onClick={() => setAudience(id)}
            role="radio"
            aria-checked={audience === id}
          >
            <strong>{audienceLabels[id]}</strong>
            <span>{id === 'team' ? t('benchmarkReadinessWithAGroup') : t('discoverYourIndividualAiReadiness')}</span>
          </button>
        ))}
      </div>
      <article className="profile-builder-card">
        <div>
          <p className="eyebrow">{t('profileBuilderAndSignals')}</p>
          <h2>{t('profileIsBuiltBeforeDuring')}</h2>
          <p>
            
            {t('beforeTheTestNewHorizon')}
          </p>
        </div>
        <div className="profile-builder-steps">
          <span>{t('beforeSurveyTags')}</span>
          <span>{t('duringAnswerSignals')}</span>
          <span>{t('afterConfidenceGaps')}</span>
          <span>{t('nextLearningPersonalization')}</span>
        </div>
      </article>
      <div className="workspace-actions">
        <button className="secondary dark" onClick={() => setStep('home')}>{t('back')}</button>
        <button className="primary" onClick={() => openProfileSurvey('free')}>{t('buildProfileAndBegin12')}</button>
      </div>
    </section>
  );
}
