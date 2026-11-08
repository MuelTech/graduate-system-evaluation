# Evaluation Guide & Scenarios Specification

> **Purpose:** Canonical specification for the two key evaluation features added on top of the `MuelTech/graduate-system` UI/UX:
> 1. **Interactive Arrow Coach-Mark Guides (`PageGuideOverlay`)** — Explains what each page and section is for using spotlight highlights and directional arrows.
> 2. **Scenario Switcher Bar (`ScenarioSwitcherBar`)** — Lets respondents toggle between workflow states on pages that normally lock or hide states behind backend stages.

---

## 1. Interactive Arrow Guide System (`PageGuideOverlay`)

### 1.1 UX Behavior
- **Triggering:**
  - Every portal header (Student and Panelist) has a prominent **`Page Guide`** button (`?` icon + `"Page Guide"` badge).
  - On first visit to a major workflow page (or when clicked manually), an interactive coach-mark tour highlights key sections in sequence (`Step 1 of N`, `Step 2 of N`, ...).
- **Visual Design:**
  - Semi-transparent dark backdrop (`bg-black/45`) with a spotlight cutout around the target `[data-guide="<id>"]` element and an accent ring (`ring-2 ring-(--earist-accent)`).
  - **Directional SVG Arrow** dynamically positioned (`top`, `bottom`, `left`, or `right`) pointing from the guide card to the highlighted target element.
  - **Guide Card:** Styled in EARIST maroon/gold (`--earist-primary` header badge, clean white card body) with:
    - Step badge (`Step 1 of 4`)
    - Bilingual/clear explanation (concise title + what the user can do here and why it matters in the graduate workflow)
    - Controls: `Skip Guide`, `Back`, and `Next` / `Finish`

---

## 2. Scenario Switcher System (`ScenarioSwitcherBar`)

### 2.1 Why It Is Needed
In the real `MuelTech/graduate-system`, a student visiting `/student/thesis/title-defense` only sees **one** state based on their database record (e.g., only the upload form if `NOT_SUBMITTED`, or only the schedule card if `SCHEDULED`). Respondents evaluating the UI/UX need to see **all stages of the page** without waiting for an admin or panelist to process their submission.

### 2.2 Visual Design
- Placed at the top of multi-state pages inside a clean institutional banner (`border-(--earist-accent)/50 bg-amber-50/80`):
  - **Label:** `Evaluation Scenario Preview:` (with an `Eye` icon and short helper text: *"Switch between stages below to evaluate how this page looks at each point in the workflow."*)
  - **Pill Buttons:** Clickable stage pills (`1. Submit Form`, `2. Under Review`, `3. Defense Scheduled`, `4. Completed & Official Records`, `5. Returned for Correction`).
  - **Interactive Continuity:** If the respondent actually fills out and submits a form in State 1, the page automatically transitions to State 2 (and shows a toast confirmation) while still allowing them to click any scenario pill manually.

---

## 3. Page-by-Page Scenarios & Guide Targets

### A. Student Portal (`/student/*`)

