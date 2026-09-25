# Feature Catalog by User Type and Release Stage

## Purpose

This is the living, user-facing feature inventory for New Horizon. It itemizes capabilities for B2C users, B2B members and managers, B2B administrators, specialist platform administrators, and Super Admins. Every feature is assigned a delivery stage so readers can distinguish the current prototype from the go-live MVP, production hardening, and longer-term roadmap.

Update this document whenever a feature is added, removed, materially changed, built, released, paused, or moved between stages. Feature work is not complete until its row, status, relevant specification link, and latest-change entry are updated.

## Status Legend

| Status | Meaning |
| --- | --- |
| **MVP - Built** | Present and demonstrable in the current prototype. It may still use browser-local or demonstration data, support only one user, require manual administration, or lack complete security, monitoring, accessibility verification, recovery, and automated tests. Built does not mean ready for real users. |
| **MVP - Go-live** | Required for the first controlled launch with real users. It needs server-side persistence, authentication and authorization, tenant separation where applicable, consent and privacy controls, stable content/scoring versions, error handling, essential monitoring and tests, backups, audit records, and human approval for material agent recommendations. It may still have limited scale, integrations, automation, and advanced analytics. |
| **Production** | Ready for sustained B2C/B2B commercial operation after the core MVP is proven. It adds operational monitoring and alerts, service objectives, reliable background processing, billing and entitlements, stronger security and compliance, retention/deletion/export operations, controlled releases and rollback, higher-volume analytics, support and incident procedures, and broader load, security, recovery, and integration testing. |
| **Scale** | A production maturity stage introduced only when measured user, event, question-bank, crawling, report, or agent volume requires it. It may add Temporal, ClickHouse, dedicated queues and worker pools, Kubernetes/KEDA, regional infrastructure, and advanced capacity or cost optimization. Scale infrastructure is not required merely because the platform has launched. |
| **Future** | A valuable capability intentionally deferred until demand, evidence, funding, staffing, regulation, psychometric maturity, or prerequisite infrastructure justifies it. It is not committed to the initial production release. |

Where a feature has a prototype and also needs production hardening, it appears once as **MVP - Built** with the limitation stated, and related production work appears as a separate row.

## Stage Exit Criteria

Use these questions when moving a feature between stages:

### MVP - Built to MVP - Go-live

- Is the feature persisted server-side rather than depending on one browser?
- Are authentication, authorization, ownership, and tenant boundaries enforced?
- Are consent, privacy, retention, and audit requirements implemented?
- Are content, configuration, scoring, model, and prompt versions recorded where relevant?
- Are essential error handling, monitoring, tests, backup, and recovery procedures present?
- Can an administrator operate the feature without editing code or local storage?

### MVP - Go-live to Production

- Has real-user evidence shown that the feature is useful and sufficiently stable?
- Are reliability targets, alerts, support ownership, incident handling, and rollback defined?
- Are billing, entitlements, cost controls, security hardening, and compliance operations complete where applicable?
- Have load, security, accessibility, recovery, and integration tests covered expected commercial use?
- Are agent and model decisions traceable, bounded, evaluated, and subject to the required human approvals?

### Production to Scale

- Is there measured queue backlog, database pressure, analytical latency, crawler volume, model throughput, or infrastructure cost that the current architecture cannot handle economically?
- Will the proposed scale component solve that measured constraint?
- Is the team prepared to operate the added infrastructure reliably?
- Can the component be introduced without weakening tenant isolation, auditability, reproducibility, or human control?

The release stage describes operational readiness, not just whether a screen or code path exists. A feature can be **MVP - Built** while still requiring separate **MVP - Go-live**, **Production**, or **Scale** work.

## User Types

- **Public visitor:** not signed in.
- **B2C user:** individual using a personal workspace.
- **B2C Premium user:** individual with paid report and personalization entitlements.
- **B2B member:** person using an organization workspace or campaign.
- **Manager:** organization user permitted to see defined team aggregates.
- **Assessment Manager:** creates and operates assessment campaigns.
- **Learning Manager:** manages learning assignments and development programs.
- **Organization Admin:** manages organization users, teams, policies, and settings.
- **Organization Owner:** controls ownership and highest-risk organization settings.
- **Billing Manager:** manages seats, subscription, usage, and cost views.
- **Organization Auditor:** read-only organization governance role.
- **Specialist platform admin:** Assessment, Content, Agent, Analytics, Billing, Security, Support, or Audit operator.
- **Super Admin:** highest platform-level authority and emergency operator.

