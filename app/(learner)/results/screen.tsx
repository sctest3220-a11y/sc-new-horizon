'use client';

import { useTranslations } from 'next-intl';
import {
  type AssessmentFeedbackSurvey,
  CompetencyRadar,
  type DomainId,
  RadarChart,
  audienceLabels,
  cleanAverageLabel,
  difficultyLabels,
  domains,
  executiveLabels,
  formatDuration,
  functionLabels,
  getCorrectAnswerSummary,
  getQuestionMeasures,
  getReadinessScore,
  getScoreBandDescription,
  getTargetScore,
  industryLabels,
  targetEvidenceSources,
} from '../../learner-app';
import { useApp, useRequireFlowState } from '../../learner-app-context';

export default function ResultsScreen() {
  const t = useTranslations('results');
  const {
    activeLearningCatalog,
    answers,
    appendBehaviorEvent,
    assessedDomains,
    audience,
    bootcampRecommendations,
    competencyScores,
    continuationRecommendation,
    continuationTargets,
    continueAssessment,
    continueEvidenceCompletion,
    courseRecommendations,
    coveragePlan,
    detailedAnalysisUnlocked,
    domainEvidenceById,
    domainEvidenceSummary,
    domainScoreCalculations,
    earnedBadges,
    evidenceCompletion,
    evidenceModeSummary,
    executiveRole,
    feedbackDraft,
    feedbackPromptOpen,
    followDidYouKnow,
    functionTrack,
    generatedReport,
    groupAverageProfile,
    improvementBrief,
    industryTrack,
    loggedResultId,
    mode,
    openProfileSurvey,
    paidReport,
    personaLeaderboard,
    personalizedDidYouKnow,
    personalizedExploration,
    profileDomainTargets,
    questionBenchmarks,
    questionScoreCalculations,
    radarProfiles,
    reportAccessSettings,
    reportTab,
    results,
    scoreGroup,
    scoreLogAnalytics,
    selectReportDomain,
    selectedDomainCompetencies,
    selectedRadarDomain,
    setFeedbackDraft,
    setFeedbackPromptOpen,
    setReportTab,
    setSelectedRadarDomain,
    setStep,
    showContinuationPanel,
    showEvidenceCompletionPanel,
    showHomeSection,
    startAssessment,
    submitAssessmentFeedback,
    telemetryAnalysis,
    userProfileSurvey,
  } = useApp();
  useRequireFlowState(answers.length > 0, '/assessment');

  return (
    <section className="results-shell">
      <div className="results-hero">
        <div>
          <p className="eyebrow">{mode === 'executive' ? t('premiumLeadershipDiagnostic') : mode === 'premium' ? t('premiumDiagnosticPilot') : mode === 'practice' ? t('practiceActivityResult') : t('indicativeMvpResult')}</p>
          <h1>{results.overall}</h1>
          <p className="result-level">{t('aiReadiness', { level: results.level })}</p>
          <p>{t('basedOnForEvidenceConfidence', { count: answers.length, responseKind: mode === 'practice' ? t('practiceActivity') : t('adaptiveResponses'), audience: mode === 'executive' ? executiveLabels[executiveRole].toLowerCase() : audienceLabels[audience].toLowerCase(), confidence: results.confidence })}</p>
          <p className="context-line">{getScoreBandDescription(results.overall, results.level)}</p>
          {mode === 'premium' && (
            <p className="context-line">{t('contextIn', { functionLabel: functionLabels[functionTrack], industry: industryLabels[industryTrack].toLowerCase() })}</p>
          )}
          {mode === 'executive' && (
            <p className="context-line">{t('contextProfileWeightedTowardD5', { executiveLabel: executiveLabels[executiveRole] })}</p>
          )}
        </div>
        <RadarChart
          scores={results.domainScores}
          benchmarks={radarProfiles}
          assessedDomains={assessedDomains}
          selectedDomain={selectedRadarDomain}
          onSelectDomain={setSelectedRadarDomain}
        />
      </div>
      <div className="report-tabs" role="tablist" aria-label={t('assessmentReportSections')}>
        <button
          type="button"
          role="tab"
          aria-selected={reportTab === 'report'}
          className={reportTab === 'report' ? 'selected' : ''}
          onClick={() => setReportTab('report')}
        >
          {t('summary')}
        </button>
        {paidReport && reportAccessSettings.paid.questionAnalysis && (<button
          type="button"
          role="tab"
          aria-selected={reportTab === 'analysis'}
          className={reportTab === 'analysis' ? 'selected' : ''}
          onClick={() => setReportTab('analysis')}
        >
          {t('questionReview')}
        </button>)}
      </div>
      {!paidReport && <article className="result-card wide report-locked-card"><p className="eyebrow">{t('moreInsightAvailable')}</p><h2>{t('unlockTheDetailedAssessmentReport')}</h2><p>{t('yourBasicReportIncludesYour')}</p></article>}
      <div className={`result-grid ${reportTab === 'analysis' ? 'show-analysis' : 'show-report'} ${paidReport ? 'plan-paid' : 'plan-free'} ${paidReport && reportAccessSettings.paid.questionAnalysis ? 'report-access-analysis' : 'report-access-no-analysis'}`}>
        <article className="result-card wide comparison-note report-primary report-order-summary">
          <h2>{t('scoreInterpretation')}</h2>
          <div className="evidence-grid">
            <p>{t.rich('yourScoreASampledReadiness', { strong: (chunks) => <strong>{chunks}</strong> })}</p>
            <p><strong>{t('groupAverage')}</strong> {groupAverageProfile ? `${groupAverageProfile.detail} for ${scoreGroup.label.toLowerCase()}.` : `No saved ${scoreGroup.label.toLowerCase()} yet; this run will start the group average.`}</p>
            <p>{t.rich('targetProfileResearchInformedTarget', { strong: (chunks) => <strong>{chunks}</strong>, profile: mode === 'executive' ? executiveLabels[executiveRole].toLowerCase() : mode === 'premium' ? `${functionLabels[functionTrack].toLowerCase()} in ${industryLabels[industryTrack].toLowerCase()}` : audienceLabels[audience].toLowerCase() })}</p>
          </div>
        </article>
        <article className="result-card wide score-calculation-card analysis-primary">
          <div className="report-heading">
            <div>
              <p className="eyebrow">{t('scoreCalculation')}</p>
              <h2>{t('howThisResultWasDerived')}</h2>
            </div>
            <span>{t('answeredItem', { count: answers.length })}</span>
          </div>
          <div className="calculation-summary-grid">
            <p>{t.rich('questionRawAnswerScoreComes', { strong: (chunks) => <strong>{chunks}</strong> })}</p>
            <p>{t.rich('difficultyRawScoreIsConverted', { strong: (chunks) => <strong>{chunks}</strong> })}</p>
            <p>{t.rich('competencyCompetencyScoreIsThe', { strong: (chunks) => <strong>{chunks}</strong> })}</p>
            <p>{t.rich('domainDomainScoreIsReadiness', { strong: (chunks) => <strong>{chunks}</strong> })}</p>
            <p>{t.rich('assessmentDomainAverageIs6', { strong: (chunks) => <strong>{chunks}</strong>, domainScores: Object.values(results.domainScores).join(' + '), domainAverage: results.domainAverage, rawAverage: results.answerQuality.rawAverage, evidenceFactor: Math.round(results.answerQuality.factor * 100), overall: results.overall })}</p>
            <p>{t.rich('timingConfidenceTimeHesitationItem', { strong: (chunks) => <strong>{chunks}</strong> })}</p>
          </div>
          <details className="calculation-details" open>
            <summary>{t('questionLevelCalculation')}</summary>
            <div className="calculation-table">
              {questionScoreCalculations.map((row, index) => {
                const answer = answers[index];
                return (
                  <div key={`${row.questionId}-${index}`}>
                    <span>Q{index + 1}</span>
                    <strong>{row.domain} · {difficultyLabels[row.difficulty]} · {row.interaction}</strong>
                    <b>{t('rawReadiness', { rawScore: row.rawScore, readinessScore: row.readinessScore })}</b>
                    <small>{row.calculation}</small>
                    {answer && (
                      <>
                        <p><strong>{t('question')}</strong> {answer.question.prompt}</p>
                        <p><strong>{t('yourAnswer')}</strong> {answer.textResponse?.trim() || answer.option.label}</p>
                        <p><strong>{t('expectedEvidence')}</strong> {getCorrectAnswerSummary(answer.question)}</p>
                        <p><strong>{t('whyItScoredThisWay')}</strong> {answer.option.feedback}</p>
                      </>
                    )}
                    <p><strong>{t('measured')}</strong> {row.competencies}</p>
                  </div>
                );
              })}
            </div>
          </details>
          <details className="calculation-details" open>
            <summary>{t('domainRollUp')}</summary>
            <div className="calculation-table domain-calculation-table">
              {domainScoreCalculations.map((row) => (
                <div key={row.domain}>
                  <span>{row.domain}</span>
                  <strong>{domains[row.domain].short}</strong>
                  <b>{row.score}/100</b>
                  <small>{row.calculation}</small>
                  <p>{row.count ? `${row.points} readiness points across ${row.count} weighted evidence signal${row.count === 1 ? '' : 's'}.` : t('noSampledEvidenceInThis')}</p>
                </div>
              ))}
            </div>
          </details>
          <details className="calculation-details">
            <summary>{t('competencyRollUp')}</summary>
            <div className="calculation-table competency-calculation-table">
              {competencyScores.filter((competency) => competency.evidenceCount > 0).map((competency) => (
                <div key={competency.id}>
                  <span>{competency.domain}</span>
                  <strong>{competency.label}</strong>
                  <b>{competency.score}/100</b>
                  <small>{t('evidenceConfidence', { evidenceCount: competency.evidenceCount, confidence: competency.confidence })}</small>
                  <p>{t('averageReadinessEvidenceFromMapped')}</p>
                </div>
              ))}
            </div>
          </details>
        </article>
        <article className="result-card wide did-you-know-report analysis-primary">
          <div>
            <p className="eyebrow">{t('didYouKnow')}</p>
            <h2>{personalizedDidYouKnow.topic}</h2>
            <p>{personalizedDidYouKnow.fact}</p>
            <small>{personalizedDidYouKnow.whyItMatters}</small>
          </div>
          <div className="did-you-know-actions">
            <button className="primary" type="button" onClick={() => followDidYouKnow(personalizedDidYouKnow)}>{t('learnMore')}</button>
            <button className="secondary dark" type="button" onClick={() => openProfileSurvey(mode === 'practice' ? 'free' : mode)}>{t('improvePersonalization')}</button>
          </div>
        </article>
        {showContinuationPanel && (
          <article className={`result-card wide continuation-panel prominent report-primary report-order-continuation ${continuationRecommendation.urgency}`}>
            <div>
              <p className="eyebrow">{continuationRecommendation.kicker}</p>
              <h2>{continuationRecommendation.headline}</h2>
              <p>{continuationRecommendation.summary}</p>
              <div className="continue-reasons">
                {continuationRecommendation.reasons.map((reason) => <span key={reason}>{reason}</span>)}
              </div>
            </div>
            <div className="continuation-decision">
              <strong>{continuationRecommendation.confidenceLabel}: {results.confidence}%</strong>
              <p>{t('targetedQuestionsCanImproveThe', { questionCount: continuationRecommendation.questionCount })}</p>
              {continuationRecommendation.targetLabels.length > 0 && (
                <div className="continue-targets">
                  {continuationRecommendation.targetLabels.map((label) => <span key={label}>{label}</span>)}
                </div>
              )}
              <div className="continuation-actions">
                <button
                  type="button"
                  className="primary"
                  onClick={() => continueAssessment(continuationRecommendation.route, continuationRecommendation.questionCount)}
                >
                  {t('continueRecommendedRoute')}
                </button>
                <button
                  type="button"
                  className="secondary dark"
                  onClick={() => continueAssessment({
                    kind: 'domain',
                    label: `${selectedRadarDomain} deep dive`,
                    targetDomain: selectedRadarDomain,
                    targetCompetencyIds: continuationTargets.domainIds,
                  })}
                >{t('chooseDeepDive', { selectedRadarDomain: selectedRadarDomain })}</button>
              </div>
            </div>
            <div className="continuation-summary">
              <span>{t('confidenceTargets', { length: continuationTargets.confidenceIds.length })}</span>
              <span>{t('profilePriorityGaps', { length: continuationTargets.priorityGapIds.length })}</span>
              <span>{t('followUps', { length: continuationTargets.domainIds.length, selectedRadarDomain: selectedRadarDomain })}</span>
            </div>
          </article>
        )}
        {showEvidenceCompletionPanel && (
          <article className="result-card wide continuation-panel prominent recommended report-primary report-order-continuation">
            <div>
              <p className="eyebrow">{t('evidenceCompletion')}</p>
              <h2>{t('continueBeyond20UntilConfidence')}</h2>
              <p>{evidenceCompletion.summary}</p>
              <div className="continue-reasons">
                <span>{t('relevantCompetenciesUnsampled', { unsampled: evidenceCompletion.unsampled })}</span>
                <span>{t('sampledCompetenciesBelowHighConfidence', { lowConfidence: evidenceCompletion.lowConfidence })}</span>
                <span>{t('questionSlotsLeftBeforeThe', { remainingCapacity: evidenceCompletion.remainingCapacity })}</span>
              </div>
            </div>
            <div className="continuation-decision">
              <strong>{t('recommendedIfYouWantA')}</strong>
              <p>{t('theNextBatchTargetsPlanned')}</p>
              <div className="continue-targets">
                {evidenceCompletion.targets.slice(0, 6).map((competency) => <span key={competency.id}>{competency.label}</span>)}
              </div>
              <div className="continuation-actions">
                <button type="button" className="primary" onClick={continueEvidenceCompletion}>{t('addEvidenceQuestions', { questionCount: evidenceCompletion.questionCount })}</button>
              </div>
            </div>
            <div className="continuation-summary">
              <span>{t('prioritySampled', { prioritySampled: coveragePlan.prioritySampled, priorityTotal: coveragePlan.priorityTotal })}</span>
              <span>{t('plannedSampled', { plannedSampled: coveragePlan.plannedSampled, plannedTotal: coveragePlan.plannedTotal })}</span>
              <span>{t('n24TotalCompetenciesSampled', { sampled: coveragePlan.sampled })}</span>
            </div>
          </article>
        )}
        <article className="result-card wide leaderboard-card analysis-primary">
          <div className="report-heading">
            <div>
              <p className="eyebrow">{t('personaLeaderboard')}</p>
              <h2>{t('top10', { cleanAverageLabel: cleanAverageLabel(scoreGroup.label) })}</h2>
            </div>
            <span>{t('rankedRun', { count: personaLeaderboard.length })}</span>
          </div>
          <div className="leaderboard-list">
            {personaLeaderboard.length ? personaLeaderboard.map((entry) => (
              <div key={entry.id} className={entry.id === loggedResultId ? 'current' : ''}>
                <strong>#{entry.rank}</strong>
                <span>{entry.displayName}</span>
                <b>{entry.overall}/100</b>
                <small>{new Date(entry.createdAt).toLocaleDateString()}</small>
              </div>
            )) : <p>{t('yourCompletedRunWillEstablish')}</p>}
          </div>
          <p className="context-line">{t('mvpRanksSavedRunsFor')}</p>
        </article>
        <article className="result-card wide telemetry-analysis-card analysis-primary">
          <div className="report-heading">
            <div>
              <p className="eyebrow">{t('telemetryAndResultAnalysis')}</p>
              <h2>{t('whatTheAssessmentTracksAnd')}</h2>
            </div>
            <span>{t('localMvpLog')}</span>
          </div>
          <div className="telemetry-grid">
            <div>
              <h3>{t('currentlyTracked')}</h3>
              {telemetryAnalysis.trackedNow.map((item) => <p key={item}>{item}</p>)}
            </div>
            <div>
              <h3>{t('usedForAnalysis')}</h3>
              {telemetryAnalysis.resultUse.map((item) => <p key={item}>{item}</p>)}
            </div>
            <div>
              <h3>{t('improveNext')}</h3>
              {telemetryAnalysis.improvements.map((item) => <p key={item}>{item}</p>)}
            </div>
          </div>
          <p className="context-line">{t('agentSuggestionsShouldAnalyzeSurvey')}</p>
        </article>
        <article id="assessment-feedback-survey" className="result-card wide assessment-feedback-gate report-primary report-order-survey">
          <div className="report-heading">
            <div>
              <p className="eyebrow">{t('n30SecondFeedback')}</p>
              <h2>{detailedAnalysisUnlocked ? t('thanksYourDetailedEvidenceIs') : t('helpImproveTheAssessmentAnd')}</h2>
            </div>
            <span>{detailedAnalysisUnlocked ? t('unlocked') : t('quickSurvey')}</span>
          </div>
          {!detailedAnalysisUnlocked ? (
            <>
              <p>{t('shareWhetherTheQuestionsFelt')}</p>
              <div className="feedback-survey-grid">
                <label>{t.rich('questionClarity', { select: () => <select value={feedbackDraft.clarity} onChange={(event) => setFeedbackDraft((draft) => ({ ...draft, clarity: event.target.value as AssessmentFeedbackSurvey['clarity'] }))}>
                    <option value="clear">{t('clear')}</option><option value="mixed">{t('someWereUnclear')}</option><option value="confusing">{t('confusing')}</option>
                  </select> })}</label>
                <label>{t.rich('difficulty2', { select: () => <select value={feedbackDraft.difficultyFit} onChange={(event) => setFeedbackDraft((draft) => ({ ...draft, difficultyFit: event.target.value as AssessmentFeedbackSurvey['difficultyFit'] }))}>
                    <option value="right">{t('aboutRight')}</option><option value="too-easy">{t('tooEasy')}</option><option value="too-hard">{t('tooHard')}</option>
                  </select> })}</label>
                <label>{t.rich('artifacts', { select: () => <select value={feedbackDraft.artifactQuality} onChange={(event) => setFeedbackDraft((draft) => ({ ...draft, artifactQuality: event.target.value as AssessmentFeedbackSurvey['artifactQuality'] }))}>
                    <option value="realistic">{t('realisticAndRelevant')}</option><option value="mixed">{t('mixedQuality')}</option><option value="poor">{t('poorOrIrrelevant')}</option>
                  </select> })}</label>
                <label>{t.rich('assessmentLength', { select: () => <select value={feedbackDraft.lengthFit} onChange={(event) => setFeedbackDraft((draft) => ({ ...draft, lengthFit: event.target.value as AssessmentFeedbackSurvey['lengthFit'] }))}>
                    <option value="right">{t('aboutRight')}</option><option value="short">{t('tooShort')}</option><option value="long">{t('tooLong')}</option>
                  </select> })}</label>
              </div>
              <label className="written-response">{t.rich('suggestionsForImprovement', { textarea: () => <textarea value={feedbackDraft.suggestions} onChange={(event) => setFeedbackDraft((draft) => ({ ...draft, suggestions: event.target.value }))} placeholder={t('optionalNameAConfusingQuestion')} /> })}</label>
              <button className="primary" type="button" onClick={submitAssessmentFeedback}>{t('submitFeedbackAndUnlockAnalysis')}</button>
            </>
          ) : (
            <>
              <p>{t('yourFeedbackIsSavedFor')}</p>
              <button className="secondary dark" type="button" onClick={() => setReportTab('analysis')}>{t('openDetailedAnalysis')}</button>
            </>
          )}
        </article>
        <article className="result-card wide assessment-feedback-gate analysis-primary">
          <div className="report-heading">
            <div>
              <p className="eyebrow">{t('questionLevelAnalysis')}</p>
              <h2>{detailedAnalysisUnlocked ? t('yourDetailedEvidenceIsUnlocked') : t('feedbackUnlockRequired')}</h2>
            </div>
            <span>{detailedAnalysisUnlocked ? t('unlocked') : t('locked')}</span>
          </div>
          {!detailedAnalysisUnlocked ? (
            <>
              <p>{t('completeTheQuickFeedbackSurvey')}</p>
              <button className="primary" type="button" onClick={() => setReportTab('report')}>{t('goToFeedbackSurvey')}</button>
            </>
          ) : (
            <div className="question-analysis-list">
              {answers.map((answer, index) => {
                const benchmark = questionBenchmarks[answer.question.id];
                return (
                  <details key={`${answer.question.id}-${index}`}>
                    <summary>
                      <span>{index + 1}</span>
                      <strong>{answer.question.domain} · {difficultyLabels[answer.question.difficulty]} · {answer.question.interaction ?? t('single')}</strong>
                      <b>{getReadinessScore(answer.option.score, answer.question.difficulty)}/100</b>
                      <small>{formatDuration(answer.behavior?.durationMs)} · {answer.behavior?.hesitation ?? t('timingUnavailable')}</small>
                    </summary>
                    <p><strong>{t('question2')}</strong> {answer.question.prompt}</p>
                    <p><strong>{t('yourAnswer2')}</strong> {answer.textResponse?.trim() || answer.option.label}</p>
                    <p><strong>{t('expectedEvidence2')}</strong> {getCorrectAnswerSummary(answer.question)}</p>
                    <p><strong>{t('measured2')}</strong> {getQuestionMeasures(answer.question).map((competency) => competency.label).join(', ')}</p>
                    <p>{t.rich('behaviorInteractionsRevisions', { strong: (chunks) => <strong>{chunks}</strong>, interactions: answer.behavior?.interactionCount ?? 0, revisions: answer.behavior?.revisionCount ?? 0 })}</p>
                    <p><strong>{t('localComparison')}</strong> {benchmark ? `${benchmark.averageScore}/100 average across ${benchmark.attempts} attempt${benchmark.attempts === 1 ? '' : 's'}; ${formatDuration(benchmark.averageDurationMs)} average time.` : t('noComparisonDataYet')}</p>
                  </details>
                );
              })}
            </div>
          )}
        </article>
        <article className="result-card wide ai-generated-report report-primary report-order-generated">
          <div className="report-heading">
            <div>
              <p className="eyebrow">{t('personalizedAiReport')}</p>
              <h2>{generatedReport.headline}</h2>
            </div>
            <span>{cleanAverageLabel(scoreGroup.label)}</span>
          </div>
          <p>{generatedReport.summary}</p>
          <div className="report-section">
            <h3>{t('whatThisMeans')}</h3>
            <div className="evidence-grid">
              {generatedReport.analysis.map((item) => <p key={item}>{item}</p>)}
            </div>
          </div>
        </article>
        <article className="result-card wide report-primary report-order-domain">
          <h2>{t('domainScorecard')}</h2>
          <div className="demo-domain-grid">
            {(Object.keys(results.domainScores) as DomainId[]).map((domain) => {
              const target = getTargetScore(domain, radarProfiles);
              const gap = target - results.domainScores[domain];
              const evidence = domainEvidenceById[domain];
              const assessed = (evidence?.evidenceCount ?? 0) > 0;
              return (
                <button
                  key={domain}
                  className={selectedRadarDomain === domain ? 'selected' : ''}
                  type="button"
                  onClick={() => selectReportDomain(domain, 'radar')}
                >
                  <span style={{ color: selectedRadarDomain === domain ? undefined : domains[domain].color }}>{domain} · {domains[domain].short}</span>
                  <strong>{assessed ? `${results.domainScores[domain]}/100` : t('notAssessed')}</strong>
                  {assessed ? <meter min="0" max="100" value={results.domainScores[domain]} /> : <div className="unassessed-meter" aria-label={t('notAssessed')} />}
                  <small>{assessed ? (gap > 0 ? `${gap} points below target` : t('atOrAboveTarget')) : t('noQuestionSampledThisDomain')}</small>
                </button>
              );
            })}
          </div>
        </article>
        <article className="result-card wide coverage-plan analysis-primary">
          <h2>{t('assessmentCoveragePlan')}</h2>
          <p>{coveragePlan.testFrame}</p>
          <div className="coverage-stats">
            <div>
              <span>{t('profile')}</span>
              <strong>{coveragePlan.contextLabel}</strong>
            </div>
            <div>
              <span>{t('sampled')}</span>
              <strong>{coveragePlan.sampled}/24</strong>
            </div>
            <div>
              <span>{t('rolePriority')}</span>
              <strong>{coveragePlan.prioritySampled}/{coveragePlan.priorityTotal}</strong>
            </div>
            <div>
              <span>{t('plannedRoute')}</span>
              <strong>{coveragePlan.plannedSampled}/{coveragePlan.plannedTotal}</strong>
            </div>
          </div>
          <div className="domain-target-grid" aria-label={t('profileDomainTargets')}>
            {(Object.keys(domains) as DomainId[]).map((domain) => (
              <div key={domain}>
                <span>{domain}</span>
                <strong>{profileDomainTargets[domain]}</strong>
                <small>{domains[domain].short}</small>
              </div>
            ))}
          </div>
          <div className="coverage-grid">
            {coveragePlan.coverage.map((competency) => (
              <div key={competency.id} className={competency.status}>
                <span>{competency.domain}</span>
                <strong>{competency.label}</strong>
                <small>{competency.statusLabel}</small>
              </div>
            ))}
          </div>
        </article>
        <article className="result-card wide profile-insights analysis-primary">
          <h2>{t('userProfileSignals')}</h2>
          {userProfileSurvey ? (
            <>
              <p>{t.rich('latestProfileContextTheseTags', { strong: () => <strong>{userProfileSurvey.context}</strong> })}</p>
              <div className="profile-tag-grid">
                {userProfileSurvey.tags.map((tag) => <span key={tag}>{tag}</span>)}
              </div>
            </>
          ) : (
            <p>{t('noOptionalProfileSurveySaved')}</p>
          )}
        </article>
        <article className="result-card wide analysis-primary">
          <h2>{t('domainEvidenceQuality')}</h2>
          <div className="domain-evidence-grid">
            {domainEvidenceSummary.map((item) => (
              <button
                key={item.domain}
                type="button"
                className={selectedRadarDomain === item.domain ? 'selected' : ''}
                onClick={() => selectReportDomain(item.domain, 'domain')}
              >
                <span>{item.domain} · {domains[item.domain].short}</span>
                <strong>{item.evidenceCount ? `${item.score}/100` : t('notSampled')}</strong>
                <p>{t('evidenceSignal', { evidenceCount: Number(item.evidenceCount.toFixed(2)), confidence: item.confidence })}</p>
              </button>
            ))}
          </div>
        </article>
        <article className="result-card wide domain-drilldown report-primary report-order-competencies">
          <h2>{t('competencyDrilldown', { name: domains[selectedRadarDomain].name })}</h2>
          <p>{selectedRadarDomain} · {domains[selectedRadarDomain].name}</p>
          <div className="drilldown-domain-tabs" aria-label={t('chooseADomainForCompetency')}>
            {(Object.keys(domains) as DomainId[]).map((domain) => (
              <button
                key={domain}
                type="button"
                className={selectedRadarDomain === domain ? 'selected' : ''}
                onClick={() => selectReportDomain(domain, 'radar')}
              >
                <span>{domain}</span>
                <strong>{domains[domain].name}</strong>
              </button>
            ))}
          </div>
          <CompetencyRadar domain={selectedRadarDomain} competencies={selectedDomainCompetencies} />
          <div className="competency-table compact">
            {selectedDomainCompetencies.map((competency) => (
              <details key={competency.id} open={competency.evidenceCount > 0}>
                <summary onClick={() => appendBehaviorEvent({ type: 'report_interest', reportArea: 'competency', label: competency.label, domain: competency.domain })}>
                  <span>{competency.id}</span>
                  <strong>{competency.label}</strong>
                  <b>{competency.evidenceCount ? `${competency.score}/100` : t('notSampled')}</b>
                  <small>{t('evidenceConfidence2', { statusLabel: competency.statusLabel, evidenceCount: competency.evidenceCount, confidence: competency.confidence })}</small>
                </summary>
                <p>{t('skills', { rationale: competency.rationale, skills: competency.skills.join(', ') })}</p>
              </details>
            ))}
          </div>
        </article>
        <article className="result-card wide score-analytics analysis-primary">
          <h2>{t('savedScoreAnalytics')}</h2>
          <div className="evidence-grid">
            <p>{t.rich('savedRunsCompletedAssessmentRun', { strong: (chunks) => <strong>{chunks}</strong>, totalRuns: scoreLogAnalytics.totalRuns })}</p>
            <p>{t.rich('individualProfilesLocalProfileWith', { strong: (chunks) => <strong>{chunks}</strong>, count: scoreLogAnalytics.individualProfiles })}</p>
            <p>{t.rich('questionSignalsItemLevelSignal', { strong: (chunks) => <strong>{chunks}</strong>, count: scoreLogAnalytics.signalSnapshots })}</p>
            <p><strong>{t('averageOverall')}</strong> {scoreLogAnalytics.totalRuns ? `${scoreLogAnalytics.averageOverall}/100` : t('noSavedScoreDistributionYet')}</p>
            <p>{t.rich('storedDimensionsAnonymousProfileId', { strong: (chunks) => <strong>{chunks}</strong> })}</p>
          </div>
          <div className="analytics-chips">
            {scoreLogAnalytics.byMode.map((item) => (
              <span key={item.label}>{item.label}: {item.count}</span>
            ))}
            {scoreLogAnalytics.profileFields.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </article>
        <article className="result-card report-primary report-order-strengths">
          <h2>{t('strengths')}</h2>
          {results.strongest.filter((domain) => assessedDomains.includes(domain)).map((domain) => (
            <p key={domain}><strong>{domains[domain].short}</strong> {results.domainScores[domain]}/100</p>
          ))}
          {!results.strongest.some((domain) => assessedDomains.includes(domain)) && <p>{t('notEnoughSampledEvidenceYet')}</p>}
        </article>
        <article className="result-card report-primary report-order-gaps">
          <h2>{t('priorityGaps')}</h2>
          {results.weakest.map((domain) => (
            <p key={domain}><strong>{domains[domain].short}</strong> {assessedDomains.includes(domain) ? `${results.domainScores[domain]}/100` : t('notAssessedYet')}</p>
          ))}
        </article>
        <article className="result-card wide analysis-primary">
          <h2>{t('knowledgeVsPracticalSkill')}</h2>
          <div className="evidence-mode-grid">
            {evidenceModeSummary.map((item) => (
              <div key={item.mode}>
                <span>{item.label}</span>
                <strong>{item.count ? `${item.score}/100` : t('notSampled')}</strong>
                <p>{t('scoredSignal', { count: item.count })}</p>
              </div>
            ))}
          </div>
        </article>
        <article className="result-card wide analysis-primary">
          <h2>{t('readinessBadges')}</h2>
          <div className="badge-grid">
            {earnedBadges.map((badge) => (
              <div key={badge.domain} className={badge.earned ? 'earned' : ''}>
                <span>{badge.earned ? t('earned') : t('inProgress')}</span>
                <strong>{badge.title}</strong>
                <p>{badge.domain} · {badge.score}/100 · {badge.detail}</p>
              </div>
            ))}
          </div>
        </article>
        <article className="result-card wide analysis-primary">
          <h2>{t('competencyAndSkillScores')}</h2>
          <div className="competency-table">
            {coveragePlan.coverage.map((competency) => (
              <details key={competency.id} open={competency.evidenceCount > 0 && competency.score < 65}>
                <summary>
                  <span>{competency.domain}</span>
                  <strong>{competency.label}</strong>
                  <b>{competency.evidenceCount ? `${competency.score}/100` : t('notSampled')}</b>
                  <small>{t('evidenceConfidence2', { statusLabel: competency.statusLabel, evidenceCount: competency.evidenceCount, confidence: competency.confidence })}</small>
                </summary>
                <p>{t('skills', { rationale: competency.rationale, skills: competency.skills.join(', ') })}</p>
              </details>
            ))}
          </div>
        </article>
        <article className="result-card wide report-primary report-order-learning">
          <h2>{mode === 'executive' ? t('executiveLearningPath') : mode === 'premium' ? t('premiumLearningPath') : t('recommendedLearningPath')}</h2>
          <div className="personalized-exploration">
            <div>
              <span>{t('toolsToExplore')}</span>
              <div className="profile-tag-grid">
                {personalizedExploration.tools.map((tool) => <span key={tool}>{tool}</span>)}
              </div>
            </div>
            <div>
              <span>{t('conceptsToStrengthen')}</span>
              <div className="profile-tag-grid">
                {personalizedExploration.concepts.map((concept) => <span key={concept}>{concept}</span>)}
              </div>
            </div>
            <div>
              <span>{t('practiceNext')}</span>
              <div className="profile-tag-grid">
                {personalizedExploration.practice.map((activity) => <span key={activity}>{activity}</span>)}
              </div>
            </div>
          </div>
          <div className="learning-list">
            {results.weakest.map((domain) => (
              <div key={domain}>
                <span>{activeLearningCatalog[domain].format}</span>
                <strong>{activeLearningCatalog[domain].title}</strong>
                <p>{activeLearningCatalog[domain].detail}</p>
              </div>
            ))}
          </div>
          <div className="learning-list bootcamp-inline-list">
            {bootcampRecommendations.slice(0, 2).map((bootcamp) => (
              <div key={bootcamp.id}>
                <span>{t('workshop', { duration: bootcamp.duration, level: bootcamp.level })}</span>
                <strong>{bootcamp.title}</strong>
                <p>{bootcamp.whyTakeIt}</p>
              </div>
            ))}
          </div>
        </article>
        <article className="result-card wide report-primary report-order-courses">
          <h2>{t('thailandCourseRecommendations')}</h2>
          <div className="course-list">
            {courseRecommendations.map((course) => (
              <article key={course.id}>
                <div>
                  <span>{course.provider} · {course.level}</span>
                  <h3><a href={course.url} target="_blank" rel="noreferrer">{course.title}</a></h3>
                  <p>{course.fit}</p>
                </div>
                <dl>
                  <div><dt>{t('format')}</dt><dd>{course.format}</dd></div>
                  <div><dt>{t('price')}</dt><dd>{course.price}</dd></div>
                  <div><dt>{t('mapsTo')}</dt><dd>{course.domains.join(', ')} · {course.skills.slice(0, 4).join(', ')}</dd></div>
                </dl>
              </article>
            ))}
          </div>
        </article>
        <article className="result-card wide report-primary report-order-bootcamps">
          <h2>{t('recommendedBootcampsAndWorkshops')}</h2>
          <p className="context-line">
            {t('suggestedWhenTheAssessmentShows')}
          </p>
          <div className="bootcamp-list">
            {bootcampRecommendations.map((bootcamp, index) => (
              <details key={bootcamp.id} open={index === 0}>
                <summary>
                  <span>{bootcamp.duration} · {bootcamp.level}</span>
                  <strong>{bootcamp.title}</strong>
                  <b>{bootcamp.domains.join(', ')}</b>
                </summary>
                <div className="bootcamp-detail-grid">
                  <p><strong>{t('forWho')}</strong> {bootcamp.forWho}</p>
                  <p><strong>{t('whyTakeIt')}</strong> {bootcamp.whyTakeIt}</p>
                  <div>
                    <strong>{t('expectedLearningOutputs')}</strong>
                    <ul>
                      {bootcamp.expectedOutputs.map((output) => <li key={output}>{output}</li>)}
                    </ul>
                  </div>
                  <div>
                    <strong>{t('workshopLabs')}</strong>
                    <ul>
                      {bootcamp.labs.map((lab) => <li key={lab}>{lab}</li>)}
                    </ul>
                  </div>
                  <p><strong>{t('frameworkAlignment')}</strong> {bootcamp.mappedFrameworks.join('; ')}</p>
                  <p><strong>{t('bestFitRoles')}</strong> {bootcamp.roles.join(', ')}</p>
                </div>
              </details>
            ))}
          </div>
        </article>
        <article className="result-card wide analysis-primary">
          <h2>{t('whereToImproveNext')}</h2>
          <div className="improvement-brief">
            {improvementBrief.map((item) => (
              <div key={item.domain}>
                <span>{item.domain} · {domains[item.domain].name}</span>
                <strong>{t('n100NowTarget100', { score: item.score, target: item.target })}</strong>
                <p>{item.gapText}: {item.action}</p>
              </div>
            ))}
          </div>
        </article>
        {(mode === 'premium' || mode === 'executive') && (
          <article className="result-card wide analysis-primary">
            <h2>{t('evidenceSummary')}</h2>
            <div className="evidence-grid">
              <p><strong>{t('adaptiveCoverage')}</strong> {mode === 'executive' ? t('executiveWeightedD5D4D6') : t('d1D6SampledWithExtra')}</p>
              <p><strong>{t('scenarioContext')}</strong> {mode === 'executive' ? `Recommendations tuned for ${executiveLabels[executiveRole].toLowerCase()} oversight decisions.` : `Recommendations tuned for ${functionLabels[functionTrack].toLowerCase()} and ${industryLabels[industryTrack].toLowerCase()}.`}</p>
              <p>{t.rich('targetStatusResearchInformedTargets', { strong: (chunks) => <strong>{chunks}</strong> })}</p>
            </div>
            <div className="source-list">
              {targetEvidenceSources.map((source) => (
                <p key={source.label}>
                  <strong><a href={source.url} target="_blank" rel="noreferrer">{source.label}</a></strong>
                  {' '}{source.detail}
                </p>
              ))}
            </div>
          </article>
        )}
      </div>
      {reportTab === 'report' && !detailedAnalysisUnlocked && feedbackPromptOpen && (
        <aside className="feedback-nudge-card" aria-label={t('feedbackInvitation')}>
          <button
            type="button"
            className="nudge-close"
            aria-label={t('dismissFeedbackInvitation')}
            onClick={() => setFeedbackPromptOpen(false)}
          >
            &times;
          </button>
          <span>{t('n30SecondExchange')}</span>
          <strong>{t('unlockYourDetailedEvidenceTrail')}</strong>
          <p>{t('answer4QuickFeedbackQuestions')}</p>
          <div className="profile-pulse-actions">
            <button type="button" className="secondary dark" onClick={() => setFeedbackPromptOpen(false)}>{t('later')}</button>
            <button
              type="button"
              className="primary"
              onClick={() => {
                setFeedbackPromptOpen(false);
                document.getElementById('assessment-feedback-survey')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }}
            >
              {t('giveFeedback')}
            </button>
          </div>
        </aside>
      )}
      <div className="upgrade-panel">
        <div>
          <h2>{t('readyForADeeperProfile')}</h2>
          <p>{t('unlockSkillLevelAnalysisRole')}</p>
        </div>
        <div className="hero-actions">
          <button className="primary" onClick={() => mode === 'practice' ? showHomeSection('labs') : startAssessment(mode)}>
            {mode === 'practice' ? t('backToActivities') : `Retake ${mode === 'executive' ? 'Executive' : mode === 'premium' ? 'Premium' : 'Free'} Assessment`}
          </button>
          {mode === 'practice' && <button className="secondary dark" onClick={() => setStep('onboarding')}>{t('startFullFreeAssessment')}</button>}
          {mode === 'free' && <button className="secondary dark" onClick={() => setStep('premiumOnboarding')}>{t('startPremiumDiagnostic')}</button>}
          {mode === 'premium' && <button className="secondary dark" onClick={() => setStep('onboarding')}>{t('tryFreeVersion')}</button>}
        </div>
      </div>
    </section>
  );
}
