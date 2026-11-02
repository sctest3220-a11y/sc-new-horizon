'use client';

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
          <p className="eyebrow">{mode === 'executive' ? 'Premium leadership diagnostic' : mode === 'premium' ? 'Premium diagnostic pilot' : mode === 'practice' ? 'Practice activity result' : 'Indicative MVP result'}</p>
          <h1>{results.overall}</h1>
          <p className="result-level">{results.level} AI readiness</p>
          <p>
            Based on {answers.length} {mode === 'practice' ? 'practice activity' : 'adaptive responses'} for {mode === 'executive' ? executiveLabels[executiveRole].toLowerCase() : audienceLabels[audience].toLowerCase()}.
            Evidence confidence is pilot-grade: {results.confidence}%.
          </p>
          <p className="context-line">{getScoreBandDescription(results.overall, results.level)}</p>
          {mode === 'premium' && (
            <p className="context-line">
              Context: {functionLabels[functionTrack]} in {industryLabels[industryTrack].toLowerCase()}.
            </p>
          )}
          {mode === 'executive' && (
            <p className="context-line">
              Context: {executiveLabels[executiveRole]} profile, weighted toward D5 strategy, D4 governance, and D6 change leadership.
            </p>
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
      <div className="report-tabs" role="tablist" aria-label="Assessment report sections">
        <button
          type="button"
          role="tab"
          aria-selected={reportTab === 'report'}
          className={reportTab === 'report' ? 'selected' : ''}
          onClick={() => setReportTab('report')}
        >
          Summary
        </button>
        {paidReport && reportAccessSettings.paid.questionAnalysis && (<button
          type="button"
          role="tab"
          aria-selected={reportTab === 'analysis'}
          className={reportTab === 'analysis' ? 'selected' : ''}
          onClick={() => setReportTab('analysis')}
        >
          Question review
        </button>)}
      </div>
      {!paidReport && <article className="result-card wide report-locked-card"><p className="eyebrow">More insight available</p><h2>Unlock the detailed assessment report</h2><p>Your basic report includes your score and practical next steps. Detailed question analysis, benchmarks, and advanced recommendations can be enabled for paid users by the administrator.</p></article>}
      <div className={`result-grid ${reportTab === 'analysis' ? 'show-analysis' : 'show-report'} ${paidReport ? 'plan-paid' : 'plan-free'} ${paidReport && reportAccessSettings.paid.questionAnalysis ? 'report-access-analysis' : 'report-access-no-analysis'}`}>
        <article className="result-card wide comparison-note report-primary report-order-summary">
          <h2>Score interpretation</h2>
          <div className="evidence-grid">
            <p><strong>Your score</strong> A sampled readiness estimate, not a validated psychometric score. Unsampled domains no longer add a midpoint floor.</p>
            <p><strong>Group average</strong> {groupAverageProfile ? `${groupAverageProfile.detail} for ${scoreGroup.label.toLowerCase()}.` : `No saved ${scoreGroup.label.toLowerCase()} yet; this run will start the group average.`}</p>
            <p><strong>Target profile</strong> Research-informed target for {mode === 'executive' ? executiveLabels[executiveRole].toLowerCase() : mode === 'premium' ? `${functionLabels[functionTrack].toLowerCase()} in ${industryLabels[industryTrack].toLowerCase()}` : audienceLabels[audience].toLowerCase()}. Built from cited competency, workforce, governance, and Thailand-readiness sources; not a validated norm yet.</p>
          </div>
        </article>
        <article className="result-card wide score-calculation-card analysis-primary">
          <div className="report-heading">
            <div>
              <p className="eyebrow">Score calculation</p>
              <h2>How this result was derived</h2>
            </div>
            <span>{answers.length} answered item{answers.length === 1 ? '' : 's'}</span>
          </div>
          <div className="calculation-summary-grid">
            <p><strong>Question</strong> Raw answer score comes from selected option, rubric hits, matching, ranking, multi-select, or mini-part scores.</p>
            <p><strong>Difficulty</strong> Raw score is converted into readiness evidence using the item difficulty band.</p>
            <p><strong>Competency</strong> Competency score is the average readiness evidence for all signals mapped to that competency.</p>
            <p><strong>Domain</strong> Domain score is readiness points divided by evidence count. Secondary domains count at 0.35 weight.</p>
            <p><strong>Assessment</strong> Domain average is {Object.values(results.domainScores).join(' + ')} / 6 = {results.domainAverage}. Domains with no sampled evidence are shown as Not assessed in the scorecard; the MVP formula still includes them as 0 until the route collects enough evidence, so the report should recommend continuation instead of treating the score as final. Answer quality average is {results.answerQuality.rawAverage}/100, applying a {Math.round(results.answerQuality.factor * 100)}% evidence factor. Final score: {results.domainAverage} × {Math.round(results.answerQuality.factor * 100)}% = {results.overall}.</p>
            <p><strong>Timing/confidence</strong> Time, hesitation, item `a/b/c`, information, and SEM are shown as telemetry and calibration signals; they do not directly change the score yet.</p>
          </div>
          <details className="calculation-details" open>
            <summary>Question-level calculation</summary>
            <div className="calculation-table">
              {questionScoreCalculations.map((row, index) => {
                const answer = answers[index];
                return (
                  <div key={`${row.questionId}-${index}`}>
                    <span>Q{index + 1}</span>
                    <strong>{row.domain} · {difficultyLabels[row.difficulty]} · {row.interaction}</strong>
                    <b>{row.rawScore} raw {'->'} {row.readinessScore} readiness</b>
                    <small>{row.calculation}</small>
                    {answer && (
                      <>
                        <p><strong>Question</strong> {answer.question.prompt}</p>
                        <p><strong>Your answer</strong> {answer.textResponse?.trim() || answer.option.label}</p>
                        <p><strong>Expected evidence</strong> {getCorrectAnswerSummary(answer.question)}</p>
                        <p><strong>Why it scored this way</strong> {answer.option.feedback}</p>
                      </>
                    )}
                    <p><strong>Measured</strong> {row.competencies}</p>
                  </div>
                );
              })}
            </div>
          </details>
          <details className="calculation-details" open>
            <summary>Domain roll-up</summary>
            <div className="calculation-table domain-calculation-table">
              {domainScoreCalculations.map((row) => (
                <div key={row.domain}>
                  <span>{row.domain}</span>
                  <strong>{domains[row.domain].short}</strong>
                  <b>{row.score}/100</b>
                  <small>{row.calculation}</small>
                  <p>{row.count ? `${row.points} readiness points across ${row.count} weighted evidence signal${row.count === 1 ? '' : 's'}.` : 'No sampled evidence in this run.'}</p>
                </div>
              ))}
            </div>
          </details>
          <details className="calculation-details">
            <summary>Competency roll-up</summary>
            <div className="calculation-table competency-calculation-table">
              {competencyScores.filter((competency) => competency.evidenceCount > 0).map((competency) => (
                <div key={competency.id}>
                  <span>{competency.domain}</span>
                  <strong>{competency.label}</strong>
                  <b>{competency.score}/100</b>
                  <small>{competency.evidenceCount} evidence · {competency.confidence} confidence</small>
                  <p>Average readiness evidence from mapped question signals.</p>
                </div>
              ))}
            </div>
          </details>
        </article>
        <article className="result-card wide did-you-know-report analysis-primary">
          <div>
            <p className="eyebrow">Did you know?</p>
            <h2>{personalizedDidYouKnow.topic}</h2>
            <p>{personalizedDidYouKnow.fact}</p>
            <small>{personalizedDidYouKnow.whyItMatters}</small>
          </div>
          <div className="did-you-know-actions">
            <button className="primary" type="button" onClick={() => followDidYouKnow(personalizedDidYouKnow)}>Learn more</button>
            <button className="secondary dark" type="button" onClick={() => openProfileSurvey(mode === 'practice' ? 'free' : mode)}>Improve personalization</button>
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
              <p>{continuationRecommendation.questionCount} targeted questions can improve the score estimate and competency evidence.</p>
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
                  Continue recommended route
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
                >
                  Choose {selectedRadarDomain} deep dive
                </button>
              </div>
            </div>
            <div className="continuation-summary">
              <span>{continuationTargets.confidenceIds.length} confidence targets</span>
              <span>{continuationTargets.priorityGapIds.length} profile-priority gaps</span>
              <span>{continuationTargets.domainIds.length} {selectedRadarDomain} follow-ups</span>
            </div>
          </article>
        )}
        {showEvidenceCompletionPanel && (
          <article className="result-card wide continuation-panel prominent recommended report-primary report-order-continuation">
            <div>
              <p className="eyebrow">Evidence completion</p>
              <h2>Continue beyond 20 until confidence is high</h2>
              <p>{evidenceCompletion.summary}</p>
              <div className="continue-reasons">
                <span>{evidenceCompletion.unsampled} relevant competencies unsampled</span>
                <span>{evidenceCompletion.lowConfidence} sampled competencies below high confidence</span>
                <span>{evidenceCompletion.remainingCapacity} question slots left before the safety cap</span>
              </div>
            </div>
            <div className="continuation-decision">
              <strong>Recommended if you want a fuller profile</strong>
              <p>The next batch targets planned and profile-priority competencies that still need repeated evidence.</p>
              <div className="continue-targets">
                {evidenceCompletion.targets.slice(0, 6).map((competency) => <span key={competency.id}>{competency.label}</span>)}
              </div>
              <div className="continuation-actions">
                <button type="button" className="primary" onClick={continueEvidenceCompletion}>
                  Add {evidenceCompletion.questionCount} evidence questions
                </button>
              </div>
            </div>
            <div className="continuation-summary">
              <span>{coveragePlan.prioritySampled}/{coveragePlan.priorityTotal} priority sampled</span>
              <span>{coveragePlan.plannedSampled}/{coveragePlan.plannedTotal} planned sampled</span>
              <span>{coveragePlan.sampled}/24 total competencies sampled</span>
            </div>
          </article>
        )}
        <article className="result-card wide leaderboard-card analysis-primary">
          <div className="report-heading">
            <div>
              <p className="eyebrow">Persona leaderboard</p>
              <h2>Top 10 · {cleanAverageLabel(scoreGroup.label)}</h2>
            </div>
            <span>{personaLeaderboard.length} ranked run{personaLeaderboard.length === 1 ? '' : 's'}</span>
          </div>
          <div className="leaderboard-list">
            {personaLeaderboard.length ? personaLeaderboard.map((entry) => (
              <div key={entry.id} className={entry.id === loggedResultId ? 'current' : ''}>
                <strong>#{entry.rank}</strong>
                <span>{entry.displayName}</span>
                <b>{entry.overall}/100</b>
                <small>{new Date(entry.createdAt).toLocaleDateString()}</small>
              </div>
            )) : <p>Your completed run will establish this persona leaderboard.</p>}
          </div>
          <p className="context-line">MVP ranks saved runs for the same persona on this device. Production should use consented server-side cohort records and privacy-safe display names.</p>
        </article>
        <article className="result-card wide telemetry-analysis-card analysis-primary">
          <div className="report-heading">
            <div>
              <p className="eyebrow">Telemetry and result analysis</p>
              <h2>What the assessment tracks and why</h2>
            </div>
            <span>Local MVP log</span>
          </div>
          <div className="telemetry-grid">
            <div>
              <h3>Currently tracked</h3>
              {telemetryAnalysis.trackedNow.map((item) => <p key={item}>{item}</p>)}
            </div>
            <div>
              <h3>Used for analysis</h3>
              {telemetryAnalysis.resultUse.map((item) => <p key={item}>{item}</p>)}
            </div>
            <div>
              <h3>Improve next</h3>
              {telemetryAnalysis.improvements.map((item) => <p key={item}>{item}</p>)}
            </div>
          </div>
          <p className="context-line">Agent suggestions should analyze survey feedback, item behavior, artifact zoom/open patterns, and cohort trends first. Human review remains required before changing scored content, artifacts, profile fields, or survey wording.</p>
        </article>
        <article id="assessment-feedback-survey" className="result-card wide assessment-feedback-gate report-primary report-order-survey">
          <div className="report-heading">
            <div>
              <p className="eyebrow">30-second feedback</p>
              <h2>{detailedAnalysisUnlocked ? 'Thanks. Your detailed evidence is unlocked.' : 'Help improve the assessment and unlock your detailed evidence.'}</h2>
            </div>
            <span>{detailedAnalysisUnlocked ? 'Unlocked' : 'Quick survey'}</span>
          </div>
          {!detailedAnalysisUnlocked ? (
            <>
              <p>Share whether the questions felt clear, realistic, and useful. In exchange, the report unlocks your question-by-question evidence, expected answers, timing, and local comparison data.</p>
              <div className="feedback-survey-grid">
                <label>Question clarity
                  <select value={feedbackDraft.clarity} onChange={(event) => setFeedbackDraft((draft) => ({ ...draft, clarity: event.target.value as AssessmentFeedbackSurvey['clarity'] }))}>
                    <option value="clear">Clear</option><option value="mixed">Some were unclear</option><option value="confusing">Confusing</option>
                  </select>
                </label>
                <label>Difficulty
                  <select value={feedbackDraft.difficultyFit} onChange={(event) => setFeedbackDraft((draft) => ({ ...draft, difficultyFit: event.target.value as AssessmentFeedbackSurvey['difficultyFit'] }))}>
                    <option value="right">About right</option><option value="too-easy">Too easy</option><option value="too-hard">Too hard</option>
                  </select>
                </label>
                <label>Artifacts
                  <select value={feedbackDraft.artifactQuality} onChange={(event) => setFeedbackDraft((draft) => ({ ...draft, artifactQuality: event.target.value as AssessmentFeedbackSurvey['artifactQuality'] }))}>
                    <option value="realistic">Realistic and relevant</option><option value="mixed">Mixed quality</option><option value="poor">Poor or irrelevant</option>
                  </select>
                </label>
                <label>Assessment length
                  <select value={feedbackDraft.lengthFit} onChange={(event) => setFeedbackDraft((draft) => ({ ...draft, lengthFit: event.target.value as AssessmentFeedbackSurvey['lengthFit'] }))}>
                    <option value="right">About right</option><option value="short">Too short</option><option value="long">Too long</option>
                  </select>
                </label>
              </div>
              <label className="written-response">Suggestions for improvement
                <textarea value={feedbackDraft.suggestions} onChange={(event) => setFeedbackDraft((draft) => ({ ...draft, suggestions: event.target.value }))} placeholder="Optional: name a confusing question, unrealistic artifact, or missing topic." />
              </label>
              <button className="primary" type="button" onClick={submitAssessmentFeedback}>Submit feedback and unlock analysis</button>
            </>
          ) : (
            <>
              <p>Your feedback is saved for item-quality review. You can now open Test analysis to inspect how each question contributed to the result.</p>
              <button className="secondary dark" type="button" onClick={() => setReportTab('analysis')}>Open detailed analysis</button>
            </>
          )}
        </article>
        <article className="result-card wide assessment-feedback-gate analysis-primary">
          <div className="report-heading">
            <div>
              <p className="eyebrow">Question-level analysis</p>
              <h2>{detailedAnalysisUnlocked ? 'Your detailed evidence is unlocked.' : 'Feedback unlock required.'}</h2>
            </div>
            <span>{detailedAnalysisUnlocked ? 'Unlocked' : 'Locked'}</span>
          </div>
          {!detailedAnalysisUnlocked ? (
            <>
              <p>Complete the quick feedback survey in the Report tab to unlock your question-by-question evidence, expected answers, timing, and local comparison data.</p>
              <button className="primary" type="button" onClick={() => setReportTab('report')}>Go to feedback survey</button>
            </>
          ) : (
            <div className="question-analysis-list">
              {answers.map((answer, index) => {
                const benchmark = questionBenchmarks[answer.question.id];
                return (
                  <details key={`${answer.question.id}-${index}`}>
                    <summary>
                      <span>{index + 1}</span>
                      <strong>{answer.question.domain} · {difficultyLabels[answer.question.difficulty]} · {answer.question.interaction ?? 'single'}</strong>
                      <b>{getReadinessScore(answer.option.score, answer.question.difficulty)}/100</b>
                      <small>{formatDuration(answer.behavior?.durationMs)} · {answer.behavior?.hesitation ?? 'timing unavailable'}</small>
                    </summary>
                    <p><strong>Question:</strong> {answer.question.prompt}</p>
                    <p><strong>Your answer:</strong> {answer.textResponse?.trim() || answer.option.label}</p>
                    <p><strong>Expected evidence:</strong> {getCorrectAnswerSummary(answer.question)}</p>
                    <p><strong>Measured:</strong> {getQuestionMeasures(answer.question).map((competency) => competency.label).join(', ')}</p>
                    <p><strong>Behavior:</strong> {answer.behavior?.interactionCount ?? 0} interactions, {answer.behavior?.revisionCount ?? 0} revisions.</p>
                    <p><strong>Local comparison:</strong> {benchmark ? `${benchmark.averageScore}/100 average across ${benchmark.attempts} attempt${benchmark.attempts === 1 ? '' : 's'}; ${formatDuration(benchmark.averageDurationMs)} average time.` : 'No comparison data yet.'}</p>
                  </details>
                );
              })}
            </div>
          )}
        </article>
        <article className="result-card wide ai-generated-report report-primary report-order-generated">
          <div className="report-heading">
            <div>
              <p className="eyebrow">Personalized AI report</p>
              <h2>{generatedReport.headline}</h2>
            </div>
            <span>{cleanAverageLabel(scoreGroup.label)}</span>
          </div>
          <p>{generatedReport.summary}</p>
          <div className="report-section">
            <h3>What this means</h3>
            <div className="evidence-grid">
              {generatedReport.analysis.map((item) => <p key={item}>{item}</p>)}
            </div>
          </div>
        </article>
        <article className="result-card wide report-primary report-order-domain">
          <h2>Domain scorecard</h2>
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
                  <strong>{assessed ? `${results.domainScores[domain]}/100` : 'Not assessed'}</strong>
                  {assessed ? <meter min="0" max="100" value={results.domainScores[domain]} /> : <div className="unassessed-meter" aria-label="Not assessed" />}
                  <small>{assessed ? (gap > 0 ? `${gap} points below target` : 'At or above target') : 'No question sampled this domain yet'}</small>
                </button>
              );
            })}
          </div>
        </article>
        <article className="result-card wide coverage-plan analysis-primary">
          <h2>Assessment coverage plan</h2>
          <p>{coveragePlan.testFrame}</p>
          <div className="coverage-stats">
            <div>
              <span>Profile</span>
              <strong>{coveragePlan.contextLabel}</strong>
            </div>
            <div>
              <span>Sampled</span>
              <strong>{coveragePlan.sampled}/24</strong>
            </div>
            <div>
              <span>Role priority</span>
              <strong>{coveragePlan.prioritySampled}/{coveragePlan.priorityTotal}</strong>
            </div>
            <div>
              <span>Planned route</span>
              <strong>{coveragePlan.plannedSampled}/{coveragePlan.plannedTotal}</strong>
            </div>
          </div>
          <div className="domain-target-grid" aria-label="Profile domain targets">
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
          <h2>User profile signals</h2>
          {userProfileSurvey ? (
            <>
              <p>
                Latest profile context: <strong>{userProfileSurvey.context}</strong>. These tags can personalize question routing,
                artifact selection, course recommendations, and cohort analytics.
              </p>
              <div className="profile-tag-grid">
                {userProfileSurvey.tags.map((tag) => <span key={tag}>{tag}</span>)}
              </div>
            </>
          ) : (
            <p>No optional profile survey saved yet. The assessment can still run, but personalization will rely only on selected audience, function, industry, or role.</p>
          )}
        </article>
        <article className="result-card wide analysis-primary">
          <h2>Domain evidence quality</h2>
          <div className="domain-evidence-grid">
            {domainEvidenceSummary.map((item) => (
              <button
                key={item.domain}
                type="button"
                className={selectedRadarDomain === item.domain ? 'selected' : ''}
                onClick={() => selectReportDomain(item.domain, 'domain')}
              >
                <span>{item.domain} · {domains[item.domain].short}</span>
                <strong>{item.evidenceCount ? `${item.score}/100` : 'Not sampled'}</strong>
                <p>{Number(item.evidenceCount.toFixed(2))} evidence signal{item.evidenceCount === 1 ? '' : 's'} · {item.confidence}</p>
              </button>
            ))}
          </div>
        </article>
        <article className="result-card wide domain-drilldown report-primary report-order-competencies">
          <h2>{domains[selectedRadarDomain].name} competency drilldown</h2>
          <p>{selectedRadarDomain} · {domains[selectedRadarDomain].name}</p>
          <div className="drilldown-domain-tabs" aria-label="Choose a domain for competency drilldown">
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
                  <b>{competency.evidenceCount ? `${competency.score}/100` : 'Not sampled'}</b>
                  <small>{competency.statusLabel} · {competency.evidenceCount} evidence · {competency.confidence} confidence</small>
                </summary>
                <p>{competency.rationale} Skills: {competency.skills.join(', ')}</p>
              </details>
            ))}
          </div>
        </article>
        <article className="result-card wide score-analytics analysis-primary">
          <h2>Saved score analytics</h2>
          <div className="evidence-grid">
            <p><strong>Saved runs</strong> {scoreLogAnalytics.totalRuns} completed assessment run{scoreLogAnalytics.totalRuns === 1 ? '' : 's'} on this device.</p>
            <p><strong>Individual profiles</strong> {scoreLogAnalytics.individualProfiles || 'No'} local profile{scoreLogAnalytics.individualProfiles === 1 ? '' : 's'} with saved signals.</p>
            <p><strong>Question signals</strong> {scoreLogAnalytics.signalSnapshots || 'No'} item-level signal snapshot{scoreLogAnalytics.signalSnapshots === 1 ? '' : 's'} saved for trend analysis.</p>
            <p><strong>Average overall</strong> {scoreLogAnalytics.totalRuns ? `${scoreLogAnalytics.averageOverall}/100` : 'No saved score distribution yet.'}</p>
            <p><strong>Stored dimensions</strong> Anonymous profile ID, survey tags, audience, function, industry, executive role, domain scores, competency scores, evidence-mode scores, question difficulty, item type, assessment mode, date, and group key.</p>
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
          <h2>Strengths</h2>
          {results.strongest.filter((domain) => assessedDomains.includes(domain)).map((domain) => (
            <p key={domain}><strong>{domains[domain].short}</strong> {results.domainScores[domain]}/100</p>
          ))}
          {!results.strongest.some((domain) => assessedDomains.includes(domain)) && <p>Not enough sampled evidence yet. Continue the test to establish strengths.</p>}
        </article>
        <article className="result-card report-primary report-order-gaps">
          <h2>Priority gaps</h2>
          {results.weakest.map((domain) => (
            <p key={domain}><strong>{domains[domain].short}</strong> {assessedDomains.includes(domain) ? `${results.domainScores[domain]}/100` : 'Not assessed yet'}</p>
          ))}
        </article>
        <article className="result-card wide analysis-primary">
          <h2>Knowledge vs practical skill</h2>
          <div className="evidence-mode-grid">
            {evidenceModeSummary.map((item) => (
              <div key={item.mode}>
                <span>{item.label}</span>
                <strong>{item.count ? `${item.score}/100` : 'Not sampled'}</strong>
                <p>{item.count} scored signal{item.count === 1 ? '' : 's'}</p>
              </div>
            ))}
          </div>
        </article>
        <article className="result-card wide analysis-primary">
          <h2>Readiness badges</h2>
          <div className="badge-grid">
            {earnedBadges.map((badge) => (
              <div key={badge.domain} className={badge.earned ? 'earned' : ''}>
                <span>{badge.earned ? 'Earned' : 'In progress'}</span>
                <strong>{badge.title}</strong>
                <p>{badge.domain} · {badge.score}/100 · {badge.detail}</p>
              </div>
            ))}
          </div>
        </article>
        <article className="result-card wide analysis-primary">
          <h2>Competency and skill scores</h2>
          <div className="competency-table">
            {coveragePlan.coverage.map((competency) => (
              <details key={competency.id} open={competency.evidenceCount > 0 && competency.score < 65}>
                <summary>
                  <span>{competency.domain}</span>
                  <strong>{competency.label}</strong>
                  <b>{competency.evidenceCount ? `${competency.score}/100` : 'Not sampled'}</b>
                  <small>{competency.statusLabel} · {competency.evidenceCount} evidence · {competency.confidence} confidence</small>
                </summary>
                <p>{competency.rationale} Skills: {competency.skills.join(', ')}</p>
              </details>
            ))}
          </div>
        </article>
        <article className="result-card wide report-primary report-order-learning">
          <h2>{mode === 'executive' ? 'Executive learning path' : mode === 'premium' ? 'Premium learning path' : 'Recommended learning path'}</h2>
          <div className="personalized-exploration">
            <div>
              <span>Tools to explore</span>
              <div className="profile-tag-grid">
                {personalizedExploration.tools.map((tool) => <span key={tool}>{tool}</span>)}
              </div>
            </div>
            <div>
              <span>Concepts to strengthen</span>
              <div className="profile-tag-grid">
                {personalizedExploration.concepts.map((concept) => <span key={concept}>{concept}</span>)}
              </div>
            </div>
            <div>
              <span>Practice next</span>
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
                <span>{bootcamp.duration} · {bootcamp.level} workshop</span>
                <strong>{bootcamp.title}</strong>
                <p>{bootcamp.whyTakeIt}</p>
              </div>
            ))}
          </div>
        </article>
        <article className="result-card wide report-primary report-order-courses">
          <h2>Thailand course recommendations</h2>
          <div className="course-list">
            {courseRecommendations.map((course) => (
              <article key={course.id}>
                <div>
                  <span>{course.provider} · {course.level}</span>
                  <h3><a href={course.url} target="_blank" rel="noreferrer">{course.title}</a></h3>
                  <p>{course.fit}</p>
                </div>
                <dl>
                  <div><dt>Format</dt><dd>{course.format}</dd></div>
                  <div><dt>Price</dt><dd>{course.price}</dd></div>
                  <div><dt>Maps to</dt><dd>{course.domains.join(', ')} · {course.skills.slice(0, 4).join(', ')}</dd></div>
                </dl>
              </article>
            ))}
          </div>
        </article>
        <article className="result-card wide report-primary report-order-bootcamps">
          <h2>Recommended bootcamps and workshops</h2>
          <p className="context-line">
            Suggested when the assessment shows a skill gap that needs guided practice, team alignment, or role-specific workflow design.
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
                  <p><strong>For who</strong> {bootcamp.forWho}</p>
                  <p><strong>Why take it</strong> {bootcamp.whyTakeIt}</p>
                  <div>
                    <strong>Expected learning outputs</strong>
                    <ul>
                      {bootcamp.expectedOutputs.map((output) => <li key={output}>{output}</li>)}
                    </ul>
                  </div>
                  <div>
                    <strong>Workshop labs</strong>
                    <ul>
                      {bootcamp.labs.map((lab) => <li key={lab}>{lab}</li>)}
                    </ul>
                  </div>
                  <p><strong>Framework alignment</strong> {bootcamp.mappedFrameworks.join('; ')}</p>
                  <p><strong>Best fit roles</strong> {bootcamp.roles.join(', ')}</p>
                </div>
              </details>
            ))}
          </div>
        </article>
        <article className="result-card wide analysis-primary">
          <h2>Where to improve next</h2>
          <div className="improvement-brief">
            {improvementBrief.map((item) => (
              <div key={item.domain}>
                <span>{item.domain} · {domains[item.domain].name}</span>
                <strong>{item.score}/100 now · target {item.target}/100</strong>
                <p>{item.gapText}: {item.action}</p>
              </div>
            ))}
          </div>
        </article>
        {(mode === 'premium' || mode === 'executive') && (
          <article className="result-card wide analysis-primary">
            <h2>Evidence summary</h2>
            <div className="evidence-grid">
              <p><strong>Adaptive coverage</strong> {mode === 'executive' ? 'Executive-weighted D5/D4/D6 coverage plus D1-D3 calibration checks.' : 'D1-D6 sampled with extra attention to low-confidence domains.'}</p>
              <p><strong>Scenario context</strong> {mode === 'executive' ? `Recommendations tuned for ${executiveLabels[executiveRole].toLowerCase()} oversight decisions.` : `Recommendations tuned for ${functionLabels[functionTrack].toLowerCase()} and ${industryLabels[industryTrack].toLowerCase()}.`}</p>
              <p><strong>Target status</strong> Research-informed targets are role/audience-weighted and source-backed. Group averages come from saved New Horizon runs on this device.</p>
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
        <aside className="feedback-nudge-card" aria-label="Feedback invitation">
          <button
            type="button"
            className="nudge-close"
            aria-label="Dismiss feedback invitation"
            onClick={() => setFeedbackPromptOpen(false)}
          >
            &times;
          </button>
          <span>30-second exchange</span>
          <strong>Unlock your detailed evidence trail</strong>
          <p>Answer 4 quick feedback questions to see your response, expected evidence, time spent, difficulty, and local comparison for each item.</p>
          <div className="profile-pulse-actions">
            <button type="button" className="secondary dark" onClick={() => setFeedbackPromptOpen(false)}>Later</button>
            <button
              type="button"
              className="primary"
              onClick={() => {
                setFeedbackPromptOpen(false);
                document.getElementById('assessment-feedback-survey')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }}
            >
              Give feedback
            </button>
          </div>
        </aside>
      )}
      <div className="upgrade-panel">
        <div>
          <h2>Ready for a deeper profile?</h2>
          <p>Unlock skill-level analysis, role context, multimodal review, and premium diagnostic continuation.</p>
        </div>
        <div className="hero-actions">
          <button className="primary" onClick={() => mode === 'practice' ? showHomeSection('labs') : startAssessment(mode)}>
            {mode === 'practice' ? 'Back to Activities' : `Retake ${mode === 'executive' ? 'Executive' : mode === 'premium' ? 'Premium' : 'Free'} Assessment`}
          </button>
          {mode === 'practice' && <button className="secondary dark" onClick={() => setStep('onboarding')}>Start Full Free Assessment</button>}
          {mode === 'free' && <button className="secondary dark" onClick={() => setStep('premiumOnboarding')}>Start Premium Diagnostic</button>}
          {mode === 'premium' && <button className="secondary dark" onClick={() => setStep('onboarding')}>Try Free Version</button>}
        </div>
      </div>
    </section>
  );
}