## B2C Public and Account Features

| Feature | User | Stage | Notes |
| --- | --- | --- | --- |
| Public product landing page | Public visitor | **MVP - Built** | Includes assessment entry points, peer challenge, scoring/framework guidance, and expandable supporting content. |
| English/Thai interface toggle | Public/B2C | **MVP - Built** | Browser-local selection; translation still requires human QA. |
| Free and Premium entry points | Public visitor | **MVP - Built** | Executive, role, function, and industry context is handled within Premium. |
| Scoring and adaptive-testing explanation | Public visitor | **MVP - Built** | Explains evidence, difficulty adjustment, confidence, and continuation. |
| Global framework crosswalk | Public visitor | **MVP - Built** | References recognized frameworks without claiming certification equivalence. |
| Daily/weekly peer challenge preview | Public visitor | **MVP - Built** | Uses local/demo rows until server-side consented data exists. |
| Anonymous top-ten leaderboard | Public/B2C | **MVP - Built** | Real names require future explicit opt-in. |
| Optional profile-interest pulse | Public/B2C | **MVP - Built** | Stored locally in the prototype. |
| Personalized `Did you know?` content | Public/B2C | **MVP - Built** | Uses profile tags and assessment signals. |
| Learn-by-doing lab previews | Public/B2C | **MVP - Built** | Includes prompting, verification, media, workflow, trust, and next-action activities. |
| Email/Google account authentication | B2C | **MVP - Go-live** | Current authentication is a preview; production requires server-side sessions and policy enforcement. |
| Personal workspace | B2C | **MVP - Go-live** | Separates individual data from all organization contexts. |
| Profile, consent, language, and notification settings | B2C | **MVP - Go-live** | Includes export/deletion request entry points. |
| Free/Freemium/Premium entitlement enforcement | B2C | **MVP - Go-live** | Must be enforced server-side, not only hidden in UI. |
| Account recovery and verified email changes | B2C | **Production** | Includes security notifications and session revocation. |
| MFA and passkey support | B2C | **Production** | Risk-based rollout after core authentication. |
| Portable personal achievement/profile record | B2C | **Future** | User-controlled credential or portfolio export. |

## Assessment Experience

| Feature | User | Stage | Notes |
| --- | --- | --- | --- |
| General Free Assessment | B2C/B2B member | **MVP - Built** | Current route has a 12-question milestone. |
| Premium role/function/industry diagnostic | Premium/B2B member | **MVP - Built** | Current route has a 20-question milestone. |
| Optional onboarding profile survey | B2C/B2B member | **MVP - Built** | Includes self-reported experience and confidence signals. |
| Adaptive starting difficulty | B2C/B2B member | **MVP - Built** | Uses profile signals before observed answers take over. |
| Profile-weighted domain routing | B2C/B2B member | **MVP - Built** | General and professional profiles receive different domain emphasis. |
| Adaptive question selection | B2C/B2B member | **MVP - Built** | Balances profile targets, coverage gaps, difficulty, and item-quality flags. |
| Four difficulty levels | B2C/B2B member | **MVP - Built** | Awareness, applied, proficient, and advanced. |
| Multiple question formats | B2C/B2B member | **MVP - Built** | Single choice, multi-select, ranking, matching, written response, and multi-part. |
| Realistic artifact questions | B2C/B2B member | **MVP - Built** | Artifact relevance and quality remain an active review area. |
| Full-window artifact reader and zoom | B2C/B2B member | **MVP - Built** | Supports text-heavy documents and workflows. |
| Artifact relevance gate | B2C/B2B member | **MVP - Built** | Hides low-value or decorative artifacts. |
| Immediate answer reveal and explanation | B2C/B2B member | **MVP - Built** | Admin configurability is planned. |
| Per-question feedback | B2C/B2B member | **MVP - Built** | Useful/unclear rating and optional comments; browser-local in prototype. |
| Quick feedback state reset | B2C/B2B member | **MVP - Built** | Designed to prevent stale comments across questions and sessions. |
| Mandatory-route completion prompt | B2C/B2B member | **MVP - Built** | Makes the continuation decision visible after the milestone. |
| Adaptive continuation batches | B2C/B2B member | **MVP - Built** | Targets confidence, profile priorities, and unassessed competencies up to a safety cap. |
| Pause and resume across devices | B2C/B2B member | **MVP - Go-live** | Requires persisted server-side sessions. |
| Accessibility-complete keyboard/screen-reader assessment | B2C/B2B member | **MVP - Go-live** | Must be verified across all question formats and artifact controls. |
| Versioned server-side assessment delivery | B2C/B2B member | **MVP - Go-live** | Preserves question, rubric, scoring, profile, and configuration versions. |
| Proctored/high-integrity delivery | B2B member | **Future** | Only if required by credentialing or high-stakes use cases. |

