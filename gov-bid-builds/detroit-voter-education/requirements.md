# Detroit Scalable Voter Education Platform — Requirements

**Source:** Colaberry Basecamp, Gov Contracts project (bucket 47346103), Docs & Files. Fetched verbatim 2026-08-19 from three source documents and combined here so the scaffold is self-contained. Do not hand-edit the content below without updating the Basecamp source first — this file should stay a faithful copy, not a fork.

- Requirements: https://app.basecamp.com/3945211/buckets/47346103/documents/10068130388
- Architecture & Agent Map: https://app.basecamp.com/3945211/buckets/47346103/documents/10068130395
- Trust (TBI) Primer: https://app.basecamp.com/3945211/buckets/47346103/documents/10068130401

---

## 1. Vision & Problem Statement

The Detroit Scalable Voter Education Platform empowers Detroit residents with personalized, accessible, and trustworthy voter education. It addresses voter disengagement and misinformation by delivering tailored information on civic issues, current officeholders, and candidates for upcoming elections, using official government and legislative data.

## 2. Personas

1. **Residents and Voters (Public)** — need reliable, personalized voter information without login credentials, to make informed voting decisions.
2. **City Content Admins** — need an efficient interface to review, edit, and approve AI-generated content before it publishes.
3. **Data Stewards** — need tools to maintain data integrity, audit trails, and compliance with city data standards.
4. **Auditors** — need audit logs and transparency dashboards to verify governance compliance.

## 3. In-Scope vs Out-of-Scope

**In-scope:** ZIP/issue-based personalization; local/state/federal jurisdiction resolution; AI-generated, human-approved summaries; provenance trails to source documents; data ingestion from official APIs; export to city data standards; WCAG 2.1 AA; SOC 2 Type II.

**Out-of-scope:** voter registration/voting facilitation; political campaign management/promotion; non-Detroit jurisdictions; social media integration.

## 4. Technical Specification (as designed; this scaffold implements a subset — see §7)

- **Backend:** Node.js + Express REST API.
- **Database:** PostgreSQL.
- **Data ingestion:** scheduled jobs (cron/BullMQ), exponential backoff on rate limits, ETL normalization.
- **Auth:** JWT for City Content Admins and Data Stewards.
- **Containerization:** Docker.
- **Frontend:** React, Redux, styled-components, ARIA/semantic HTML for WCAG 2.1 AA.
- **Deployment (target):** AWS EC2/S3/RDS, GitHub Actions CI/CD, ELB. Not implemented in this scaffold — see `deploy/`.

### Database schema (as designed)

- **users**: user_id (PK), role, email, password_hash, created_at, updated_at.
- **residents**: resident_id (PK), zip_code, issue_preferences (JSONB), last_accessed.
- **summaries**: summary_id (PK), content, status, created_by, approved_by, created_at, updated_at.
- **audit_logs**: log_id (PK), user_id (FK), action, timestamp, details.
- **provenance**: provenance_id (PK), summary_id (FK), source_url, retrieved_at.

## 5. Functional Requirements

| ID | Requirement | Priority | Acceptance criteria |
|---|---|---|---|
| REQ-001 | User Input and Personalization | Must | ZIP + issue selection; real-time personalized info; updates as preferences change |
| REQ-002 | Jurisdiction Resolution | Must | Resolves local/state/federal jurisdiction from ZIP; refreshed every 24h |
| REQ-003 | AI-Generated Summaries | Must | Summaries generated; **held for City content admin review and approval**; approved summaries publish within 2 hours |
| REQ-004 | Provenance and Source Links | Must | Every summary carries a "why am I seeing this" trail; direct links to source docs; updated on every refresh |
| REQ-005 | Data Ingestion and Export | Must | Ingest from official APIs; export ODBC/JSON/CSV/XML; validated against schema |
| REQ-006 | Accessibility Compliance | Must | WCAG 2.1 AA; quarterly verification |
| REQ-007 | Audit Logging | Must | Append-only log of every meaningful action; 5-year retention |
| REQ-008 | Trust Dashboard | Should | System health, pending approvals, recent actions, anomalies, governance score |

