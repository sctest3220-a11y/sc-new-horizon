'use client';

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
            <p className="eyebrow">Admin login</p>
            <h1>Assessment intelligence console.</h1>
            <p>
              Admin users should see aggregate assessment performance, group patterns, function gaps,
              competency coverage, question-format behavior, and longitudinal trends. This MVP uses a preview gate;
              production should require Supabase Auth role-based access control.
            </p>
          </div>
          <div className="admin-login-card">
            <span>{authProfile ? 'Admin identity detected' : 'Admin authentication'}</span>
            {authProfile && (
              <div className="admin-auth-profile">
                <strong>{authProfile.name ?? authProfile.email}</strong>
                <small>{authProfile.email}</small>
              </div>
            )}
            <button className="primary" type="button" onClick={() => startGoogleSignIn(setAuthMessage)}>Continue with Google</button>
            <div className="email-auth-row">
              <input
                type="email"
                value={authEmail}
                onChange={(event) => setAuthEmail(event.target.value)}
                placeholder="admin@newhorizon.ai"
                aria-label="Admin email magic link"
              />
              <button className="secondary" type="button" onClick={() => sendEmailMagicLink(authEmail, setAuthMessage)}>Email link</button>
            </div>
            <label>
              Preview email
              <input type="email" placeholder="admin@newhorizon.ai" aria-label="Admin email" />
            </label>
            <label>
              Preview password
              <input type="password" placeholder="Preview only" aria-label="Admin password" />
            </label>
            <button className="secondary" type="button" onClick={() => setAdminAuthenticated(true)}>Open admin dashboard preview</button>
            <small>{authMessage || 'Google/email sign-in uses Supabase when env vars are configured. Admin dashboard access is preview-only until admin role claims are added.'}</small>
          </div>
        </div>
      ) : (
        <>
          <div className="admin-hero">
            <div>
              <p className="eyebrow">Admin dashboard</p>
              <h1>Assessment analytics across users and groups.</h1>
              <p>
                Track readiness by cohort, function, role, domain, competency, difficulty, question format, and trend over time.
                The current view summarizes saved local MVP runs; production should query Supabase analytics views.
              </p>
            </div>
            <div className="admin-hero-actions">
              <a className="primary" href="/admin/pilot-operations">Pilot operations</a>
              <a className="primary" href="/admin/question-inventory">Question inventory</a>
              <button className="secondary dark" type="button" onClick={() => setAdminAuthenticated(false)}>Sign out preview</button>
            </div>
          </div>

          <div className="admin-kpi-grid">
            <div><span>Completed runs</span><strong>{adminAnalytics.totalRuns}</strong><small>non-practice assessments</small></div>
            <div><span>Profiles</span><strong>{adminAnalytics.totalProfiles}</strong><small>local profile ids</small></div>
            <div><span>Question signals</span><strong>{adminAnalytics.totalQuestionSignals}</strong><small>item-level records</small></div>
            <div><span>Average readiness</span><strong>{adminAnalytics.totalRuns ? `${adminAnalytics.averageOverall}/100` : 'No data'}</strong><small>all saved runs</small></div>
          </div>

          <div className="admin-grid">
            <article className="admin-card admin-wide analytics-readiness-card">
              <div className="admin-card-heading">
                <div>
                  <span>MVP refinement</span>
                  <h2>Analytics readiness checklist</h2>
                </div>
                <button className="secondary dark" type="button" onClick={exportPilotReviewCsv} disabled={!adminAnalytics.totalQuestionSignals}>
                  Export pilot review CSV
                </button>
              </div>
              <p>
                This panel separates pilot-local evidence from production-ready analytics. Use the export for offline item review;
                keep cohort claims labeled insufficient until server-side aggregate views are deployed.
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
                  <span>Agent operations</span>
                  <h2>Supervised agent jobs</h2>
                </div>
                <div className="admin-action-row">
                  <button className="primary" type="button" onClick={runSupervisedAgentJobs}>Run supervised jobs</button>
                  <button className="secondary dark" type="button" onClick={runAgentWorkflowSimulation}>Run simulation only</button>
                </div>
              </div>
              <div className="admin-kpi-grid compact-kpis agent-review-kpis">
                <div><span>Runs</span><strong>{supervisedAgentRuns.length}</strong><small>persisted local runs</small></div>
                <div><span>Pending</span><strong>{pendingAgentDraftCount}</strong><small>drafts needing review</small></div>
                <div><span>Approved</span><strong>{approvedAgentDraftCount}</strong><small>accepted proposals</small></div>
                <div><span>Rejected</span><strong>{rejectedAgentDraftCount}</strong><small>blocked proposals</small></div>
              </div>
              {latestSupervisedAgentRun && (
                <div className="supervised-run-panel">
                  <div className="report-heading">
                    <div>
                      <p className="eyebrow">Latest supervised run</p>
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
                            Approve
                          </button>
                          <button
                            className="secondary dark"
                            type="button"
                            disabled={draft.status === 'rejected'}
                            onClick={() => updateAgentDraftStatus(latestSupervisedAgentRun.id, draft.id, 'rejected')}
                          >
                            Reject
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
                  <section className="agent-workflow-visual" aria-label="Interactive agent workflow">
                    <div className="agent-workflow-toolbar">
                      <div>
                        <span>Workflow map</span>
                        <h3>Assessment improvement orchestration</h3>
                      </div>
                      <p>Click an agent to inspect its stages, controls, and latest output.</p>
                    </div>
                    <div className="agent-workflow-scroll">
                      <div className="agent-workflow-canvas">
                        <svg className="agent-workflow-connectors" viewBox="0 0 1160 570" role="img" aria-label="Connections between assessment agents">
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
                              <small><b aria-hidden="true" />{agent.status} · {agent.outputCount} stage{agent.outputCount === 1 ? '' : 's'}</small>
                            </button>
                          );
                        })}
                        <div className="agent-human-gate" style={{ left: 1012, top: 224 }}>
                          <span>Human gate</span>
                          <strong>Admin approval</strong>
                          <small>Approve · revise · reject</small>
                        </div>
                        <div className="agent-workflow-legend" aria-label="Workflow status legend">
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
                              <div><dt>Schedule</dt><dd>{selectedAgent.cadence}</dd></div>
                              <div><dt>Guardrail</dt><dd>{selectedAgent.guardrail}</dd></div>
                            </dl>
                          </div>
                          <div className="agent-inspector-stages">
                            <h3>Latest run stages</h3>
                            {selectedActivity.length ? selectedActivity.map((entry) => (
                              <div key={`${entry.step}-${entry.activity}`} className={`agent-inspector-stage ${entry.status}`}>
                                <span>{entry.step}</span>
                                <div>
                                  <strong>{entry.activity}</strong>
                                  <p>{entry.output}</p>
                                </div>
                              </div>
                            )) : <p>No stage activity has been recorded for this agent.</p>}
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
                      <h3>Activity Log</h3>
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
                      <h3>Safety Cut</h3>
                      <div className="agent-list">
                        {agentWorkflowReport.safetyEvents.map((event) => <p key={event}>{event}</p>)}
                      </div>
                      <h3>Outputs</h3>
                      <div className="agent-list">
                        {agentWorkflowReport.outputs.map((output) => <p key={output}>{output}</p>)}
                      </div>
                      <h3>Recommendations</h3>
                      <div className="agent-list">
                        {agentWorkflowReport.recommendations.map((recommendation) => <p key={recommendation}>{recommendation}</p>)}
                      </div>
                    </div>
                  </div>
                  <p className="context-line">{agentWorkflowReport.productionNote}</p>
                </div>
              ) : (
                <p>No agent run has been generated yet.</p>
              )}
            </article>

            <article className="admin-card admin-wide quality-engine-card">
              <span>Continuous improvement</span>
              <h2>Supervised assessment quality engine</h2>
              <p>
                Telemetry and end-of-assessment feedback automatically identify candidates for revision. Proposed changes remain in a review queue before they can alter a scored assessment.
              </p>
              <div className="admin-kpi-grid compact-kpis">
                <div><span>Started</span><strong>{qualityInsights.started}</strong><small>tracked sessions</small></div>
                <div><span>Abandoned</span><strong>{qualityInsights.abandoned}</strong><small>incomplete exits</small></div>
                <div><span>Mandatory complete</span><strong>{qualityInsights.mandatory}</strong><small>base routes</small></div>
                <div><span>Continued</span><strong>{qualityInsights.continued}</strong><small>optional depth</small></div>
              </div>
              <div className="agent-report-columns">
                <div>
                  <h3>Improvement queue</h3>
                  <div className="agent-list">
                    {qualityInsights.recommendations.map((recommendation) => <p key={recommendation}>{recommendation}</p>)}
                  </div>
                </div>
	                    <div>
	                      <h3>Question candidates</h3>
	                      <div className="admin-list compact">
	                        {qualityInsights.questionRows.length ? qualityInsights.questionRows.map((row) => (
	                          <p key={row.questionId}>
	                            <strong>{row.questionId}</strong>
	                            <small>{row.attempts} attempts · {row.averageScore}/100 · {formatDuration(row.averageDurationMs)} · {row.confusionRate}% confusing</small>
	                          </p>
	                        )) : <p>No item behavior data yet.</p>}
	                      </div>
	                    </div>
	                  </div>
	                  <div className="quality-review-table">
	                    <h3>Item calibration dashboard</h3>
	                    <div className="quality-review-rows">
	                      {qualityInsights.qualityRows.length ? qualityInsights.qualityRows.map((row) => (
	                        <div key={row.questionId} className={`quality-review-row ${row.status}`}>
	                          <span>{row.status}</span>
	                          <strong>{row.questionId}</strong>
                        <div className="calibration-chip-row">
                          <b>{row.actionLabel}</b>
                          <b>{row.domain ?? 'Unknown'} · {row.difficulty ?? 'unmapped'} · {row.interaction}</b>
                          <b>{row.attempts} attempts</b>
                          <b>{row.averageScore}/100 avg</b>
                          <b>{formatDuration(row.averageDurationMs)} avg</b>
                          <b>{row.confusionRate}% confusing</b>
                          <b>{row.artifactOpenRate}% artifact actions/attempt</b>
                          <b>{row.feedbackCount} feedback · {row.unclear} unclear</b>
                          <b>{row.difficultyMismatch}</b>
                        </div>
	                          <small>{row.artifactRequired} · {row.negativeSignals} negative signals</small>
	                          <p>{row.action}</p>
	                        </div>
	                      )) : <p>No item-level feedback has been submitted yet.</p>}
	                    </div>
	                  </div>
	                </article>

            <article className="admin-card admin-wide assessment-quality-suite">
              <div className="admin-card-heading">
                <div>
                  <span>Assessment quality</span>
                  <h2>10-point quality analysis suite</h2>
                </div>
                <small>{adminAnalytics.totalQuestionSignals ? `${adminAnalytics.totalQuestionSignals} saved question signals` : 'Insufficient data until users complete assessments'}</small>
              </div>
              <div className="quality-suite-grid">
                <div>
                  <h3>1. Item discrimination</h3>
                  {assessmentQualityAnalytics.discriminationRows.length ? assessmentQualityAnalytics.discriminationRows.map((row) => (
                    <p key={row.questionId}><strong>{row.questionId}</strong><small>{row.status} · high {row.highCorrect}% vs low {row.lowCorrect}% · gap {row.gap}</small></p>
                  )) : <p>No completed item signals yet.</p>}
                </div>
                <div>
                  <h3>2. Distractor analysis</h3>
                  {assessmentQualityAnalytics.distractorRows.length ? assessmentQualityAnalytics.distractorRows.map((row) => (
                    <p key={row.questionId}><strong>{row.questionId}</strong><small>{row.status} · top wrong {row.topDistractor} · {row.neverChosen} never chosen</small></p>
                  )) : <p>No answer-option data yet.</p>}
                </div>
                <div>
                  <h3>3. Artifact dependency</h3>
                  {assessmentQualityAnalytics.artifactDependencyRows.length ? assessmentQualityAnalytics.artifactDependencyRows.map((row) => (
                    <p key={row.questionId}><strong>{row.questionId}</strong><small>{row.status} · opened {row.opened}/{row.attempts} · score {row.openedScore} vs {row.notOpenedScore} · {row.timeDeltaSeconds}s delta</small></p>
                  )) : <p>No artifact-linked attempts yet.</p>}
                </div>
                <div>
                  <h3>4. Clarity index</h3>
                  {assessmentQualityAnalytics.clarityRows.length ? assessmentQualityAnalytics.clarityRows.map((row) => (
                    <p key={row.questionId}><strong>{row.questionId}</strong><small>risk {row.clarityRisk}/100 · {row.unclear} unclear · {row.confusionRate}% confusing · {row.actionLabel}</small></p>
                  )) : <p>No clarity risk signals yet.</p>}
                </div>
                <div>
                  <h3>5. Difficulty calibration</h3>
                  {assessmentQualityAnalytics.difficultyCalibrationRows.map((row) => (
                    <p key={row.difficulty}><strong>{difficultyLabels[row.difficulty]}</strong><small>{row.status} · {row.count} signals · {row.average}/100 avg · {row.quickHigh} fast-high</small></p>
                  ))}
                </div>
                <div>
                  <h3>6. Competency heatmap</h3>
                  {assessmentQualityAnalytics.competencyHeatmapRows.map((row) => (
                    <p key={row.id}><strong>{row.domain} · {row.label}</strong><small>{row.status} · bank {row.bankCount} · sampled {row.sampled} · {row.average}/100 · {row.difficultySpread}</small></p>
                  ))}
                </div>
                <div>
                  <h3>7. Reliability estimate</h3>
                  {assessmentQualityAnalytics.reliabilityRows.length ? assessmentQualityAnalytics.reliabilityRows.map((row) => (
                    <p key={row.id}><strong>{row.label}</strong><small>{row.status} · {row.questions} questions · {row.sampledDomains} domains · {row.sampledCompetencies} competencies · {row.advancedSignals} hard signals</small></p>
                  )) : <p>No completed runs yet.</p>}
                </div>
                <div>
                  <h3>8. Written rubric audit</h3>
                  {assessmentQualityAnalytics.writtenAuditRows.length ? assessmentQualityAnalytics.writtenAuditRows.map((row) => (
                    <p key={row.questionId}><strong>{row.questionId}</strong><small>{row.status} · {row.attempts} attempts · {row.noRubricHits} no-hit · {row.short} short · {row.average}/100</small></p>
                  )) : <p>No written-response attempts yet.</p>}
                </div>
                <div>
                  <h3>9. Route/persona fit</h3>
                  {assessmentQualityAnalytics.routeFitRows.length ? assessmentQualityAnalytics.routeFitRows.map((row) => (
                    <p key={row.id}><strong>{row.label}</strong><small>{row.status} · {row.detail}</small></p>
                  )) : <p>No completed route snapshots yet.</p>}
                </div>
                <div>
                  <h3>10. Learning/report engagement</h3>
                  {assessmentQualityAnalytics.reportEngagementRows.length ? assessmentQualityAnalytics.reportEngagementRows.map((row) => (
                    <p key={row.area}><strong>{row.area}</strong><small>{row.count} click{row.count === 1 ? '' : 's'}</small></p>
                  )) : <p>No report engagement clicks yet.</p>}
                  <p><strong>Recommendation signals</strong><small>{assessmentQualityAnalytics.recommendationSignals} course/tool/coverage/continuation click{assessmentQualityAnalytics.recommendationSignals === 1 ? '' : 's'}</small></p>
                </div>
              </div>
            </article>

            <article className="admin-card admin-wide telemetry-analysis-card">
              <div className="report-heading">
                <div>
                  <p className="eyebrow">Human review gate</p>
                  <h2>Analyze surveys and behavior before platform edits</h2>
                </div>
                <span>{pendingAgentDraftCount} pending drafts</span>
              </div>
              <p>
                Agents should use telemetry and survey trends to explain what should change, why it matters,
                and which users are affected. A human reviewer approves the next platform edit after seeing the evidence.
              </p>
              <div className="telemetry-grid">
                <div>
                  <h3>Current signals</h3>
                  {telemetryAnalysis.trackedNow.map((item) => <p key={item}>{item}</p>)}
                </div>
                <div>
                  <h3>Analysis questions</h3>
                  {[
                    'Which artifacts trigger zoom/open-file behavior and long answer time?',
                    'Which questions look confusing because users revise often or answer slowly?',
                    'Which competencies remain unsampled or low-confidence after 20 questions?',
                    'Which survey comments point to unrealistic artifacts, unclear wording, or missing topics?',
                  ].map((item) => <p key={item}>{item}</p>)}
                </div>
                <div>
                  <h3>Human decision</h3>
                  {[
                    'Approve, reject, or rewrite each agent proposal.',
                    'Version scored items so historical scores stay explainable.',
                    'Review new artifacts for readability and relevance before release.',
                    'Keep profile collection transparent and useful to the learner.',
                  ].map((item) => <p key={item}>{item}</p>)}
                </div>
              </div>
            </article>

            <article className="admin-card admin-wide artifact-backlog">
              <span>Artifact production</span>
              <h2>Real-document replacement briefs</h2>
              <p>These briefs map every unique visual artifact to the first question that uses it, so realistic replacements can be generated externally and dropped into the same asset path.</p>
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
              <span>Domain trend</span>
              <h2>Lowest average domains</h2>
              <div className="admin-domain-bars">
                {adminAnalytics.domainRows.map((row) => (
                  <div key={row.domain}>
                    <label>{row.domain} · {row.label}</label>
                    <meter min="0" max="100" value={row.average} />
                    <strong>{adminAnalytics.totalRuns ? `${row.average}/100` : 'No data'}</strong>
                    <small>{row.evidence} question signal{row.evidence === 1 ? '' : 's'}</small>
                  </div>
                ))}
              </div>
            </article>

            <article className="admin-card">
              <span>User groups</span>
              <h2>Cohort averages</h2>
              <div className="admin-list">
                {adminAnalytics.groupRows.length ? adminAnalytics.groupRows.map((row) => (
                  <p key={row.key}><strong>{row.label}</strong><small>{row.count} runs · {row.average}/100 · latest {row.lastRun ? new Date(row.lastRun).toLocaleDateString() : 'n/a'}</small></p>
                )) : <p>No saved cohort data yet.</p>}
              </div>
            </article>

            <article className="admin-card">
              <span>Functions</span>
              <h2>Function analysis</h2>
              <div className="admin-list">
                {adminAnalytics.functionRows.length ? adminAnalytics.functionRows.map((row) => (
                  <p key={row.key}><strong>{row.label}</strong><small>{row.count} runs · {row.average}/100 average</small></p>
                )) : <p>No function-specific premium runs yet.</p>}
              </div>
            </article>

            <article className="admin-card">
              <span>Executive roles</span>
              <h2>Role analysis</h2>
              <div className="admin-list">
                {adminAnalytics.executiveRows.length ? adminAnalytics.executiveRows.map((row) => (
                  <p key={row.key}><strong>{row.label}</strong><small>{row.count} runs · {row.average}/100 average</small></p>
                )) : <p>No executive-role runs yet.</p>}
              </div>
            </article>

            <article className="admin-card">
              <span>Competencies</span>
              <h2>Priority gaps</h2>
              <div className="admin-list">
                {adminAnalytics.competencyRows.length ? adminAnalytics.competencyRows.map((row) => (
                  <p key={row.id}><strong>{row.domain} · {row.label}</strong><small>{row.average}/100 · {row.evidence} evidence signals</small></p>
                )) : <p>No competency signal log yet.</p>}
              </div>
            </article>

            <article className="admin-card">
              <span>Difficulty calibration</span>
              <h2>Item difficulty behavior</h2>
              <div className="admin-list compact">
                {adminAnalytics.difficultyRows.map((row) => (
                  <p key={row.label}><strong>{row.label}</strong><small>{row.count} signals · {row.count ? `${row.average}/100` : 'no data'}</small></p>
                ))}
              </div>
            </article>

            <article className="admin-card">
              <span>Formats</span>
              <h2>Question interaction mix</h2>
              <div className="admin-list compact">
                {adminAnalytics.interactionRows.length ? adminAnalytics.interactionRows.map((row) => (
                  <p key={row.label}><strong>{row.label}</strong><small>{row.count} signals · {row.average}/100</small></p>
                )) : <p>No interaction data yet.</p>}
              </div>
            </article>

            <article className="admin-card admin-wide">
              <span>Recent trend</span>
              <h2>Latest assessment runs</h2>
              <div className="admin-run-grid">
                {adminAnalytics.recentRuns.length ? adminAnalytics.recentRuns.map((run) => (
                  <div key={run.id}>
                    <strong>{run.score}/100</strong>
                    <span>{run.mode}</span>
                    <p>{run.label}</p>
                    <small>{run.date}</small>
                  </div>
                )) : <p>No saved runs yet. Complete assessments to populate admin trends.</p>}
              </div>
            </article>
          </div>
        </>
      )}
    </section>
  );
}