## Scoring, Results, and Learning

| Feature | User | Stage | Notes |
| --- | --- | --- | --- |
| Raw answer evidence scoring | B2C/B2B member | **MVP - Built** | Supports correct, partial, incorrect, and blank responses. |
| Difficulty-adjusted readiness evidence | B2C/B2B member | **MVP - Built** | Difficulty affects readiness interpretation. |
| Domain and competency scoring | B2C/B2B member | **MVP - Built** | Domains without evidence display `Not assessed`. |
| Overall score and readiness belt | B2C/B2B member | **MVP - Built** | Includes answer-quality factor to reduce inflated results. |
| Evidence confidence and continuation rationale | B2C/B2B member | **MVP - Built** | Confidence is separate from correctness. |
| Profile-specific radar target | B2C/B2B member | **MVP - Built** | Targets vary by general, role, function, industry, and leadership context. |
| Report summary and analysis tabs | B2C/B2B member | **MVP - Built** | Separates user priorities from technical evidence. |
| Question-by-question score explanation | B2C/B2B member | **MVP - Built** | Shows prompt, response, expected evidence, raw score, readiness score, and competency. |
| Strengths and priority gaps | B2C/B2B member | **MVP - Built** | Avoids labeling unassessed competencies as weaknesses. |
| Personalized learning path | B2C/B2B member | **MVP - Built** | Derived from weak evidence, profile, and assessment context. |
| Recommended courses, labs, and tools | B2C/B2B member | **MVP - Built** | Current catalog is local/static. |
| Recommended bootcamps and workshops | B2C/B2B member | **MVP - Built** | Includes audience, rationale, outcomes, labs, and framework alignment. |
| End-of-assessment survey and detailed evidence unlock | B2C/B2B member | **MVP - Built** | Prototype exchange uses browser-local state. |
| Registered-user progress dashboard | B2C | **MVP - Built** | Prototype view; multi-device persistence is not complete. |
| Server-persisted reports and history | B2C/B2B member | **MVP - Go-live** | Requires authentication, ownership, and retention controls. |
| Downloadable accessible report | B2C/B2B member | **MVP - Go-live** | Must preserve evidence labels and privacy policy. |
| Premium Report Copilot | Premium/B2B entitled member | **MVP - Go-live** | Bounded, evidence-grounded score, confidence, learning, and recommendation assistant. |
| Copilot learning/reassessment plan | Premium/B2B entitled member | **MVP - Go-live** | Uses approved learning catalog and versioned assessment evidence. |
| Provider-backed dynamic learning catalog | Premium/B2B member | **Production** | Requires source governance, freshness, and human review. |
| Portable credential/certification | B2C/B2B member | **Future** | Requires validated psychometrics and governance beyond readiness guidance. |

## Telemetry, Privacy, and User Controls

