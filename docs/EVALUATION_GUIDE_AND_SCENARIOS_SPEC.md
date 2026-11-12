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

## 3. Plain-Language Naming Standard (No Internal Form Codes)

To ensure all evaluation respondents (**Applicants**, **Students**, and **Faculty**) immediately understand every feature, avoid internal form numbers or unexplained acronyms in guide titles, descriptions, and scenario switcher pills:

- Use **"Thesis Adviser Request Form"** instead of `"GS-020"` or `"GS-20"`.
- Use **"Rapporteur Report (Defense Evaluation Summary)"** instead of `"RAP"` or `"RAP Report"`.
- Use **"Plagiarism & Similarity Check"** instead of `"STRIKE"`.
- Use **"Final Thesis Archival Documents"** instead of `"DL-9"`.
- Use **"Faculty Portal"** instead of `"Panelist Portal"`.

---

## 4. Page-by-Page Scenarios & Guide Targets

### A. Public Portal & Authentication (`/`, `/login`, `/register`, `/repository`)

| Route | Key Guide Steps (`data-guide`) |
| :--- | :--- |
| `/` (Landing Page) | 1. `public-navbar-signin`: Official navigation bar & **Sign In** button to enter the evaluation portals<br>2. `landing-hero-carousel`: Full-screen Graduate School announcements & highlights<br>3. `landing-news-section`: Graduate School News & Announcements with photo gallery<br>4. `landing-programs-section`: Master's & Doctoral Programs Directory<br>5. `landing-repository-section`: Published Graduate Research Repository preview |
| `/login` | 1. `login-testing-notice`: System Evaluation & Testing Environment notice<br>2. `login-role-selector`: Choosing your assigned participant role (**Applicant**, **Graduate Student**, or **Faculty**)<br>3. `login-signin-button`: One-click sign-in to the selected portal |
| `/register` | 1. `register-step-indicator`: 2-Step Applicant Registration (Personal Details & Academic Background)<br>2. `register-form-card`: Interactive registration form with automatic Program Alignment check |

---

### B. Applicant Portal (`/applicant/*`)

| Route | Scenario Switcher States | Key Guide Steps (`data-guide`) |
| :--- | :--- | :--- |
| **Applicant Layout & Sidebar** | *(All 8 Applicant sections navigable)* | 1. `applicant-sidebar-nav`: Overview of the 8 Applicant Portal sections from Dashboard to COR Upload |
| `/applicant/dashboard` | 1. **Step 1: Program Alignment**<br>2. **Step 2: Exam Scheduled & Ready**<br>3. **Step 3: Exam Passed & COR Upload** | 1. `scenario-switcher`: Preview the Applicant Dashboard at each stage of admission<br>2. `applicant-progress-stepper`: 3-step visual tracker (Register & Align → Schedule & Take Exam → Upload COR)<br>3. `applicant-status-cards`: 6-card overview of Alignment, Exam Schedule, Exam Results, and COR Verification |
| `/applicant/profile` | *Populated applicant record* | 1. `applicant-personal-info`: Applicant demographic and contact information<br>2. `applicant-academic-background`: Undergraduate degree, GPA, and target Master's/Doctoral program |
| `/applicant/alignment` | 1. **Program Aligned (Cleared)**<br>2. **Bridging Courses Required (Waiver)** | 1. `scenario-switcher`: Toggle between Aligned and Bridging Required states<br>2. `alignment-status-card`: Assessment of undergraduate degree alignment with the chosen graduate program and Bridging Waiver download |
| `/applicant/schedule` | 1. **Select Available Exam Slot**<br>2. **Confirmed Exam Schedule**<br>3. **Locked (Pending Bridging Waiver)** | 1. `scenario-switcher`: Toggle between Slot Selection, Confirmed Booking, and Waiver Lock<br>2. `schedule-view-toggle`: Switch between Table View and Calendar View of available examination dates<br>3. `schedule-slots-card`: Interactive slot booking with confirmation dialog |
| `/applicant/exam` | 1. **Ready to Begin (Instructions)**<br>2. **Active Exam (MCQ & Essay)**<br>3. **Submitted (Finalization Receipt)**<br>4. **Missed Exam Appeal Gate** | 1. `scenario-switcher`: Preview all stages of the Entrance Examination<br>2. `exam-timer-bar`: Live countdown timer and automatic draft saving status<br>3. `exam-question-workspace`: Interactive Multiple-Choice Questions (with reading passages) and Graduate Essay editor (with live word count)<br>4. `exam-question-navigator`: Quick-jump numbered question grid, Essay section toggle, and **Submit Examination** button |
| `/applicant/results` | 1. **Passed**<br>2. **Pending Essay Evaluation**<br>3. **Passed (Reconsidered)**<br>4. **Did Not Meet Threshold** | 1. `scenario-switcher`: Preview all Entrance Exam outcome states<br>2. `results-score-breakdown`: Detailed breakdown of Multiple-Choice Score, Essay Score, Total Percentage, and Passing Threshold<br>3. `results-next-steps`: Enrollment instructions and direct link to Certificate of Registration (COR) Upload |
| `/applicant/cor-upload` | 1. **Ready to Upload COR**<br>2. **Under Verification**<br>3. **Verified (Upgraded to Student)** | 1. `scenario-switcher`: Toggle Certificate of Registration verification states<br>2. `cor-upload-dropzone`: Drag-and-drop uploader for the official Certificate of Registration PDF/image |
| `/applicant/notifications` | *Populated notifications list* | 1. `notifications-list`: Admission, examination, and enrollment verification alerts |

