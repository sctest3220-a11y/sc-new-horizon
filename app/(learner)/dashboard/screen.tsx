'use client';

import { useTranslations } from 'next-intl';
import {
  RadarChart,
  audienceLabels,
  executiveLabels,
  functionLabels,
  isSupabaseConfigured,
  sendEmailMagicLink,
  startGoogleSignIn,
  trendFeed,
} from '../../learner-app';
import { useApp } from '../../learner-app-context';

export default function DashboardScreen() {
  const t = useTranslations('dashboard');
  const {
    audience,
    authEmail,
    authMessage,
    authProfile,
    courseRecommendations,
    coveragePlan,
    dashboardNews,
    executiveRole,
    followDidYouKnow,
    functionTrack,
    localProfileId,
    mode,
    openProfileSurvey,
    personalizedDidYouKnow,
    personalizedExploration,
    radarProfiles,
    results,
    scoreLogAnalytics,
    selectedRadarDomain,
    setAuthEmail,
    setAuthMessage,
    setSelectedRadarDomain,
    setStep,
    signOutUser,
    userProfileSurvey,
  } = useApp();

  return (
    <section className="dashboard-shell">
      <div className="dashboard-hero">
        <div>
          <p className="eyebrow">{t('registeredUserLandingPage')}</p>
          <h1>{t('yourAiReadinessDashboard')}</h1>
          <p>
            
            {t('thisIsTheLoggedIn')}
          </p>
        </div>
        <div className="dashboard-identity">
          <span>{authProfile ? t('signedIn') : isSupabaseConfigured() ? t('signInAvailable') : t('authSetupNeeded')}</span>
          <strong>{authProfile?.name ?? userProfileSurvey?.context ?? (mode === 'executive' ? executiveLabels[executiveRole] : mode === 'premium' ? functionLabels[functionTrack] : audienceLabels[audience])}</strong>
          <p>{authProfile?.email ?? localProfileId}</p>
          {authProfile ? (
            <>
              <button className="primary" type="button" onClick={() => openProfileSurvey(mode === 'practice' ? 'free' : mode)}>{t('updateProfileSignals')}</button>
              <button className="secondary" type="button" onClick={signOutUser}>{t('signOut')}</button>
            </>
          ) : (
            <div className="auth-actions">
              <button className="primary" type="button" onClick={() => startGoogleSignIn(setAuthMessage)}>{t('continueWithGoogle')}</button>
              <div className="email-auth-row">
                <input
                  type="email"
                  value={authEmail}
                  onChange={(event) => setAuthEmail(event.target.value)}
                  placeholder="you@example.com"
                  aria-label={t('emailForMagicLink')}
                />
                <button className="secondary" type="button" onClick={() => sendEmailMagicLink(authEmail, setAuthMessage)}>{t('emailLink')}</button>
              </div>
              <button className="secondary" type="button" onClick={() => openProfileSurvey(mode === 'practice' ? 'free' : mode)}>{t('continueAsGuest')}</button>
            </div>
          )}
          <small>{authMessage || (isSupabaseConfigured() ? t('googleProfileSeedsEmailName') : t('setSupabasePublicEnvVars'))}</small>
        </div>
      </div>

      <div className="dashboard-grid">
        <article className="dashboard-card profile-overview">
          <span>{t('profileSignals')}</span>
          <h2>{t('savedTags', { value: userProfileSurvey ? userProfileSurvey.tags.length : 0 })}</h2>
          {userProfileSurvey ? (
            <div className="profile-tag-grid">
              {userProfileSurvey.tags.slice(0, 10).map((tag) => <span key={tag}>{tag}</span>)}
            </div>
          ) : (
            <p>{t('noProfileSurveySavedYet')}</p>
          )}
        </article>

        <article className="dashboard-card progress-overview">
          <span>{t('progress')}</span>
          <h2>{t('savedRun', { totalRuns: scoreLogAnalytics.totalRuns, value: scoreLogAnalytics.totalRuns === 1 ? '' : 's' })}</h2>
          <div className="dashboard-stats">
            <div><strong>{scoreLogAnalytics.totalRuns ? `${scoreLogAnalytics.averageOverall}/100` : t('new')}</strong><small>{t('averageReadiness')}</small></div>
            <div><strong>{scoreLogAnalytics.signalSnapshots || 0}</strong><small>{t('questionSignals')}</small></div>
            <div><strong>{coveragePlan.sampled}/24</strong><small>{t('competenciesSampled')}</small></div>
          </div>
          <button className="secondary dark" type="button" onClick={() => setStep('onboarding')}>{t('takeAssessment')}</button>
        </article>

        <article className="dashboard-card radar-overview">
          <span>{t('readinessProfile')}</span>
          <RadarChart
            scores={results.domainScores}
            benchmarks={radarProfiles}
            selectedDomain={selectedRadarDomain}
            onSelectDomain={setSelectedRadarDomain}
          />
        </article>

        <article className="dashboard-card recommendation-overview">
          <span>{t('personalizedRecommendations')}</span>
          <h2>{t('exploreNext')}</h2>
          <div className="personalized-exploration dashboard-exploration">
            <div>
              <span>{t('tools')}</span>
              <div className="profile-tag-grid">
                {personalizedExploration.tools.slice(0, 5).map((tool) => <span key={tool}>{tool}</span>)}
              </div>
            </div>
            <div>
              <span>{t('concepts')}</span>
              <div className="profile-tag-grid">
                {personalizedExploration.concepts.slice(0, 5).map((concept) => <span key={concept}>{concept}</span>)}
              </div>
            </div>
            <div>
              <span>{t('practice')}</span>
              <div className="profile-tag-grid">
                {personalizedExploration.practice.slice(0, 3).map((activity) => <span key={activity}>{activity}</span>)}
              </div>
            </div>
          </div>
        </article>

        <article className="dashboard-card did-you-know-dashboard">
          <span>{t('didYouKnow')}</span>
          <h2>{personalizedDidYouKnow.topic}</h2>
          <p>{personalizedDidYouKnow.fact}</p>
          <small>{personalizedDidYouKnow.whyItMatters}</small>
          <div className="dashboard-card-actions">
            <button className="secondary dark" type="button" onClick={() => followDidYouKnow(personalizedDidYouKnow)}>{t('learnMore')}</button>
            <button className="text-button" type="button" onClick={() => openProfileSurvey(mode === 'practice' ? 'free' : mode)}>{t('retuneProfile')}</button>
          </div>
        </article>

        <article className="dashboard-card learning-overview">
          <span>{t('learningPath')}</span>
          <h2>{t('recommendedCourses')}</h2>
          <div className="dashboard-course-list">
            {courseRecommendations.slice(0, 3).map((course) => (
              <a key={course.id} href={course.url} target="_blank" rel="noreferrer">
                <strong>{course.title}</strong>
                <small>{course.provider} · {course.level}</small>
              </a>
            ))}
          </div>
        </article>

        <article className="dashboard-card news-overview">
          <span>{t('personalizedAiWatch')}</span>
          <h2>{t('signalsForYourGaps')}</h2>
          <div className="dashboard-news-list">
            {(dashboardNews.length ? dashboardNews : trendFeed.slice(0, 4)).map((item) => (
              <a key={item.title} href={item.url} target="_blank" rel="noreferrer">
                <small>{item.category} · {item.source}</small>
                <strong>{item.title}</strong>
              </a>
            ))}
          </div>
          <button className="secondary dark" type="button" onClick={() => setStep('news')}>{t('openAiWatch')}</button>
        </article>
      </div>
    </section>
  );
}