| Feature | User | Stage | Notes |
| --- | --- | --- | --- |
| Question timing, changes, hesitation, and interaction telemetry | B2C/B2B member | **MVP - Built** | Browser-local prototype. |
| Answer versus expected-evidence logging | B2C/B2B member | **MVP - Built** | Supports later quality analysis. |
| Artifact open, zoom, and external-open telemetry | B2C/B2B member | **MVP - Built** | Used to assess relevance and readability. |
| Abandonment, continuation, and report-interest telemetry | B2C/B2B member | **MVP - Built** | Browser-local prototype. |
| User-facing telemetry explanation | B2C/B2B member | **MVP - Built** | Explains what is measured and why. |
| Central server-side telemetry | B2C/B2B member | **MVP - Go-live** | Required for cross-device and cross-user analysis. |
| Consent, retention, export, and deletion controls | B2C/B2B member | **MVP - Go-live** | Must cover profile, evidence, feedback, and conversations. |
| Personal result-sharing controls | B2C/B2B member | **MVP - Go-live** | Organization membership does not imply sharing. |
| Privacy center and consent history | B2C/B2B member | **Production** | Includes policy versions and withdrawal effects. |
| User-visible access history | B2C/B2B member | **Future** | Shows organization or support access to personal results where legally appropriate. |
| Thai/English Privacy Notice and Terms acceptance | B2C/B2B member | **MVP - Go-live** | Versioned acceptance; final text requires Thai legal review. |
| Cookie preference center | Public/B2C/B2B | **MVP - Go-live** | Necessary versus optional categories; reject as easy as accept. |
| Data-subject rights request workflow | B2C/B2B member | **MVP - Go-live** | Access, correction, deletion, restriction, objection, portability, and consent withdrawal as applicable. |
| B2B campaign privacy notice | B2B member | **MVP - Go-live** | Identifies controller, purpose, organization visibility, retention, and rights. |
| Retention and deletion schedule | B2C/B2B member | **MVP - Go-live** | Purpose-specific; no indefinite default. |
| Automated cross-system rights fulfillment | B2C/B2B member | **Production** | Covers providers, backups, organizations, and processors. |
| Child/guardian account workflow | Child/guardian | **Future** | Only after age/capacity policy and Thai legal review. |

## B2B Member and Manager Features

| Feature | User | Stage | Notes |
| --- | --- | --- | --- |
| Join organization by invitation | B2B member | **MVP - Go-live** | Invitation must be scoped, expiring, and revocable. |
| Switch between personal and organization workspace | B2B member | **MVP - Go-live** | Active context must be visible. |
| Receive assessment campaign assignment | B2B member | **MVP - Go-live** | Includes purpose, dates, requirements, and sharing notice. |
| Campaign reminders and deadline status | B2B member | **MVP - Go-live** | Notification preferences and escalation rules apply. |
| Explicit campaign result-sharing consent | B2B member | **MVP - Go-live** | Records policy version and user decision. |
| Personal report within an organization campaign | B2B member | **MVP - Go-live** | Member sees their own result regardless of manager aggregate access. |
| Organization-assigned learning actions | B2B member | **MVP - Go-live** | Courses, labs, bootcamps, and reassessment. |
| Team-level privacy-safe dashboard | Manager | **MVP - Go-live** | Aggregate only by default with minimum cohort threshold. |
| Participation and completion view | Manager | **MVP - Go-live** | Scope limited to permitted teams/campaigns. |
| Team competency and learning priorities | Manager | **MVP - Go-live** | Must suppress small cohorts. |
| Reassessment improvement trends | Manager | **Production** | Requires longitudinal, version-aware analytics. |
| Manager action planning | Manager | **Production** | Recommendations must avoid high-impact automated decisions. |
| LMS/LXP/HRIS integrations | B2B member/manager | **Future** | Standards-based integration after core campaign model. |

## B2B Assessment and Learning Manager Features

| Feature | User | Stage | Notes |
| --- | --- | --- | --- |
| Create and preview assessment campaign | Assessment Manager | **MVP - Go-live** | Draft before launch; preview as member. |
| Select assessment template and profile | Assessment Manager | **MVP - Go-live** | Restricted to organization entitlements. |
| Assign users, teams, or cohorts | Assessment Manager | **MVP - Go-live** | Records assignment source and status. |
| Configure dates, attempts, question limits, and reminders | Assessment Manager | **MVP - Go-live** | Material post-launch changes create a new version. |
| Configure report-sharing level | Assessment Manager | **MVP - Go-live** | Cannot exceed organization policy or user notice/consent. |
| Monitor invitations, starts, completions, and failures | Assessment Manager | **MVP - Go-live** | No unauthorized answer inspection. |
| Close, cancel, archive, or schedule reassessment | Assessment Manager | **MVP - Go-live** | Lifecycle is audited. |
| Assign courses, labs, and bootcamps | Learning Manager | **MVP - Go-live** | Uses approved catalog. |
| Track aggregate learning engagement | Learning Manager | **Production** | Applies cohort privacy thresholds. |
| Build organization learning programs | Learning Manager | **Production** | Maps team gaps to sequenced learning. |
| Custom competency/profile templates | Assessment Manager | **Future** | Requires validation and framework governance. |

