'use client';

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
    currentThaiAvailable,
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
    setQuestionLanguageOverride,
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
                  {continuationFocus && <p className="context-line">Continuation: {continuationFocus.label}</p>}
                </div>
                <div className="progress-block">
                  <span>
                    Question {progress} of {activeConfig.totalQuestions}
                    <HelpBubble label="Telemetry help: progress">
                      Progress is logged so the system can tell whether users complete, abandon, or continue after required milestones.
                    </HelpBubble>
                  </span>
                  <div className="progress-track"><span style={{ width: `${(progress / activeConfig.totalQuestions) * 100}%` }} /></div>
                  <div className="question-language-toggle" aria-label="Question language">
                    <small>Question language</small>
                    <div>
                      <button
                        type="button"
                        className={questionLanguage === 'en' ? 'selected' : ''}
                        onClick={() => setQuestionLanguageOverride({ questionId: current.id, language: 'en' })}
                        aria-pressed={questionLanguage === 'en'}
                      >
                        EN
                      </button>
                      <button
                        type="button"
                        className={questionLanguage === 'th' ? 'selected' : ''}
                        onClick={() => setQuestionLanguageOverride({ questionId: current.id, language: 'th' })}
                        aria-pressed={questionLanguage === 'th'}
                        disabled={!currentThaiAvailable}
                        aria-label={currentThaiAvailable ? 'Show question in Thai' : 'Thai translation unavailable for this question'}
                      >
                        TH
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              {assessmentDisplaySettings.showQuestionMeta && <div className="question-meta">
                <span>
                  {current.domain}
                  <HelpBubble label="Telemetry help: domain">
                    Domain identifies which D1-D6 capability area this question contributes evidence to.
                  </HelpBubble>
                </span>
                <span className={`difficulty-pill ${current.difficulty}`}>
                  Difficulty: {difficultyLabels[current.difficulty]}
                  <HelpBubble label="Telemetry help: difficulty">
                    Difficulty is stored with the answer so harder correct or partially correct work can count differently from easy work.
                  </HelpBubble>
                </span>
                <span>
                  {current.type}
                  <HelpBubble label="Telemetry help: item type">
                    Item type shows whether this is a report review, media check, fraud task, scenario, or similar evidence format.
                  </HelpBubble>
                </span>
                <span>
                  {current.interaction ?? 'single'}
                  <HelpBubble label="Telemetry help: interaction format">
                    Interaction format helps compare single choice, multi-select, matching, ranking, written, and multi-part questions fairly.
                  </HelpBubble>
                </span>
              </div>}
              {assessmentDisplaySettings.showTelemetry && <div className="live-telemetry-strip" aria-label="Live telemetry help">
                <span>
                  Time on question
                  <HelpBubble label="Telemetry help: time on question">
                    Time is used to spot confusing wording, hard-to-read artifacts, and questions that need calibration review.
                  </HelpBubble>
                </span>
                <span>
                  Answer interactions
                  <HelpBubble label="Telemetry help: answer interactions">
                    Clicks, selections, revisions, and text edits help estimate hesitation and whether the question format is clear.
                  </HelpBubble>
                </span>
                <span>
                  Artifact use
                  <HelpBubble label="Telemetry help: artifact use">
                    Opening, zooming, or launching artifacts flags which screenshots, workflows, or documents may need larger or clearer versions.
                  </HelpBubble>
                </span>
              </div>}
              {assessmentDisplaySettings.showFocus && <div className="question-focus-strip">
                <span>{difficultyLabels[current.difficulty]} task</span>
                <strong>{getQuestionFocus(current)}</strong>
                <small>{difficultyDescriptions[current.difficulty]}</small>
              </div>}
              {assessmentDisplaySettings.showScoredEvidence && <details className="measure-details">
                <summary>
                  <span>Scored evidence</span>
                  <strong>
                    {getEvidenceMode(current)} · {currentMeasures.map((measure) => measure.domain).join(' / ')}
                    <HelpBubble label="Telemetry help: scored evidence">
                      Scored evidence records whether the item mostly tests knowing, doing, or a hybrid task, then maps it to competencies.
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
                <div className="skill-chip-row" aria-label="Scored skill tags">
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
                    <span>Make the call</span>
                    <h2>{shownQuestion.prompt}</h2>
                    <div className="reliance-options" aria-label="Reliance decision">
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
                    <span>Task brief</span>
                    <p>{getTaskInstruction(current)}</p>
                  </div>
                  <div className="scenario-panel">
                    <span>Scenario</span>
                    <p className="context">{shownQuestion.context}</p>
                    {(currentDisplayStimulus || shownQuestion.visualStimulus || currentDisplayVisualStimulus) && (
                      <div className="scenario-artifact" aria-label="Evidence embedded in the question">
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
                  <button className="primary submit-answer" onClick={submitMultiSelect}>Submit Selected Answers</button>
                </div>
              )}
              {current.interaction === 'rank' && (
                <div className="interaction-panel">
                  <div className="rank-list" aria-label="Drag-order response">
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
                            <button onClick={() => moveRankItem(index, index - 1)} aria-label={`Move ${item?.label} up`}>Up</button>
                            <button onClick={() => moveRankItem(index, index + 1)} aria-label={`Move ${item?.label} down`}>Down</button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <button className="primary submit-answer" onClick={submitRankOrder}>Submit Order</button>
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
                          <option value="">Choose match</option>
                          {(displayedMatchChoices[pair.id] ?? pair.choices).map((choice) => (
                            <option key={choice} value={choice}>{choice}</option>
                          ))}
                        </select>
                      </label>
                    ))}
                  </div>
                  <button className="primary submit-answer" onClick={submitMatches}>Submit Matches</button>
                </div>
              )}
              {current.interaction === 'parts' && (
                <div className="interaction-panel">
                  <div className="part-list">
                    {displayedParts.map((part, partIndex) => (
                      <section className="part-card" key={part.id}>
                        <div className="part-header">
                          <span>Part {partIndex + 1}</span>
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
                    Submit Mini-Parts
                  </button>
                </div>
              )}
              {current.interaction === 'text' && (
                <div className="interaction-panel">
                  <label className="written-response">
                    <span>Your written answer</span>
                    <textarea
                      value={textResponse}
                      onChange={(event) => updateTextResponse(event.target.value)}
                      placeholder="Write 3-5 sentences explaining the evidence, action, and customer response you would use."
                    />
                  </label>
                  <button className="primary submit-answer" onClick={submitTextAnswer} disabled={!textResponse.trim()}>Submit Written Answer</button>
                </div>
              )}
              {renderQuestionFeedback(current)}
            </article>
            {assessmentDisplaySettings.showPsychometrics && <aside className="adaptive-panel" aria-label="Adaptive psychometric indicators">
              <div className={`adaptive-card difficulty-card ${current.difficulty}`}>
                <span>
                  Current item difficulty
                  <HelpBubble label="Telemetry help: current item difficulty">
                    Current difficulty is the seeded challenge level for this item before large-scale pilot calibration.
                  </HelpBubble>
                </span>
                <strong>{difficultyLabels[current.difficulty]}</strong>
                <p>{difficultyDescriptions[current.difficulty]}</p>
              </div>
              <div className="adaptive-card highlight">
                <span>
                  Ability estimate theta
                  <HelpBubble label="Telemetry help: theta">
                    Theta is a pilot ability estimate from prior answers. It helps choose harder, easier, or coverage-focused next questions.
                  </HelpBubble>
                </span>
                <strong>{formatAbility(adaptiveReadout.theta)}</strong>
                <p>Pilot estimate from {adaptiveReadout.answeredCount} answered items.</p>
              </div>
              <div className="indicator-grid">
                <div>
                  <span>Target level<HelpBubble label="Telemetry help: target level">Target level is the next difficulty pressure after the previous answer and coverage needs.</HelpBubble></span>
                  <strong>{adaptiveReadout.targetDifficulty}</strong>
                </div>
                <div>
                  <span>Item b<HelpBubble label="Telemetry help: item difficulty b">Item b is the seeded psychometric difficulty value used to compare the item with the current ability estimate.</HelpBubble></span>
                  <strong>{formatAbility(adaptiveReadout.b)}</strong>
                </div>
                <div>
                  <span>Item a<HelpBubble label="Telemetry help: item discrimination a">Item a estimates how strongly this item should separate lower and higher readiness users.</HelpBubble></span>
                  <strong>{adaptiveReadout.a.toFixed(2)}</strong>
                </div>
                <div>
                  <span>Guess c<HelpBubble label="Telemetry help: guessing c">Guess c is the estimated chance someone could get credit without the underlying skill, lower for richer formats.</HelpBubble></span>
                  <strong>{adaptiveReadout.c.toFixed(2)}</strong>
                </div>
                <div>
                  <span>Info<HelpBubble label="Telemetry help: item information">Information estimates how useful this item is for reducing uncertainty at the current ability level.</HelpBubble></span>
                  <strong>{adaptiveReadout.information}</strong>
                </div>
                <div>
                  <span>SEM<HelpBubble label="Telemetry help: standard error">SEM is standard error of measurement. Lower means the current estimate is becoming more stable.</HelpBubble></span>
                  <strong>{adaptiveReadout.sem}</strong>
                </div>
              </div>
              <div className="adaptive-card">
                <span>
                  Why this question?
                  <HelpBubble label="Telemetry help: routing reason">
                    Routing combines prior score, difficulty movement, domain coverage, and profile-priority competencies.
                  </HelpBubble>
                </span>
                <p>{adaptiveReadout.adaptationReason}</p>
              </div>
              <div className="adaptive-card">
                <span>
                  Coverage pressure
                  <HelpBubble label="Telemetry help: coverage confidence">
                    Coverage confidence estimates whether enough relevant competencies have been tested to trust the result.
                  </HelpBubble>
                </span>
                <p>Next target: {adaptiveReadout.targetDomain} · {domains[adaptiveReadout.targetDomain].short}. Confidence {adaptiveReadout.confidence}%.</p>
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
              <p className="eyebrow">Answer review</p>
              {assessmentDisplaySettings.showAnswerReveal ? <>
                <h1>{lastAnswer.option.score}/100</h1>
                <p className="result-level">{lastAnswer.option.score >= 82 ? 'Strong evidence' : lastAnswer.option.score >= 64 ? 'Partial evidence' : 'Needs review'}</p>
              </> : <p className="result-level">Answer recorded. Continue when you are ready.</p>}
              {assessmentDisplaySettings.showAnswerReveal && <div className="score-explanation-panel" aria-label="Score explanation">
                <span>Score explanation</span>
                <p>{getRawScoreMethod(lastAnswer)}</p>
                {getScoreExplanation(lastAnswer).map((item) => <p key={item}>{item}</p>)}
                <p><strong>Practice cue</strong> {getAnswerPracticeCue(lastAnswer)}</p>
              </div>}
              {assessmentDisplaySettings.showAnswerReveal && <div className="feedback-grid">
                <div>
                  <span>Your answer</span>
                  <p>{lastAnswer.textResponse || localizeAnswerOption(lastAnswer, appLanguage, showDraftThai).label}</p>
                </div>
                <div>
                  <span>Expected answer</span>
                  <p>{getCorrectAnswerSummary(localizeQuestion(lastAnswer.question, appLanguage, showDraftThai))}</p>
                </div>
              </div>}
              {assessmentDisplaySettings.showAnswerReveal && <div className="rubric-panel">
                <span>Rubric and calibration</span>
                <p>{getCalibrationSummary(lastAnswer.question, lastAnswer)}</p>
                <p>{localizeAnswerOption(lastAnswer, appLanguage, showDraftThai).feedback}</p>
              </div>}
              {assessmentDisplaySettings.showAnswerReveal && assessmentDisplaySettings.showScoredEvidence && <div className="rubric-panel">
                <span>Measured competencies</span>
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
                        <span>{hit ? 'Detected' : 'Missing'}</span>
                        <strong>{criterion.label}</strong>
                        <small>{criterion.points} pts</small>
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
                      <strong>Next focus</strong>
                      {continuationRecommendation.targetLabels.map((label) => <span key={label}>{label}</span>)}
                    </div>
                  )}
                  <div className="continue-primary-actions">
                    <button
                      type="button"
                      className="primary"
                      onClick={() => continueAssessment(continuationRecommendation.route, continuationRecommendation.questionCount)}
                    >
                      Continue with {continuationRecommendation.questionCount} targeted questions
                    </button>
                    <button type="button" className="secondary" onClick={continueAfterFeedback}>View report now</button>
                  </div>
                </div>
              )}
              {!pendingQuestion && !showContinuationPanel && showEvidenceCompletionPanel && (
                <div className="continue-callout recommended">
                  <p className="eyebrow">Evidence completion route</p>
                  <h2>Keep going until relevant competencies are high-confidence</h2>
                  <p>{evidenceCompletion.summary}</p>
                  <div className="continue-reasons">
                    <span>{evidenceCompletion.unsampled} relevant competencies still unsampled</span>
                    <span>{evidenceCompletion.lowConfidence} sampled competencies below high confidence</span>
                    <span>Maximum cap: {Math.min(60, allAssessmentItems.length)} total questions</span>
                  </div>
                  <div className="continue-targets">
                    <strong>Next focus</strong>
                    {evidenceCompletion.targets.slice(0, 5).map((competency) => <span key={competency.id}>{competency.label}</span>)}
                  </div>
                  <div className="continue-primary-actions">
                    <button type="button" className="primary" onClick={continueEvidenceCompletion}>
                      Add {evidenceCompletion.questionCount} evidence questions
                    </button>
                    <button type="button" className="secondary" onClick={continueAfterFeedback}>View report now</button>
                  </div>
                </div>
              )}
              {/* Always rendered: the adaptive panel below is hidden unless psychometrics are enabled. */}
              <button className="primary submit-answer" onClick={continueAfterFeedback}>
                {pendingQuestion ? 'Continue to Next Question' : 'View Results'}
              </button>
            </article>
            {assessmentDisplaySettings.showPsychometrics && <aside className="adaptive-panel" aria-label="Next adaptive step">
              <div className={`movement-card ${difficultyMovement.tone}`}>
                <span>{difficultyMovement.label}</span>
                <p>{difficultyMovement.detail}</p>
              </div>
              <div className="adaptive-card highlight">
                <span>Updated theta</span>
                <strong>{formatAbility(estimateTheta(answers))}</strong>
                <p>Updated after {answers.length} answered items.</p>
              </div>
              <div className="adaptive-card">
                <span>Next step</span>
                <p>
                  {pendingQuestion
                    ? `Next item: ${pendingQuestion.domain} · ${domains[pendingQuestion.domain].short} · ${pendingQuestion.difficulty} · ${pendingQuestion.type}.`
                    : 'Assessment complete. Results are ready.'}
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
                  <p>
                    {continuationRecommendation.reasons[0]} The recommended route adds {continuationRecommendation.questionCount} targeted questions.
                  </p>
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
                      disabled={!continuationTargets.priorityGapIds.length}
                      onClick={() => continueAssessment({
                        kind: 'priority',
                        label: 'Role-priority gap route',
                        targetCompetencyIds: continuationTargets.priorityGapIds,
                      }, 8)}
                    >
                      Keep going: role gaps
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
                      Keep going: {selectedRadarDomain} deep dive
                    </button>
                  </div>
                  <div className="continuation-summary">
                    <span>{continuationTargets.confidenceIds.length} confidence targets</span>
                    <span>{continuationTargets.priorityGapIds.length} role-priority gaps</span>
                    <span>{continuationTargets.domainIds.length} {selectedRadarDomain} follow-ups</span>
                  </div>
                </div>
              )}
              {!pendingQuestion && !showContinuationPanel && showEvidenceCompletionPanel && (
                <div className="adaptive-card continuation-inline">
                  <span>Evidence completion</span>
                  <strong>{results.confidence}%</strong>
                  <p>
                    {evidenceCompletion.summary} Add {evidenceCompletion.questionCount} evidence questions to improve coverage.
                  </p>
                  <div className="continuation-actions">
                    <button type="button" className="primary" onClick={continueEvidenceCompletion}>
                      Keep going
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
