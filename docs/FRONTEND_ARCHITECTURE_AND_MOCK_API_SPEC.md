# Frontend Architecture & Mock API Specification

> **Authority:** Canonical technical blueprint for adapting `MuelTech/graduate-system/frontend` into a 100% self-contained, Vercel Free-Tier deployable UI/UX Evaluation application in `MuelTech/graduate-system-evaluation`.

---

## 1. Source-to-Target File Mapping (`graduate-system/frontend` → `graduate-system-evaluation`)

### 1.1 Files Copied Verbatim (100% UI/UX Fidelity)
| Directory / File | Purpose |
| :--- | :--- |
| `src/app/globals.css` | EARIST CSS custom properties (`--earist-primary`, `--earist-secondary`, `--earist-accent`, `--earist-surface-gray`, `--earist-border-gray`, `--earist-body-text`, `--earist-success`, `--earist-warning`), Tailwind v4 rules, and print/form styles |
| `src/components/ui/*` | All 18 `shadcn/ui` & custom EARIST primitives (`alert`, `badge`, `breadcrumb`, `button`, `card`, `dialog`, `document-viewer`, `input`, `label`, `page-header`, `pagination`, `select`, `separator`, `skeleton`, `sonner`, `switch`, `tabs`, `textarea`, `tooltip`) |
| `src/components/defense-workspace/*.css` | `manuscript-viewer.css` and `report-body.css` for exact PDF & RAP report typography |
| `src/types/*` | All TypeScript domain contracts (`student-thesis-journey.ts`, `defense-workspace.ts`, `adviser-workspace.ts`, `defense-history.ts`, `defense-document-history.ts`, `proposal-adviser-review.ts`, `scheduled-defense-submission.ts`, `index.ts`) |
| `src/lib/student-thesis-journey.ts` | Canonical route map, step labels, wall-clock date/time formatters (`formatDefenseDate`, `formatDefenseTime`), status headings/descriptions |
| `src/lib/student-dashboard.ts` | Pure projection logic (`resolveNextStep`, `activeDefense`, `milestoneStateLabel`, `resolveDefenseVenue`) |
| `src/lib/panelist-dashboard.ts` | Panelist KPI and task formatting helpers (`formatWallDate`, `formatWallTime`) |
| `src/lib/panelist-defenses.ts` | Quick filters, stage/status labels, venue resolution, and action resolvers |
| `src/lib/adviser-workspace.ts` | Adviser review status labels, stage labels, and next-responsibility helpers |
| `src/lib/adviser-request-ui-state.ts` & `src/lib/adviser-request-signing.ts` | GS-020 Adviser Request state resolution and signature payload helpers |
| `src/lib/adviser-reviews.ts` | Proposal & Final pre-defense adviser review helpers |
| `src/lib/report/*` | `report-document.ts`, `tiptap-adapter.ts`, `report-autosave.ts`, `report-preview-throttle.ts` |
| `src/lib/pdf-annotation/*` | `anchors.ts`, `annotations.ts`, `viewer-core.ts` |