## B2B Organization Administration

| Feature | User | Stage | Notes |
| --- | --- | --- | --- |
| Create organization | Organization Owner | **MVP - Go-live** | Establishes initial ownership and workspace. |
| Edit organization profile and settings | Owner/Admin | **MVP - Go-live** | Includes language and basic policy settings. |
| Invite, resend, revoke, and expire invitations | Organization Admin | **MVP - Go-live** | Single and reviewed CSV invitation flows. |
| Activate, suspend, and remove memberships | Organization Admin | **MVP - Go-live** | Does not delete personal account. |
| Assign organization roles | Owner/Admin | **MVP - Go-live** | Granular permission enforcement behind roles. |
| Create teams and manage membership | Organization Admin | **MVP - Go-live** | Simple hierarchy for MVP. |
| Allocate and reclaim seats | Organization Admin | **MVP - Go-live** | Shows assigned, invited, suspended, and available seats. |
| View organization audit history | Owner/Admin/Auditor | **MVP - Go-live** | Read access varies by role. |
| Configure result-sharing defaults | Owner/Admin | **MVP - Go-live** | Cannot override required disclosure and consent. |
| Configure minimum cohort size | Owner/Admin | **MVP - Go-live** | Initial recommended default: five completions. |
| Organization usage and LLM budget | Owner/Billing Manager | **MVP - Go-live** | Tenant-level limits and alerts. |
| Subscription and entitlement management | Owner/Billing Manager | **Production** | Integrates billing provider and invoices. |
| Verified organization domains | Owner/Security Admin | **Production** | Supports trusted invitations and SSO. |
| SAML/OIDC SSO | Owner/Security Admin | **Production** | Includes mandatory SSO policy. |
| SCIM provisioning/deprovisioning | Owner/Security Admin | **Future** | Enterprise lifecycle automation. |
| Custom organization roles | Owner/Security Admin | **Future** | Permission-builder UI with safeguards. |
| Business-unit hierarchy and inherited policy | Organization Admin | **Future** | Deferred until simple teams are proven. |
| Data residency, legal hold, and enterprise retention | Owner/Security Admin | **Future** | Region- and contract-specific. |

## B2B Analytics and Billing

| Feature | User | Stage | Notes |
| --- | --- | --- | --- |
| Participation and completion analytics | Assessment Manager/Admin | **MVP - Go-live** | Campaign and team filters. |
| Aggregate domain/competency heatmaps | Manager/Admin | **MVP - Go-live** | Privacy threshold enforced. |
| Coverage and confidence gaps | Manager/Admin | **MVP - Go-live** | Separates unassessed from weak evidence. |
| Learning-priority dashboard | Learning Manager/Admin | **MVP - Go-live** | Aggregate recommendations. |
| Seat utilization | Billing Manager/Admin | **MVP - Go-live** | Assigned, active, invited, and available. |
| LLM requests, tokens, and spend | Billing Manager/Admin | **MVP - Go-live** | Tenant scoped. |
| Average cost per user, assessment, report, and copilot conversation | Billing Manager/Admin | **MVP - Go-live** | Denominator always visible. |
| Named-user drill-down | Authorized Admin | **Production** | Purpose-limited, separately permissioned, and audited. |
| Provider billing reconciliation | Billing Manager | **Production** | Reconciles estimated and invoiced cost. |
| Gross margin and subscription unit economics | Billing Manager/Owner | **Production** | Requires revenue/billing integration. |
| Cross-organization benchmarks | Authorized customer roles | **Future** | Anonymized, consented, and statistically safe. |

## Platform Admin: Assessment and Content

