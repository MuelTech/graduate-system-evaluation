# EARIST Graduate School Information System — UI/UX Evaluation Edition

> **Institution:** Eulogio "Amang" Rodriguez Institute of Science and Technology (EARIST) — Graduate School  
> **Edition:** Interactive UI/UX System Evaluation Prototype (Applicant, Student & Faculty Portals)  
> **Deployment Target:** Vercel Free Tier (Hobby) — 100% Frontend-Self-Contained, Zero Backend or Database Required

---

## 1. Overview

The **EARIST Graduate School Information System — UI/UX Evaluation Edition** is a self-contained Next.js (App Router) evaluation prototype designed for thesis evaluation respondents across three primary participant roles:
1. **Applicants** (Evaluating Registration, Program Alignment, Exam Scheduling, the 72-item Entrance Exam + Essay, Exam Results, and COR Upload)
2. **Graduate Students** (Evaluating the Student Dashboard, Curriculum Checklist, Academic Journey, Unlocked 5-Step Thesis Journey, and Research Repository Archival)
3. **Faculty Members** (Evaluating the Faculty Workload Dashboard, Defense Assignments, Collaborative Defense Workspace with PDF Annotation & Rubrics, Advisee Supervision, Entrance Exam Essay Grading, and Digital Signatures)

In the production system (`MuelTech/graduate-system`), strict sequential backend database gates lock milestones (`LOCKED` / `WAITING`) until preceding administrative and faculty clearances are finalized. For UI/UX evaluation and usability testing, this Evaluation Edition unlocks **every screen, workflow stage, interactive form, PDF viewer, rubric matrix, and entrance exam engine** so respondents can freely inspect and evaluate the entire system with zero login friction.

---

## 2. Direct Evaluation Entry Links (For Respondents)

Once deployed on Vercel (e.g., `https://<your-vercel-domain>.vercel.app`), share any of the following direct entry links with your evaluation respondents:

| Participant Role | Route Path | Pre-Loaded Persona & Capabilities |
| :--- | :--- | :--- |
| **Landing Page (Public Entry)** | `/` | V2 institutional landing page with 100svh Hero Carousel, News Lightbox, Academic Programs Directory, and official **Sign In** (`/login`) |
| **Portal Sign-In & Role Selector** | `/login` | Passwordless sign-in with 1-click role selection between **Applicant**, **Graduate Student**, and **Faculty** |
| **Applicant Registration Wizard** | `/register` | 2-step registration with automated undergraduate degree alignment checking |
| **Applicant Portal** | `/applicant/dashboard` | **Maria Lourdes G. Villanueva** (`APP-2026-0142` · *Applicant for MAEd Administration & Supervision*) — Full admission lifecycle |
| **Entrance Examination (72 MCQs + Essay)** | `/applicant/exam` | Complete interactive exam with live countdown timer, all 72 OLSAT Multiple-Choice questions, Question Navigator, Graduate Essay editor with live word count, and submission receipt |
| **Graduate Student Portal** | `/student/dashboard` | **Juan M. Dela Cruz** (`2024-GS-00142` · *Enrolled MAEd Student*) — All 5 Thesis Journey steps unlocked |
| **Faculty Portal** | `/faculty/dashboard` | **Dr. Maria Clara R. Santos, EdD** (`FAC-GS-0018` · *Associate Professor V / Committee Chair & Adviser*) |
| **Entrance Exam Essay Evaluations** | `/faculty/essay-evaluations` | Faculty grading panel to review applicant written essays, assign scores, and compute combined entrance exam results |
| **Collaborative Defense Workspace** | `/faculty/defense-workspace/sched-eval-proposal-01` | Split-screen Oral Defense Workspace with PDF manuscript annotation, 1.00–2.50 institutional rubric matrix, rich-text Rapporteur Report editor, and committee verdict |

---

## 3. Built-In Evaluation Tools for Respondents

Every portal screen is equipped with **interactive evaluation aids**:

### 1. Interactive Arrow Page Guide (`? Page Guide`)
- Click the **`Page Guide`** button in the top header or public navigation on any page to launch an interactive spotlight overlay.
- Renders a **gold spotlight frame** around each real UI section on the page with a **curved directional SVG arrow** and an institutional coach-mark card (`Step 1 of N`) written in plain, self-explanatory language (no confusing internal form codes).
- Supports `Previous`, `Next`, `Skip Guide`, and keyboard navigation (`←`, `→`, `Esc`).

