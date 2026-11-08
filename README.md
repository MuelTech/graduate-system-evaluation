# EARIST Graduate School Information System — UI/UX Evaluation Edition

> **Institution:** Eulogio "Amang" Rodriguez Institute of Science and Technology (EARIST) — Graduate School  
> **Edition:** Interactive UI/UX System Evaluation Prototype (Student & Faculty / Panelist Portals)  
> **Deployment Target:** Vercel Free Tier (Hobby) — 100% Frontend-Self-Contained, Zero Backend or Database Required

---

## 1. Overview

The **EARIST Graduate School Information System — UI/UX Evaluation Edition** is a self-contained Next.js 16 (App Router) evaluation prototype designed for thesis evaluation respondents (**Graduate Students** and **Graduate Faculty / Defense Committee Panelists**).

In the production system (`MuelTech/graduate-system`), strict sequential backend database gates lock Thesis Journey milestones (`LOCKED` / `WAITING`) until preceding administrative, adviser, and defense clearances are finalized. For UI/UX evaluation and ISO/IEC 25010 usability testing, this Evaluation Edition unlocks **every screen, workflow stage, interactive form, PDF viewer, rubric matrix, and e-signature workflow** so respondents can freely inspect and evaluate the entire system with zero login or database barriers.

---

## 2. Direct Evaluation Entry Links (For Respondents)

Once deployed on Vercel (e.g., `https://<your-vercel-domain>.vercel.app`), share any of the following direct entry links with your evaluation respondents:

| Target Audience / Purpose | Route Path | Pre-Loaded Persona & Capabilities |
| :--- | :--- | :--- |
| **Landing Page (Public Entry)** | `/` | Institutional landing page with 1-click **"Evaluate as Graduate Student"** and **"Evaluate as Faculty / Panelist"** hero entry buttons |
| **Quick Role Entry** | `/login` | Passwordless Respondent Role Selector comparing the Student and Faculty/Panelist evaluation personas |
| **Direct Student Portal Evaluation Link** | `/student/dashboard` | **Juan M. Dela Cruz** (`2024-GS-00142` · *MAEd in Administration & Supervision*) — All 5 Thesis Journey steps unlocked |
| **Direct Faculty / Panelist Evaluation Link** | `/panelist/dashboard` | **Dr. Maria Clara R. Santos, EdD** (`FAC-GS-0018` · *Associate Professor V / Committee Chairperson & Thesis Adviser*) |
| **Direct Collaborative Defense Workspace Link** | `/panelist/defense-workspace/sched-eval-proposal-01` | Immersive split-screen Oral Defense Workspace with interactive PDF manuscript annotation, 1.00–2.50 institutional rubric matrix, rich-text RAP report editor, and Chairperson verdict controls |

---

## 3. Built-In Evaluation Tools for Respondents

Every portal screen is equipped with **three (3) interactive evaluation aids** in the top bar:

### 1. Interactive Arrow Page Guide (`? Page Guide`)
- Click the **`? Page Guide` (`Tour`)** button in the top header on any page to launch an interactive spotlight overlay.
- Renders a **gold spotlight frame** around each real UI section on the page with a **curved directional SVG arrow** and an institutional coach-mark card (`Step 1 of N`) explaining what that section does and how to test it.
- Supports `Previous`, `Next`, `Skip Guide`, and keyboard navigation (`←`, `→`, `Esc`).

### 2. Scenario Switcher Bar (`Evaluation Scenario Preview`)
- Located at the top of multi-state workflow pages (`/student/dashboard`, all 5 `/student/thesis/*` steps, `/student/repository/submit`, and `/panelist/defense-workspace/[scheduleId]`).
- Allows respondents to toggle a page's live state in **one click** without filling out prerequisite stages first:
  - **Title Defense (`/student/thesis/title-defense`):** `1. Submit Form` ↔ `2. Under Review` ↔ `3. Defense Scheduled` ↔ `4. Completed & RAP` ↔ `5. Returned for Correction`
  - **Adviser Request (`/student/thesis/adviser-request`):** `1. Select Adviser (Form)` ↔ `2. Pending Signatures (GS-020)` ↔ `3. Adviser Assigned (Approved)` ↔ `4. Declined / Re-select`
  - **Proposal Defense (`/student/thesis/proposal-defense`):** `1. Pre-Defense Adviser Review` ↔ `2. Submit Defense Application` ↔ `3. Defense Scheduled` ↔ `4. Completed & RAP Result` ↔ `5. Revisions Required`
  - **STRIKE Plagiarism (`/student/thesis/strike`):** `1. Submit Manuscript` ↔ `2. Verification in Progress` ↔ `3. Cleared (9% Similarity & Certificate)`
  - **Final Defense (`/student/thesis/final-defense`):** `1. Final Adviser Endorsement` ↔ `2. Submit Final Application` ↔ `3. Final Defense Scheduled` ↔ `4. Completed & Passed`
  - **Defense Workspace (`/panelist/defense-workspace/[scheduleId]`):** `1. Committee Chairperson Mode` ↔ `2. Panel Member / Rapporteur Mode` ↔ `3. Concluded Read-Only View`

