# WP-3 & WP-4 Implementation Plan — Student Portal & Unlocked Thesis Journey

> **Covers:** `WP-3` (Student Layout & Core Pages) and `WP-4` (Unlocked 5-Step Thesis Journey with Multi-State Scenario Switchers).

---

## 1. WP-3: Student Layout & Core Pages

### 1.1 Student Portal Layout (`src/app/(portal)/student/layout.tsx`)
- **Source File:** `/home/antigravity/MuelTech/graduate-system/frontend/src/app/(portal)/student/layout.tsx`
- **Exact Adaptations Required:**
  1. **Unlock All 5 Thesis Journey Steps:**
     - In the original file (lines 227–232), `isNavigable` blocks `LOCKED` steps.
     - In the Evaluation version, set `const isNavigable = true;` for all 5 keys in `JOURNEY_STEP_ORDER` (`TITLE_DEFENSE`, `ADVISER_REQUEST`, `PROPOSAL_DEFENSE`, `STRIKE`, `FINAL_DEFENSE`) so respondents can click any step at any time.
     - Add `data-guide="student-sidebar-nav"` to the `<nav>` element and `data-guide="student-thesis-journey-menu"` to the Thesis Journey `<li>` submenu.
  2. **Header Evaluation Controls:**
     - In the `<header>` right-side action bar, add `<RoleSwitcherPill currentRole="student" />` and `<PageGuideTrigger />`.

### 1.2 Student Core Pages Mapping
| Target Route | Source File in `graduate-system/frontend/src/app/(portal)` | Data / Mock Hook Used | Guide Attributes (`data-guide`) |
| :--- | :--- | :--- | :--- |
| `/student/dashboard` | `student/dashboard/page.tsx` | `useStudentThesisJourney()` + `GET /student/journey` + `GET /notifications` + `GET /memos` + `ScenarioSwitcherBar` (toggle dashboard overview between *Active Title Defense*, *Scheduled Proposal Defense*, and *Completed Thesis Journey*) | `dashboard-welcome`, `dashboard-next-step`, `dashboard-milestones`, `dashboard-upcoming-defense` |
| `/student/profile` | `student/profile/page.tsx` | `GET /student/journey` (Student personal & academic record, degree program, adviser info) | `profile-personal-info`, `profile-academic-info` |
| `/student/curriculum` | `student/curriculum/page.tsx` | `GET /student/journey` (Core courses, Major courses, Cognates, Thesis Seminar I & II, units earned) | `curriculum-summary`, `curriculum-course-list` |
| `/student/journey` | `student/journey/page.tsx` | `GET /student/journey` + `useStudentThesisJourney()` (Full visual milestone tracker from Admission → Comprehensive Exam → Thesis Stages → Graduation) | `journey-stepper`, `journey-action-cards` |
| `/student/thesis` | `student/thesis/page.tsx` | `useStudentThesisJourney()` (Overview hub linking to all 5 Thesis Journey steps) | `thesis-hub-overview`, `thesis-step-cards` |
| `/student/repository` | `student/repository/page.tsx` | `RepositoryBrowser` (`GET /databank/publications`) + `GET /databank/archive/me` | `repo-search-filters`, `repo-submit-button` |
| `/student/repository/submit` | `student/repository/submit/page.tsx` | `GET /databank/archive/me` + `POST /databank/archive` (Final manuscript archival submission form) | `repo-submit-form`, `repo-submit-files` |
| `/student/announcements` | `student/announcements/page.tsx` | `GET /memos` | `announcements-list` |
| `/student/notifications` | `student/notifications/page.tsx` | `GET /notifications` + `PUT /notifications/:id/read` | `notifications-list` |

---

## 2. WP-4: Unlocked Student Thesis Journey Pages & Subcomponents

### 2.1 Shared Student Thesis Subcomponents to Port (`src/components/student/*`)
All 7 student thesis components from `/home/antigravity/MuelTech/graduate-system/frontend/src/components/student/` must be ported verbatim:
1. `defense-status-panel.tsx` (`DefenseStatusPanel`, `DefenseScheduleSummary`)
2. `title-defense-post-submission.tsx` (`TitleDefensePostSubmission`)
3. `proposal-adviser-review-panel.tsx` (`ProposalAdviserReviewPanel`)
4. `final-adviser-review-panel.tsx` (`FinalAdviserReviewPanel`)
5. `student-rap-panel.tsx` (`StudentRapPanel`)
6. `official-defense-application-record.tsx` (`OfficialDefenseApplicationRecord`)
7. `rejected-application-correction.tsx` (`RejectedApplicationCorrection`)
8. `local-file-preview-dialog.tsx` (`LocalFilePreviewDialog`)

---

### 2.2 Step 1: Title Defense (`/student/thesis/title-defense/page.tsx`)
- **Source File:** `student/thesis/title-defense/page.tsx` (643 lines)
- **Scenario Switcher States (`ScenarioSwitcherBar`):**
  1. `NOT_SUBMITTED` — **"1. Submit Application Form"**: Shows the 3-slot upload form (`Title Defense Proposal Package`, `Current Semester COR`, `Defense-fee Proof of Payment`), format guidance, file preview dialog, and confirmation modal. Submitting transitions automatically to `APPLICATION_UNDER_REVIEW`.
  2. `APPLICATION_UNDER_REVIEW` — **"2. Under Admin Review"**: Shows `DefenseStatusPanel` + `TitleDefensePostSubmission` with submitted documents and pending status.
  3. `SCHEDULED` — **"3. Defense Scheduled"**: Shows `DefenseScheduleSummary` (Date, Time, Room/Google Meet link), Committee roster, and Official Defense Application PDF record.
  4. `COMPLETED` — **"4. Completed & Title Approved"**: Shows approved thesis title banner, `StudentRapPanel` (Official RAP Report PDF preview), and `"Proceed to Adviser Request"` CTA.
  5. `REJECTED` — **"5. Returned for Correction"**: Renders `RejectedApplicationCorrection` with Admin remarks and document replacement slots.