## 6. Multi-Agent Architecture

Each requirement is owned by exactly one agent; the Trust/Governance agent observes every command.

| Agent | Owns | Commands | Reacts to | Approval gate |
|---|---|---|---|---|
| UserInputAgent | REQ-001 | UpdateUserPreferences, FetchPersonalizedInfo | UserInputReceived | — |
| JurisdictionResolutionAgent | REQ-002 | ResolveJurisdiction, RefreshJurisdictionData | ZIPCodeEntered | — |
| SummaryGenerationAgent | REQ-003 | GenerateSummary, HoldForReview | NewDataReceived | AdminApprovalRequired |
| ProvenanceAgent | REQ-004 | UpdateProvenanceTrail, NotifyUsers | SummaryPublished | — |
| DataIngestionAgent | REQ-005 | IngestData, ExportData | DataImportRequest | — |
| AccessibilityAgent | REQ-006 | VerifyAccessibility, ConductQuarterlyTests | FeatureUpdate | — |
| AuditLoggingAgent | REQ-007 | RecordAction, VerifyLogIntegrity | ActionPerformed | — |
| TrustDashboardAgent | REQ-008 | UpdateDashboard, CalculateGovernanceScore | SystemEvent | — |
| **CoordinatorAgent** | REQ-009 | CoordinateAgents, ManageInterAgentCommunication | AgentEvent | — |
| TrustGovernanceAgent | REQ-010 | MonitorAgentActions, EnforceGovernancePolicies | AgentCommandIssued | — |

**Note on STORY-011:** the Basecamp ticket assigns "hold summaries for admin review + notify within 15 minutes" to the **CoordinatorAgent** and cites REQ-003/REQ-005. The agent map above shows `HoldForReview` as a command already owned by **SummaryGenerationAgent** under REQ-003. This scaffold builds to the ticket's literal acceptance criteria (CoordinatorAgent receives and holds) rather than silently reassigning it to SummaryGenerationAgent — flagged here as a real spec inconsistency worth resolving with whoever owns the architecture doc, not resolved unilaterally.

## 7. Trust (TBI) requirements this build must satisfy

Framework: TBI-2025.12.0 (pinned). Full text in the Trust Primer doc linked above.

- **Audit log** — append-only record of every meaningful action (who/what/when/before-after).
- **Approval gate** — high-stakes actions (publishing a summary) are held for human approval.
- **Escalation** — low confidence or anomalies route to a human rather than auto-acting.
- **Trust dashboard** — system health, pending approvals, recent actions, anomalies (not built in this scaffold — out of scope for STORY-011).
- **Governance score** — live 0–100 compliance score (not built in this scaffold — out of scope for STORY-011).

## 8. What this scaffold actually implements (STORY-011 scope)

Everything in §4–§7 above is the full platform's target design. This initial scaffold implements **only STORY-011**: the CoordinatorAgent's hold-for-review workflow. Specifically:

- `app/db/schema.sql` — `summaries` and `audit_log` tables (Postgres DDL, matches §4's schema).
- `app/agents/coordinatorAgent.js` — receives a generated summary, persists it with `status='pending_review'`, writes an audit log entry, and records an admin notification — all synchronously, so the 15-minute SLA in REQ-003's acceptance criteria is satisfied by construction (notification latency is ~0, not merely under 15 minutes).
- `app/agents/summaryGenerationAgentStub.js` — a minimal stand-in for the real SummaryGenerationAgent (STORY-005/010, not yet built), producing a summary object matching the `summaries` schema so STORY-011 has something real to hold. Not a REQ-003 implementation.
- `app/routes/summaries.js` — REST endpoints: list pending summaries, approve, reject.
- `frontend/src/AdminSummaryReview.jsx` — minimal React admin UI: pending-summary list + notification indicator + approve/reject actions.
- `app/tests/coordinatorAgent.test.js` — hermetic test (in-memory repository/notifier, no live DB) proving the acceptance scenario.

Everything else in this document (jurisdiction resolution, real summary generation, provenance, ingestion/export, accessibility, full audit logging across the whole app, trust dashboard, deployment) is **not implemented** and should not be assumed to exist.
