# Legal, Privacy, PDPA, and Terms Requirements

## Status and Legal Review

This document is a product, engineering, and drafting specification. It is not legal advice and is not a final Privacy Notice, Terms of Use, Data Processing Agreement, or consent form. Before public launch, qualified Thai counsel must review the actual business entity, service model, data flows, age groups, cross-border transfers, payment terms, B2B contracts, and every user-facing legal document in Thai and English.

The primary Thai reference is the [Personal Data Protection Act B.E. 2562 (2019)](https://www.ocs.go.th/searchlaw/law-index/item/224). The Office of the Personal Data Protection Committee's Government Platform for PDPA Compliance provides official operational resources for [consent management](https://gppc.pdpc.or.th/portfolio/operational-training-installation-course-1-content-3/), [data-subject request management](https://gppc.pdpc.or.th/portfolio/operational-training-installation-course-1-content-5/), [breach management](https://gppc.pdpc.or.th/portfolio/operational-training-installation-course-1-content-4/), and [cookie-banner design](https://gppc.pdpc.or.th/wp-content/uploads/%E0%B8%84%E0%B8%B9%E0%B9%88%E0%B8%A1%E0%B8%B7%E0%B8%AD%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B8%AD%E0%B8%AD%E0%B8%81%E0%B9%81%E0%B8%9A%E0%B8%9A%E0%B9%81%E0%B8%A5%E0%B8%B0%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B9%83%E0%B8%8A%E0%B9%89%E0%B8%87%E0%B8%B2%E0%B8%99%E0%B8%84%E0%B8%B8%E0%B8%81%E0%B8%81%E0%B8%B5%E0%B9%89%E0%B9%81%E0%B8%9A%E0%B8%99%E0%B9%80%E0%B8%99%E0%B8%AD%E0%B8%A3%E0%B9%8C.pdf). These sources must be checked again before release because regulations and official guidance may change.

## Purpose

New Horizon processes identity, profile, assessment, behavior, feedback, report, learning, organization, billing, and AI-usage information. The platform must define why each category is processed, its lawful basis, who receives it, where it is stored, how long it is retained, and how a person can exercise rights.

Legal controls must be implemented in product behavior and data architecture, not only described in documents.

## Required Legal Document Set

The go-live document set should include:

1. Privacy Notice for B2C users and public visitors
2. Organization/Campaign Participant Privacy Notice
3. Terms of Use
4. Acceptable Use Policy
5. Cookie Notice and preference center
6. Assessment and AI Disclaimer
7. B2B Master Service Agreement or commercial terms
8. Data Processing Agreement where New Horizon acts as processor
9. Controller-to-controller data-sharing terms where applicable
10. Subprocessor and international-transfer disclosure
11. Retention and deletion schedule
12. Data-subject rights request form and procedure
13. Child/guardian notice and consent process where minors are permitted
14. Security and personal-data breach response procedure
15. Internal Record of Processing Activities
16. Admin/support access policy
17. Version and change-notification history for all legal documents

## PDPA Role Mapping

The role must be decided per processing purpose, not once for the whole platform.

| Scenario | Likely New Horizon role | Other party | Required decision/document |
| --- | --- | --- | --- |
| Individual creates personal account | Controller | Individual is data subject | B2C Privacy Notice and Terms |
| Individual takes personal assessment | Controller | Individual is data subject | Purpose/lawful-basis record and retention policy |
| Organization assigns assessment and defines purpose/results | Processor or joint/separate controller depending facts | Organization may be controller | Legal analysis, MSA/DPA, campaign notice, sharing rules |
| New Horizon uses de-identified aggregate data to improve item quality | Controller for its own improvement purpose | Organization/user context | Compatibility/legal-basis assessment and notice |
| Payment processing | Controller for purchase records; payment provider is separate controller or processor by contract | Payment provider | Payment notice and provider terms |
| LLM provider processes report/copilot prompt | Controller or processor chain depends workspace context | AI provider/subprocessor | DPA, transfer safeguards, disclosure, data-minimization controls |
| Support operator accesses user account | Controller/processor according to context | Support provider/staff | Time-bound access, confidentiality, audit record |

Counsel must confirm each role and contract. The application must store the applicable controller/processor context, organization, campaign, policy version, and consent/notice record with the processing event.

## Data Inventory

### Account and Identity

- name, display name, email, authentication provider, provider identifier
- language, timezone, locale, notification preferences
- account, membership, role, invitation, and security status
- session, device, IP, and security-event metadata where justified

### Profile and Personalization

- audience, role, function, industry, organization, team
- self-reported AI experience and confidence
- tools, workflows, learning interests, profile tags, and optional survey answers
- explicit and inferred preference signals disclosed to the user

Avoid collecting special-category data unless necessary, approved, and supported by an appropriate legal basis and safeguards. Free-text fields must warn users not to enter health, biometric, political, religious, union, sexual-life, criminal, financial-account, national-identity, or third-party confidential information unless a specifically approved workflow requires it.

### Assessment Evidence

- questions presented and versions
- answers, text responses, expected answers, rubrics, and partial-credit evidence
- scores, domain/competency results, confidence, coverage, and readiness belt
- question timing, revisions, interactions, hesitation indicators, and continuation choices
- artifact opens/zoom, feedback, survey responses, and report engagement

### Learning and Reports

- strengths, gaps, recommendations, learning plans, courses, labs, bootcamps
- generated reports and downloads
- Report Copilot questions, responses, feedback, and linked actions where retention is enabled

### B2B and Administration

- organization, team, campaign, assignment, seat, entitlement, and billing records
- result-sharing policy and consent
- admin actions, exports, support access, approval decisions, and audit events

### AI and API Usage

- provider, model, prompt/configuration version, token/unit usage, latency, errors, fallback, and cost
- pseudonymous user, assessment, report, question, conversation, and agent-run identifiers

Full prompts and outputs should not be retained by default merely because an API was called. Retention must follow the declared purpose and diagnostic policy.

## Purpose and Lawful-Basis Register

Do not ask for consent for every activity. Determine and document the appropriate basis for each purpose with counsel.

| Processing purpose | Candidate basis requiring legal confirmation | User control |
| --- | --- | --- |
| Create and secure account | Contract, legal obligation, or legitimate interests as applicable | Account closure and rights request |
| Deliver requested assessment and report | Contract or steps requested before contract | Stop assessment; account/data controls subject to retention duties |
| Store score/report history | Contract and/or legitimate interests depending service | Delete/history settings subject to obligations |
| Personalize route and learning recommendations | Contract, legitimate interests, or consent depending signal | Explain, disable optional personalization, correct profile |
| Optional profile pulse and optional surveys | Consent or legitimate interests depending implementation | Skip and withdraw where consent is used |
| Essential security and fraud monitoring | Legal obligation and/or legitimate interests | Cannot disable essential controls; rights still apply |
| Product and question-quality analytics | Legitimate interests, consent, or anonymized processing depending design | Analytics preference where required; object/request rights |
| Nonessential analytics/marketing cookies | Consent | Accept, reject, granular choice, withdraw |
| Leaderboard participation with alias/name | Consent | Default anonymous; opt in and withdraw |
| B2B campaign and organization reporting | Contract/legal relationship plus disclosed controller instructions | Campaign notice and result-sharing choice where applicable |
| Report Copilot | Contract/requested service; separate consent for optional retention or training | Clear start action, delete conversation, retention choice |
| Marketing email | Consent or other legally permitted basis | Unsubscribe at any time |
| Model/question improvement from identifiable content | Separate compatibility/basis assessment; consent where required | Clear choice; never silently train on private responses |

For every purpose, maintain owner, data categories, data subjects, recipients, systems, locations, basis, retention, security controls, transfer mechanism, and rights impact.

## Privacy Notice Requirements

The Thai and English Privacy Notices must be concise, layered, accessible, and available before or at collection. They should explain:

- identity and contact details of the controller
- DPO/contact channel where applicable
- categories and sources of personal data
- each purpose and lawful basis
- consequences where required information is not provided
- recipients and categories of recipients
- processors, AI providers, and relevant subprocessors
- international transfers and safeguards
- retention periods or criteria
- data-subject rights and request process
- complaint route to the PDPC
- automated/adaptive processing and meaningful explanation of its role
- whether information is required or optional
- leaderboard, B2B campaign, report-sharing, telemetry, and Copilot handling
- effective date, version, and material-change notification

Use just-in-time notices beside profile surveys, assessment telemetry explanations, campaign enrollment, result sharing, leaderboards, Report Copilot, file uploads, and free-text fields.

## Data-Subject Rights

Subject to applicable conditions and exceptions, the rights workflow should support:

- access and copy
- correction
- deletion or anonymization
- restriction of processing
- objection
- data portability where applicable
- withdrawal of consent without affecting earlier lawful processing
- complaint/contact route

The rights portal must:

- verify identity proportionately
- record request type, scope, received date, status, owner, response deadline, decision, and evidence
- search personal, organization, assessment, report, feedback, telemetry, Copilot, billing, and backup contexts
- route organization-controlled requests to the correct controller under the DPA
- explain denials or limitations and the complaint route
- preserve an audit record without retaining unnecessary request content

Do not promise a universal fixed response period in user copy until Thai counsel confirms the applicable statutory and regulatory deadline for each request type.

## Consent Management

Where consent is used, it must be freely given, specific, informed, unambiguous, distinguishable, and demonstrable. Avoid bundled consent and preselected optional choices.

Consent records should contain:

- user/data-subject identifier
- purpose and data categories
- exact notice/consent text and language
- policy version
- collection surface
- timestamp and evidence
- guardian authority where relevant
- withdrawal timestamp and downstream action

Withdrawing optional consent should be as easy as giving it. Withdrawal must propagate to dependent trackers, marketing, leaderboard display, optional personalization, retained Copilot content, or other linked processing where applicable.

## Children and Young Users

The platform must decide and publish its minimum age and whether it permits child accounts, school-managed accounts, or educator-created campaigns.

Before supporting minors:

- obtain Thai legal advice on capacity and parental-authority requirements under PDPA section 20 and applicable civil law
- use age-appropriate Thai and English notices
- implement verified parent/guardian or authorized-school workflow where required
- minimize profile, telemetry, leaderboard, and free-text collection
- disable public identity display by default
- prohibit behavioral advertising
- define guardian access without exposing unrelated personal data
- document controller roles for schools and New Horizon
- provide child-safety reporting and deletion/escalation paths

Until this workflow is legally reviewed and implemented, the Terms should set a clear minimum age and state that unauthorized child use is not permitted.

## Cookies and Similar Technologies

Classify each cookie, SDK, local-storage key, pixel, and device identifier:

- strictly necessary
- preferences/functionality
- analytics
- advertising/marketing

Requirements:

- necessary technologies may operate only for necessary purposes
- nonessential categories remain off until valid consent where required
- `Reject nonessential` must be as easy to use as `Accept all`
- provide granular category choices
- do not use preselected optional categories
- store consent version and timestamp
- allow preference changes and withdrawal from every page
- block tags before consent rather than only hiding the banner
- rescan after releases and provider changes
- publish purpose, provider, duration, and category

The current browser-local MVP keys must also appear in the internal technology inventory even when they are not cookies.

## Retention and Deletion

Retention periods must be purpose-based and approved before launch. Do not use “keep indefinitely” as a default.

The schedule should separately cover:

- unverified accounts and expired invitations
- active and closed accounts
- assessment responses and score evidence
- reports and downloads
- question/assessment feedback
- raw telemetry and derived aggregates
- Report Copilot conversations
- organization campaigns and assignments
- billing/tax records
- security and audit logs
- consent and policy-acceptance evidence
- agent proposals and AI usage ledgers
- backups and disaster-recovery copies

Deletion workflows should support hard deletion, irreversible anonymization, legal hold, processor deletion instructions, backup expiry, and confirmation records. Aggregates may be retained only when they are genuinely non-identifiable and reidentification risk has been assessed.

## Security and Access

Required controls include:

- least privilege and role-based permissions
- personal/organization row-level isolation
- encryption in transit and at rest
- secret management and key rotation
- MFA for privileged administrators
- secure development, dependency, and vulnerability management
- access logging, monitoring, and alerting
- time-bound audited support access
- export controls and download logging
- backup, recovery, and tested deletion procedures
- vendor/subprocessor security review
- incident-response exercises

## Personal-Data Breach Response

Maintain an incident workflow that can:

- receive and triage security/privacy reports
- contain the incident and preserve evidence
- identify affected systems, data, users, organizations, countries, and processors
- assess likelihood and severity of risk
- notify affected controllers in processor scenarios without undue delay under contract
- support notification to the PDPC within the legally applicable period where required
- notify affected data subjects when the legal risk threshold is met
- document reasons where notification is not required
- track remediation and lessons learned

The PDPA includes a 72-hour authority-notification concept for qualifying breaches; counsel and the incident team must apply the exact statutory/regulatory test to the facts rather than treating every event identically.

## International Transfers and Subprocessors

Before sending personal data outside Thailand or allowing foreign remote access:

- identify destination and recipient
- determine adequacy or another permitted safeguard
- execute required contractual terms
- evaluate onward transfers and government-access risk
- minimize fields and retention
- list relevant subprocessors and purposes
- provide required notice and change mechanism
- preserve transfer assessment and approval

Model/API routing must respect tenant restrictions and data-residency settings. A lower-cost fallback cannot route data to an unapproved country or provider.

## B2B Data Processing Agreement

Where New Horizon acts as processor, the DPA should address:

- subject matter, duration, nature, and purpose
- data-subject and data-category descriptions
- documented controller instructions
- confidentiality and authorized personnel
- security measures
- subprocessors and change notification
- international transfers
- rights-request assistance
- DPIA/regulatory assistance where applicable
- incident notification and cooperation
- return/deletion at end of service
- audit and evidence rights
- organization configuration and responsibility boundaries
- use of aggregated/de-identified service-improvement data

Campaign configuration must not permit an organization admin to collect or view more data than the signed agreement and participant notice allow.

## Terms of Use Requirements

The Terms should include:

- contracting entity and contact details
- eligibility, minimum age, and authority to accept
- account registration, credentials, and security
- personal versus organization workspace rules
- plans, subscriptions, trials, renewal, taxes, cancellation, and refunds
- license to use the service
- ownership of platform, questions, reports, artifacts, and trademarks
- limited license for user-submitted content needed to provide the service
- confidentiality and prohibition on uploading unauthorized third-party data
- acceptable use and prohibited conduct
- assessment integrity and restrictions on copying/distributing question banks
- AI-generated output limitations
- assessment, scoring, confidence, and recommendation limitations
- no certification, employment, legal, medical, financial, or other high-stakes guarantee
- user responsibility and human review
- service availability, changes, suspension, and termination
- third-party services and learning links
- disclaimers, liability limits, and indemnity subject to Thai law and consumer protections
- governing law, dispute process, and jurisdiction confirmed by counsel
- document version, effective date, and material-change notice

Users must affirmatively accept the Terms during account creation or before first protected use. Store the accepted version, language, timestamp, and context. Material changes should require a new notice and, when appropriate, renewed acceptance.

## Acceptable Use Policy

Prohibit:

- unlawful, harmful, fraudulent, harassing, discriminatory, or abusive use
- attempts to identify or expose other users
- unauthorized personal, confidential, copyrighted, or regulated data uploads
- malware, credential theft, security testing without permission, or service disruption
- automated scraping, copying, resale, or reconstruction of the question bank
- bypassing assessment limits, impersonation, collusion, or score manipulation
- using reports as the sole basis for prohibited or high-impact decisions
- attempts to extract system prompts, secrets, hidden answer keys, or private reasoning
- using the Report Copilot outside its approved assessment/learning purpose

Enforcement should be proportionate and auditable, with warning, content restriction, suspension, termination, and appeal paths where appropriate.

## Assessment and AI Disclaimer

The user interface and Terms should state clearly:

- scores estimate readiness from sampled evidence and are not absolute ability measures
- confidence reflects evidence sufficiency, not certainty or correctness
- unassessed domains are not scored weaknesses
- benchmark quality depends on cohort size and data maturity
- recommendations are educational guidance, not professional advice
- the product is not certification-grade until validated and expressly designated
- results should not be the sole basis for hiring, promotion, termination, admission, credit, healthcare, legal, or similar high-impact decisions
- AI-generated explanations may contain errors and must remain grounded in the displayed assessment record
- users can report confusing questions, artifacts, scores, or Copilot responses

## Report Copilot Legal Controls

- Show a just-in-time notice before first use.
- Explain whether conversation content is stored and for how long.
- Do not use private conversations for model training or scored-content changes without a separate approved basis and notice.
- Minimize the context sent to providers.
- Redact unnecessary identifiers and third-party data.
- Respect organization provider, transfer, and retention policy.
- Provide conversation deletion where applicable.
- Do not expose hidden chain-of-thought or other users' data.
- Keep the assistant bounded to approved assessment and learning evidence.

## Leaderboards and Peer Benchmarks

- Use anonymous or pseudonymous labels by default.
- Require explicit opt-in before displaying a real name or chosen alias publicly.
- Explain audience, duration, cohort, ranking logic, and withdrawal effect.
- Apply minimum cohort thresholds and anti-reidentification controls.
- Do not expose rare role/industry combinations that identify a person.
- Separate public leaderboards from private organization benchmarks.

## Admin and Product Requirements

Admin must provide:

- legal-document version management
- Thai/English content and effective dates
- required acceptance and reacceptance rules
- lawful-basis and purpose register
- consent records and withdrawal status
- cookie/technology inventory
- retention schedule and deletion jobs
- rights-request queue and deadlines
- subprocessor/transfer register
- incident and breach register
- DPA and organization-controller mapping
- DPO/privacy contact settings
- access/export audit logs
- legal hold where introduced

Legal settings must be permission-restricted. Changes to notices, consent, retention, subprocessors, transfer routes, or data-sharing rules require review, preview, versioning, and audit history.

## Delivery Stages

### MVP - Go-live

- Thai/English Privacy Notice and Terms reviewed by counsel
- Acceptable Use and Assessment/AI Disclaimer
- cookie/technology inventory and compliant preference center
- policy acceptance and consent evidence
- campaign participant notice and result-sharing consent
- basic rights-request intake and tracked workflow
- approved retention schedule and deletion process
- controller/processor role map and initial DPA
- subprocessor list and server-side provider controls
- incident/breach response plan
- personal/organization isolation and access audit

### Production

- automated rights fulfillment across all systems
- mature ROPA, DPIA/legitimate-interest workflows where applicable
- provider billing/transfer reconciliation
- scheduled retention and verified deletion jobs
- DPO dashboard and access review
- tested incident exercises and processor notification workflow
- policy-change notification and reacceptance automation
- vendor/subprocessor review lifecycle

### Future

- child/guardian accounts after legal review
- school-specific parent/guardian workflows
- multi-region residency and transfer routing
- legal hold and litigation preservation
- jurisdiction-specific notice packs beyond Thailand
- user-visible personal-data access history

## Release Gate

Public multi-user launch must not proceed until the responsible owner confirms:

- legal entity and contact details are final
- Thai counsel approved the Terms, notices, lawful-basis map, age policy, and B2B role allocation
- every production tracker/provider is in the data inventory
- consent and cookie controls technically block nonessential processing where required
- rights, deletion, breach, and support-access workflows have owners and tests
- organization campaigns cannot override participant notice and sharing restrictions
- RLS and cross-tenant tests pass
- legal documents are versioned, accessible, and linked in product surfaces

## Maintenance Rule

Review this document whenever a tracker, profile field, question format, report section, AI provider, model route, Copilot capability, B2B campaign field, subprocessor, country, payment flow, age group, or data-sharing feature changes. Update the feature catalog, Privacy Notice, Terms, cookie inventory, ROPA, retention schedule, DPA/subprocessor list, and latest-change log as applicable.

## Related Specifications

- [Feature Catalog by User Type and Release Stage](FEATURE_CATALOG_BY_USER_AND_RELEASE.md)
- [B2C, B2B, and User Administration](B2C_B2B_USER_ADMINISTRATION.md)
- [Admin Settings and Configuration](ADMIN_SETTINGS_CONFIGURATION.md)
- [Telemetry Tracking Purpose](TELEMETRY_TRACKING_PURPOSE.md)
- [Telemetry and Agent Orchestration](TELEMETRY_AND_AGENT_ORCHESTRATION.md)
- [Deployment Notes](DEPLOYMENT.md)
