# B2C, B2B, and User Administration Specification

## Purpose

New Horizon must support individual consumers, organizations, and platform operators through one identity and authorization architecture. The system should not create separate B2C and B2B applications. A person owns one account and may use a personal workspace while also belonging to one or more organizations.

This document is the authoritative specification for account contexts, tenant isolation, organization administration, roles and permissions, assessment campaigns, result sharing, seats and entitlements, authentication, user lifecycle, and administration safeguards.

The consolidated release-stage inventory is maintained in [Feature Catalog by User Type and Release Stage](FEATURE_CATALOG_BY_USER_AND_RELEASE.md).

## Design Principles

- One person has one account and may use multiple workspaces.
- Personal and organization data contexts remain distinct.
- Joining an organization does not automatically expose personal assessment history.
- Every assessment records the active workspace, entitlement, campaign, profile, and configuration version.
- Authorization uses granular permissions behind named roles.
- Organization analytics default to privacy-safe aggregates.
- Administrative access and support access are explicit, time-bound where appropriate, and audited.
- Removing organization membership does not automatically delete the person's account.
- Historical assessment records preserve the tenant, consent, assessment, scoring, and report policy versions that applied at the time.

## Account and Workspace Model

```text
User
├── Personal workspace
├── Organization A membership
└── Organization B membership
```

A user must choose or be shown the active workspace when an action could affect ownership, billing, assignment, reporting, or data visibility.

Each user-owned record should contain one of:

- `personal_workspace_id`
- `organization_id`

Organization-owned records should also carry the relevant team, campaign, subscription, and entitlement identifiers where applicable.

## B2C Experience

Individual users should be able to:

- register using email, Google, or another approved identity provider
- use the platform without an organization
- access Free, Freemium, or Premium entitlements
- manage profile, language, consent, and notification preferences
- take assessments, continuation routes, and reassessments
- view personal reports, learning paths, and progress
- use the Premium Report Copilot when entitled
- download, share, export, or delete permitted personal data
- control whether a result may be shared with an organization
- join an organization later without losing personal history

Platform support for a B2C account may include account status, entitlement, assessment history, consent/deletion requests, abuse controls, and restricted support access. Support impersonation, if implemented, must require a reason, use a time-limited grant, display a visible banner, and write a complete audit event.

## B2B Organization Model

An organization should contain:

- organization profile and verified domains
- subscription, plan, seat limits, and entitlements
- workspaces, business units, teams, and cohorts
- members, roles, and invitations
- assessment campaigns and assignments
- organization-approved profiles and assessment templates
- report and result-sharing policies
- aggregate analytics and benchmarks
- learning programs and reassessment schedules
- branding, language, and notification settings
- retention, deletion, and export policies
- SSO and identity-provider settings
- LLM provider, model-routing, budget, and usage policies
- configuration versions and audit history

Recommended structure:

```text
Organization
├── Business units
├── Teams and cohorts
├── Members and roles
├── Assessment campaigns
├── Learning programs
├── Reports and benchmarks
└── Billing, AI usage, and audit records
```

## Platform Roles

Platform roles apply across New Horizon and must be limited to authorized operators.

| Role | Primary responsibilities |
| --- | --- |
| Super Admin | Global configuration, emergency controls, and role administration |
| Security Admin | Identity providers, permissions, security policy, and access reviews |
| Assessment Admin | Assessment templates, profiles, routing, and scoring versions |
| Content Reviewer | Questions, artifacts, rubrics, learning content, and translations |
| Agent Operator | Agent schedules, model routes, budgets, and proposal queues |
| Analytics Admin | Platform analytics, approved drill-downs, and exports |
| Billing Admin | Plans, subscriptions, AI cost, and unit economics |
| Support Agent | Restricted troubleshooting and approved support access |
| Auditor | Read-only configuration, approval, access, and audit history |

## Organization Roles

| Role | Primary responsibilities |
| --- | --- |
| Organization Owner | Organization authority, ownership transfer, and critical settings |
| Organization Admin | Members, teams, roles, and organization configuration |
| Assessment Manager | Campaigns, assignments, reminders, and authorized results |
| Learning Manager | Courses, labs, bootcamps, and learning programs |
| Manager | Permitted team aggregates and assigned actions |
| Reviewer | Assigned evidence or content review where applicable |
| Member | Assessments, reports, learning, and personal settings |
| Billing Manager | Seats, invoices, subscription usage, and cost views |
| Organization Auditor | Read-only organization activity and configuration history |

