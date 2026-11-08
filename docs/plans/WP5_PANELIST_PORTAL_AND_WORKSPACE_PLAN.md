# WP-5 Implementation Plan — Faculty / Panelist Portal & Collaborative Defense Workspace

> **Covers:** `WP-5` (Panelist Layout, Dashboard, Profile, My Defenses, Immersive Collaborative Defense Workspace, My Advisees, E-Signatures, Repository, Announcements, and Notifications).

---

## 1. Panelist Layout & Core Pages

### 1.1 Panelist Portal Layout (`src/app/(portal)/panelist/layout.tsx`)
- **Source File:** `/home/antigravity/MuelTech/graduate-system/frontend/src/app/(portal)/panelist/layout.tsx`
- **Exact Adaptations Required:**
  1. Keep all 8 navigation items active and navigable:
     - `Dashboard` (`/panelist/dashboard`)
     - `Profile` (`/panelist/profile`)
     - `My Defenses` (`/panelist/defenses`)
     - `My Advisees` (`/panelist/advisees`)
     - `E-Signatures` (`/panelist/signatures`)
     - `Repository` (`/panelist/repository`)
     - `Announcements` (`/panelist/announcements`)
     - `Notifications` (`/panelist/notifications`)
  2. Keep the immersive focus-mode opt-out for `/panelist/defense-workspace/*` (lines 70–74).
  3. In the `<header>` right-side bar, add `<RoleSwitcherPill currentRole="panelist" />` and `<PageGuideTrigger />`.

### 1.2 Panelist Core Pages Mapping
| Target Route | Source File in `graduate-system/frontend/src/app/(portal)` | Mock Data & Interactive Behavior | Guide Attributes (`data-guide`) |
| :--- | :--- | :--- | :--- |
| `/panelist/dashboard` | `panelist/dashboard/page.tsx` | `GET /thesis/defense/panelist/dashboard` + `GET /notifications`. Displays KPI cards (`Upcoming Defenses`, `Pending Tasks`), `Needs Your Attention` action cards (linking directly to Defense Workspace, Advisee Reviews, and RAP Signatures), `Active Defense Sessions`, and `Upcoming Defenses`. | `panelist-kpi-cards`, `panelist-attention-list`, `panelist-upcoming-list` |
| `/panelist/profile` | `panelist/profile/page.tsx` | `GET /panelists/me` + `PUT /panelists/me/availability`. Shows faculty credentials, specialization tags, and interactive `"Available as Thesis Adviser"` switch. | `panelist-profile-card`, `panelist-availability-toggle` |
| `/panelist/repository` | `panelist/repository/page.tsx` | `RepositoryBrowser` (`GET /databank/publications`) | `repo-search-filters` |
| `/panelist/announcements` | `panelist/announcements/page.tsx` | `GET /memos` | `announcements-list` |
| `/panelist/notifications` | `panelist/notifications/page.tsx` | `GET /notifications` + `PUT /notifications/:id/read` | `notifications-list` |

---

## 2. My Defenses & Collaborative Defense Workspace

### 2.1 My Defenses (`/panelist/defenses/page.tsx`)
- **Source File:** `panelist/defenses/page.tsx` (737 lines) + `src/components/panelist/manuscript-dialog.tsx`
- **Mock Assignments Provided (`GET /thesis/defense/panelist/assignments`):**
  1. `sched-eval-proposal-01` — **Juan M. Dela Cruz** (`PROPOSAL_DEFENSE` · Role: `CHAIRMAN` · Status: `IN_PROGRESS` · Evaluation: `DRAFT`) → Primary evaluation showcase!
  2. `sched-eval-title-02` — **Maria Luisa T. Villanueva** (`TITLE_DEFENSE` · Role: `PANELIST` · Status: `IN_PROGRESS` · Evaluation: `NOT_STARTED`)
  3. `sched-eval-final-03` — **Carlos Miguel A. Soriano** (`FINAL_DEFENSE` · Role: `RAPPORTEUR` · Status: `AWAITING_CONCLUSION` · Evaluation: `FINALIZED`)
  4. `sched-eval-final-04` — **Angela Mae D. Bautista** (`FINAL_DEFENSE` · Role: `CHAIRMAN` · Status: `CONCLUDED` · Evaluation: `FINALIZED`)
- **Interactive Features:**
  - Quick filters (`All`, `Needs evaluation`, `Today`, `Upcoming`, `Concluded`), Stage selector, Session status selector, and search box.
  - **View Manuscript** button opens `ManuscriptDialog` rendering `/sample-docs/sample-manuscript.pdf`.
  - **Open Defense Workspace** button navigates to `/panelist/defense-workspace/[scheduleId]`.
- **Guide Targets (`data-guide`):** `defenses-quick-filters`, `defense-card-actions`.

---