### 1.2 Files Replaced with Evaluation-Safe Adapters (Zero Backend / Zero Auth / Zero Socket Server)
| Target File | Original Behavior in `graduate-system` | Evaluation Replacement Behavior |
| :--- | :--- | :--- |
| `src/lib/api.client.ts` | Calls Express backend via `fetch(`${BACKEND_ORIGIN}/api/...`)` with JWT bearer token | Routes every path + HTTP method (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`) through `evaluationMockRouter(endpoint, options)` backed by reactive in-memory + `localStorage` state |
| `src/lib/api.server.ts` | Server-side `fetch` using NextAuth server session | Returns deterministic mock data directly from `src/lib/evaluation-mock/dataset.ts` |
| `src/lib/evaluation-session.tsx` *(replaces `next-auth/react`)* | Requires NextAuth `/api/auth/session` & credentials login | Provides `useSession()`, `signIn()`, `signOut()`, and `switchEvaluationRole("student" \| "panelist")` with pre-populated EARIST personas |
| `src/middleware.ts` | Redirects unauthenticated users to `/login` and blocks cross-role navigation | Disabled / pass-through so respondents can freely visit `/student/*` and `/panelist/*` links directly |
| `src/hooks/use-defense-realtime.ts` | Connects to live `socket.io` server for defense workspace events | Simulated local realtime bus that emits instant local state updates and shows `"Connected · Evaluation Mode"` |
| `src/app/api/**/pdf/route.ts` & `src/app/api/documents/[...path]/route.ts` | Proxies PDF streams from Express backend storage | Redirects/streams static institutional sample PDFs from `/sample-docs/*.pdf` |

### 1.3 Excluded Directories (Out of Scope for Student & Faculty Respondents)
- `src/app/(portal)/admin/**` and `src/components/admin/**`
- `src/app/(portal)/applicant/**` and `src/components/exam-content/**`

---

## 2. Evaluation Personas (Pre-Loaded Respondent Accounts)

1. **Student Persona (`role: "student"`):**
   - **Name:** `Juan M. Dela Cruz`
   - **Student Number:** `2025-GS-00142`
   - **Program:** `Master of Arts in Education Major in Administration and Supervision (MAEd-AS)`
   - **Email:** `jmdelacruz.gs@earist.edu.ph`
   - **Assigned Adviser (when in post-Adviser stages):** `Dr. Maria Clara R. Santos`

2. **Faculty / Panelist Persona (`role: "panelist"`):**
   - **Name:** `Dr. Maria Clara R. Santos, EdD`
   - **Faculty ID:** `FAC-GS-0089`
   - **Academic Rank:** `Associate Professor V`
   - **Specialization:** `Educational Leadership, Curriculum Development, & Policy Research`
   - **Office / Affiliation:** `EARIST Graduate School — College of Education`
   - **Email:** `mcrsantos@earist.edu.ph`

---

## 3. Complete Mock API Endpoint Contract (`src/lib/api.client.ts`)

Every `apiClientRequest(endpoint, options)` call across all Student, Panelist, Shared, and Repository components is mapped below and must be handled by `src/lib/evaluation-mock/mock-router.ts`:

### 3.1 Shared & Public Endpoints
| Method & Endpoint Pattern | Caller Component / Page | Mock Response Contract |
| :--- | :--- | :--- |
| `GET /memos` | `/student/dashboard`, `/student/announcements`, `/panelist/announcements` | `Array<MemoItem>` (Official EARIST Graduate School memos with titles, dates, categories, and body text) |
| `GET /notifications` | `NotificationBell`, `/student/dashboard`, `/student/notifications`, `/panelist/dashboard`, `/panelist/notifications` | `Array<NotificationItem>` (Role-aware notifications for Student or Panelist) |
| `PUT /notifications/:id/read` | `NotificationBell`, `/student/notifications`, `/panelist/notifications` | Marks notification `:id` as `isRead: true` in mock state |
| `GET /databank/publications*` | `RepositoryBrowser` (`/repository`, `/student/repository`, `/panelist/repository`) | `PaginatedResponse<RepositoryPublication>` with search, program filter, and pagination |

### 3.2 Student Portal Endpoints
| Method & Endpoint Pattern | Caller Component / Page | Mock Response Contract |
| :--- | :--- | :--- |
| `GET /thesis/journey` | `useStudentThesisJourney` (Sidebar, `/student/thesis/*`) | Returns `StudentThesisJourney` dynamically reflecting the active Scenario Switcher override on the current page, with **all 5 steps navigable** |
| `GET /student/journey` | `/student/dashboard`, `/student/journey`, `/student/curriculum`, `/student/profile` | Returns `StudentOverview` (profile, curriculum courses, comprehensive exam status, thesis milestones) |
| `GET /thesis/defense/current` | `TitleDefensePostSubmission`, `RejectedApplicationCorrection` | Returns current defense application record (`thesisTitles`, `selectedTitle`, `status`, `adminRemarks`, `documents`) |
| `POST /thesis/defense/title` | `/student/thesis/title-defense` | Accepts `FormData` (package, COR, receipt), updates scenario to `APPLICATION_UNDER_REVIEW`, returns success DTO |
| `POST /thesis/defense/:thesisId/resubmit` | `RejectedApplicationCorrection` | Accepts corrected documents, transitions scenario to `APPLICATION_UNDER_REVIEW` |
| `GET /thesis/adviser/candidates` | `/student/thesis/adviser-request` | Returns `CandidatesResponse` with 4 EARIST Graduate Faculty candidates, specializations, and student review context |
| `POST /thesis/adviser/request` | `/student/thesis/adviser-request` | Accepts signed GS-020 submission (`signedAdviserRequestSubmission`), transitions scenario to `PENDING` (`WAITING`) |
| `GET /thesis/adviser/requests/records` | `AdviserRequestRecords` | Returns `Array<AdviserRequestRecord>` with GS-020 PDF link (`/sample-docs/sample-gs020-adviser-request.pdf`) |
| `GET /thesis/proposal-adviser-review` | `ProposalAdviserReviewPanel` | Returns `ProposalAdviserReview` (`reviewStatus`: `NONE` / `AWAITING_REVIEW` / `CHANGES_REQUESTED` / `ISSUED`) |
| `POST /thesis/proposal-adviser-review/manuscript` | `ProposalAdviserReviewPanel` | Accepts manuscript upload, sets `reviewStatus: "AWAITING_REVIEW"` |
| `GET /thesis/final-adviser-review` | `FinalAdviserReviewPanel` | Returns `FinalAdviserReview` (`reviewStatus`: `NONE` / `AWAITING_REVIEW` / `CHANGES_REQUESTED` / `ISSUED`) |
| `POST /thesis/final-adviser-review/manuscript` | `FinalAdviserReviewPanel` | Accepts final manuscript upload, sets `reviewStatus: "AWAITING_REVIEW"` |
| `GET /thesis/adviser-certifications*` | `AdviserCertificationRecords` | Returns signed pre-defense certification records with PDF preview links |
| `GET /thesis/eligibility/:stage` | `/student/thesis/proposal-defense`, `/student/thesis/final-defense` | Returns `{ eligible: true, missingRequirements: [] }` (or scenario-matched state) |
| `POST /thesis/defense/proposal` | `/student/thesis/proposal-defense` | Submits Proposal Defense application & transitions scenario |
| `POST /thesis/defense/final` | `/student/thesis/final-defense` | Submits Final Defense application & transitions scenario |
| `GET /thesis/defense/:scheduleId/official-application` | `OfficialDefenseApplicationRecord` | Returns `{ available: true, scheduleId, pdfUrl: "/sample-docs/sample-defense-application.pdf" }` |
| `GET /thesis/defense/student/rap-report*` | `StudentRapPanel` | Returns finalized RAP report summary, verdict, and PDF link (`/sample-docs/sample-rap-report.pdf`) |
| `GET /databank/archive/me` | `/student/repository`, `/student/repository/submit` | Returns `DatabankArchiveContext` (eligible to submit final approved manuscript) |
| `POST /databank/archive` | `/student/repository/submit` | Saves archival submission and shows confirmation |

### 3.3 Faculty / Panelist Portal Endpoints
| Method & Endpoint Pattern | Caller Component / Page | Mock Response Contract |
| :--- | :--- | :--- |
| `GET /thesis/defense/panelist/dashboard` | `/panelist/dashboard` | Returns `PanelistDashboard` (`kpis`, `needsAttention`, `activeDefenses`, `upcomingDefenses`, `waitingOnOthers`) |
| `GET /panelists/me` | `/panelist/profile` | Returns `PanelistProfile` for Dr. Maria Clara R. Santos |
| `PUT /panelists/me/availability` | `/panelist/profile` | Toggles `isAvailableAsAdviser` and updates profile |
| `GET /thesis/defense/panelist/assignments` | `/panelist/defenses` | Returns `Array<PanelistAssignmentData>` covering Title (`IN_PROGRESS`), Proposal (`SCHEDULED`), and Final (`CONCLUDED` & `AWAITING_CONCLUSION`) sessions |
| `GET /thesis/defense/:scheduleId/workspace` | `/panelist/defense-workspace/[scheduleId]` | Returns `DefenseWorkspace` dynamically adjusted by the workspace Scenario Switcher (`CHAIRMAN_ACTIVE`, `PANELIST_ACTIVE`, `CONCLUDED_READONLY`) |
| `POST /thesis/defense/:scheduleId/start` | `RoleRail` | Starts defense session (`sessionStatus: "IN_PROGRESS"`) |
| `GET /thesis/defense/:scheduleId/evaluation` | `OralEvaluationForm` | Returns `OralEvaluation` (`INSTITUTIONAL_MATRIX_V2` 1.00–2.50 rubric scores, rating, recommendations) |
| `PUT /thesis/defense/:scheduleId/evaluation` | `OralEvaluationForm` | Autosaves draft rubric criteria & computes Group I / Group II / Overall weighted average |
| `POST /thesis/defense/:scheduleId/evaluation/finalize` | `OralEvaluationForm` | Finalizes & signs the panelist's oral evaluation |
| `GET /thesis/defense/:scheduleId/collaboration/annotations*` | `useDefenseCollaboration` | Returns sample PDF highlight & comment threads on the manuscript |
| `POST /thesis/defense/:scheduleId/collaboration/annotations` | `useDefenseCollaboration` | Adds a new PDF highlight/comment annotation in memory |
| `DELETE /thesis/defense/:scheduleId/collaboration/annotations/:id` | `useDefenseCollaboration` | Deletes an annotation |
| `GET /thesis/defense/:scheduleId/collaboration/report` | `CommitteeReportPanel`, `RapporteurNotesWorkspace` | Returns structured RAP report document & signature status |
| `PUT /thesis/defense/:scheduleId/collaboration/report` | `CommitteeReportPanel`, `RapporteurNotesWorkspace` | Saves RAP report rich-text body / rapporteur notes |
| `POST /thesis/defense/:scheduleId/collaboration/report/finalize` | `CommitteeReportPanel` | Finalizes the committee RAP report for signing |
| `POST /thesis/defense/:scheduleId/collaboration/report/sign` | `RapSignaturePanel` | Records the faculty member's e-signature on the RAP report |
| `GET /thesis/defense/:scheduleId/conclusion` & `POST` | `ChairmanVerdictPanel` | Reads/records the formal defense verdict (`PASSED`, `REVISION_REQUIRED`, `REDEFENSE_REQUIRED`) and selected title |
| `GET /thesis/defense/:scheduleId/history` | `useDefenseHistory` (`DefenseHistoryPanel`) | Returns prior defense stage history, manuscripts, and committee reports |
| `GET /thesis/adviser/workspace` | `MyAdviseesWorkspace` (`/panelist/advisees`) | Returns `AdviserWorkspaceDto` (`activeAdvisees`, `incomingRequests`, `reviewTasks`) |
| `GET /thesis/adviser/workspace/advisees/:studentId` | `/panelist/advisees/[studentId]` | Returns `AdviserAdviseeDetailDto` (student info, research documents, review tasks, defense history) |
| `POST /thesis/adviser/requests/:id/approve` & `/decline` | `AdviserRequestActionDialog` | Approves (with e-signature) or declines an incoming GS-020 Adviser Request |
| `GET /thesis/adviser-reviews/:stage/:thesisId` | `AdviserReviewActionPanel` | Returns pre-defense manuscript review details for the advisee |
| `POST /thesis/adviser-reviews/:stage/:thesisId/issue` & `/request-changes` | `AdviserReviewActionPanel` | Issues signed Pre-Defense Adviser Certification or requests manuscript changes |
| `GET /thesis/defense/rap-reports/pending` | `/panelist/signatures` | Returns `Array<RapReportSignatureDoc>` awaiting panelist e-signature |
| `POST /thesis/defense/rap-reports/:id/sign` | `/panelist/signatures` | Signs the pending RAP report |