- **Guide Targets (`data-guide`):** `scenario-switcher`, `title-doc-slots`, `title-status-panel`.

---

### 2.3 Step 2: Adviser Request (`/student/thesis/adviser-request/page.tsx`)
- **Source File:** `student/thesis/adviser-request/page.tsx` (542 lines)
- **Scenario Switcher States (`ScenarioSwitcherBar`):**
  1. `READY` — **"1. Select Adviser & Sign GS-020"**: Displays approved thesis title, list of qualified Graduate Faculty candidates (`Dr. Maria Clara R. Santos`, `Dr. Roberto L. Gomez`, `Dr. Elena V. Reyes`), remarks field, Review Modal, and interactive `ESignaturePad` to sign Official Form GS-020.
  2. `PENDING` — **"2. Awaiting Adviser & Dean Signatures"**: Shows routing progress badge (`Adviser: Approved` → `Dean: Pending`) and `AdviserRequestRecords` table with GS-020 PDF preview button.
  3. `APPROVED` — **"3. Adviser Officially Assigned"**: Shows active adviser confirmation (`Dr. Maria Clara R. Santos`), signed GS-020 PDF record (`AdviserRequestRecords`), and link to Proposal Defense.
  4. `DECLINED_RETRY` — **"4. Declined / Re-select Adviser"**: Shows declined notice with reason and unlocks the candidate selector for retry.
- **Guide Targets (`data-guide`):** `scenario-switcher`, `adviser-selection`, `gs020-preview`.

---

### 2.4 Step 3: Proposal Defense (`/student/thesis/proposal-defense/page.tsx`)
- **Source File:** `student/thesis/proposal-defense/page.tsx`
- **Scenario Switcher States (`ScenarioSwitcherBar`):**
  1. `ADVISER_REVIEW` — **"1. Pre-Defense Adviser Review"**: Renders `ProposalAdviserReviewPanel` where the student uploads their Proposal Manuscript for Adviser review & certification (`AWAITING_REVIEW` / `CHANGES_REQUESTED`), plus `AdviserCertificationRecords`.
  2. `READY_TO_APPLY` — **"2. Submit Proposal Defense Application"**: Adviser certification is `ISSUED` (signed PDF viewable); unlocks the Proposal Defense Application upload form (COR + Receipt + Certified Manuscript).
  3. `SCHEDULED` — **"3. Defense Scheduled"**: Shows `DefenseScheduleSummary`, Committee assignments, and `OfficialDefenseApplicationRecord` PDF preview.
  4. `COMPLETED` — **"4. Completed & RAP Result"**: Shows `DefenseStatusPanel` (`Passed`), `StudentRapPanel` with downloadable Proposal Defense RAP Report PDF, and link to STRIKE / Plagiarism.
  5. `REVISION_REQUIRED` — **"5. Revisions Required"**: Shows panel revision instructions and RAP record.
- **Guide Targets (`data-guide`):** `scenario-switcher`, `proposal-adviser-panel`, `proposal-defense-record`.

---

### 2.5 Step 4: STRIKE / Plagiarism (`/student/thesis/strike/page.tsx`)
- **Source File:** `student/thesis/strike/page.tsx`
- **Scenario Switcher States (`ScenarioSwitcherBar`):**
  1. `SUBMIT_MANUSCRIPT` — **"1. Submit Manuscript for Similarity Check"**: Interactive card allowing the student respondent to upload their revised manuscript PDF for STRIKE / Turnitin plagiarism scanning + preview button.
  2. `WAITING` — **"2. Verification in Progress"**: Shows `WAITING` status card (`Manuscript under Graduate School plagiarism verification`).
  3. `COMPLETED` — **"3. Cleared (Similarity Index: 9%)"**: Shows `COMPLETED` clearance card, similarity score summary (`9% Similarity Index — Passed (<15% threshold)`), preview of the Official STRIKE Clearance Certificate PDF, and `"Proceed to Final Defense"` button.
- **Guide Targets (`data-guide`):** `scenario-switcher`, `strike-upload`, `strike-certificate`.

---

### 2.6 Step 5: Final Defense (`/student/thesis/final-defense/page.tsx`)
- **Source File:** `student/thesis/final-defense/page.tsx`
- **Scenario Switcher States (`ScenarioSwitcherBar`):**
  1. `FINAL_ADVISER_REVIEW` — **"1. Final Adviser Endorsement"**: Renders `FinalAdviserReviewPanel` for uploading the complete Final Manuscript and tracking Adviser endorsement + `AdviserCertificationRecords`.
  2. `READY_TO_APPLY` — **"2. Submit Final Defense Application"**: Final Adviser Certification is `ISSUED`; unlocks the Final Defense Application submission form (COR + Receipt + Certified Final Manuscript).
  3. `SCHEDULED` — **"3. Final Defense Scheduled"**: Shows `DefenseScheduleSummary`, Final Oral Defense Committee, and `OfficialDefenseApplicationRecord`.
  4. `COMPLETED` — **"4. Completed & Passed (Ready for Archival)"**: Shows final `COMPLETED` status, `StudentRapPanel` (Signed Final RAP Report PDF), and CTA button to `/student/repository/submit`.
- **Guide Targets (`data-guide`):** `scenario-switcher`, `final-adviser-panel`, `final-rap-panel`.
