'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  type AppLanguage,
} from '../learner-app';
import { useApp } from '../learner-app-context';
import { pathForStep, type AppStep } from '../learner-routes-model';

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

  return (
    <main>
      {surveyOpen && (
        <div className="survey-backdrop" role="presentation">
          <section className="profile-survey" role="dialog" aria-modal="true" aria-labelledby="profile-survey-title">
            <div className="profile-survey-header">
              <div>
                <p className="eyebrow">Optional profile survey</p>
                <h1 id="profile-survey-title">Personalize your assessment.</h1>
                <p>
                  Tell us what you already use, what similar people in your role are exploring, and what you may want to learn next.
                  New Horizon uses these signals to tune examples, learning paths, cohort analysis, and the starting difficulty before your answers take over.
                </p>
              </div>
              <button type="button" className="icon-close" onClick={skipProfileSurvey} aria-label="Skip profile survey">X</button>
            </div>
            <div className="profile-context-card">
              <span>Current context</span>
              <strong>{activeSurveyContext}</strong>
              <p>These answers are stored locally in the MVP as profile and interest signals. Production should add consent, versioning, privacy controls, and backend profile graph storage.</p>
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
              <span>Profile graph seed</span>
              <p>Tool choices, workflows, risk concerns, artifacts, role, function, and industry become tags that can later connect to competencies, courses, question routing, and cohort analytics.</p>
            </div>
            <div className="survey-actions">
              <button type="button" className="secondary dark" onClick={skipProfileSurvey}>Skip for now</button>
              <button type="button" className="primary" onClick={saveProfileSurvey}>Save profile and start</button>
            </div>
          </section>
        </div>
      )}
      <header className="topbar">
        <Link className="brand nav-reset" href={pathForStep('home')} aria-label="New Horizon home">
          <span className="brand-mark">NH</span>
          <span>New Horizon</span>
        </Link>
        <nav aria-label="Primary navigation">
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
          <div className="language-toggle" aria-label="Language">
            {(['en', 'th'] as AppLanguage[]).map((language) => (
              <button
                key={language}
                type="button"
                className={appLanguage === language ? 'selected' : ''}
                onClick={() => setAppLanguage(language)}
                aria-pressed={appLanguage === language}
              >
                {language === 'en' ? 'EN' : 'TH'}
              </button>
            ))}
          </div>
          <Link className="small-button" href={pathForStep('onboarding')}>Start</Link>
        </div>
      </header>
      {children}
    </main>
  );
}
