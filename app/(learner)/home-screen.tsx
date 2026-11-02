'use client';

import AwarenessFlash from '../watch-awareness';
import {
  type Difficulty,
  type DomainId,
  type LandingLeaderboardPeriod,
  RadarChart,
  didYouKnowInsights,
  difficultyLabels,
  difficultyReadinessBands,
  domains,
  fieldLabRooms,
  frameworkSourceLinks,
  gamificationRules,
  globalFrameworkCrosswalk,
  learnByDoingActivities,
  microProfilePulse,
  scoringModelExplainers,
  trendFeed,
} from '../learner-app';
import { useApp } from '../learner-app-context';

export default function HomeScreen() {
  const {
    appLanguage,
    applyProfilePulse,
    artifactItemCount,
    authProfile,
    dismissProfilePulse,
    followDidYouKnow,
    homeMoreOpen,
    interactionCount,
    landingLeaderboard,
    landingLeaderboardPeriod,
    landingPeerInsights,
    liveItemCount,
    localProfileId,
    multiPartItemCount,
    openProfileSurvey,
    personalizedDidYouKnow,
    previewDomainCompetencies,
    profilePulseOpen,
    profilePulseSelections,
    secondaryDidYouKnow,
    selectedPreviewDomain,
    setHomeMoreOpen,
    setLandingLeaderboardPeriod,
    setSelectedPreviewDomain,
    setStep,
    showHomeSection,
    startLabActivity,
    toggleProfilePulse,
  } = useApp();

  return (
    <>
      {profilePulseOpen && (
        <aside className="profile-pulse-card" aria-label="Optional profile pulse">
          <div>
            <p className="eyebrow">Optional profile pulse</p>
            <h2>{microProfilePulse.title}</h2>
            <p>{microProfilePulse.prompt}</p>
          </div>
          <div className="profile-pulse-options">
            {microProfilePulse.options.map((option) => {
              const selected = profilePulseSelections.includes(option.id);
              return (
                <button
                  key={option.id}
                  type="button"
                  className={selected ? 'selected' : ''}
                  onClick={() => toggleProfilePulse(option.id)}
                  aria-pressed={selected}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
          <div className="profile-pulse-actions">
            <button type="button" className="secondary dark" onClick={dismissProfilePulse}>Skip</button>
            <button type="button" className="primary" disabled={!profilePulseSelections.length} onClick={applyProfilePulse}>Tune my test</button>
          </div>
          <small>Used to route questions and recommendations in this browser.</small>
        </aside>
      )}
      <>
        <section id="top" className="hero">
          <div className="hero-copy">
            <p className="eyebrow">AI-powered readiness assessment</p>
            <h1>Measure practical AI readiness.</h1>
            <p className="lede">
              New Horizon is an adaptive assessment platform for real AI capability: inspect artifacts,
              verify sources, choose safe workflows, govern agents, and turn scores into learning paths.
            </p>
            <div className="hero-actions">
              <button className="primary" onClick={() => setStep('onboarding')}>Start Free Assessment</button>
              <button className="secondary" onClick={() => setStep('premiumOnboarding')}>Start Premium Diagnostic</button>
              <button className="secondary" type="button" onClick={() => showHomeSection('process')}>See How It Works</button>
              <button className="secondary" type="button" onClick={() => showHomeSection('scoring-model')}>Scoring model</button>
            </div>
          </div>
          <div className="hero-panel" aria-label="Assessment preview">
            <div className="preview-card assessment-preview-card">
              <span className="status-dot" />
              <p>Adaptive assessment platform</p>
              <strong>Artifacts, scoring, radar, learning paths</strong>
            </div>
            <div className="assessment-snapshot" aria-label="Assessment platform snapshot">
              {[
                ['Raw artifacts', 'Invoices, reports, policies, source packets, workflows'],
                ['Question formats', 'Single, multi-select, matching, drag-order, written response, mini-parts'],
                ['Adaptive engine', 'Domain coverage plus difficulty up/down after each answer'],
                ['Decision output', 'D1-D6 radar, group average, research target, learning path'],
              ].map(([title, body]) => (
                <div key={title}>
                  <span>{title}</span>
                  <p>{body}</p>
                </div>
              ))}
            </div>
            <div className="preview-question">
              <p>Example task</p>
              <strong>Inspect a raw policy packet. What did the AI overstate, omit, or make unsafe?</strong>
            </div>
          </div>
        </section>

        <section className="stats" aria-label="MVP scope highlights">
          <div><strong>{liveItemCount}</strong><span>live seed items</span></div>
          <div><strong>{artifactItemCount}</strong><span>artifact-backed items</span></div>
          <div><strong>{multiPartItemCount}</strong><span>multi-part clusters</span></div>
          <div><strong>6</strong><span>AILF domains</span></div>
          <div><strong>{interactionCount}</strong><span>question formats</span></div>
        </section>

        <section className="home-menu-tabs" aria-label="Home guide menu">
          {[
            ['Scoring model', 'How answers, difficulty, competencies, domains, and confidence become the score.', 'scoring-model'],
            ['Global frameworks', 'How New Horizon maps to UNESCO, OECD, NIST, EU AI Act, DigComp, ISO, and AI Verify.', 'global-frameworks'],
            ['Adaptive testing', 'Why the test continues when coverage or confidence is not strong enough.', 'process'],
          ].map(([title, body, target]) => (
            <a key={title} href={`#${target}`}>
              <span>{title}</span>
              <p>{body}</p>
            </a>
          ))}
        </section>

        <section className="section did-you-know-section" aria-labelledby="did-you-know-title">
          <AwarenessFlash stories={trendFeed} language={appLanguage} ownerId={authProfile?.id ?? localProfileId} onOpenWatch={() => setStep('news')} />
          <article className="did-you-know-card featured">
            <div>
              <p className="eyebrow">Did you know?</p>
              <span>{personalizedDidYouKnow.domain} · {personalizedDidYouKnow.topic}</span>
              <h2 id="did-you-know-title">{personalizedDidYouKnow.fact}</h2>
              <p>{personalizedDidYouKnow.whyItMatters}</p>
            </div>
            <div className="did-you-know-actions">
              <button className="primary" type="button" onClick={() => followDidYouKnow(personalizedDidYouKnow)}>Learn more</button>
              <button className="secondary dark" type="button" onClick={() => openProfileSurvey('free')}>Tune topics</button>
            </div>
          </article>
          <div className="did-you-know-grid">
            {(secondaryDidYouKnow.length ? secondaryDidYouKnow : didYouKnowInsights.filter((insight) => insight.id !== personalizedDidYouKnow.id).slice(0, 2)).map((insight) => (
              <article key={insight.id} className="did-you-know-card compact">
                <span>{insight.domain} · {insight.topic}</span>
                <strong>{insight.fact}</strong>
                <p>{insight.whyItMatters}</p>
                <button className="text-button" type="button" onClick={() => followDidYouKnow(insight)}>Learn more</button>
              </article>
            ))}
          </div>
        </section>

        <section className="section peer-board-section" aria-labelledby="peer-board-title">
          <div className="section-heading-row">
            <div>
              <p className="eyebrow">Peer challenge</p>
              <h2 id="peer-board-title">Where would you land today?</h2>
              <p>
                Compare against the visible top 10 for the day or week, then take the assessment to see
                whether your strongest domain is enough to break into your peer group.
              </p>
            </div>
            <div className="period-toggle" aria-label="Leaderboard period">
              {(['day', 'week'] as LandingLeaderboardPeriod[]).map((period) => (
                <button
                  key={period}
                  type="button"
                  className={landingLeaderboardPeriod === period ? 'selected' : ''}
                  onClick={() => setLandingLeaderboardPeriod(period)}
                >
                  {period === 'day' ? 'Today' : 'This week'}
                </button>
              ))}
            </div>
          </div>
          <div className="peer-board-grid">
            <article className="peer-leaderboard-card">
              <div className="peer-card-heading">
                <div>
                  <span>Top 10</span>
                  <strong>{landingLeaderboardPeriod === 'day' ? 'Daily board' : 'Weekly board'}</strong>
                </div>
                <small>{landingLeaderboard.some((row) => row.source === 'local') ? 'Local pilot data' : 'Demo until your first runs'}</small>
              </div>
              <div className="landing-leaderboard-list">
                {landingLeaderboard.map((row) => (
                  <div key={row.id} className={row.source}>
                    <b>#{row.rank}</b>
                    <span>
                      <strong>{row.displayName}</strong>
                      <small>{row.groupLabel}</small>
                    </span>
                    <i>{row.strongestDomain}</i>
                    <em>{row.overall}</em>
                  </div>
                ))}
              </div>
            </article>
            <div className="peer-insight-grid">
              {landingPeerInsights.map((insight) => (
                <article key={insight.label} className="peer-insight-card">
                  <span>{insight.label}</span>
                  <strong>{insight.value}</strong>
                  <p>{insight.detail}</p>
                </article>
              ))}
              <article className="peer-cta-card">
                <span>Find your rank</span>
                <strong>Can you beat your peer average?</strong>
                <p>Scores above 80 need stronger applied or advanced evidence, not just easy-item correctness.</p>
                <div className="hero-actions">
                  <button className="primary" onClick={() => setStep('onboarding')}>Take the free test</button>
                  <button className="secondary dark" onClick={() => setStep('premiumOnboarding')}>Choose peer group</button>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section className={`home-more-panel ${homeMoreOpen ? 'open' : ''}`}>
          <button
            type="button"
            className="home-more-summary"
            onClick={() => setHomeMoreOpen((open) => !open)}
            aria-expanded={homeMoreOpen}
          >
            <span>Explore more</span>
            <strong>{homeMoreOpen ? 'Hide learning prompts, practice labs, scoring, and frameworks' : 'Learning prompts, practice labs, scoring, and frameworks'}</strong>
          </button>

          <div className="home-more-content" hidden={!homeMoreOpen}>
        <section id="labs" className="section field-lab">
          <div>
            <p className="eyebrow">Learn by doing</p>
            <h2>Practice the activities the assessment is built from.</h2>
            <p>
              Each activity box maps to a practical assessment format. Users do not just read about AI;
              they inspect, repair, verify, sequence, match, and explain.
              Pilot labs should be treated as samples until they include complete instructions, realistic artifacts,
              scoring criteria, and a debrief.
            </p>
          </div>
          <div className="activity-grid">
            {learnByDoingActivities.map((activity) => (
              <button className="activity-card" key={activity.title} onClick={() => startLabActivity(activity)} type="button">
                <div>
                  <span>{activity.domain} · {domains[activity.domain].short}</span>
                  <strong>{activity.format}</strong>
                </div>
                <h3>{activity.title}</h3>
                <p>{activity.detail}</p>
                <small>Start activity</small>
              </button>
            ))}
          </div>
          <div className="room-grid">
            {fieldLabRooms.map((activity) => (
              <button className="room-card" key={activity.title} onClick={() => startLabActivity(activity)} type="button">
                <span>{activity.domain} · {activity.format}</span>
                <h3>{activity.title}</h3>
                <p>{activity.detail}</p>
              </button>
            ))}
          </div>
        </section>

        <section id="platform" className="section two-column">
          <div>
            <p className="eyebrow">The platform</p>
            <h2>A field test for the way people actually use AI.</h2>
            <p>
              New Horizon turns AI readiness into observable behavior. Users inspect messy artifacts,
              make judgment calls, explain evidence, and see how their choices change the next task.
            </p>
          </div>
          <div className="card-grid">
            {[
              ['Evidence over opinion', 'The assessment asks users to prove what they trust, reject, revise, or escalate.'],
              ['Adaptive under the hood', 'Difficulty and domain focus move as the score estimate and coverage gaps change.'],
              ['Useful after the score', 'Results point to competencies, practical skills, benchmarks, and real learning options.'],
            ].map(([title, body]) => (
              <article className="info-card" key={title}>
                <h3>{title}</h3>
                <p>{body}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="scoring-model" className="section scoring-model-section">
          <div className="section-heading-row">
            <div>
              <p className="eyebrow">Scoring and adaptive testing</p>
              <h2>Scores reward harder evidence, not just correct guesses.</h2>
              <p>
                New Horizon separates raw answer correctness from readiness evidence. The same raw score
                contributes differently depending on difficulty, competency coverage, and confidence.
              </p>
            </div>
            <span>Transparent MVP logic</span>
          </div>
          <div className="score-model-grid">
            {scoringModelExplainers.map(([title, body]) => (
              <article className="info-card score-model-card" key={title}>
                <h3>{title}</h3>
                <p>{body}</p>
              </article>
            ))}
          </div>
          <div className="difficulty-band-table" role="table" aria-label="Difficulty readiness bands">
            <div role="row">
              <strong role="columnheader">Difficulty</strong>
              <strong role="columnheader">Partial anchor</strong>
              <strong role="columnheader">Maximum readiness</strong>
            </div>
            {(Object.keys(difficultyReadinessBands) as Difficulty[]).map((difficulty) => (
              <div role="row" key={difficulty}>
                <span role="cell">{difficultyLabels[difficulty]}</span>
                <span role="cell">{difficultyReadinessBands[difficulty].partial}/100</span>
                <span role="cell">{difficultyReadinessBands[difficulty].max}/100</span>
              </div>
            ))}
          </div>
        </section>

        <section id="global-frameworks" className="section global-framework-section band">
          <div className="section-heading-row">
            <div>
              <p className="eyebrow">Global framework crosswalk</p>
              <h2>Mapped to reputable AI literacy, governance, and readiness frameworks.</h2>
              <p>
                New Horizon is not claiming certification equivalence. It uses these frameworks as a
                crosswalk so domains, competencies, questions, telemetry, and improvement reviews stay globally grounded.
              </p>
            </div>
            <span>D1-D6 crosswalk</span>
          </div>
          <div className="framework-crosswalk-grid">
            {globalFrameworkCrosswalk.map((row) => (
              <article className="framework-card" key={row.domain} style={{ borderTopColor: domains[row.domain].color }}>
                <span>{row.domain} · {domains[row.domain].name}</span>
                <h3>{domains[row.domain].short}</h3>
                <p><strong>Maps to</strong> {row.mapsTo}</p>
                <p><strong>Tests</strong> {row.emphasis}</p>
                <p><strong>Improve next</strong> {row.improveNext}</p>
              </article>
            ))}
          </div>
          <div className="framework-source-list">
            {frameworkSourceLinks.map((source) => (
              <a key={source.label} href={source.url} target="_blank" rel="noreferrer">{source.label}</a>
            ))}
          </div>
        </section>

        <section className="section gamification-section">
          <div>
            <p className="eyebrow">Progress system</p>
            <h2>Make readiness feel earned.</h2>
            <p>
              Gamification should reward careful judgment, evidence review, and improvement over time.
              The goal is confidence through practice, not points for rushing.
            </p>
          </div>
          <div className="game-grid">
            {gamificationRules.map(([title, body]) => (
              <article className="game-card" key={title}>
                <span>{title}</span>
                <p>{body}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="process" className="section band">
          <p className="eyebrow">Simple process</p>
          <h2>One clear flow from assessment to action.</h2>
          <div className="steps">
            {[
              ['01', 'Build a light profile', 'Choose your audience, role, tools, interests, and peer-tool awareness.'],
              ['02', 'Answer adaptive scenarios', 'Questions create domain, competency, skill, difficulty, and behavior signals.'],
              ['03', 'Decide whether to keep going', 'If confidence or coverage is weak, add targeted questions before final results.'],
              ['04', 'Follow a learning path', 'See tools, concepts, labs, and courses matched to your profile and gaps.'],
            ].map(([num, title, body]) => (
              <article className="step-card" key={num}>
                <span>{num}</span>
                <h3>{title}</h3>
                <p>{body}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="domains" className="section">
          <p className="eyebrow">AILF framework pack</p>
          <h2>Six domains of AI readiness.</h2>
          <div className="domain-grid">
            {(Object.keys(domains) as DomainId[]).map((id) => (
              <article className="domain-card" key={id} style={{ borderTopColor: domains[id].color }}>
                <span>{id}</span>
                <h3>{domains[id].name}</h3>
              </article>
            ))}
          </div>
        </section>

        <section id="results" className="section results-preview">
          <div>
            <p className="eyebrow">Your results</p>
            <h2>Radar profile, gaps, and next steps.</h2>
            <p>
              MVP results are indicative, not certification-grade. They show readiness patterns and recommend
              practical learning actions while collecting evidence for future calibration.
            </p>
            <div className="hero-actions">
              <button className="primary light" onClick={() => setStep('onboarding')}>Try Free Flow</button>
              <button className="secondary invert" onClick={() => setStep('premiumOnboarding')}>Try Premium Diagnostic</button>
            </div>
          </div>
          <div className="mock-result">
            <RadarChart
              scores={{ D1: 72, D2: 68, D3: 46, D4: 58, D5: 64, D6: 76 }}
              selectedDomain={selectedPreviewDomain}
              onSelectDomain={setSelectedPreviewDomain}
            />
            <div className="preview-domain-drilldown">
              <span>{selectedPreviewDomain} · {domains[selectedPreviewDomain].name}</span>
              <strong>Competency map</strong>
              <div>
                {previewDomainCompetencies.map((competency) => (
                  <p key={competency.id}>
                    <b>{competency.label}</b>
                    <small>{competency.skills.slice(0, 3).join(', ')}</small>
                  </p>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="section premium-section">
          <div>
            <p className="eyebrow">Premium assessment</p>
            <h2>Deeper diagnosis for people who want more than a score.</h2>
            <p>
              The MVP premium pilot adds function, industry, role context, a longer adaptive run,
              evidence review, precision language, leadership pathways, and a richer learning plan.
            </p>
          </div>
          <div className="premium-grid">
            {['Function context', 'Industry scenarios', 'Leadership role context', 'Premium learning plan'].map((item) => (
              <article className="info-card" key={item}>
                <h3>{item}</h3>
                <p>Pilot-grade now, designed for calibrated psychometrics after response data is collected.</p>
              </article>
            ))}
          </div>
          <div className="hero-actions">
            <button className="primary" onClick={() => setStep('premiumOnboarding')}>Start Premium Diagnostic</button>
          </div>
        </section>
          </div>
        </section>
      </>
    </>
  );
}