### 2.2 Immersive Collaborative Defense Workspace (`/panelist/defense-workspace/[scheduleId]/page.tsx`)
- **Source File:** `panelist/defense-workspace/[scheduleId]/page.tsx` + all 22 components in `src/components/defense-workspace/*`:
  - `workspace-shell.tsx`, `workspace-header.tsx`, `compact-workspace-header.tsx`, `role-rail.tsx`
  - `student-document-collaboration.tsx`, `collaborative-manuscript-viewer.tsx`, `manuscript-page.tsx`, `manuscript-highlight-layer.tsx`, `manuscript-viewer-toolbar.tsx`, `annotation-comment-composer.tsx`, `annotation-thread.tsx`, `shared-comments-rail.tsx`
  - `oral-evaluation-form.tsx`, `institutional-evaluation-matrix.tsx`, `evaluation-completion-tracker.tsx`, `evaluation-finalization-dialog.tsx`
  - `committee-report-panel.tsx`, `rapporteur-notes-workspace.tsx`, `rich-text-report-editor.tsx`, `report-editor-toolbar.tsx`, `report-document-view.tsx`, `committee-report-signature-dialog.tsx`, `rap-signature-panel.tsx`, `e-signature-pad.tsx`
  - `chairman-conclusion-panel.tsx`, `chairman-oral-summary.tsx`, `chairman-verdict-panel.tsx`, `defense-roster.tsx`, `defense-history-panel.tsx`
- **Workspace Evaluation Controls (Top Floating Bar):**
  - Because `/panelist/defense-workspace/[scheduleId]` runs in full-screen focus mode, include a compact top evaluation bar (`ScenarioSwitcherBar` + `<PageGuideTrigger />`) allowing the respondent to switch between:
    1. `CHAIRMAN_IN_PROGRESS` — **"1. Committee Chair View (In Progress)"**: Full access to PDF Annotation, Rubric Scoring (`INSTITUTIONAL_MATRIX_V2` 1.00–2.50 scale), Committee Report (RAP), and Chairman Verdict / Conclusion controls.
    2. `PANELIST_IN_PROGRESS` — **"2. Panel Member / Rapporteur View"**: Access to PDF Annotation, Rubric Evaluation & Finalize Score, Rapporteur Notes editor, and RAP E-Signature.
    3. `CONCLUDED_VIEW` — **"3. Concluded Session & Signed RAP"**: Shows finalized scores, recorded verdict (`PASSED`), and completed committee e-signatures.
- **Guide Targets (`data-guide`):** `workspace-role-toggle`, `workspace-pdf-pane`, `workspace-rubric-tab`, `workspace-rap-tab`.
- **Compatibility Routes:**
  - Port `/panelist/scoring/page.tsx`, `/panelist/scoring/[id]/page.tsx`, `/panelist/defense-lobby/[scheduleId]/page.tsx`, and `/panelist/materials/page.tsx` so any deep links redirect/resolve cleanly to `/panelist/defenses` or `/panelist/defense-workspace/[scheduleId]`.

---

## 3. My Advisees & E-Signatures

### 3.1 My Advisees (`/panelist/advisees/page.tsx` & `/panelist/advisees/[studentId]/page.tsx`)
- **Source Files:**
  - `panelist/advisees/page.tsx`
  - `panelist/advisees/[studentId]/page.tsx`
  - `src/components/panelist/my-advisees-workspace.tsx`
  - `src/components/panelist/adviser-request-action-dialog.tsx`
  - `src/components/panelist/adviser-review-action-panel.tsx`
  - `(portal)/panelist/adviser-requests/page.tsx` & `(portal)/panelist/adviser-reviews/page.tsx`
- **Interactive Features:**
  - **Incoming GS-020 Adviser Requests:** Faculty respondent can click **Review & Approve** on a pending student request, sign with `ESignaturePad` inside `AdviserRequestActionDialog`, or decline with remarks.
  - **Pre-Defense Manuscript Review Tasks:** Faculty respondent can open an advisee's submitted Proposal or Final manuscript, preview the PDF (`/sample-docs/sample-manuscript.pdf`), and either **Issue Signed Pre-Defense Certification** or **Request Changes** via `AdviserReviewActionPanel`.
  - **Advisee Detail View (`/panelist/advisees/[studentId]`):** Shows the advisee's full research timeline, uploaded manuscripts across stages, and defense history reports.
- **Guide Targets (`data-guide`):** `advisees-tabs`, `adviser-incoming-requests`, `adviser-review-actions`.

### 3.2 E-Signatures (`/panelist/signatures/page.tsx`)
- **Source File:** `panelist/signatures/page.tsx`
- **Interactive Features:**
  - Shows pending RAP Reports awaiting the panelist's digital signature (`GET /thesis/defense/rap-reports/pending`).
  - Allows drawing/saving an e-signature specimen and clicking **Sign RAP Report** (`POST /thesis/defense/rap-reports/:id/sign`) with instant status update.
- **Guide Targets (`data-guide`):** `signature-specimen-card`, `pending-signatures-list`.