---

### C. Student Portal (`/student/*`)

| Route | Scenario Switcher States | Key Guide Steps (`data-guide`) |
| :--- | :--- | :--- |
| **Student Layout & Sidebar** | *(Always Unlocked: All 5 Thesis Journey steps are clickable)* | 1. `student-sidebar-nav`: Overview of Student navigation<br>2. `student-thesis-journey-menu`: Unlocked 5-step Thesis Journey menu |
| `/student/dashboard` | 1. **Active Proposal Defense**<br>2. **Initial Title Defense**<br>3. **Completed Thesis Journey** | 1. `scenario-switcher`: Preview Dashboard across thesis stages<br>2. `dashboard-welcome`: Student status & active degree banner<br>3. `dashboard-next-step`: Immediate next required action<br>4. `dashboard-milestones`: 5-Step Thesis Journey progress tracker<br>5. `dashboard-upcoming-defense`: Scheduled oral defense quick view |
| `/student/profile` | *Default populated view* | 1. `profile-personal-info`: Student demographic & contact details<br>2. `profile-academic-info`: Program, major, and enrollment record |
| `/student/curriculum` | *Default populated view* | 1. `curriculum-summary`: Earned units vs. required units<br>2. `curriculum-course-list`: Categorized graduate courses (Core, Major, Cognate, Thesis) |
| `/student/journey` | *Default populated view* | 1. `journey-stepper`: End-to-end visual timeline from Admission/Coursework to Final Defense<br>2. `journey-action-cards`: Direct links to each Thesis stage |
| `/student/thesis/title-defense` | 1. **Ready to Submit** (Upload 3-Title Proposal Package, COR, Receipt)<br>2. **Under Graduate School Review**<br>3. **Defense Scheduled** (Date, Time, Room/Link, Committee)<br>4. **Completed** (Approved Title & Rapporteur Report)<br>5. **Returned for Correction** | 1. `scenario-switcher`: Preview all Title Defense workflow states<br>2. `thesis-journey-stepper`: 5-Step Horizontal Thesis Journey Stepper & Approved Title/Adviser Context Banner<br>3. `title-doc-slots`: Uploading the 3 proposed thesis titles, COR, and payment receipt<br>4. `title-status-panel`: 3-Card Defense Status Tracker, Defense Schedule Summary, Rapporteur Report, and Submitted Documents |
| `/student/thesis/adviser-request` | 1. **Select & Request Adviser**<br>2. **Awaiting Approvals & Signatures**<br>3. **Adviser Officially Assigned**<br>4. **Declined — Select Another Adviser** | 1. `scenario-switcher`: Preview Thesis Adviser Request stages<br>2. `thesis-journey-stepper`: 5-Step Thesis Journey Stepper<br>3. `adviser-selection`: Selecting an eligible Graduate Faculty Adviser and signing the Thesis Adviser Request Form<br>4. `gs020-preview`: Tracking Adviser & Dean approval status and previewing the signed Thesis Adviser Request Form PDF |
| `/student/thesis/proposal-defense` | 1. **Step 1: Adviser Manuscript Review**<br>2. **Step 2: Submit Defense Application**<br>3. **Defense Scheduled**<br>4. **Completed & Rapporteur Report**<br>5. **Revisions Required** | 1. `scenario-switcher`: Toggle Proposal Defense stages<br>2. `thesis-journey-stepper`: 5-Step Thesis Journey Stepper<br>3. `proposal-adviser-panel`: Step 1 — Uploading the Proposal Manuscript for Adviser Pre-Defense Review & Certification<br>4. `proposal-application-step`: Step 2 — Uploading COR & Proof of Payment once certified by the Adviser<br>5. `proposal-defense-record`: 3-Card Defense Status Tracker, Schedule, and Rapporteur Report |
| `/student/thesis/strike` | 1. **Submit Manuscript for Check**<br>2. **Similarity Review in Progress**<br>3. **Cleared (Certificate Issued)** | 1. `scenario-switcher`: Toggle Plagiarism & Similarity Check stages<br>2. `thesis-journey-stepper`: 5-Step Thesis Journey Stepper<br>3. `strike-upload`: Uploading the revised manuscript for similarity verification (<15% threshold)<br>4. `strike-certificate`: Viewing the verified similarity score (9%) and Plagiarism Clearance Certificate PDF |
| `/student/thesis/final-defense` | 1. **Step 1: Final Adviser Review**<br>2. **Step 2: Submit Final Defense Application**<br>3. **Defense Scheduled**<br>4. **Completed & Passed** | 1. `scenario-switcher`: Toggle Final Oral Defense stages<br>2. `thesis-journey-stepper`: 5-Step Thesis Journey Stepper<br>3. `final-adviser-panel`: Step 1 — Final Manuscript endorsement by the Thesis Adviser<br>4. `final-application-step`: Step 2 — Final Defense Application requirements (COR & Proof of Payment)<br>5. `final-rap-panel`: 3-Card Defense Status Tracker, Final Rapporteur Report, and Research Repository Archival link |
| `/student/repository` & `/student/repository/submit` | 1. **Browse Repository**<br>2. **Submit Final Manuscript** | 1. `repo-search-filters`: Searching the EARIST Graduate Thesis Repository<br>2. `repo-submit-button`: Archiving the approved final thesis manuscript and required documents |