| Feature | User | Stage | Notes |
| --- | --- | --- | --- |
| Admin dashboard preview | Platform admin | **MVP - Built** | Uses local prototype data and preview authentication. |
| Question inventory access from Admin | Assessment/Content Admin | **MVP - Built** | Direct link to review inventory. |
| Draft and live bank review | Content Reviewer | **MVP - Built** | 3,328 draft variants and 634 live items currently exported. |
| Domain, competency, difficulty, format, role, and industry filters | Content Reviewer | **MVP - Built** | Includes filtered counts. |
| English/Thai question review | Content Reviewer | **MVP - Built** | Page-level and item-level language viewing. |
| Reviewer rating, decision, clarity, artifact, format, and comments | Content Reviewer | **MVP - Built** | Browser-local history in prototype. |
| Review count, latest rating, and status filters | Content Reviewer | **MVP - Built** | Supports prioritizing unreviewed/problem items. |
| Artifact-needs briefs and prompts | Content Reviewer | **MVP - Built** | Candidates still require human review. |
| Central review database and multi-reviewer attribution | Content Reviewer | **MVP - Go-live** | Replaces browser-local comments. |
| Question/rubric/artifact versioning | Assessment Admin | **MVP - Go-live** | Required for historical score explanation. |
| Publish and rollback workflow | Assessment Admin | **MVP - Go-live** | Draft, review, pilot, approve, publish, monitor. |
| Translation provider registry and deterministic workload router | Super Admin/Localization Admin | **MVP - Go-live** | Versioned policy, reason codes, approved fallback, budget and human-review gates. |
| Translation quality comparison and approval queue | Localization/Content Reviewer | **MVP - Go-live** | Blind provider pilot, terminology versions, equivalence QA, and human publication decision. |
| Learned or agentic translation routing | Super Admin/AI Operations | **Production** | Only after deterministic-router evidence shows a measurable routing gap. |
| Jev bounded-decision shadow pilot | AI Operations/Quality Admin | **Production** | Pre-production evaluation only; no live authority until each use case passes labelled accuracy, calibration, risk, privacy, fallback, and audit gates. |
| Content conflict and duplicate detection | Content Reviewer | **Production** | Automated assistance with human decision. |

## Platform Admin: Analytics and Quality

| Feature | User | Stage | Notes |
| --- | --- | --- | --- |
| Cohort/function/role/domain/competency analytics preview | Analytics Admin | **MVP - Built** | Local logs and demo data. |
| Ten assessment-quality analysis panels | Analytics/Assessment Admin | **MVP - Built** | Includes discrimination, distractors, artifacts, clarity, difficulty, coverage, reliability, rubric, route fit, and engagement. |
| Item calibration dashboard | Analytics/Assessment Admin | **MVP - Built** | Shows attempts, score/time, confusion, artifact actions, feedback, and mismatch. |
| Pilot-review CSV export | Analytics Admin | **MVP - Built** | Local prototype export. |
| Analytics-readiness checklist | Analytics Admin | **MVP - Built** | Identifies insufficient or local-only data. |
| Server analytics warehouse/views | Analytics Admin | **MVP - Go-live** | RLS-protected and tenant aware. |
| Privacy-safe organization analytics | Analytics/Organization Admin | **MVP - Go-live** | Minimum cohort and anti-reidentification controls. |
| Psychometric calibration jobs | Analytics/Assessment Admin | **Production** | Requires adequate pilot sample sizes. |
| Fairness and differential-item analysis | Analytics/Assessment Admin | **Production** | Reviewed before high-impact use. |
| Longitudinal score stability | Analytics Admin | **Production** | Version-aware comparisons. |

## Platform Admin: Agents and Improvement

