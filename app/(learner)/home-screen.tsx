'use client';

import { useContent } from '../language';
import { useTranslations } from 'next-intl';
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
  const tc = useContent();
  const t = useTranslations('home');
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
        <aside className="profile-pulse-card" aria-label={t('optionalProfilePulse')}>
          <div>
            <p className="eyebrow">{t('optionalProfilePulse')}</p>
            <h2>{tc(microProfilePulse.title)}</h2>
            <p>{tc(microProfilePulse.prompt)}</p>
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
                  {tc(option.label)}
                </button>
              );
            })}
          </div>
          <div className="profile-pulse-actions">
            <button type="button" className="secondary dark" onClick={dismissProfilePulse}>{t('skip')}</button>
            <button type="button" className="primary" disabled={!profilePulseSelections.length} onClick={applyProfilePulse}>{t('tuneMyTest')}</button>
          </div>
          <small>{t('usedToRouteQuestionsAnd')}</small>
        </aside>
      )}
      <>
        <section id="top" className="hero">
          <div className="hero-copy">
            <p className="eyebrow">{t('aiPoweredReadinessAssessment')}</p>
            <h1>{t('measurePracticalAiReadiness')}</h1>
            <p className="lede">
              {t('newHorizonIsAnAdaptive')}
            </p>
            <div className="hero-actions">
              <button className="primary" onClick={() => setStep('onboarding')}>{t('startFreeAssessment')}</button>
              <button className="secondary" onClick={() => setStep('premiumOnboarding')}>{t('startPremiumDiagnostic')}</button>
              <button className="secondary" type="button" onClick={() => showHomeSection('process')}>{t('seeHowItWorks')}</button>
              <button className="secondary" type="button" onClick={() => showHomeSection('scoring-model')}>{t('scoringModel')}</button>
            </div>
          </div>
          <div className="hero-panel" aria-label={t('assessmentPreview')}>
            <div className="preview-card assessment-preview-card">
              <span className="status-dot" />
              <p>{t('adaptiveAssessmentPlatform')}</p>
              <strong>{t('artifactsScoringRadarLearningPaths')}</strong>
            </div>
            <div className="assessment-snapshot" aria-label={t('assessmentPlatformSnapshot')}>
              {[
                [t('rawArtifacts'), t('invoicesReportsPoliciesSourcePackets')],
                [t('questionFormats2'), t('singleMultiSelectMatchingDrag')],
                [t('adaptiveEngine'), t('domainCoveragePlusDifficultyUp')],
                [t('decisionOutput'), t('d1D6RadarGroupAverage')],
              ].map(([title, body]) => (
                <div key={title}>
                  <span>{tc(title)}</span>
                  <p>{tc(body)}</p>
                </div>
              ))}
            </div>
            <div className="preview-question">
              <p>{t('exampleTask')}</p>
              <strong>{t('inspectARawPolicyPacket')}</strong>
            </div>
          </div>
        </section>

        <section className="stats" aria-label={t('mvpScopeHighlights')}>
          <div><strong>{liveItemCount}</strong><span>{t('liveSeedItems')}</span></div>
          <div><strong>{artifactItemCount}</strong><span>{t('artifactBackedItems')}</span></div>
          <div><strong>{multiPartItemCount}</strong><span>{t('multiPartClusters')}</span></div>
          <div><strong>6</strong><span>{t('ailfDomains')}</span></div>
          <div><strong>{interactionCount}</strong><span>{t('questionFormats')}</span></div>
        </section>

        <section className="home-menu-tabs" aria-label={t('homeGuideMenu')}>
          {[
            [t('scoringModel'), t('howAnswersDifficultyCompetenciesDomains'), 'scoring-model'],
            [t('globalFrameworks'), t('howNewHorizonMapsTo'), 'global-frameworks'],
            [t('adaptiveTesting'), t('whyTheTestContinuesWhen'), 'process'],
          ].map(([title, body, target]) => (
            <a key={title} href={`#${target}`}>
              <span>{tc(title)}</span>
              <p>{tc(body)}</p>
            </a>
          ))}
        </section>

        <section className="section did-you-know-section" aria-labelledby="did-you-know-title">
          <AwarenessFlash stories={trendFeed} language={appLanguage} ownerId={authProfile?.id ?? localProfileId} onOpenWatch={() => setStep('news')} />
          <article className="did-you-know-card featured">
            <div>
              <p className="eyebrow">{t('didYouKnow')}</p>
              <span>{tc(personalizedDidYouKnow.domain ?? '')} · {tc(personalizedDidYouKnow.topic)}</span>
              <h2 id="did-you-know-title">{tc(personalizedDidYouKnow.fact)}</h2>
              <p>{tc(personalizedDidYouKnow.whyItMatters)}</p>
            </div>
            <div className="did-you-know-actions">
              <button className="primary" type="button" onClick={() => followDidYouKnow(personalizedDidYouKnow)}>{t('learnMore')}</button>
              <button className="secondary dark" type="button" onClick={() => openProfileSurvey('free')}>{t('tuneTopics')}</button>
            </div>
          </article>
          <div className="did-you-know-grid">
            {(secondaryDidYouKnow.length ? secondaryDidYouKnow : didYouKnowInsights.filter((insight) => insight.id !== personalizedDidYouKnow.id).slice(0, 2)).map((insight) => (
              <article key={insight.id} className="did-you-know-card compact">
                <span>{tc(insight.domain ?? '')} · {tc(insight.topic)}</span>
                <strong>{tc(insight.fact)}</strong>
                <p>{tc(insight.whyItMatters)}</p>
                <button className="text-button" type="button" onClick={() => followDidYouKnow(insight)}>{t('learnMore')}</button>
              </article>
            ))}
          </div>
        </section>

        <section className="section peer-board-section" aria-labelledby="peer-board-title">
          <div className="section-heading-row">
            <div>
              <p className="eyebrow">{t('peerChallenge')}</p>
              <h2 id="peer-board-title">{t('whereWouldYouLandToday')}</h2>
              <p>
                {t('compareAgainstTheVisibleTop')}
              </p>
            </div>
            <div className="period-toggle" aria-label={t('leaderboardPeriod')}>
              {(['day', 'week'] as LandingLeaderboardPeriod[]).map((period) => (
                <button
                  key={period}
                  type="button"
                  className={landingLeaderboardPeriod === period ? 'selected' : ''}
                  onClick={() => setLandingLeaderboardPeriod(period)}
                >
                  {period === 'day' ? t('today') : t('thisWeek')}
                </button>
              ))}
            </div>
          </div>
          <div className="peer-board-grid">
            <article className="peer-leaderboard-card">
              <div className="peer-card-heading">
                <div>
                  <span>{t('top10')}</span>
                  <strong>{landingLeaderboardPeriod === 'day' ? t('dailyBoard') : t('weeklyBoard')}</strong>
                </div>
                <small>{landingLeaderboard.some((row) => row.source === 'local') ? t('localPilotData') : t('demoUntilYourFirstRuns')}</small>
              </div>
              <div className="landing-leaderboard-list">
                {landingLeaderboard.map((row) => (
                  <div key={row.id} className={row.source}>
                    <b>#{row.rank}</b>
                    <span>
                      <strong>{tc(row.displayName)}</strong>
                      <small>{tc(row.groupLabel)}</small>
                    </span>
                    <i>{tc(row.strongestDomain ?? '')}</i>
                    <em>{row.overall}</em>
                  </div>
                ))}
              </div>
            </article>
            <div className="peer-insight-grid">
              {landingPeerInsights.map((insight) => (
                <article key={insight.label} className="peer-insight-card">
                  <span>{tc(insight.label)}</span>
                  <strong>{tc(insight.value)}</strong>
                  <p>{tc(insight.detail)}</p>
                </article>
              ))}
              <article className="peer-cta-card">
                <span>{t('findYourRank')}</span>
                <strong>{t('canYouBeatYourPeer')}</strong>
                <p>{t('scoresAbove80NeedStronger')}</p>
                <div className="hero-actions">
                  <button className="primary" onClick={() => setStep('onboarding')}>{t('takeTheFreeTest')}</button>
                  <button className="secondary dark" onClick={() => setStep('premiumOnboarding')}>{t('choosePeerGroup')}</button>
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
            <span>{t('exploreMore')}</span>
            <strong>{homeMoreOpen ? t('hideLearningPromptsPracticeLabs') : t('learningPromptsPracticeLabsScoring')}</strong>
          </button>

          <div className="home-more-content" hidden={!homeMoreOpen}>
        <section id="labs" className="section field-lab">
          <div>
            <p className="eyebrow">{t('learnByDoing')}</p>
            <h2>{t('practiceTheActivitiesTheAssessment')}</h2>
            <p>
              {t('eachActivityBoxMapsTo')}
            </p>
          </div>
          <div className="activity-grid">
            {learnByDoingActivities.map((activity) => (
              <button className="activity-card" key={activity.title} onClick={() => startLabActivity(activity)} type="button">
                <div>
                  <span>{tc(activity.domain ?? '')} · {tc(domains[activity.domain].short)}</span>
                  <strong>{tc(activity.format)}</strong>
                </div>
                <h3>{tc(activity.title)}</h3>
                <p>{tc(activity.detail)}</p>
                <small>{t('startActivity')}</small>
              </button>
            ))}
          </div>
          <div className="room-grid">
            {fieldLabRooms.map((activity) => (
              <button className="room-card" key={activity.title} onClick={() => startLabActivity(activity)} type="button">
                <span>{tc(activity.domain ?? '')} · {tc(activity.format)}</span>
                <h3>{tc(activity.title)}</h3>
                <p>{tc(activity.detail)}</p>
              </button>
            ))}
          </div>
        </section>

        <section id="platform" className="section two-column">
          <div>
            <p className="eyebrow">{t('thePlatform')}</p>
            <h2>{t('aFieldTestForThe')}</h2>
            <p>
              {t('newHorizonTurnsAiReadiness')}
            </p>
          </div>
          <div className="card-grid">
            {[
              [t('evidenceOverOpinion'), t('theAssessmentAsksUsersTo')],
              [t('adaptiveUnderTheHood'), t('difficultyAndDomainFocusMove')],
              [t('usefulAfterTheScore'), t('resultsPointToCompetenciesPractical')],
            ].map(([title, body]) => (
              <article className="info-card" key={title}>
                <h3>{tc(title)}</h3>
                <p>{tc(body)}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="scoring-model" className="section scoring-model-section">
          <div className="section-heading-row">
            <div>
              <p className="eyebrow">{t('scoringAndAdaptiveTesting')}</p>
              <h2>{t('scoresRewardHarderEvidenceNot')}</h2>
              <p>
                {t('newHorizonSeparatesRawAnswer')}
              </p>
            </div>
            <span>{t('transparentMvpLogic')}</span>
          </div>
          <div className="score-model-grid">
            {scoringModelExplainers.map(([title, body]) => (
              <article className="info-card score-model-card" key={title}>
                <h3>{tc(title)}</h3>
                <p>{tc(body)}</p>
              </article>
            ))}
          </div>
          <div className="difficulty-band-table" role="table" aria-label={t('difficultyReadinessBands')}>
            <div role="row">
              <strong role="columnheader">{t('difficulty')}</strong>
              <strong role="columnheader">{t('partialAnchor')}</strong>
              <strong role="columnheader">{t('maximumReadiness')}</strong>
            </div>
            {(Object.keys(difficultyReadinessBands) as Difficulty[]).map((difficulty) => (
              <div role="row" key={difficulty}>
                <span role="cell">{tc(difficultyLabels[difficulty])}</span>
                <span role="cell">{difficultyReadinessBands[difficulty].partial}/100</span>
                <span role="cell">{difficultyReadinessBands[difficulty].max}/100</span>
              </div>
            ))}
          </div>
        </section>

        <section id="global-frameworks" className="section global-framework-section band">
          <div className="section-heading-row">
            <div>
              <p className="eyebrow">{t('globalFrameworkCrosswalk')}</p>
              <h2>{t('mappedToReputableAiLiteracy')}</h2>
              <p>
                {t('newHorizonIsNotClaiming')}
              </p>
            </div>
            <span>{t('d1D6Crosswalk')}</span>
          </div>
          <div className="framework-crosswalk-grid">
            {globalFrameworkCrosswalk.map((row) => (
              <article className="framework-card" key={row.domain} style={{ borderTopColor: domains[row.domain].color }}>
                <span>{tc(row.domain ?? '')} · {tc(domains[row.domain].name)}</span>
                <h3>{tc(domains[row.domain].short)}</h3>
                <p><strong>{t('mapsTo')}</strong> {tc(row.mapsTo)}</p>
                <p><strong>{t('tests')}</strong> {tc(row.emphasis)}</p>
                <p><strong>{t('improveNext')}</strong> {tc(row.improveNext)}</p>
              </article>
            ))}
          </div>
          <div className="framework-source-list">
            {frameworkSourceLinks.map((source) => (
              <a key={source.label} href={source.url} target="_blank" rel="noreferrer">{tc(source.label)}</a>
            ))}
          </div>
        </section>

        <section className="section gamification-section">
          <div>
            <p className="eyebrow">{t('progressSystem')}</p>
            <h2>{t('makeReadinessFeelEarned')}</h2>
            <p>
              {t('gamificationShouldRewardCarefulJudgment')}
            </p>
          </div>
          <div className="game-grid">
            {gamificationRules.map(([title, body]) => (
              <article className="game-card" key={title}>
                <span>{tc(title)}</span>
                <p>{tc(body)}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="process" className="section band">
          <p className="eyebrow">{t('simpleProcess')}</p>
          <h2>{t('oneClearFlowFromAssessment')}</h2>
          <div className="steps">
            {[
              ['01', t('buildALightProfile'), t('chooseYourAudienceRoleTools')],
              ['02', t('answerAdaptiveScenarios'), t('questionsCreateDomainCompetencySkill')],
              ['03', t('decideWhetherToKeepGoing'), t('ifConfidenceOrCoverageIs')],
              ['04', t('followALearningPath'), t('seeToolsConceptsLabsAnd')],
            ].map(([num, title, body]) => (
              <article className="step-card" key={num}>
                <span>{tc(num)}</span>
                <h3>{tc(title)}</h3>
                <p>{tc(body)}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="domains" className="section">
          <p className="eyebrow">{t('ailfFrameworkPack')}</p>
          <h2>{t('sixDomainsOfAiReadiness')}</h2>
          <div className="domain-grid">
            {(Object.keys(domains) as DomainId[]).map((id) => (
              <article className="domain-card" key={id} style={{ borderTopColor: domains[id].color }}>
                <span>{tc(id ?? '')}</span>
                <h3>{tc(domains[id].name)}</h3>
              </article>
            ))}
          </div>
        </section>

        <section id="results" className="section results-preview">
          <div>
            <p className="eyebrow">{t('yourResults')}</p>
            <h2>{t('radarProfileGapsAndNext')}</h2>
            <p>
              {t('mvpResultsAreIndicativeNot')}
            </p>
            <div className="hero-actions">
              <button className="primary light" onClick={() => setStep('onboarding')}>{t('tryFreeFlow')}</button>
              <button className="secondary invert" onClick={() => setStep('premiumOnboarding')}>{t('tryPremiumDiagnostic')}</button>
            </div>
          </div>
          <div className="mock-result">
            <RadarChart
              scores={{ D1: 72, D2: 68, D3: 46, D4: 58, D5: 64, D6: 76 }}
              selectedDomain={selectedPreviewDomain}
              onSelectDomain={setSelectedPreviewDomain}
            />
            <div className="preview-domain-drilldown">
              <span>{tc(selectedPreviewDomain ?? '')} · {tc(domains[selectedPreviewDomain].name)}</span>
              <strong>{t('competencyMap')}</strong>
              <div>
                {previewDomainCompetencies.map((competency) => (
                  <p key={competency.id}>
                    <b>{tc(competency.label)}</b>
                    <small>{competency.skills.slice(0, 3).map(tc).join(', ')}</small>
                  </p>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="section premium-section">
          <div>
            <p className="eyebrow">{t('premiumAssessment')}</p>
            <h2>{t('deeperDiagnosisForPeopleWho')}</h2>
            <p>
              {t('theMvpPremiumPilotAdds')}
            </p>
          </div>
          <div className="premium-grid">
            {[t('functionContext'), t('industryScenarios'), t('leadershipRoleContext'), t('premiumLearningPlan')].map((item) => (
              <article className="info-card" key={item}>
                <h3>{tc(item)}</h3>
                <p>{t('pilotGradeNowDesignedFor')}</p>
              </article>
            ))}
          </div>
          <div className="hero-actions">
            <button className="primary" onClick={() => setStep('premiumOnboarding')}>{t('startPremiumDiagnostic')}</button>
          </div>
        </section>
          </div>
        </section>
      </>
    </>
  );
}