---

### D. Faculty Portal (`/faculty/*` & `/panelist/*`)

| Route | Scenario Switcher States | Key Guide Steps (`data-guide`) |
| :--- | :--- | :--- |
| `/faculty/dashboard` | *Default populated view* | 1. `panelist-kpi-cards`: Workload summary covering Active Defenses, Advisee Reviews, Pending Signatures, and **Pending Entrance Exam Essay Evaluations**<br>2. `panelist-attention-list`: Immediate action items requiring Faculty review or signature<br>3. `panelist-upcoming-list`: Quick access to active and upcoming oral defense sessions |
| `/faculty/defenses` | *Filterable list across Title, Proposal, and Final stages* | 1. `defenses-quick-filters`: Filter assignments by defense stage or session status<br>2. `defense-card-actions`: Preview Manuscript PDF or click **Open Defense Workspace** |
| `/faculty/defense-workspace/[scheduleId]` | 1. **Committee Chairperson Mode**<br>2. **Panel Member / Rapporteur Mode**<br>3. **Concluded Session View** | 1. `workspace-role-toggle`: Switch between Committee Chairperson, Panel Member/Rapporteur, and Concluded views<br>2. `workspace-pdf-pane`: Split-screen Manuscript PDF Viewer with highlight and comment annotations<br>3. `workspace-rubric-tab`: Oral Defense Evaluation Rubric (Manuscript 60% & Oral Defense 40%) with automatic weighted scoring<br>4. `workspace-rap-tab`: Collaborative Rapporteur Report editor, digital signatures, and formal committee verdict |
| `/faculty/advisees` & `/faculty/advisees/[studentId]` | 1. **Active Advisees**<br>2. **Incoming Adviser Requests**<br>3. **Pre-Defense Manuscript Reviews** | 1. `advisees-tabs`: Switch between Active Advisees, Incoming Thesis Adviser Requests, and Manuscript Review tasks<br>2. `adviser-review-actions`: Inspect advisee manuscripts, request revisions, or sign the Pre-Defense Adviser Certification |
| `/faculty/essay-evaluations` & `/faculty/essay-evaluations/[id]` | 1. **Pending Essay Evaluation**<br>2. **Evaluated Essay Record** | 1. `essay-eval-filters`: Search and filter Applicant Entrance Exam essays by program and evaluation status<br>2. `essay-eval-table`: View applicant exam submissions and click **Evaluate Essay**<br>3. `essay-grading-panel`: Read the applicant's written essay response, enter the essay score, and compute the final Entrance Exam result |
| `/faculty/signatures` | *Configured digital signature & pending documents* | 1. `signature-specimen-card`: Manage the faculty member's digital signature specimen<br>2. `pending-signatures-list`: One-click digital signing for pending Rapporteur Reports |
| `/faculty/profile` | *Faculty credentials & access badges* | 1. `panelist-profile-card`: Faculty academic rank, department affiliation, and specialization<br>2. `faculty-access-badges`: Classification & Academic Access indicators (Internal/External Faculty, Adviser Eligibility, and Entrance Exam Essay Evaluation access) |