### 2. Scenario Switcher Bar (`Evaluation Scenario Preview`)
- Located at the top of multi-state workflow pages across Applicant, Student, and Faculty portals.
- Allows respondents to toggle a page's live state in **one click** without waiting for backend approvals:
  - **Applicant Dashboard (`/applicant/dashboard`):** `1. Alignment` ↔ `2. Exam Scheduled` ↔ `3. Exam Passed & COR Upload`
  - **Program Alignment (`/applicant/alignment`):** `1. Aligned (Cleared)` ↔ `2. Non-Aligned (Bridging Waiver Required)`
  - **Exam Scheduling (`/applicant/schedule`):** `1. Select Slot` ↔ `2. Confirmed Schedule` ↔ `3. Waiver Locked Gate`
  - **Entrance Exam (`/applicant/exam`):** `1. Instructions` ↔ `2. Active Exam (72 MCQs & Essay)` ↔ `3. Submission Receipt` ↔ `4. Missed Exam Appeal`
  - **Exam Results (`/applicant/results`):** `1. Passed` ↔ `2. Pending Essay Evaluation` ↔ `3. Passed Reconsidered` ↔ `4. Did Not Meet Threshold`
  - **COR Upload (`/applicant/cor-upload`):** `1. Upload Form` ↔ `2. Verification Pending` ↔ `3. Verified Student`
  - **Title Defense (`/student/thesis/title-defense`):** `1. Submit Form` ↔ `2. Under Review` ↔ `3. Defense Scheduled` ↔ `4. Completed & Rapporteur Report` ↔ `5. Returned for Correction`
  - **Adviser Request (`/student/thesis/adviser-request`):** `1. Select Adviser (Form)` ↔ `2. Awaiting Signatures` ↔ `3. Adviser Assigned` ↔ `4. Declined / Re-select`
  - **Proposal Defense (`/student/thesis/proposal-defense`):** `1. Pre-Defense Adviser Review` ↔ `2. Submit Defense Application` ↔ `3. Defense Scheduled` ↔ `4. Completed & Rapporteur Report` ↔ `5. Revisions Required`
  - **Plagiarism Check (`/student/thesis/strike`):** `1. Submit Manuscript` ↔ `2. Verification in Progress` ↔ `3. Cleared (9% Similarity & Certificate)`
  - **Final Defense (`/student/thesis/final-defense`):** `1. Final Adviser Endorsement` ↔ `2. Submit Final Application` ↔ `3. Final Defense Scheduled` ↔ `4. Completed & Passed`
  - **Faculty Essay Grading (`/faculty/essay-evaluations/[id]`):** `1. Pending Essay Grading` ↔ `2. Graded & Final Score Computed`
  - **Defense Workspace (`/faculty/defense-workspace/[scheduleId]`):** `1. Committee Chairperson Mode` ↔ `2. Panel Member / Rapporteur Mode` ↔ `3. Concluded Read-Only View`

---

## 4. Complete Route Inventory

### A. Public & Authentication Portal (`(public)`, `/login`, `/register`)
- `/` — V2 Institutional Landing Page (`100svh` Hero Carousel, News Lightbox, About, Programs, Repository, Contact)
- `/login` — Professional 3-Role Sign-In & Role Selector (**Applicant**, **Graduate Student**, **Faculty**)
- `/register` — 2-Step Applicant Registration with automated program alignment check
- `/programs` — Complete Doctoral and Master's Graduate Programs Directory
- `/repository` — Public Graduate Research Databank Catalog with citation export
- `/faq` — Frequently Asked Questions & Help Center
- `/about` — About the EARIST Graduate School

### B. Applicant Portal (`/applicant/*`)
- `/applicant/dashboard` — Applicant Progress Stepper & 6-Card Status Bento Grid
- `/applicant/profile` — Applicant Demographic & Undergraduate Academic Profile
- `/applicant/alignment` — Program Alignment Assessment & Bridging Waiver PDF Download
- `/applicant/schedule` — Entrance Exam Slot Booking (Table & Calendar Views)
- `/applicant/exam` — **Interactive Entrance Exam (All 72 Verified MCQs + Graduate Essay)**
- `/applicant/results` — Exam Score Breakdown (MCQ + Essay + Threshold)
- `/applicant/cor-upload` — Certificate of Registration (COR) Drag-and-Drop Upload & Verification
- `/applicant/notifications` — Applicant Alerts & Admission Updates

