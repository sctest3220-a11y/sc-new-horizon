'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import {
  type AppLanguage,
} from '../learner-app';
import { useApp } from '../learner-app-context';
import { pathForStep, stepForPath, type AppStep } from '../learner-routes-model';

const primaryNavigation: { step: Exclude<AppStep, 'lab'>; label: string }[] = [
  { step: 'home', label: 'Home' },
  { step: 'onboarding', label: 'Assessment' },
  { step: 'premiumOnboarding', label: 'Premium' },
  { step: 'learningLabs', label: 'AI Labs' },
  { step: 'news', label: 'AI Watch' },
  { step: 'dashboard', label: 'Dashboard' },
  { step: 'admin', label: 'Admin' },
];

export default function LearnerShell({ children }: { children: React.ReactNode }) {
  const t = useTranslations('shell');
  const {
    activeSurveyContext,
    activeSurveyQuestions,
    appLanguage,
    saveProfileSurvey,
    setAppLanguage,
    skipProfileSurvey,
    surveyAnswers,
    surveyOpen,
    toggleSurveyAnswer,
  } = useApp();
  const pathname = usePathname();
  const titles = useTranslations('titles');
  const routeStep = stepForPath(pathname);

  // Route metadata is rendered on the server in the default language, so the
  // tab title follows the chosen language here.
  useEffect(() => {
    document.title = titles(routeStep);
  }, [routeStep, titles]);

  return (
    <main>
      {surveyOpen && (
        <div className="survey-backdrop" role="presentation">
          <section className="profile-survey" role="dialog" aria-modal="true" aria-labelledby="profile-survey-title">
            <div className="profile-survey-header">
              <div>
                <p className="eyebrow">{t('optionalProfileSurvey')}</p>
                <h1 id="profile-survey-title">{t('personalizeYourAssessment')}</h1>
                <p>
                  {t('tellUsWhatYouAlready')}
                </p>
              </div>
              <button type="button" className="icon-close" onClick={skipProfileSurvey} aria-label={t('skipProfileSurvey')}>X</button>
            </div>
            <div className="profile-context-card">
              <span>{t('currentContext')}</span>
              <strong>{activeSurveyContext}</strong>
              <p>{t('theseAnswersAreStoredLocally')}</p>
            </div>
            <div className="survey-question-list">
              {activeSurveyQuestions.map((question) => (
                <fieldset key={question.id}>
                  <legend>{question.label}</legend>
                  <div className="survey-option-grid">
                    {question.options.map((option) => {
                      const selected = (surveyAnswers[question.id] ?? []).includes(option);
                      return (
                        <button
                          key={option}
                          type="button"
                          className={selected ? 'selected' : ''}
                          onClick={() => toggleSurveyAnswer(question, option)}
                          aria-pressed={selected}
                        >
                          {option}
                        </button>
                      );
                    })}
                  </div>
                </fieldset>
              ))}
            </div>
            <div className="profile-ontology-note">
              <span>{t('profileGraphSeed')}</span>
              <p>{t('toolChoicesWorkflowsRiskConcerns')}</p>
            </div>
            <div className="survey-actions">
              <button type="button" className="secondary dark" onClick={skipProfileSurvey}>{t('skipForNow')}</button>
              <button type="button" className="primary" onClick={saveProfileSurvey}>{t('saveProfileAndStart')}</button>
            </div>
          </section>
        </div>
      )}
      <header className="topbar">
        <Link className="brand nav-reset" href={pathForStep('home')} aria-label={t('newHorizonHome')}>
          <span className="brand-mark">{t('nh')}</span>
          <span>{t('newHorizon')}</span>
        </Link>
        <nav aria-label={t('primaryNavigation')}>
          {primaryNavigation.map(({ step, label }) => {
            const href = pathForStep(step);
            return (
              <Link key={step} href={href} aria-current={pathname === href ? 'page' : undefined}>
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="topbar-actions">
          <div className="language-toggle" aria-label={t('language')}>
            {(['en', 'th'] as AppLanguage[]).map((language) => (
              <button
                key={language}
                type="button"
                className={appLanguage === language ? 'selected' : ''}
                onClick={() => setAppLanguage(language)}
                aria-pressed={appLanguage === language}
              >
                {language === 'en' ? t('en') : t('th')}
              </button>
            ))}
          </div>
          <Link className="small-button" href={pathForStep('onboarding')}>{t('start')}</Link>
        </div>
      </header>
      {children}
    </main>
  );
}