| Route | Scenario Switcher States | Key Guide Steps (`data-guide`) |
| :--- | :--- | :--- |
| **Student Layout & Sidebar** | *(Always Unlocked: All 5 Thesis Journey steps are clickable)* | 1. `student-sidebar-nav`: Overview of Student navigation<br>2. `student-thesis-journey-menu`: Unlocked 5-step Thesis Journey menu<br>3. `role-switcher`: Quick switch to Faculty/Panelist view |
| `/student/dashboard` | *Default populated view* | 1. `dashboard-welcome`: Student status & active degree banner<br>2. `dashboard-journey-card`: Current Thesis Milestone progress<br>3. `dashboard-upcoming-defense`: Scheduled defense quick view |
| `/student/profile` | *Default populated view* | 1. `profile-personal-info`: Student demographic & contact details<br>2. `profile-academic-info`: Program, major, and enrollment record |
| `/student/curriculum` | *Default populated view* | 1. `curriculum-summary`: Earned units vs. required units<br>2. `curriculum-course-list`: Categorized graduate courses (Core, Major, Cognate, Thesis) |
| `/student/journey` | *Default populated view* | 1. `journey-stepper`: End-to-end visual timeline from Admission/Coursework to Final Defense<br>2. `journey-action-cards`: Direct links to each Thesis stage |
| `/student/thesis/title-defense` | 1. **Ready to Submit** (Upload 3-Title Proposal Package, COR, Receipt)<br>2. **Under Admin Review**<br>3. **Defense Scheduled** (Date, Time, Room/Link, Committee)<br>4. **Completed** (Approved Title, RAP Result, Official Record)<br>5. **Returned for Correction** (Admin feedback & resubmit) | 1. `scenario-switcher`: How to preview all Title Defense states<br>2. `title-doc-slots`: Uploading the 3-title proposal package, COR, and receipt<br>3. `title-status-panel`: Viewing schedule, committee members, and official RAP outcome |
| `/student/thesis/adviser-request` | 1. **Select & Request Adviser** (Faculty list & GS-020 form)<br>2. **Awaiting Signatures** (GS-020 routing status)<br>3. **Approved & Signed** (Completed GS-020 PDF preview) | 1. `scenario-switcher`: Preview Adviser Request stages<br>2. `adviser-selection`: Selecting a qualified Graduate Faculty adviser<br>3. `gs020-preview`: Viewing and downloading the official GS-020 Adviser Request Form |
| `/student/thesis/proposal-defense` | 1. **Pre-Defense Adviser Review** (Upload manuscript for Adviser endorsement)<br>2. **Ready to Apply** (Submit Proposal Defense application)<br>3. **Defense Scheduled** (Schedule & Panel)<br>4. **Completed & RAP Result** (Scores, Verdict, Official Forms) | 1. `scenario-switcher`: Toggle between Adviser Review, Application, Schedule, and Results<br>2. `proposal-adviser-panel`: Pre-defense manuscript check & Adviser E-Signature certification<br>3. `proposal-defense-record`: Official Proposal Defense schedule & RAP report |
| `/student/thesis/strike` | 1. **Submit Manuscript** (Upload for similarity check)<br>2. **Under Review** (Verification in progress)<br>3. **Cleared** (Similarity score & STRIKE Certificate) | 1. `scenario-switcher`: Toggle STRIKE Plagiarism stages<br>2. `strike-upload`: Submitting the revised manuscript for plagiarism scanning<br>3. `strike-certificate`: Viewing similarity percentage and official clearance |
| `/student/thesis/final-defense` | 1. **Final Adviser Endorsement** (Manuscript review before Final Defense)<br>2. **Ready to Apply** (Final Defense application)<br>3. **Defense Scheduled**<br>4. **Completed & Passed** (Final RAP Report & Repository link) | 1. `scenario-switcher`: Toggle Final Defense stages<br>2. `final-adviser-panel`: Final Adviser certification before oral defense<br>3. `final-rap-panel`: Official Final Defense RAP result & clearance for bound submission |
| `/student/repository` & `/student/repository/submit` | 1. **Browse Repository** (Search completed theses)<br>2. **Submit Final Manuscript** (Metadata, abstract, PDF upload) | 1. `repo-search-filters`: Searching the EARIST Graduate Thesis Databank<br>2. `repo-submit-button`: Archiving the approved final thesis manuscript |

---

### B. Faculty / Panelist Portal (`/panelist/*`)

| Route | Scenario Switcher States | Key Guide Steps (`data-guide`) |
| :--- | :--- | :--- |
| `/panelist/dashboard` | *Default populated view* | 1. `panelist-kpi-cards`: Summary of assigned defenses, advisees, and pending signatures<br>2. `panelist-upcoming-list`: Quick access to today's and upcoming defense sessions |
| `/panelist/defenses` | *Filterable list containing assignments in `IN_PROGRESS`, `SCHEDULED`, `AWAITING_CONCLUSION`, and `CONCLUDED` states* | 1. `defenses-quick-filters`: Filter assignments by stage (Title, Proposal, Final) or session status<br>2. `defense-card-actions`: View Manuscript PDF or click **Open Defense Workspace** |
| `/panelist/defense-workspace/[scheduleId]` | 1. **Chair / Lead Panelist Mode** (Full Rubric + RAP Editor + Conclude Session)<br>2. **Panel Member Mode** (PDF Annotation + Rubric Scoring + E-Sign)<br>3. **Concluded Session View** (Read-only finalized RAP & signatures) | 1. `workspace-pdf-pane`: Split-screen Manuscript PDF Viewer with text highlight & comment annotations<br>2. `workspace-rubric-tab`: Interactive rubric scoring with automatic computation & autosave<br>3. `workspace-rap-tab`: Collaborative Official RAP Report editor & verdict deliberation<br>4. `workspace-role-toggle`: Switch between Committee Chairperson and Panel Member views |
| `/panelist/advisees` & `/panelist/advisees/[studentId]` | 1. **Pending GS-020 Adviser Requests**<br>2. **Pre-Defense Manuscript Review** (Approve / Request Revision)<br>3. **Advisee Thesis Progress** | 1. `advisees-tabs`: Switching between Active Advisees, Pending GS-020 Requests, and Manuscript Reviews<br>2. `adviser-review-actions`: Reviewing an advisee's manuscript, leaving feedback, and issuing official pre-defense endorsement |
| `/panelist/signatures` | 1. **Configured E-Signature Specimen**<br>2. **Pending Documents for Signature** | 1. `signature-specimen-card`: Managing the faculty member's digital signature specimen<br>2. `pending-signatures-list`: One-click signing for RAP reports, GS-020 forms, and certifications |