### 3. 1-Click Role Switcher (`Student` ↔ `Faculty / Panelist`)
- Located in the top navigation bar of both portals.
- Lets respondents switch instantaneously between **Graduate Student** (`Juan M. Dela Cruz`) and **Faculty / Panelist** (`Dr. Maria Clara R. Santos`) personas—or open the `/login` Role Selector—at any point during their walkthrough.

---

## 4. Complete Route Inventory

### A. Public Portal (`(public)` & `/login`)
- `/` — Institutional Landing Page with Respondent Quick-Entry CTAs
- `/login` — Passwordless Respondent Role Selector
- `/programs` — Graduate Programs Catalog
- `/repository` — Public Graduate Research Databank Browser
- `/faq` — Frequently Asked Questions & Help Center
- `/about` — About the EARIST Graduate School Information System

### B. Student Portal (`/student/*`)
- `/student/dashboard` — Student Dashboard (with 3-state Scenario Switcher)
- `/student/profile` — Verified Student Demographic & Academic Record
- `/student/curriculum` — Categorized Coursework Checklist, Units Progress, & GWA Summary
- `/student/journey` — Visual End-to-End Academic & Thesis Milestone Tracker
- `/student/thesis` — 5-Step Thesis Journey Hub
- `/student/thesis/title-defense` — Step 1: Title Defense Application, Schedule, & Official RAP Record
- `/student/thesis/adviser-request` — Step 2: Official GS Form No. 020 Adviser Request & E-Signature Routing
- `/student/thesis/proposal-defense` — Step 3: Pre-Defense Adviser Review, Proposal Defense Application, & RAP Outcome
- `/student/thesis/strike` — Step 4: STRIKE Plagiarism Check Submission & Clearance Certificate (`9%` Similarity Index)
- `/student/thesis/final-defense` — Step 5: Final Pre-Defense Endorsement, Final Oral Defense, & Final RAP Outcome
- `/student/repository` & `/student/repository/submit` — Research Databank Browser & Final Manuscript Archival Submission
- `/student/announcements` — Graduate School Memoranda & Circulars
- `/student/notifications` — Interactive Workflow Notifications

### C. Faculty / Panelist Portal (`/panelist/*`)
- `/panelist/dashboard` — Faculty Workload KPI Summary, Actionable Tasks, & Upcoming Defense Sessions
- `/panelist/profile` — Faculty Academic Profile, Specializations, & Adviser Availability Toggle
- `/panelist/defenses` — Unified Defense Assignments (Title, Proposal, Final; Chair vs. Panel Member)
- `/panelist/defense-workspace/[scheduleId]` — **Collaborative Defense Workspace** (Split-screen PDF Manuscript Viewer + Highlight/Comment Annotations, 1.00–2.50 Institutional Oral Evaluation Rubric, Rich-Text Official RAP Report Editor, and Committee Verdict & E-Signature Panel)
- `/panelist/advisees` & `/panelist/advisees/[studentId]` — My Advisees Roster, Incoming GS-020 Adviser Requests (`CONFORME`), & Pre-Defense Manuscript Certifications
- `/panelist/signatures` — Faculty Digital Signature Specimen & 1-Click Pending RAP Sign-Offs
- `/panelist/repository` — Faculty Research Databank Browser
- `/panelist/announcements` — Faculty Memoranda & Guidelines
- `/panelist/notifications` — Defense Committee & Adviser Notifications

---

## 5. Step-by-Step Vercel Free Tier (Hobby) Deployment Guide

This repository is engineered specifically to deploy on **Vercel Free Tier (Hobby)** with **zero environment variables**, **zero external backend servers**, and **zero database setup**.

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
5. Click **"Deploy"**. Within ~60 seconds, your live evaluation URL will be ready to share with Student and Faculty/Panelist respondents.

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

## 6. Architecture & Built-In Sample PDF Assets

- **Deterministic In-Memory + LocalStorage Mock Engine (`src/lib/evaluation-mock/`):** Intercepts all `apiClientRequest` queries and mutations client-side so forms, file uploads, rubric scores, RAP edits, and e-signatures update the UI immediately and persist in the respondent's browser session (`localStorage` key `earist_eval_state_v1`). Respondents can reset demo data at any time via the **"Reset Demo"** button on any Scenario Switcher bar.
- **Static Institutional Sample PDFs (`public/sample-docs/`):** Bundled directly in `public/sample-docs/` and served through `/api/documents/*`, `/api/adviser-requests/*`, `/api/adviser-certifications/*`, and `/api/student-defense-applications/*`:
  - `sample-manuscript.pdf` — Sample Graduate Thesis Manuscript (for Collaborative Defense Workspace & PDF Annotation)
  - `sample-gs020-adviser-request.pdf` — Official GS Form No. 020 Request for Thesis Adviser
  - `sample-predefense-certification.pdf` — Official Adviser Pre-Defense Manuscript Certification
  - `sample-defense-application.pdf` — Official Graduate School Oral Defense Application
  - `sample-rap-report.pdf` — Official Report of Action Taken (RAP)
  - `sample-strike-certificate.pdf` — Official STRIKE Plagiarism Clearance Certificate (`9%` Similarity Index)
  - `sample-cor.pdf` — Sample Certificate of Registration (COR)