| Feature | User | Stage | Notes |
| --- | --- | --- | --- |
| Supervised local Agent Ops | Agent Operator | **MVP - Built** | Deterministic, browser-local prototype. |
| Manual agent run | Agent Operator | **MVP - Built** | Reads local telemetry and creates proposals. |
| Draft proposal approve/reject | Agent Operator/Reviewer | **MVP - Built** | Does not automatically alter scored content. |
| Promotion states and human review gates | Agent Operator/Reviewer | **MVP - Built** | Demonstrated in local workflow. |
| Agent enable/disable controls | Agent Operator | **MVP - Go-live** | Centrally enforced. |
| Hourly/daily/weekly/monthly scheduling | Agent Operator | **MVP - Go-live** | Requires durable server job runner. |
| Per-agent scope, model, budget, retry, and sample-size settings | Agent Operator | **MVP - Go-live** | Versioned configuration. |
| Durable queue, retries, dedupe, and run history | Agent Operator | **Production** | Server-side operations. |
| Agent cost and outcome analytics | Agent/Billing Admin | **Production** | Includes cost per accepted proposal. |
| Automated low-risk publishing | Super Admin/Reviewer | **Future** | Only for explicitly approved low-risk content classes. |

## Platform Admin: Configuration, Models, and Cost

| Feature | User | Stage | Notes |
| --- | --- | --- | --- |
| Assessment count/profile/report/tracker configuration design | Super/Assessment Admin | **MVP - Go-live** | Specification exists; settings UI not yet built. |
| Pilot Operations workspace | Assessment Admin | **MVP - Built** | Browser-local pilot setup, readiness gates, tester preview, issue triage, and CSV exports; not a shared or authorized backend. |
| Pilot status blocked by required readiness gates | Assessment Admin | **MVP - Built** | UI guard prevents Ready/Running while required gates are open; server enforcement and audit are go-live work. |
| Shared pilot records, invitations, and audited launch decisions | Assessment Admin | **MVP - Go-live** | Requires authentication, tenant-scoped persistence, consent, versioning, and audit history. |
| Report visibility by Free/Freemium/Premium | Assessment Admin | **MVP - Go-live** | Hidden, summary, or detailed. |
| Tracker switches and dependency warnings | Analytics/Security Admin | **MVP - Go-live** | Essential audit records cannot be disabled casually. |
| Provider and model registry | Super/Agent Admin | **MVP - Go-live** | Models selected by workload without hardcoding. |
| Secure server-side API secret references | Super/Security Admin | **MVP - Go-live** | Never exposed to browser or logs. |
| Model route, prompt version, fallback, and limits | Super/Agent Admin | **MVP - Go-live** | Grading fallbacks cannot silently change comparability. |
| Append-only LLM usage ledger | Billing/Analytics Admin | **MVP - Go-live** | Links user, assessment, report, agent, provider, model, tokens, and cost. |
| Cost averages and budget alerts | Billing Admin | **MVP - Go-live** | User, assessment, question, report, copilot, and agent metrics. |
| Configuration draft, preview, publish, version, and rollback | Super Admin | **MVP - Go-live** | Audit actor, reason, prior/new values, and effective date. |
| Provider billing reconciliation | Billing Admin | **Production** | Uses effective-dated rates and provider invoices. |
| Feature flags and percentage rollout | Super/Product Admin | **Production** | Includes guardrails and rollback. |
| Multi-tenant configuration overrides | Super Admin | **Production** | Organization policy cannot weaken platform safeguards. |

## Platform Admin: Identity, Security, and Support

| Feature | User | Stage | Notes |
| --- | --- | --- | --- |
| Basic admin preview gate | Platform admin | **MVP - Built** | Not production authorization. |
| Platform and organization role separation | Security/Super Admin | **MVP - Go-live** | Enforced through permissions. |
| Organization membership and invitation lifecycle | Organization/Security Admin | **MVP - Go-live** | Expiring and revocable. |
| RLS tenant isolation | Security Admin | **MVP - Go-live** | Personal and organization contexts fail closed. |
| Append-only admin audit log | Auditor/Security Admin | **MVP - Go-live** | Includes exports, result access, roles, and ownership. |
| Time-bound support access grants | Support/Security Admin | **MVP - Go-live** | Reason, scope, approval, expiry, and visible banner. |
| Reauthentication for high-risk changes | Security/Super Admin | **Production** | Ownership, SSO, exports, secrets, and named results. |
| Two-person approval for critical settings | Security/Super Admin | **Production** | Scoring, privacy, provider secrets, and platform roles. |
| SSO connection management | Security Admin | **Production** | SAML/OIDC and verified domains. |
| SCIM and identity lifecycle automation | Security Admin | **Future** | Enterprise provisioning. |
| Legal hold and regional residency controls | Security Admin | **Future** | Contract and jurisdiction specific. |
| Legal-document version and acceptance management | Security/Super Admin | **MVP - Go-live** | Privacy, Terms, cookies, campaign notices, disclaimers, and policy versions. |
| Consent and lawful-basis register | Privacy/Security Admin | **MVP - Go-live** | Consent is one basis, not a blanket default. |
| Rights-request and retention administration | Privacy/Security Admin | **MVP - Go-live** | Tracks ownership, status, deadline, decision, deletion, and evidence. |
| Subprocessor and transfer register | Security/Super Admin | **MVP - Go-live** | Includes AI providers, countries, purposes, and safeguards. |
| Incident and breach register | Security/Super Admin | **MVP - Go-live** | Supports risk assessment, notification decisions, and remediation. |

