'use client';

import { useTranslations } from 'next-intl';
import {
  type DomainId,
  HelpBubble,
  StimulusFigure,
  VisualStimulusCard,
  allAssessmentItems,
  difficultyDescriptions,
  difficultyLabels,
  domains,
  estimateTheta,
  formatAbility,
  getAnswerPracticeCue,
  getAnsweredDomainCounts,
  getCalibrationSummary,
  getCorrectAnswerSummary,
  getEvidenceMode,
  getQuestionFocus,
  getQuestionMeasures,
  getRawScoreMethod,
  getRelianceChoice,
  getScoreExplanation,
  getTaskInstruction,
  localizeAnswerOption,
  localizeQuestion,
  optionDisplayLetter,
} from '../../../learner-app';
import { useApp, useRequireFlowState } from '../../../learner-app-context';

export default function AssessmentRunScreen() {
  const t = useTranslations('run');
  const {
    activeConfig,
    adaptiveReadout,
    answers,
    assessmentActive,
    appLanguage,
    assessmentDisplaySettings,
    chooseMatch,
    chooseOption,
    choosePartOption,
    continuationFocus,
    continuationRecommendation,
    continuationTargets,
    continueAfterFeedback,
    continueAssessment,
    continueEvidenceCompletion,
    current,
    currentDisplayStimulus,
    currentDisplayVisualStimulus,
    currentMeasures,
    currentSkills,
    difficultyMovement,
    displayedMatchChoices,
    displayedMatchPairs,
    displayedOptions,
    displayedPartOptions,
    displayedParts,
    draggedIndex,
    evidenceCompletion,
    lastAnswer,
    matchSelections,
    moveRankItem,
    multiSelected,
    partSelections,
    pendingQuestion,
    progress,
    questionLanguage,
    rankOrder,
    renderQuestionFeedback,
    results,
    selectedRadarDomain,
    setDraggedIndex,
    setAppLanguage,
    showContinuationPanel,
    showDraftThai,
    showEvidenceCompletionPanel,
    shownQuestion,
    step,
    submitMatches,
    submitMultiSelect,
    submitPartAnswers,
    submitRankOrder,
    submitTextAnswer,
    textResponse,
    toggleMultiOption,
    trackArtifactAction,
    updateTextResponse,
    useRelianceStage,
  } = useApp();
  useRequireFlowState(assessmentActive, '/assessment');

  return (
    <>
      {step === 'assessment' && current && (
        <section className="assessment-shell">
          <div className="assessment-workbench">
            <article className="question-card task-card" data-question-id={current.id}>
              <div className="task-toolbar">
                <div>
                  <p className="eyebrow">{activeConfig.label}</p>
                  <h1>{domains[current.domain].short}</h1>
                  {continuationFocus && <p className="context-line">{t('continuation', { label: continuationFocus.label })}</p>}
                </div>
                <div className="progress-block">
                  <span>{t.rich('questionOf', { progress: progress, totalQuestions: activeConfig.totalQuestions, HelpBubble: () => <HelpBubble label={t('telemetryHelpProgress')}>
                      {t('progressIsLoggedSoThe')}
                    </HelpBubble> })}</span>
                  <div className="progress-track"><span style={{ width: `${(progress / activeConfig.totalQuestions) * 100}%` }} /></div>
                  <div className="question-language-toggle" aria-label={t('questionLanguage')}>
                    <small>{t('questionLanguage')}</small>
                    <div>
                      {/* Switches and saves the language for the whole app, not just this question. */}
                      <button
                        type="button"
                        className={appLanguage === 'en' ? 'selected' : ''}
                        onClick={() => setAppLanguage('en')}
                        aria-pressed={appLanguage === 'en'}
                        aria-label={t('switchToEnglish')}
                      >
                        {t('en')}
                      </button>
                      <button
                        type="button"
                        className={appLanguage === 'th' ? 'selected' : ''}
                        onClick={() => setAppLanguage('th')}
                        aria-pressed={appLanguage === 'th'}
                        aria-label={t('switchToThai')}
                      >
                        {t('th')}
                      </button>
                    </div>
                    {appLanguage === 'th' && questionLanguage === 'en' && <small>{t('thaiTranslationUnavailableForThis')}</small>}
                  </div>
                </div>
              </div>
              {assessmentDisplaySettings.showQuestionMeta && <div className="question-meta">
                <span>
                  {current.domain}
                  <HelpBubble label={t('telemetryHelpDomain')}>
                    {t('domainIdentifiesWhichD1D6')}
                  </HelpBubble>
                </span>
                <span className={`difficulty-pill ${current.difficulty}`}>{t.rich('difficulty', { difficultyLabel: difficultyLabels[current.difficulty], HelpBubble: () => <HelpBubble label={t('telemetryHelpDifficulty')}>
                    {t('difficultyIsStoredWithThe')}
                  </HelpBubble> })}</span>
                <span>
                  {current.type}
                  <HelpBubble label={t('telemetryHelpItemType')}>
                    {t('itemTypeShowsWhetherThis')}
                  </HelpBubble>
                </span>
                <span>
                  {current.interaction ?? t('single')}
                  <HelpBubble label={t('telemetryHelpInteractionFormat')}>
                    {t('interactionFormatHelpsCompareSingle')}
                  </HelpBubble>
                </span>
              </div>}
              {assessmentDisplaySettings.showTelemetry && <div className="live-telemetry-strip" aria-label={t('liveTelemetryHelp')}>
                <span>{t.rich('timeOnQuestion', { HelpBubble: () => <HelpBubble label={t('telemetryHelpTimeOnQuestion')}>
                    {t('timeIsUsedToSpot')}
                  </HelpBubble> })}</span>
                <span>{t.rich('answerInteractions', { HelpBubble: () => <HelpBubble label={t('telemetryHelpAnswerInteractions')}>
                    {t('clicksSelectionsRevisionsAndText')}
                  </HelpBubble> })}</span>
                <span>{t.rich('artifactUse', { HelpBubble: () => <HelpBubble label={t('telemetryHelpArtifactUse')}>
                    {t('openingZoomingOrLaunchingArtifacts')}
                  </HelpBubble> })}</span>
              </div>}
              {assessmentDisplaySettings.showFocus && <div className="question-focus-strip">
                <span>{t('task', { difficultyLabel: difficultyLabels[current.difficulty] })}</span>
                <strong>{getQuestionFocus(current)}</strong>
                <small>{difficultyDescriptions[current.difficulty]}</small>
              </div>}
              {assessmentDisplaySettings.showScoredEvidence && <details className="measure-details">
                <summary>
                  <span>{t('scoredEvidence')}</span>
                  <strong>
                    {getEvidenceMode(current)} · {currentMeasures.map((measure) => measure.domain).join(' / ')}
                    <HelpBubble label={t('telemetryHelpScoredEvidence')}>
                      {t('scoredEvidenceRecordsWhetherThe')}
                    </HelpBubble>
                  </strong>
                </summary>
                <div className="measure-grid">
                  {currentMeasures.map((measure) => (
                    <div key={measure.id}>
                      <span>{measure.domain}</span>
                      <strong>{measure.label}</strong>
                      <p>{measure.skills.slice(0, 3).join(', ')}</p>
                    </div>
                  ))}
                </div>
                <div className="skill-chip-row" aria-label={t('scoredSkillTags')}>
                  {currentSkills.map((skill) => <span key={skill}>{skill}</span>)}
                </div>
              </details>}
              {useRelianceStage && current.type === 'reliance-decision' && (
                <div className="reliance-stage">
                  <div>
                    {currentDisplayStimulus && <StimulusFigure stimulus={currentDisplayStimulus} onArtifactAction={(action, zoomLevel) => trackArtifactAction(current, action, zoomLevel)} />}
                    {!currentDisplayStimulus && shownQuestion.visualStimulus && <VisualStimulusCard stimulus={shownQuestion.visualStimulus} />}
                    {!currentDisplayStimulus && currentDisplayVisualStimulus && <VisualStimulusCard stimulus={currentDisplayVisualStimulus} />}
                  </div>
                  <div className="reliance-prompt">
                    <span>{t('makeTheCall')}</span>
                    <h2>{shownQuestion.prompt}</h2>
                    <div className="reliance-options" aria-label={t('relianceDecision')}>
                      {displayedOptions.map((option) => {
                        const choice = getRelianceChoice(option);
                        return (
                          <button key={option.id} className={`reliance-choice ${option.id}`} onClick={() => chooseOption(option)}>
                            <span>{choice.label}</span>
                            <strong>{choice.detail}</strong>
                          </button>
                        );
                      })}
                    </div>
                    <p>{shownQuestion.context}</p>
                  </div>
                </div>
              )}
              {!useRelianceStage && (
                <>
                  <div className="task-brief">
                    <span>{t('taskBrief')}</span>
                    <p>{getTaskInstruction(current)}</p>
                  </div>
                  <div className="scenario-panel">
                    <span>{t('scenario')}</span>
                    <p className="context">{shownQuestion.context}</p>
                    {(currentDisplayStimulus || shownQuestion.visualStimulus || currentDisplayVisualStimulus) && (
                      <div className="scenario-artifact" aria-label={t('evidenceEmbeddedInTheQuestion')}>
                        {currentDisplayStimulus && <StimulusFigure stimulus={currentDisplayStimulus} onArtifactAction={(action, zoomLevel) => trackArtifactAction(current, action, zoomLevel)} />}
                        {!currentDisplayStimulus && shownQuestion.visualStimulus && <VisualStimulusCard stimulus={shownQuestion.visualStimulus} />}
                        {!currentDisplayStimulus && currentDisplayVisualStimulus && <VisualStimulusCard stimulus={currentDisplayVisualStimulus} />}
                      </div>
                    )}
                    <h2>{shownQuestion.prompt}</h2>
                  </div>
                </>
              )}
              {(current.interaction ?? 'single') === 'single' && !useRelianceStage && (
                <div className="options">
                  {displayedOptions.map((option, index) => (
                    <button key={option.id} onClick={() => chooseOption(option)}>
                      <span>{optionDisplayLetter(index)}</span>
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
              {current.interaction === 'multi' && (
                <div className="interaction-panel">
                  <div className="options multi-options">
                    {displayedOptions.map((option, index) => (
                      <button
                        key={option.id}
                        className={multiSelected.includes(option.id) ? 'selected' : ''}
                        onClick={() => toggleMultiOption(option.id)}
                        aria-pressed={multiSelected.includes(option.id)}
                      >
                        <span>{optionDisplayLetter(index)}</span>
                        {option.label}
                      </button>
                    ))}
                  </div>
                  <button className="primary submit-answer" onClick={submitMultiSelect}>{t('submitSelectedAnswers')}</button>
                </div>
              )}
              {current.interaction === 'rank' && (
                <div className="interaction-panel">
                  <div className="rank-list" aria-label={t('dragOrderResponse')}>
                    {rankOrder.map((itemId, index) => {
                      const item = shownQuestion.rankItems?.find((rankItem) => rankItem.id === itemId);
                      return (
                        <div
                          className="rank-item"
                          draggable
                          key={itemId}
                          onDragStart={() => setDraggedIndex(index)}
                          onDragOver={(event) => event.preventDefault()}
                          onDrop={() => {
                            if (draggedIndex !== null) moveRankItem(draggedIndex, index);
                          }}
                        >
                          <span>{index + 1}</span>
                          <strong>{item?.label}</strong>
                          <div>
                            <button onClick={() => moveRankItem(index, index - 1)} aria-label={t('moveItemUp', { item: item?.label ?? '' })}>{t('up')}</button>
                            <button onClick={() => moveRankItem(index, index + 1)} aria-label={t('moveItemDown', { item: item?.label ?? '' })}>{t('down')}</button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <button className="primary submit-answer" onClick={submitRankOrder}>{t('submitOrder')}</button>
                </div>
              )}
              {current.interaction === 'match' && (
                <div className="interaction-panel">
                  <div className="match-list">
                    {displayedMatchPairs.map((pair) => (
                      <label className="match-row" key={pair.id}>
                        <span>{pair.left}</span>
                        <select
                          value={matchSelections[pair.id] ?? ''}
                          onChange={(event) => chooseMatch(pair.id, event.target.value)}
                        >
                          <option value="">{t('chooseMatch')}</option>
                          {(displayedMatchChoices[pair.id] ?? pair.choices).map((choice) => (
                            <option key={choice} value={choice}>{choice}</option>
                          ))}
                        </select>
                      </label>
                    ))}
                  </div>
                  <button className="primary submit-answer" onClick={submitMatches}>{t('submitMatches')}</button>
                </div>
              )}
              {current.interaction === 'parts' && (
                <div className="interaction-panel">
                  <div className="part-list">
                    {displayedParts.map((part, partIndex) => (
                      <section className="part-card" key={part.id}>
                        <div className="part-header">
                          <span>{t('part', { number: partIndex + 1 })}</span>
                          <strong>{part.domain} · {domains[part.domain].short}</strong>
                        </div>
                        <p>{part.prompt}</p>
                        <div className="options part-options">
                          {(displayedPartOptions[part.id] ?? part.options).map((option, optionIndex) => (
                            <button
                              key={option.id}
                              className={partSelections[part.id] === option.id ? 'selected' : ''}
                              onClick={() => choosePartOption(part.id, option.id)}
                              aria-pressed={partSelections[part.id] === option.id}
                            >
                              <span>{optionDisplayLetter(optionIndex)}</span>
                              {option.label}
                            </button>
                          ))}
                        </div>
                      </section>
                    ))}
                  </div>
                  <button
                    className="primary submit-answer"
                    onClick={submitPartAnswers}
                    disabled={(current.parts ?? []).some((part) => !partSelections[part.id])}
                  >
                    {t('submitMiniParts')}
                  </button>
                </div>
              )}
              {current.interaction === 'text' && (
                <div className="interaction-panel">
                  <label className="written-response">
                    <span>{t('yourWrittenAnswer')}</span>
                    <textarea
                      value={textResponse}
                      onChange={(event) => updateTextResponse(event.target.value)}
                      placeholder={t('write35SentencesExplaining')}
                    />
                  </label>
                  <button className="primary submit-answer" onClick={submitTextAnswer} disabled={!textResponse.trim()}>{t('submitWrittenAnswer')}</button>
                </div>
              )}
              {renderQuestionFeedback(current)}
            </article>
            {assessmentDisplaySettings.showPsychometrics && <aside className="adaptive-panel" aria-label={t('adaptivePsychometricIndicators')}>
              <div className={`adaptive-card difficulty-card ${current.difficulty}`}>
                <span>{t.rich('currentItemDifficulty', { HelpBubble: () => <HelpBubble label={t('telemetryHelpCurrentItemDifficulty')}>
                    {t('currentDifficultyIsTheSeeded')}
                  </HelpBubble> })}</span>
                <strong>{difficultyLabels[current.difficulty]}</strong>
                <p>{difficultyDescriptions[current.difficulty]}</p>
              </div>
              <div className="adaptive-card highlight">
                <span>{t.rich('abilityEstimateTheta', { HelpBubble: () => <HelpBubble label={t('telemetryHelpTheta')}>
                    {t('thetaIsAPilotAbility')}
                  </HelpBubble> })}</span>
                <strong>{formatAbility(adaptiveReadout.theta)}</strong>
                <p>{t('pilotEstimateFromAnsweredItems', { answeredCount: adaptiveReadout.answeredCount })}</p>
              </div>
              <div className="indicator-grid">
                <div>
                  <span>{t.rich('targetLevel', { HelpBubble: () => <HelpBubble label={t('telemetryHelpTargetLevel')}>{t('targetLevelIsTheNext')}</HelpBubble> })}</span>
                  <strong>{adaptiveReadout.targetDifficulty}</strong>
                </div>
                <div>
                  <span>{t.rich('itemB', { HelpBubble: () => <HelpBubble label={t('telemetryHelpItemDifficultyB')}>{t('itemBIsTheSeeded')}</HelpBubble> })}</span>
                  <strong>{formatAbility(adaptiveReadout.b)}</strong>
                </div>
                <div>
                  <span>{t.rich('itemA', { HelpBubble: () => <HelpBubble label={t('telemetryHelpItemDiscriminationA')}>{t('itemAEstimatesHowStrongly')}</HelpBubble> })}</span>
                  <strong>{adaptiveReadout.a.toFixed(2)}</strong>
                </div>
                <div>
                  <span>{t.rich('guessC', { HelpBubble: () => <HelpBubble label={t('telemetryHelpGuessingC')}>{t('guessCIsTheEstimated')}</HelpBubble> })}</span>
                  <strong>{adaptiveReadout.c.toFixed(2)}</strong>
                </div>
                <div>
                  <span>{t.rich('info', { HelpBubble: () => <HelpBubble label={t('telemetryHelpItemInformation')}>{t('informationEstimatesHowUsefulThis')}</HelpBubble> })}</span>
                  <strong>{adaptiveReadout.information}</strong>
                </div>
                <div>
                  <span>{t.rich('sem', { HelpBubble: () => <HelpBubble label={t('telemetryHelpStandardError')}>{t('semIsStandardErrorOf')}</HelpBubble> })}</span>
                  <strong>{adaptiveReadout.sem}</strong>
                </div>
              </div>
              <div className="adaptive-card">
                <span>{t.rich('whyThisQuestion', { HelpBubble: () => <HelpBubble label={t('telemetryHelpRoutingReason')}>
                    {t('routingCombinesPriorScoreDifficulty')}
                  </HelpBubble> })}</span>
                <p>{adaptiveReadout.adaptationReason}</p>
              </div>
              <div className="adaptive-card">
                <span>{t.rich('coveragePressure', { HelpBubble: () => <HelpBubble label={t('telemetryHelpCoverageConfidence')}>
                    {t('coverageConfidenceEstimatesWhetherEnough')}
                  </HelpBubble> })}</span>
                <p>{t('nextTargetConfidence', { targetDomain: adaptiveReadout.targetDomain, short: domains[adaptiveReadout.targetDomain].short, confidence: adaptiveReadout.confidence })}</p>
              </div>
              <div className="domain-meter-list">
                {(Object.keys(domains) as DomainId[]).map((domain) => {
                  const answeredInDomain = getAnsweredDomainCounts(answers)[domain].count;
                  return (
                    <div key={domain}>
                      <span>{domain}</span>
                      <div><i style={{ width: `${Math.min(100, answeredInDomain * 34)}%`, background: domains[domain].color }} /></div>
                      <strong>{answeredInDomain}</strong>
                    </div>
                  );
                })}
              </div>
            </aside>}
          </div>
        </section>
      )}
      {step === 'feedback' && lastAnswer && (
        <section className="assessment-shell">
          <div className="feedback-workbench">
            <article className="feedback-card">
              <p className="eyebrow">{t('answerReview')}</p>
              {assessmentDisplaySettings.showAnswerReveal ? <>
                <h1>{lastAnswer.option.score}/100</h1>
                <p className="result-level">{lastAnswer.option.score >= 82 ? t('strongEvidence') : lastAnswer.option.score >= 64 ? t('partialEvidence') : t('needsReview')}</p>
              </> : <p className="result-level">{t('answerRecordedContinueWhenYou')}</p>}
              {assessmentDisplaySettings.showAnswerReveal && <div className="score-explanation-panel" aria-label={t('scoreExplanation')}>
                <span>{t('scoreExplanation')}</span>
                <p>{getRawScoreMethod(lastAnswer)}</p>
                {getScoreExplanation(lastAnswer).map((item) => <p key={item}>{item}</p>)}
                <p><strong>{t('practiceCue')}</strong> {getAnswerPracticeCue(lastAnswer)}</p>
              </div>}
              {assessmentDisplaySettings.showAnswerReveal && <div className="feedback-grid">
                <div>
                  <span>{t('yourAnswer')}</span>
                  <p>{lastAnswer.textResponse || localizeAnswerOption(lastAnswer, appLanguage, showDraftThai).label}</p>
                </div>
                <div>
                  <span>{t('expectedAnswer')}</span>
                  <p>{getCorrectAnswerSummary(localizeQuestion(lastAnswer.question, appLanguage, showDraftThai))}</p>
                </div>
              </div>}
              {assessmentDisplaySettings.showAnswerReveal && <div className="rubric-panel">
                <span>{t('rubricAndCalibration')}</span>
                <p>{getCalibrationSummary(lastAnswer.question, lastAnswer)}</p>
                <p>{localizeAnswerOption(lastAnswer, appLanguage, showDraftThai).feedback}</p>
              </div>}
              {assessmentDisplaySettings.showAnswerReveal && assessmentDisplaySettings.showScoredEvidence && <div className="rubric-panel">
                <span>{t('measuredCompetencies')}</span>
                <div className="measure-grid compact">
                  {getQuestionMeasures(lastAnswer.question).map((measure) => (
                    <div key={measure.id}>
                      <span>{measure.domain}</span>
                      <strong>{measure.label}</strong>
                      <p>{measure.skills.slice(0, 3).join(', ')}</p>
                    </div>
                  ))}
                </div>
              </div>}
              {assessmentDisplaySettings.showAnswerReveal && lastAnswer.question.rubricCriteria && (
                <div className="criterion-list">
                  {lastAnswer.question.rubricCriteria.map((criterion) => {
                    const hit = lastAnswer.rubricHits?.some((rubricHit) => rubricHit.id === criterion.id);
                    return (
                      <div key={criterion.id} className={hit ? 'hit' : ''}>
                        <span>{hit ? t('detected') : t('missing')}</span>
                        <strong>{criterion.label}</strong>
                        <small>{t('pts', { points: criterion.points })}</small>
                      </div>
                    );
                  })}
                </div>
              )}
              {assessmentDisplaySettings.showAnswerReveal && renderQuestionFeedback(lastAnswer.question, 'reveal')}
              {!pendingQuestion && showContinuationPanel && (
                <div className={`continue-callout ${continuationRecommendation.urgency}`}>
                  <p className="eyebrow">{continuationRecommendation.kicker}</p>
                  <h2>{continuationRecommendation.headline}</h2>
                  <p>{continuationRecommendation.summary}</p>
                  <div className="continue-reasons">
                    {continuationRecommendation.reasons.map((reason) => <span key={reason}>{reason}</span>)}
                  </div>
                  {continuationRecommendation.targetLabels.length > 0 && (
                    <div className="continue-targets">
                      <strong>{t('nextFocus')}</strong>
                      {continuationRecommendation.targetLabels.map((label) => <span key={label}>{label}</span>)}
                    </div>
                  )}
                  <div className="continue-primary-actions">
                    <button
                      type="button"
                      className="primary"
                      onClick={() => continueAssessment(continuationRecommendation.route, continuationRecommendation.questionCount)}
                    >{t('continueWithTargetedQuestions', { questionCount: continuationRecommendation.questionCount })}</button>
                    <button type="button" className="secondary" onClick={continueAfterFeedback}>{t('viewReportNow')}</button>
                  </div>
                </div>
              )}
              {!pendingQuestion && !showContinuationPanel && showEvidenceCompletionPanel && (
                <div className="continue-callout recommended">
                  <p className="eyebrow">{t('evidenceCompletionRoute')}</p>
                  <h2>{t('keepGoingUntilRelevantCompetencies')}</h2>
                  <p>{evidenceCompletion.summary}</p>
                  <div className="continue-reasons">
                    <span>{t('relevantCompetenciesStillUnsampled', { unsampled: evidenceCompletion.unsampled })}</span>
                    <span>{t('sampledCompetenciesBelowHighConfidence', { lowConfidence: evidenceCompletion.lowConfidence })}</span>
                    <span>{t('maximumCapTotalQuestions', { maxQuestions: Math.min(60, allAssessmentItems.length) })}</span>
                  </div>
                  <div className="continue-targets">
                    <strong>{t('nextFocus')}</strong>
                    {evidenceCompletion.targets.slice(0, 5).map((competency) => <span key={competency.id}>{competency.label}</span>)}
                  </div>
                  <div className="continue-primary-actions">
                    <button type="button" className="primary" onClick={continueEvidenceCompletion}>{t('addEvidenceQuestions', { questionCount: evidenceCompletion.questionCount })}</button>
                    <button type="button" className="secondary" onClick={continueAfterFeedback}>{t('viewReportNow')}</button>
                  </div>
                </div>
              )}
              {/* Always rendered: the adaptive panel below is hidden unless psychometrics are enabled. */}
              <button className="primary submit-answer" onClick={continueAfterFeedback}>
                {pendingQuestion ? t('continueToNextQuestion') : t('viewResults')}
              </button>
            </article>
            {assessmentDisplaySettings.showPsychometrics && <aside className="adaptive-panel" aria-label={t('nextAdaptiveStep')}>
              <div className={`movement-card ${difficultyMovement.tone}`}>
                <span>{difficultyMovement.label}</span>
                <p>{difficultyMovement.detail}</p>
              </div>
              <div className="adaptive-card highlight">
                <span>{t('updatedTheta')}</span>
                <strong>{formatAbility(estimateTheta(answers))}</strong>
                <p>{t('updatedAfterAnsweredItems', { length: answers.length })}</p>
              </div>
              <div className="adaptive-card">
                <span>{t('nextStep')}</span>
                <p>
                  {pendingQuestion
                    ? t('nextItem', { domain: pendingQuestion.domain, domainName: domains[pendingQuestion.domain].short, difficulty: pendingQuestion.difficulty, type: pendingQuestion.type })
                    : t('assessmentCompleteResultsAreReady')}
                </p>
                {pendingQuestion && (
                  <div className="difficulty-compare">
                    <span>{lastAnswer.question.domain} · {lastAnswer.question.difficulty}</span>
                    <b aria-hidden="true">→</b>
                    <span>{pendingQuestion.domain} · {pendingQuestion.difficulty}</span>
                  </div>
                )}
              </div>
              {!pendingQuestion && showContinuationPanel && (
                <div className="adaptive-card continuation-inline">
                  <span>{continuationRecommendation.confidenceLabel}</span>
                  <strong>{results.confidence}%</strong>
                  <p>{t('theRecommendedRouteAddsTargeted', { reason: continuationRecommendation.reasons[0], questionCount: continuationRecommendation.questionCount })}</p>
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
                      disabled={!continuationTargets.priorityGapIds.length}
                      onClick={() => continueAssessment({
                        kind: 'priority',
                        label: 'Role-priority gap route',
                        targetCompetencyIds: continuationTargets.priorityGapIds,
                      }, 8)}
                    >
                      {t('keepGoingRoleGaps')}
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
                    >{t('keepGoingDeepDive', { selectedRadarDomain: selectedRadarDomain })}</button>
                  </div>
                  <div className="continuation-summary">
                    <span>{t('confidenceTargets', { length: continuationTargets.confidenceIds.length })}</span>
                    <span>{t('rolePriorityGaps', { length: continuationTargets.priorityGapIds.length })}</span>
                    <span>{t('followUps', { length: continuationTargets.domainIds.length, selectedRadarDomain: selectedRadarDomain })}</span>
                  </div>
                </div>
              )}
              {!pendingQuestion && !showContinuationPanel && showEvidenceCompletionPanel && (
                <div className="adaptive-card continuation-inline">
                  <span>{t('evidenceCompletion')}</span>
                  <strong>{results.confidence}%</strong>
                  <p>{t('addEvidenceQuestionsToImprove', { summary: evidenceCompletion.summary, questionCount: evidenceCompletion.questionCount })}</p>
                  <div className="continuation-actions">
                    <button type="button" className="primary" onClick={continueEvidenceCompletion}>
                      {t('keepGoing')}
                    </button>
                  </div>
                </div>
              )}
            </aside>}
          </div>
        </section>
      )}
    </>
  );
}