### C. Student Portal (`/student/*`)
- `/student/dashboard` — Student Dashboard (with 3-state Scenario Switcher)
- `/student/profile` — Verified Student Demographic & Academic Record
- `/student/curriculum` — Categorized Coursework Checklist, Units Progress, & GWA Summary
- `/student/journey` — Visual End-to-End Academic & Thesis Milestone Tracker
- `/student/thesis` — 5-Step Thesis Journey Hub
- `/student/thesis/title-defense` — Step 1: Title Defense Application, Schedule, & Unified 3-Card Status View
- `/student/thesis/adviser-request` — Step 2: Thesis Adviser Request Form & Digital Signing Status
- `/student/thesis/proposal-defense` — Step 3: 2-Step Progressive Disclosure (Adviser Review → Application) & Rapporteur Report
- `/student/thesis/strike` — Step 4: Plagiarism & Similarity Check (<15% threshold) & Clearance Certificate
- `/student/thesis/final-defense` — Step 5: 2-Step Progressive Disclosure (Final Review → Application) & Final Rapporteur Report
- `/student/repository` & `/student/repository/submit` — Research Databank Browser & Final Manuscript Archival Submission
- `/student/announcements` — Graduate School Memoranda & Circulars
- `/student/notifications` — Interactive Workflow Notifications

### D. Faculty Portal (`/faculty/*` rewriting to `/panelist/*`)
- `/faculty/dashboard` — Faculty Workload KPI Summary, Pending Essay Evaluations, & Upcoming Defenses
- `/faculty/profile` — Faculty Academic Profile, Specializations, & Classification Badges
- `/faculty/defenses` — Unified Defense Assignments (Title, Proposal, Final; Chair vs. Panel Member)
- `/faculty/defense-workspace/[scheduleId]` — **Collaborative Defense Workspace** (PDF Annotation, 1.00–2.50 Rubric Matrix, Rapporteur Report Editor, and Committee Verdict)
- `/faculty/advisees` & `/faculty/advisees/[studentId]` — My Advisees Roster, Incoming Adviser Requests, & Manuscript Certifications
- `/faculty/essay-evaluations` & `/faculty/essay-evaluations/[id]` — **Entrance Exam Essay Evaluations** (Interactive essay grading with automatic score computation)
- `/faculty/signatures` — Faculty Digital Signature Specimen & 1-Click Pending Document Sign-Offs
- `/faculty/repository` — Faculty Research Databank Browser
- `/faculty/announcements` — Faculty Memoranda & Guidelines
- `/faculty/notifications` — Defense Committee & Adviser Alerts

---

## 5. Step-by-Step Vercel Free Tier (Hobby) Deployment Guide

This repository is engineered to deploy on **Vercel Free Tier (Hobby)** with **zero environment variables**, **zero external backend servers**, and **zero database setup**.

### Option A: Deploy via Vercel Dashboard (Recommended)
1. Push this repository (`MuelTech/graduate-system-evaluation`) to GitHub.
2. Sign in to [vercel.com](https://vercel.com) using your GitHub account and click **"Add New..." → "Project"**.
3. Import **`MuelTech/graduate-system-evaluation`**.
4. Verify the auto-detected settings:
   - **Framework Preset:** `Next.js`
   - **Root Directory:** `./` (repo root)
   - **Build Command:** `npm run build` (default)
   - **Output Directory:** `.next` (default)
   - **Environment Variables:** *None required* (leave blank)
5. Click **"Deploy"**. Within ~60 seconds, your live evaluation URL will be ready to share with Applicant, Student, and Faculty respondents.

### Option B: Run Locally for Development or Verification
```bash
# 1. Install dependencies
npm install

# 2. Run production build verification
npm run build

# 3. Start local development server (http://localhost:3000)
npm run dev
```

---

## 6. Architecture & Built-In Sample Assets

- **Deterministic In-Memory + LocalStorage Mock Engine (`src/lib/evaluation-mock/`):** Intercepts all `apiClientRequest` queries and mutations client-side so forms, entrance exams, essay evaluations, rubric scores, and e-signatures update the UI immediately and persist in the respondent's browser session (`localStorage` key `earist_eval_state_v1`).
- **Static OLSAT Assessment Assets (`public/exam-assets/`):** 108 high-resolution visual stimulus and option figures from the institutional question bank served statically for instantaneous loading.
- **Static Institutional Sample PDFs (`public/sample-docs/`):** Bundled directly in `public/sample-docs/` and served through `/api/documents/*`, `/api/adviser-requests/*`, `/api/adviser-certifications/*`, `/api/student-defense-applications/*`, and `/api/waivers/*`:
  - `sample-manuscript.pdf` — Sample Graduate Thesis Manuscript (for Collaborative Defense Workspace & PDF Annotation)
  - `sample-gs020-adviser-request.pdf` — Official Thesis Adviser Request Form
  - `sample-predefense-certification.pdf` — Official Adviser Pre-Defense Manuscript Certification
  - `sample-defense-application.pdf` — Official Graduate School Oral Defense Application
  - `sample-rap-report.pdf` — Official Rapporteur Report
  - `sample-strike-certificate.pdf` — Official Plagiarism Clearance Certificate (`9%` Similarity Index)
  - `sample-cor.pdf` — Sample Certificate of Registration (COR)