Roles are convenience bundles. Application code should authorize granular permissions such as `campaign.create`, `member.invite`, `result.aggregate.read`, or `billing.read`, rather than scattering role-name checks throughout the codebase.

## User and Membership Administration

Authorized admins should be able to:

- invite one user or upload a reviewed CSV invitation list
- resend, cancel, and expire invitations
- assign and remove roles
- add or remove team memberships
- activate, suspend, and remove organization memberships
- transfer organization ownership
- allocate and reclaim seats
- assign campaigns and learning programs
- require terms, policy, or consent acceptance
- see last sign-in, invitation, assignment, and completion status
- export permitted member lists
- process access, correction, deletion, and portability requests
- view a complete audit trail of role and permission changes

Invitation records should include inviter, organization, proposed role, email/domain, issue time, expiry, acceptance time, and status. Invitations must not grant access after expiry or revocation.

Suspending a membership blocks organization access without deleting historical organization records. Removing a membership does not delete the person's account or personal workspace.

## Seat and Entitlement Management

Plans and seats should control capabilities through entitlements rather than UI-only checks.

Configurable entitlements may include:

- active members and seat count
- assessment types and campaigns
- assessments or reports per period
- Premium Report Copilot messages
- organization analytics and exports
- custom profiles and branding
- LLM usage and monthly budget
- agent runs
- retention duration
- SSO or SCIM availability

Admins should see assigned, available, invited, suspended, and over-limit seats. Seat changes and entitlement overrides must be versioned and audited.

## Assessment Campaigns

Organization Assessment Managers should be able to configure:

- campaign name, purpose, owner, and internal reference
- target teams, cohorts, or users
- assessment template and profile
- opening, closing, and reassessment dates
- required or optional participation
- invitation and reminder schedule
- question, duration, continuation, and attempt limits
- language and accessibility options
- report visibility and result-sharing policy
- individual versus aggregate manager access
- minimum cohort size
- assigned learning path, course, lab, or bootcamp
- completion and success criteria

Campaign state should support `draft`, `scheduled`, `open`, `closed`, `archived`, and `cancelled`.

Admins must preview a campaign as a member before launch. Material changes after launch should create a new campaign version and must not silently change completed users' score interpretation.

## Result Ownership and Sharing

Use explicit result-sharing levels:

1. `private`: visible only to the user and authorized platform operations.
2. `shared-summary`: selected score, domain, and learning-priority information.
3. `campaign-result`: information defined by campaign notice and accepted consent.
4. `aggregate-only`: included in cohort analytics without individual disclosure.
5. `reviewer-access`: purpose-bound, time-limited access granted to an approved reviewer.

Campaign enrollment must clearly tell the user:

- who commissioned the assessment
- what information the organization will receive
- whether participation is required
- how long data will be retained
- whether results affect any organizational process
- how to request access, correction, or deletion where applicable

Employers and managers should not receive private answer text, free-text feedback, Report Copilot conversations, or detailed behavioral telemetry by default.

## Cohort Privacy

Organization dashboards should use minimum cohort thresholds before displaying breakdowns. A configurable initial default is five completed assessments.

The system should suppress or combine small segments and prevent filtering combinations that reveal an individual. Exports must apply the same rules as on-screen reports.

Anonymous leaderboard and benchmark data must not be reversible through names, rare profile combinations, or very small cohorts.

## B2B Analytics

Authorized organization dashboards should support:

- invitations, participation, starts, and completions
- aggregate domain and competency results
- evidence confidence and unassessed coverage
- role, team, and cohort gaps
- learning priorities and assigned actions
- course, lab, bootcamp, and Report Copilot engagement
- reassessment improvement
- question-quality and data-quality warnings
- seat utilization
- LLM usage and budget consumption
- cost per assigned assessment
- cost per started and completed assessment
- cost per generated report and active user

Named-user drill-down must be separately permissioned, purpose-limited, and audited. Operational dashboards should prefer aggregates.

