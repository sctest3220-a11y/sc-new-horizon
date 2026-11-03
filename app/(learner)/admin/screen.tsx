'use client';

import { useTranslations } from 'next-intl';
import {
  type AgentStatus,
  agentWorkflowEdges,
  agentWorkflowNodes,
  difficultyLabels,
  formatDuration,
  getWorkflowConnectorPath,
  sendEmailMagicLink,
  startGoogleSignIn,
} from '../../learner-app';
import { useApp } from '../../learner-app-context';

export default function AdminScreen() {
  const t = useTranslations('admin');
  const {
    adminAnalytics,
    adminAuthenticated,
    agentWorkflowReport,
    analyticsReadinessRows,
    approvedAgentDraftCount,
    artifactReplacementBriefs,
    assessmentQualityAnalytics,
    authEmail,
    authMessage,
    authProfile,
    exportPilotReviewCsv,
    latestSupervisedAgentRun,
    pendingAgentDraftCount,
    qualityInsights,
    rejectedAgentDraftCount,
    runAgentWorkflowSimulation,
    runSupervisedAgentJobs,
    selectedAgentId,
    setAdminAuthenticated,
    setAuthEmail,
    setAuthMessage,
    setSelectedAgentId,
    supervisedAgentRuns,
    telemetryAnalysis,
    updateAgentDraftStatus,
  } = useApp();

  return (
    <section className="admin-shell">
      {!adminAuthenticated ? (
        <div className="admin-login">
          <div>
            <p className="eyebrow">{t('adminLogin')}</p>
            <h1>{t('assessmentIntelligenceConsole')}</h1>
            <p>
              {t('adminUsersShouldSeeAggregate')}
            </p>
          </div>
          <div className="admin-login-card">
            <span>{authProfile ? t('adminIdentityDetected') : t('adminAuthentication')}</span>
            {authProfile && (
              <div className="admin-auth-profile">
                <strong>{authProfile.name ?? authProfile.email}</strong>
                <small>{authProfile.email}</small>
              </div>
            )}
            <button className="primary" type="button" onClick={() => startGoogleSignIn(setAuthMessage)}>{t('continueWithGoogle')}</button>
            <div className="email-auth-row">
              <input
                type="email"
                value={authEmail}
                onChange={(event) => setAuthEmail(event.target.value)}
                placeholder="admin@newhorizon.ai"
                aria-label={t('adminEmailMagicLink')}
              />
              <button className="secondary" type="button" onClick={() => sendEmailMagicLink(authEmail, setAuthMessage)}>{t('emailLink')}</button>
            </div>
            <label>{t.rich('previewEmail', { input: () => <input type="email" placeholder="admin@newhorizon.ai" aria-label={t('adminEmail')} /> })}</label>
            <label>{t.rich('previewPassword', { input: () => <input type="password" placeholder={t('previewOnly')} aria-label={t('adminPassword')} /> })}</label>
            <button className="secondary" type="button" onClick={() => setAdminAuthenticated(true)}>{t('openAdminDashboardPreview')}</button>
            <small>{authMessage || t('googleEmailSignInUses')}</small>
          </div>
        </div>
      ) : (
        <>
          <div className="admin-hero">
            <div>
              <p className="eyebrow">{t('adminDashboard')}</p>
              <h1>{t('assessmentAnalyticsAcrossUsersAnd')}</h1>
              <p>
                {t('trackReadinessByCohortFunction')}
              </p>
            </div>
            <div className="admin-hero-actions">
              <a className="primary" href="/admin/pilot-operations">{t('pilotOperations')}</a>
              <a className="primary" href="/admin/question-inventory">{t('questionInventory')}</a>
              <button className="secondary dark" type="button" onClick={() => setAdminAuthenticated(false)}>{t('signOutPreview')}</button>
            </div>
          </div>

          <div className="admin-kpi-grid">
            <div><span>{t('completedRuns')}</span><strong>{adminAnalytics.totalRuns}</strong><small>{t('nonPracticeAssessments')}</small></div>
            <div><span>{t('profiles')}</span><strong>{adminAnalytics.totalProfiles}</strong><small>{t('localProfileIds')}</small></div>
            <div><span>{t('questionSignals')}</span><strong>{adminAnalytics.totalQuestionSignals}</strong><small>{t('itemLevelRecords')}</small></div>
            <div><span>{t('averageReadiness')}</span><strong>{adminAnalytics.totalRuns ? `${adminAnalytics.averageOverall}/100` : t('noData')}</strong><small>{t('allSavedRuns')}</small></div>
          </div>

          <div className="admin-grid">
            <article className="admin-card admin-wide analytics-readiness-card">
              <div className="admin-card-heading">
                <div>
                  <span>{t('mvpRefinement')}</span>
                  <h2>{t('analyticsReadinessChecklist')}</h2>
                </div>
                <button className="secondary dark" type="button" onClick={exportPilotReviewCsv} disabled={!adminAnalytics.totalQuestionSignals}>
                  {t('exportPilotReviewCsv')}
                </button>
              </div>
              <p>
                {t('thisPanelSeparatesPilotLocal')}
              </p>
              <div className="telemetry-grid readiness-grid">
                {analyticsReadinessRows.map((row) => (
                  <div key={row.label}>
                    <h3>{row.label}</h3>
                    <strong>{row.status}</strong>
                    <p>{row.detail}</p>
                  </div>
                ))}
              </div>
            </article>

            <article className="admin-card admin-wide">
              <div className="admin-card-heading">
                <div>
                  <span>{t('agentOperations')}</span>
                  <h2>{t('supervisedAgentJobs')}</h2>
                </div>
                <div className="admin-action-row">
                  <button className="primary" type="button" onClick={runSupervisedAgentJobs}>{t('runSupervisedJobs')}</button>
                  <button className="secondary dark" type="button" onClick={runAgentWorkflowSimulation}>{t('runSimulationOnly')}</button>
                </div>
              </div>
              <div className="admin-kpi-grid compact-kpis agent-review-kpis">
                <div><span>{t('runs')}</span><strong>{supervisedAgentRuns.length}</strong><small>{t('persistedLocalRuns')}</small></div>
                <div><span>{t('pending')}</span><strong>{pendingAgentDraftCount}</strong><small>{t('draftsNeedingReview')}</small></div>
                <div><span>{t('approved')}</span><strong>{approvedAgentDraftCount}</strong><small>{t('acceptedProposals')}</small></div>
                <div><span>{t('rejected')}</span><strong>{rejectedAgentDraftCount}</strong><small>{t('blockedProposals')}</small></div>
              </div>
              {latestSupervisedAgentRun && (
                <div className="supervised-run-panel">
                  <div className="report-heading">
                    <div>
                      <p className="eyebrow">{t('latestSupervisedRun')}</p>
                      <h3>{latestSupervisedAgentRun.headline}</h3>
                      <p>{latestSupervisedAgentRun.summary}</p>
                      <small>{latestSupervisedAgentRun.id} · {new Date(latestSupervisedAgentRun.createdAt).toLocaleString()}</small>
                    </div>
                    <span>{latestSupervisedAgentRun.status}</span>
                  </div>
                  <div className="agent-draft-grid">
                    {latestSupervisedAgentRun.drafts.map((draft) => (
                      <article key={draft.id} className={`agent-draft-card ${draft.status}`}>
                        <div>
                          <span>{draft.kind} · {draft.ownerAgent}</span>
                          <h4>{draft.title}</h4>
                          <p>{draft.summary}</p>
                          <small>{draft.rationale}</small>
                        </div>
                        <div className="source-signal-list">
                          {draft.sourceSignals.map((signal) => <b key={signal}>{signal}</b>)}
                        </div>
                        <div className="draft-review-actions">
                          <button
                            className="secondary dark"
                            type="button"
                            disabled={draft.status === 'approved'}
                            onClick={() => updateAgentDraftStatus(latestSupervisedAgentRun.id, draft.id, 'approved')}
                          >
                            {t('approve')}
                          </button>
                          <button
                            className="secondary dark"
                            type="button"
                            disabled={draft.status === 'rejected'}
                            onClick={() => updateAgentDraftStatus(latestSupervisedAgentRun.id, draft.id, 'rejected')}
                          >
                            {t('reject')}
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>
                  <div className="agent-list">
                    {latestSupervisedAgentRun.safetyEvents.map((event) => <p key={event}>{event}</p>)}
                  </div>
                </div>
              )}
              {agentWorkflowReport ? (
                <div className="agent-report">
                  <div className="agent-report-hero">
                    <div>
                      <strong>{agentWorkflowReport.headline}</strong>
                      <p>{agentWorkflowReport.summary}</p>
                      <small>{agentWorkflowReport.runId} · {agentWorkflowReport.generatedAt}</small>
                    </div>
                  </div>
                  <section className="agent-workflow-visual" aria-label={t('interactiveAgentWorkflow')}>
                    <div className="agent-workflow-toolbar">
                      <div>
                        <span>{t('workflowMap')}</span>
                        <h3>{t('assessmentImprovementOrchestration')}</h3>
                      </div>
                      <p>{t('clickAnAgentToInspect')}</p>
                    </div>
                    <div className="agent-workflow-scroll">
                      <div className="agent-workflow-canvas">
                        <svg className="agent-workflow-connectors" viewBox="0 0 1160 570" role="img" aria-label={t('connectionsBetweenAssessmentAgents')}>
                          <defs>
                            <marker id="agent-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
                              <path d="M0,0 L8,4 L0,8 Z" />
                            </marker>
                          </defs>
                          {agentWorkflowEdges.map((edge) => {
                            const target = agentWorkflowReport.agents.find((agent) => agent.id === edge.to);
                            return (
                              <path
                                key={`${edge.from}-${edge.to}`}
                                className={`agent-workflow-edge ${target?.status ?? 'idle'}`}
                                d={getWorkflowConnectorPath(edge.from, edge.to)}
                                markerEnd="url(#agent-arrow)"
                              />
                            );
                          })}
                          <path
                            className={`agent-workflow-edge ${agentWorkflowReport.agents.find((agent) => agent.id === 'reviewer')?.status ?? 'idle'}`}
                            d="M 944 285 C 978 285, 978 285, 1012 285"
                            markerEnd="url(#agent-arrow)"
                          />
                        </svg>
                        {agentWorkflowNodes.map((node) => {
                          const agent = agentWorkflowReport.agents.find((candidate) => candidate.id === node.id);
                          if (!agent) return null;
                          return (
                            <button
                              key={node.id}
                              className={`agent-workflow-node ${agent.status} ${selectedAgentId === node.id ? 'selected' : ''}`}
                              style={{ left: node.x, top: node.y }}
                              type="button"
                              onClick={() => setSelectedAgentId(node.id)}
                              aria-pressed={selectedAgentId === node.id}
                            >
                              <span>{node.eyebrow}</span>
                              <strong>{agent.name}</strong>
                              <small>{t.rich('stage', { b: () => <b aria-hidden="true" />, status: agent.status, outputCount: agent.outputCount })}</small>
                            </button>
                          );
                        })}
                        <div className="agent-human-gate" style={{ left: 1012, top: 224 }}>
                          <span>{t('humanGate')}</span>
                          <strong>{t('adminApproval')}</strong>
                          <small>{t('approveReviseReject')}</small>
                        </div>
                        <div className="agent-workflow-legend" aria-label={t('workflowStatusLegend')}>
                          {(['complete', 'running', 'review', 'blocked', 'idle'] as AgentStatus[]).map((status) => (
                            <span key={status} className={status}><b />{status}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                    {(() => {
                      const selectedAgent = agentWorkflowReport.agents.find((agent) => agent.id === selectedAgentId) ?? agentWorkflowReport.agents[0];
                      const selectedActivity = agentWorkflowReport.activityLog.filter((entry) => entry.agent === selectedAgent.name);
                      return (
                        <div className="agent-workflow-inspector">
                          <div className="agent-inspector-summary">
                            <span className={`agent-status ${selectedAgent.status}`}>{selectedAgent.status}</span>
                            <h3>{selectedAgent.name}</h3>
                            <p>{selectedAgent.role}</p>
                            <dl>
                              <div><dt>{t('schedule')}</dt><dd>{selectedAgent.cadence}</dd></div>
                              <div><dt>{t('guardrail')}</dt><dd>{selectedAgent.guardrail}</dd></div>
                            </dl>
                          </div>
                          <div className="agent-inspector-stages">
                            <h3>{t('latestRunStages')}</h3>
                            {selectedActivity.length ? selectedActivity.map((entry) => (
                              <div key={`${entry.step}-${entry.activity}`} className={`agent-inspector-stage ${entry.status}`}>
                                <span>{entry.step}</span>
                                <div>
                                  <strong>{entry.activity}</strong>
                                  <p>{entry.output}</p>
                                </div>
                              </div>
                            )) : <p>{t('noStageActivityHasBeen')}</p>}
                          </div>
                        </div>
                      );
                    })()}
                  </section>
                  <div className="agent-status-grid">
                    {agentWorkflowReport.agents.map((agent) => (
                      <div key={agent.id}>
                        <span className={`agent-status ${agent.status}`}>{agent.status}</span>
                        <strong>{agent.name}</strong>
                        <p>{agent.role}</p>
                        <small>{agent.cadence}</small>
                      </div>
                    ))}
                  </div>
                  <div className="agent-report-columns">
                    <div>
                      <h3>{t('activityLog')}</h3>
                      <ol className="agent-timeline">
                        {agentWorkflowReport.activityLog.map((entry) => (
                          <li key={`${entry.step}-${entry.agent}`}>
                            <span>{entry.step}</span>
                            <div>
                              <strong>{entry.agent}</strong>
                              <p>{entry.activity}</p>
                              <small>{entry.output}</small>
                            </div>
                          </li>
                        ))}
                      </ol>
                    </div>
                    <div>
                      <h3>{t('safetyCut')}</h3>
                      <div className="agent-list">
                        {agentWorkflowReport.safetyEvents.map((event) => <p key={event}>{event}</p>)}
                      </div>
                      <h3>{t('outputs')}</h3>
                      <div className="agent-list">
                        {agentWorkflowReport.outputs.map((output) => <p key={output}>{output}</p>)}
                      </div>
                      <h3>{t('recommendations')}</h3>
                      <div className="agent-list">
                        {agentWorkflowReport.recommendations.map((recommendation) => <p key={recommendation}>{recommendation}</p>)}
                      </div>
                    </div>
                  </div>
                  <p className="context-line">{agentWorkflowReport.productionNote}</p>
                </div>
              ) : (
                <p>{t('noAgentRunHasBeen')}</p>
              )}
            </article>

            <article className="admin-card admin-wide quality-engine-card">
              <span>{t('continuousImprovement')}</span>
              <h2>{t('supervisedAssessmentQualityEngine')}</h2>
              <p>
                {t('telemetryAndEndOfAssessment')}
              </p>
              <div className="admin-kpi-grid compact-kpis">
                <div><span>{t('started')}</span><strong>{qualityInsights.started}</strong><small>{t('trackedSessions')}</small></div>
                <div><span>{t('abandoned')}</span><strong>{qualityInsights.abandoned}</strong><small>{t('incompleteExits')}</small></div>
                <div><span>{t('mandatoryComplete')}</span><strong>{qualityInsights.mandatory}</strong><small>{t('baseRoutes')}</small></div>
                <div><span>{t('continued')}</span><strong>{qualityInsights.continued}</strong><small>{t('optionalDepth')}</small></div>
              </div>
              <div className="agent-report-columns">
                <div>
                  <h3>{t('improvementQueue')}</h3>
                  <div className="agent-list">
                    {qualityInsights.recommendations.map((recommendation) => <p key={recommendation}>{recommendation}</p>)}
                  </div>
                </div>
	                    <div>
	                      <h3>{t('questionCandidates')}</h3>
	                      <div className="admin-list compact">
	                        {qualityInsights.questionRows.length ? qualityInsights.questionRows.map((row) => (
	                          <p key={row.questionId}>
	                            <strong>{row.questionId}</strong>
	                            <small>{t('attempts100Confusing', { attempts: row.attempts, averageScore: row.averageScore, formatDuration: formatDuration(row.averageDurationMs), confusionRate: row.confusionRate })}</small>
	                          </p>
	                        )) : <p>{t('noItemBehaviorDataYet')}</p>}
	                      </div>
	                    </div>
	                  </div>
	                  <div className="quality-review-table">
	                    <h3>{t('itemCalibrationDashboard')}</h3>
	                    <div className="quality-review-rows">
	                      {qualityInsights.qualityRows.length ? qualityInsights.qualityRows.map((row) => (
	                        <div key={row.questionId} className={`quality-review-row ${row.status}`}>
	                          <span>{row.status}</span>
	                          <strong>{row.questionId}</strong>
                        <div className="calibration-chip-row">
                          <b>{row.actionLabel}</b>
                          <b>{row.domain ?? t('unknown')} · {row.difficulty ?? t('unmapped')} · {row.interaction}</b>
                          <b>{t('attempts', { attempts: row.attempts })}</b>
                          <b>{t('n100Avg', { averageScore: row.averageScore })}</b>
                          <b>{t('avg', { formatDuration: formatDuration(row.averageDurationMs) })}</b>
                          <b>{t('confusing', { confusionRate: row.confusionRate })}</b>
                          <b>{t('artifactActionsAttempt', { artifactOpenRate: row.artifactOpenRate })}</b>
                          <b>{t('feedbackUnclear', { feedbackCount: row.feedbackCount, unclear: row.unclear })}</b>
                          <b>{row.difficultyMismatch}</b>
                        </div>
	                          <small>{t('negativeSignals', { artifactRequired: row.artifactRequired, negativeSignals: row.negativeSignals })}</small>
	                          <p>{row.action}</p>
	                        </div>
	                      )) : <p>{t('noItemLevelFeedbackHas')}</p>}
	                    </div>
	                  </div>
	                </article>

            <article className="admin-card admin-wide assessment-quality-suite">
              <div className="admin-card-heading">
                <div>
                  <span>{t('assessmentQuality')}</span>
                  <h2>{t('n10PointQualityAnalysisSuite')}</h2>
                </div>
                <small>{adminAnalytics.totalQuestionSignals ? t('savedQuestionSignals', { count: adminAnalytics.totalQuestionSignals }) : t('insufficientDataUntilUsersComplete')}</small>
              </div>
              <div className="quality-suite-grid">
                <div>
                  <h3>{t('n1ItemDiscrimination')}</h3>
                  {assessmentQualityAnalytics.discriminationRows.length ? assessmentQualityAnalytics.discriminationRows.map((row) => (
                    <p key={row.questionId}><strong>{row.questionId}</strong><small>{t('highVsLowGap', { status: row.status, highCorrect: row.highCorrect, lowCorrect: row.lowCorrect, gap: row.gap })}</small></p>
                  )) : <p>{t('noCompletedItemSignalsYet')}</p>}
                </div>
                <div>
                  <h3>{t('n2DistractorAnalysis')}</h3>
                  {assessmentQualityAnalytics.distractorRows.length ? assessmentQualityAnalytics.distractorRows.map((row) => (
                    <p key={row.questionId}><strong>{row.questionId}</strong><small>{t('topWrongNeverChosen', { status: row.status, topDistractor: row.topDistractor, neverChosen: row.neverChosen })}</small></p>
                  )) : <p>{t('noAnswerOptionDataYet')}</p>}
                </div>
                <div>
                  <h3>{t('n3ArtifactDependency')}</h3>
                  {assessmentQualityAnalytics.artifactDependencyRows.length ? assessmentQualityAnalytics.artifactDependencyRows.map((row) => (
                    <p key={row.questionId}><strong>{row.questionId}</strong><small>{t('openedScoreVsSDelta', { status: row.status, opened: row.opened, attempts: row.attempts, openedScore: row.openedScore, notOpenedScore: row.notOpenedScore, timeDeltaSeconds: row.timeDeltaSeconds })}</small></p>
                  )) : <p>{t('noArtifactLinkedAttemptsYet')}</p>}
                </div>
                <div>
                  <h3>{t('n4ClarityIndex')}</h3>
                  {assessmentQualityAnalytics.clarityRows.length ? assessmentQualityAnalytics.clarityRows.map((row) => (
                    <p key={row.questionId}><strong>{row.questionId}</strong><small>{t('risk100UnclearConfusing', { clarityRisk: row.clarityRisk, unclear: row.unclear, confusionRate: row.confusionRate, actionLabel: row.actionLabel })}</small></p>
                  )) : <p>{t('noClarityRiskSignalsYet')}</p>}
                </div>
                <div>
                  <h3>{t('n5DifficultyCalibration')}</h3>
                  {assessmentQualityAnalytics.difficultyCalibrationRows.map((row) => (
                    <p key={row.difficulty}><strong>{difficultyLabels[row.difficulty]}</strong><small>{t('signals100AvgFastHigh', { status: row.status, count: row.count, average: row.average, quickHigh: row.quickHigh })}</small></p>
                  ))}
                </div>
                <div>
                  <h3>{t('n6CompetencyHeatmap')}</h3>
                  {assessmentQualityAnalytics.competencyHeatmapRows.map((row) => (
                    <p key={row.id}><strong>{row.domain} · {row.label}</strong><small>{t('bankSampled100', { status: row.status, bankCount: row.bankCount, sampled: row.sampled, average: row.average, difficultySpread: row.difficultySpread })}</small></p>
                  ))}
                </div>
                <div>
                  <h3>{t('n7ReliabilityEstimate')}</h3>
                  {assessmentQualityAnalytics.reliabilityRows.length ? assessmentQualityAnalytics.reliabilityRows.map((row) => (
                    <p key={row.id}><strong>{row.label}</strong><small>{t('questionsDomainsCompetenciesHardSignals', { status: row.status, questions: row.questions, sampledDomains: row.sampledDomains, sampledCompetencies: row.sampledCompetencies, advancedSignals: row.advancedSignals })}</small></p>
                  )) : <p>{t('noCompletedRunsYet')}</p>}
                </div>
                <div>
                  <h3>{t('n8WrittenRubricAudit')}</h3>
                  {assessmentQualityAnalytics.writtenAuditRows.length ? assessmentQualityAnalytics.writtenAuditRows.map((row) => (
                    <p key={row.questionId}><strong>{row.questionId}</strong><small>{t('attemptsNoHitShort100', { status: row.status, attempts: row.attempts, noRubricHits: row.noRubricHits, short: row.short, average: row.average })}</small></p>
                  )) : <p>{t('noWrittenResponseAttemptsYet')}</p>}
                </div>
                <div>
                  <h3>{t('n9RoutePersonaFit')}</h3>
                  {assessmentQualityAnalytics.routeFitRows.length ? assessmentQualityAnalytics.routeFitRows.map((row) => (
                    <p key={row.id}><strong>{row.label}</strong><small>{row.status} · {row.detail}</small></p>
                  )) : <p>{t('noCompletedRouteSnapshotsYet')}</p>}
                </div>
                <div>
                  <h3>{t('n10LearningReportEngagement')}</h3>
                  {assessmentQualityAnalytics.reportEngagementRows.length ? assessmentQualityAnalytics.reportEngagementRows.map((row) => (
                    <p key={row.area}><strong>{row.area}</strong><small>{t('click', { count: row.count })}</small></p>
                  )) : <p>{t('noReportEngagementClicksYet')}</p>}
                  <p><strong>{t('recommendationSignals')}</strong><small>{t('courseToolCoverageContinuationClick', { recommendationSignals: assessmentQualityAnalytics.recommendationSignals })}</small></p>
                </div>
              </div>
            </article>

            <article className="admin-card admin-wide telemetry-analysis-card">
              <div className="report-heading">
                <div>
                  <p className="eyebrow">{t('humanReviewGate')}</p>
                  <h2>{t('analyzeSurveysAndBehaviorBefore')}</h2>
                </div>
                <span>{t('pendingDrafts', { pendingAgentDraftCount: pendingAgentDraftCount })}</span>
              </div>
              <p>
                {t('agentsShouldUseTelemetryAnd')}
              </p>
              <div className="telemetry-grid">
                <div>
                  <h3>{t('currentSignals')}</h3>
                  {telemetryAnalysis.trackedNow.map((item) => <p key={item}>{item}</p>)}
                </div>
                <div>
                  <h3>{t('analysisQuestions')}</h3>
                  {[
                    t('whichArtifactsTriggerZoomOpen'),
                    t('whichQuestionsLookConfusingBecause'),
                    t('whichCompetenciesRemainUnsampledOr'),
                    t('whichSurveyCommentsPointTo'),
                  ].map((item) => <p key={item}>{item}</p>)}
                </div>
                <div>
                  <h3>{t('humanDecision')}</h3>
                  {[
                    t('approveRejectOrRewriteEach'),
                    t('versionScoredItemsSoHistorical'),
                    t('reviewNewArtifactsForReadability'),
                    t('keepProfileCollectionTransparentAnd'),
                  ].map((item) => <p key={item}>{item}</p>)}
                </div>
              </div>
            </article>

            <article className="admin-card admin-wide artifact-backlog">
              <span>{t('artifactProduction')}</span>
              <h2>{t('realDocumentReplacementBriefs')}</h2>
              <p>{t('theseBriefsMapEveryUnique')}</p>
              <div className="admin-list artifact-brief-list">
                {artifactReplacementBriefs.map((artifact) => (
                  <details key={artifact.src}>
                    <summary><strong>{artifact.label}</strong><small>{artifact.questionId} · {artifact.src}</small></summary>
                    <p>{artifact.description}</p>
                  </details>
                ))}
              </div>
            </article>

            <article className="admin-card admin-wide">
              <span>{t('domainTrend')}</span>
              <h2>{t('lowestAverageDomains')}</h2>
              <div className="admin-domain-bars">
                {adminAnalytics.domainRows.map((row) => (
                  <div key={row.domain}>
                    <label>{row.domain} · {row.label}</label>
                    <meter min="0" max="100" value={row.average} />
                    <strong>{adminAnalytics.totalRuns ? `${row.average}/100` : t('noData')}</strong>
                    <small>{t('questionSignal', { evidence: row.evidence })}</small>
                  </div>
                ))}
              </div>
            </article>

            <article className="admin-card">
              <span>{t('userGroups')}</span>
              <h2>{t('cohortAverages')}</h2>
              <div className="admin-list">
                {adminAnalytics.groupRows.length ? adminAnalytics.groupRows.map((row) => (
                  <p key={row.key}><strong>{row.label}</strong><small>{t('runs100Latest', { count: row.count, average: row.average, lastRun: row.lastRun ? new Date(row.lastRun).toLocaleDateString() : t('notAvailable') })}</small></p>
                )) : <p>{t('noSavedCohortDataYet')}</p>}
              </div>
            </article>

            <article className="admin-card">
              <span>{t('functions')}</span>
              <h2>{t('functionAnalysis')}</h2>
              <div className="admin-list">
                {adminAnalytics.functionRows.length ? adminAnalytics.functionRows.map((row) => (
                  <p key={row.key}><strong>{row.label}</strong><small>{t('runs100Average', { count: row.count, average: row.average })}</small></p>
                )) : <p>{t('noFunctionSpecificPremiumRuns')}</p>}
              </div>
            </article>

            <article className="admin-card">
              <span>{t('executiveRoles')}</span>
              <h2>{t('roleAnalysis')}</h2>
              <div className="admin-list">
                {adminAnalytics.executiveRows.length ? adminAnalytics.executiveRows.map((row) => (
                  <p key={row.key}><strong>{row.label}</strong><small>{t('runs100Average', { count: row.count, average: row.average })}</small></p>
                )) : <p>{t('noExecutiveRoleRunsYet')}</p>}
              </div>
            </article>

            <article className="admin-card">
              <span>{t('competencies')}</span>
              <h2>{t('priorityGaps')}</h2>
              <div className="admin-list">
                {adminAnalytics.competencyRows.length ? adminAnalytics.competencyRows.map((row) => (
                  <p key={row.id}><strong>{row.domain} · {row.label}</strong><small>{t('n100EvidenceSignals', { average: row.average, evidence: row.evidence })}</small></p>
                )) : <p>{t('noCompetencySignalLogYet')}</p>}
              </div>
            </article>

            <article className="admin-card">
              <span>{t('difficultyCalibration')}</span>
              <h2>{t('itemDifficultyBehavior')}</h2>
              <div className="admin-list compact">
                {adminAnalytics.difficultyRows.map((row) => (
                  <p key={row.label}><strong>{row.label}</strong><small>{t('signals', { count: row.count, average: row.count ? `${row.average}/100` : t('noData2') })}</small></p>
                ))}
              </div>
            </article>

            <article className="admin-card">
              <span>{t('formats')}</span>
              <h2>{t('questionInteractionMix')}</h2>
              <div className="admin-list compact">
                {adminAnalytics.interactionRows.length ? adminAnalytics.interactionRows.map((row) => (
                  <p key={row.label}><strong>{row.label}</strong><small>{t('signals100', { count: row.count, average: row.average })}</small></p>
                )) : <p>{t('noInteractionDataYet')}</p>}
              </div>
            </article>

            <article className="admin-card admin-wide">
              <span>{t('recentTrend')}</span>
              <h2>{t('latestAssessmentRuns')}</h2>
              <div className="admin-run-grid">
                {adminAnalytics.recentRuns.length ? adminAnalytics.recentRuns.map((run) => (
                  <div key={run.id}>
                    <strong>{run.score}/100</strong>
                    <span>{run.mode}</span>
                    <p>{run.label}</p>
                    <small>{run.date}</small>
                  </div>
                )) : <p>{t('noSavedRunsYetComplete')}</p>}
              </div>
            </article>
          </div>
        </>
      )}
    </section>
  );
}