## Super Admin Features

| Feature | Stage | Notes |
| --- | --- | --- |
| Platform health and active configuration overview | **MVP - Go-live** | Assessments, agents, trackers, providers, budgets, and warnings. |
| Enable/pause assessment templates and profiles | **MVP - Go-live** | Supports scheduled activation. |
| Emergency pause for scheduled agents | **MVP - Go-live** | Does not delete queued evidence. |
| Emergency disable for optional external AI calls | **MVP - Go-live** | Essential non-AI assessment access should remain available where possible. |
| Global model routes and budgets | **MVP - Go-live** | Workload-specific. |
| Role and permission administration | **MVP - Go-live** | Platform authority only. |
| Configuration validation, preview, publish, and rollback | **MVP - Go-live** | Immutable versions and audit reason. |
| Organization suspension and ownership recovery | **Production** | High-risk, reauthenticated, and audited. |
| Cross-tenant operational analytics | **Production** | Aggregate by default; named drill-down restricted. |
| Global feature flags and experiments | **Production** | Guardrail metrics and rollback. |
| Multi-region and residency administration | **Future** | Requires regional infrastructure. |

## Explicitly Deferred or Prohibited

| Capability | Stage | Rule |
| --- | --- | --- |
| Automatic agent publication of scored content | **Future** | Prohibited until a separately approved low-risk policy exists; scored changes continue to require human approval. |
| Employer access to personal assessment history by membership alone | Not planned | Prohibited. Explicit sharing policy and consent are required. |
| Hidden sensitive profile inference | Not planned | Prohibited. Personalization must remain transparent and consent-aware. |
| Raw API keys in browser settings | Not planned | Prohibited. Secrets remain encrypted server-side. |
| Unexplained raw telemetry in user reports | Not planned | Prohibited. Translate signals into understandable evidence. |
| Certification, hiring, or promotion decisions from MVP scores | Not planned | Prohibited until validation, governance, and appropriate human process exist. |
| General-purpose unrestricted Report Copilot | Not planned | Copilot remains bounded to approved assessment and learning evidence. |

## Maintenance Rule

When a feature changes:

1. Update this catalog's feature row and stage.
2. Update the authoritative detailed specification.
3. Update `docs/LATEST_CHANGES.md`.
4. Update README when the change affects users, operators, setup, or limitations.
5. Update the matching Obsidian note and project MOC.
6. Record the implementation commit or release reference in the change log.
7. Do not mark a feature **MVP - Built** until it is accessible in the current application and has been verified.
8. Do not mark a feature **Production** until server persistence, authorization, privacy, monitoring, failure handling, and audit requirements are satisfied.

## Related Specifications

- [Legal, Privacy, PDPA, and Terms Requirements](LEGAL_PRIVACY_PDPA_TERMS.md)
- [B2C, B2B, and User Administration](B2C_B2B_USER_ADMINISTRATION.md)
- [Admin Settings and Configuration](ADMIN_SETTINGS_CONFIGURATION.md)
- [MVP Requirements Specification](MVP_REQUIREMENTS_SPECIFICATION.md)
- [Telemetry and Agent Orchestration](TELEMETRY_AND_AGENT_ORCHESTRATION.md)
- [Deployment Notes](DEPLOYMENT.md)
- [Latest Changes](LATEST_CHANGES.md)