## Admin Access and Support Controls

High-risk actions require reauthentication and, where indicated, two-person approval:

- changing organization ownership
- changing SSO configuration
- exposing named-user results
- exporting identifiable assessment data
- altering retention or deletion policy
- changing scoring or grading model configuration
- changing provider secrets or global budgets
- granting platform-wide administrative access

Support-access grants should record requester, approver, user/tenant scope, reason, expiry, actions performed, and revocation time.

## Authentication Roadmap

### MVP

- email and Google authentication
- personal workspaces
- organization creation
- invitations and membership lifecycle
- Platform Admin, Organization Admin, Assessment Manager, and Member roles
- teams and campaign assignments
- explicit result-sharing policy
- row-level personal and organization isolation
- audit log for admin and membership changes

### Post-MVP

- Microsoft Entra ID and Google Workspace federation
- SAML and OIDC SSO
- verified organization domains
- mandatory organization SSO
- MFA policies
- SCIM provisioning and deprovisioning
- just-in-time membership
- custom roles
- enterprise retention, legal hold, and data residency

## Recommended Data Model

- `users`
- `personal_workspaces`
- `organizations`
- `organization_domains`
- `organization_memberships`
- `roles`
- `permissions`
- `role_permissions`
- `teams`
- `team_memberships`
- `invitations`
- `subscriptions`
- `entitlements`
- `seat_assignments`
- `assessment_campaigns`
- `campaign_versions`
- `campaign_assignments`
- `result_sharing_policies`
- `result_sharing_consents`
- `support_access_grants`
- `identity_connections`
- `audit_events`

Assessment, response, report, telemetry, LLM usage, and agent-run records should also retain workspace/organization and campaign context where applicable.

## Row-Level Security Requirements

Database policies must enforce:

- users can access their personal workspace records
- organization members can access only records permitted by their active membership and permissions
- organization data cannot be read by another organization
- personal results are not organization-readable without an applicable sharing policy and consent record
- suspended or removed memberships cannot access organization resources
- platform support and admin access is explicit and audited
- service roles are restricted to narrowly defined server workflows

RLS tests must cover cross-tenant reads, guessed identifiers, stale invitations, suspended memberships, role changes, exports, report links, and support access.

## Audit Events

Audit events should capture:

- actor and effective role
- personal or organization context
- action and affected resource
- prior and new values where appropriate
- reason and approval reference
- timestamp, request ID, and network/device security metadata
- outcome

Audit logs should be append-only, retention-controlled, searchable by authorized auditors, and excluded from ordinary member deletion where legal/security requirements apply.

## MVP Delivery Scope

Build first:

1. Personal and organization workspaces
2. Organization creation and invitations
3. Platform Admin, Organization Admin, Assessment Manager, and Member roles
4. Teams and assessment campaigns
5. Explicit result-sharing rules and consent
6. Privacy-safe organization dashboard
7. Seat and plan entitlements
8. User lifecycle and audit log
9. Tenant-scoped LLM budgets and usage
10. RLS and cross-tenant authorization tests

Defer full SSO, SCIM, custom role builders, legal hold, complex business-unit inheritance, and multi-region residency until the core tenant and permission model is proven.

## Acceptance Criteria

- A B2C user can complete an assessment without an organization.
- A user can join multiple organizations and switch active context.
- Personal results remain private unless explicitly shared.
- An Organization Admin can invite, suspend, remove, and assign members without gaining unauthorized result access.
- An Assessment Manager can launch a versioned campaign and see only permitted results.
- Small cohort filters cannot expose individual results.
- Removing membership preserves personal access and organization audit history.
- Cross-tenant access tests fail closed.
- All role, permission, result-sharing, export, support-access, and ownership changes are audited.
- Tenant-level LLM usage, cost, and budget data reconcile with usage-ledger events.

## Related Specifications

- [Admin Settings and Configuration](ADMIN_SETTINGS_CONFIGURATION.md)
- [MVP Requirements Specification](MVP_REQUIREMENTS_SPECIFICATION.md)
- [Deployment Notes](DEPLOYMENT.md)
- [Telemetry and Agent Orchestration](TELEMETRY_AND_AGENT_ORCHESTRATION.md)
