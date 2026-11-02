'use client';

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
          <p className="eyebrow">Registered user landing page</p>
          <h1>Your AI readiness dashboard.</h1>
          <p>
            This is the logged-in home experience for New Horizon. It brings together profile signals,
            assessment progress, recommended tools and concepts, learning actions, and a personalized AI Watch feed.
          </p>
        </div>
        <div className="dashboard-identity">
          <span>{authProfile ? 'Signed in' : isSupabaseConfigured() ? 'Sign in available' : 'Auth setup needed'}</span>
          <strong>{authProfile?.name ?? userProfileSurvey?.context ?? (mode === 'executive' ? executiveLabels[executiveRole] : mode === 'premium' ? functionLabels[functionTrack] : audienceLabels[audience])}</strong>
          <p>{authProfile?.email ?? localProfileId}</p>
          {authProfile ? (
            <>
              <button className="primary" type="button" onClick={() => openProfileSurvey(mode === 'practice' ? 'free' : mode)}>Update profile signals</button>
              <button className="secondary" type="button" onClick={signOutUser}>Sign out</button>
            </>
          ) : (
            <div className="auth-actions">
              <button className="primary" type="button" onClick={() => startGoogleSignIn(setAuthMessage)}>Continue with Google</button>
              <div className="email-auth-row">
                <input
                  type="email"
                  value={authEmail}
                  onChange={(event) => setAuthEmail(event.target.value)}
                  placeholder="you@example.com"
                  aria-label="Email for magic link"
                />
                <button className="secondary" type="button" onClick={() => sendEmailMagicLink(authEmail, setAuthMessage)}>Email link</button>
              </div>
              <button className="secondary" type="button" onClick={() => openProfileSurvey(mode === 'practice' ? 'free' : mode)}>Continue as guest</button>
            </div>
          )}
          <small>{authMessage || (isSupabaseConfigured() ? 'Google profile seeds email, name, avatar URL, and provider ID. Role/function signals still come from New Horizon.' : 'Set Supabase public env vars to activate Google and email login.')}</small>
        </div>
      </div>

      <div className="dashboard-grid">
        <article className="dashboard-card profile-overview">
          <span>Profile signals</span>
          <h2>{userProfileSurvey ? userProfileSurvey.tags.length : 0} saved tags</h2>
          {userProfileSurvey ? (
            <div className="profile-tag-grid">
              {userProfileSurvey.tags.slice(0, 10).map((tag) => <span key={tag}>{tag}</span>)}
            </div>
          ) : (
            <p>No profile survey saved yet. Registered users should be prompted to update tools, workflows, peer-tool awareness, and learning interests.</p>
          )}
        </article>

        <article className="dashboard-card progress-overview">
          <span>Progress</span>
          <h2>{scoreLogAnalytics.totalRuns} saved run{scoreLogAnalytics.totalRuns === 1 ? '' : 's'}</h2>
          <div className="dashboard-stats">
            <div><strong>{scoreLogAnalytics.totalRuns ? `${scoreLogAnalytics.averageOverall}/100` : 'New'}</strong><small>average readiness</small></div>
            <div><strong>{scoreLogAnalytics.signalSnapshots || 0}</strong><small>question signals</small></div>
            <div><strong>{coveragePlan.sampled}/24</strong><small>competencies sampled</small></div>
          </div>
          <button className="secondary dark" type="button" onClick={() => setStep('onboarding')}>Take assessment</button>
        </article>

        <article className="dashboard-card radar-overview">
          <span>Readiness profile</span>
          <RadarChart
            scores={results.domainScores}
            benchmarks={radarProfiles}
            selectedDomain={selectedRadarDomain}
            onSelectDomain={setSelectedRadarDomain}
          />
        </article>

        <article className="dashboard-card recommendation-overview">
          <span>Personalized recommendations</span>
          <h2>Explore next</h2>
          <div className="personalized-exploration dashboard-exploration">
            <div>
              <span>Tools</span>
              <div className="profile-tag-grid">
                {personalizedExploration.tools.slice(0, 5).map((tool) => <span key={tool}>{tool}</span>)}
              </div>
            </div>
            <div>
              <span>Concepts</span>
              <div className="profile-tag-grid">
                {personalizedExploration.concepts.slice(0, 5).map((concept) => <span key={concept}>{concept}</span>)}
              </div>
            </div>
            <div>
              <span>Practice</span>
              <div className="profile-tag-grid">
                {personalizedExploration.practice.slice(0, 3).map((activity) => <span key={activity}>{activity}</span>)}
              </div>
            </div>
          </div>
        </article>

        <article className="dashboard-card did-you-know-dashboard">
          <span>Did you know?</span>
          <h2>{personalizedDidYouKnow.topic}</h2>
          <p>{personalizedDidYouKnow.fact}</p>
          <small>{personalizedDidYouKnow.whyItMatters}</small>
          <div className="dashboard-card-actions">
            <button className="secondary dark" type="button" onClick={() => followDidYouKnow(personalizedDidYouKnow)}>Learn more</button>
            <button className="text-button" type="button" onClick={() => openProfileSurvey(mode === 'practice' ? 'free' : mode)}>Retune profile</button>
          </div>
        </article>

        <article className="dashboard-card learning-overview">
          <span>Learning path</span>
          <h2>Recommended courses</h2>
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
          <span>Personalized AI Watch</span>
          <h2>Signals for your gaps</h2>
          <div className="dashboard-news-list">
            {(dashboardNews.length ? dashboardNews : trendFeed.slice(0, 4)).map((item) => (
              <a key={item.title} href={item.url} target="_blank" rel="noreferrer">
                <small>{item.category} · {item.source}</small>
                <strong>{item.title}</strong>
              </a>
            ))}
          </div>
          <button className="secondary dark" type="button" onClick={() => setStep('news')}>Open AI Watch</button>
        </article>
      </div>
    </section>
  );
}
