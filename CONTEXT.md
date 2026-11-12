# Project Context: EARIST Graduate System — UI/UX Evaluation Edition

> **Agent instruction:** Read [`GEMINI.md`](./GEMINI.md) and this file first before implementing or modifying any code. Always check [`docs/IMPLEMENTATION_CHECKLIST.md`](./docs/IMPLEMENTATION_CHECKLIST.md) to see the current active Work Package.

---

## 1. Project Purpose & Background

- **Evaluation Repository:** `MuelTech/graduate-system-evaluation`
- **Source Reference Repository:** `MuelTech/graduate-system` (`https://github.com/MuelTech/graduate-system`)
- **Target Audience:** Thesis evaluation respondents consisting strictly of:
  1. **Applicants** (Prospective Graduate School applicants evaluating registration, program alignment, entrance exam scheduling, the interactive MCQ + Essay Entrance Examination, exam results, and COR upload)
  2. **Students** (Graduate School students evaluating the Student Portal & 5-Step Thesis Journey)
  3. **Faculty** (Advisers, Defense Committee Chairpersons, Panel Members, and Entrance Exam Essay Evaluators evaluating the Faculty Portal & Collaborative Defense Workspace)
- **Why this Evaluation Edition exists:**
  - In the production `MuelTech/graduate-system`, strict backend workflow gates lock Applicant and Student milestones (`LOCKED` / `WAITING`) until prior administrative, examination, and defense steps are completed in the database.
  - For system evaluation, respondents must be able to **freely explore, interact with, and evaluate every screen, state, form, entrance exam, and document workflow** for their role (**Applicant**, **Student**, or **Faculty**)—with **guided directional arrows/callouts** written in plain, self-explanatory language (avoiding cryptic internal form codes like `GS-020`).
- **Deployment Target:** **Vercel Free Tier (Hobby)** as a self-contained Next.js frontend application with zero external backend dependencies.

---

## 2. Scope Boundaries

### Included Portals & Route Families
1. **Public Portal (`(public)`) & Respondent Entry:**
   - `/` (V2 Redesigned Landing Page matching `MuelTech/graduate-system`: `100svh` Hero Carousel, News & Announcements with photo lightbox, About, Graduate Programs Directory, Research Repository, Contact, and official Navbar with `Sign In` & `Create Account`)
   - `/about`, `/programs`, `/faq`, `/repository`
   - `/login` (Professional Sign-In & Role Selector for **Applicant**, **Student**, and **Faculty** with clear System Evaluation & Testing notice)
   - `/register` (2-Step Applicant Registration Wizard with program alignment check)
2. **Applicant Portal (`/applicant/*`):**
   - `/applicant/dashboard` — Applicant Progress Stepper & 6-Card Application Status Bento Grid
   - `/applicant/profile` — Applicant Personal & Undergraduate Academic Profile
   - `/applicant/alignment` — Program Alignment Status & Bridging Course Waiver Download
   - `/applicant/schedule` — Entrance Examination Slot Booking (Table & Calendar Views)
   - `/applicant/exam` — **Interactive Entrance Examination** (Live Countdown Timer, 10 Graduate MCQs with stimulus passages, 1 Graduate Essay with word counter, Question Navigator, Auto-Save, and Submission Receipt)
   - `/applicant/results` — Entrance Exam Score Breakdown (MCQ + Essay + Passing Threshold)
   - `/applicant/cor-upload` — Certificate of Registration (COR) Upload & Verification Status
   - `/applicant/notifications` — Applicant Notifications
3. **Student Portal (`/student/*`):**
   - `/student/dashboard` — Student Dashboard
   - `/student/profile` — Student Profile
   - `/student/curriculum` — Curriculum & Coursework Checklist
   - `/student/journey` — Academic Journey Overview
   - `/student/thesis` — Thesis Journey Hub
   - **Unlocked Thesis Journey Steps (All 5 always navigable, wrapped in `<ThesisJourneyShell>`):**
     - `/student/thesis/title-defense` — Title Defense Application, Schedule, & Unified 3-Card Status View
     - `/student/thesis/adviser-request` — Thesis Adviser Request Form & Digital Signing Status
     - `/student/thesis/proposal-defense` — 2-Step Disclosure (Adviser Manuscript Review → Defense Application), Schedule, & Rapporteur Report
     - `/student/thesis/strike` — Plagiarism & Similarity Check Submission & Clearance Certificate
     - `/student/thesis/final-defense` — 2-Step Disclosure (Final Adviser Review → Defense Application), Schedule, & Final Rapporteur Report
   - `/student/repository` & `/student/repository/submit` — Thesis Repository & Final Archival Submission
   - `/student/announcements` — Graduate School Memos & Announcements
   - `/student/notifications` — Student Notifications
4. **Faculty Portal (`/faculty/*` rewriting to `/panelist/*`):**
   - `/faculty/dashboard` — Faculty Dashboard, Pending Essay Evaluations KPI, & Upcoming Defense Summary
   - `/faculty/profile` — Faculty Profile & Classification / Academic Access Badges
   - `/faculty/defenses` — My Defenses (Unified assignment list across Title, Proposal, and Final stages)
   - `/faculty/defense-workspace/[scheduleId]` — **Collaborative Defense Workspace** (Immersive split-screen PDF Manuscript Annotation, Rubric Evaluation & Scoring, Rapporteur Report Editor, Committee Verdict & E-Signature status)
   - `/faculty/advisees` & `/faculty/advisees/[studentId]` — My Advisees (Adviser Requests endorsement + Proposal/Final Pre-Defense Manuscript Review & Certification)
   - `/faculty/essay-evaluations` & `/faculty/essay-evaluations/[id]` — **Entrance Exam Essay Evaluations** (Review & grade Applicant Entrance Exam essays with automatic total score calculation)
   - `/faculty/signatures` — E-Signatures Management & Pending Rapporteur Report Sign-offs
   - `/faculty/repository` — Faculty Thesis Repository
   - `/faculty/announcements` — Faculty Announcements & Memos
   - `/faculty/notifications` — Faculty Notifications

### Excluded Portals
- **Admin Portal (`/admin/*`)** — Excluded (not part of Applicant/Student/Faculty respondent evaluation).

---

## 3. Core Evaluation Architecture

```text
┌──────────────────────────────────────────────────────────────────────┐
│             NEXT.JS APP ROUTER (100% Client / Static Ready)          │
│                     Deployable on Vercel Free Tier                   │
├──────────────────────────────────────────────────────────────────────┤
│  1. Exact V2 UI/UX Components from MuelTech/graduate-system/frontend │
│     (60-30-10 #FFF8F0 / #e02b20 Theme, Instrument Sans, V2 Landing)  │
├──────────────────────────────────────────────────────────────────────┤
│  2. Evaluation Enhancement Layer (Clean & Role-Focused)              │
│     • Clean Portal Headers (No RoleSwitcherPill clutter in header)   │
│     • ScenarioSwitcherBar (Toggle stage states: Form / Review /      │
│       Scheduled / Completed / Revision Required)                     │
│     • PageGuideOverlay (Spotlight + Directional Arrows + Plain-      │
│       Language Explanations covering every portal section)           │
├──────────────────────────────────────────────────────────────────────┤
│  3. Hardcoded Mock Store & Static Sample Assets                      │
│     • Deterministic EARIST Mock Dataset (src/lib/evaluation-mock/)   │
│     • Interactive Local State (Exams, Forms, Rubrics, Essay Grading) │
│     • Static Sample PDFs in public/sample-docs/ for PDF Viewer       │
└──────────────────────────────────────────────────────────────────────┘
```

### Key Technical Rules
1. **No Backend Fetch Errors:** Replace live `axios` / `fetch` calls in `src/lib/api.client.ts` and `src/lib/api.server.ts` with a deterministic **In-Memory / LocalStorage Evaluation Mock Router** so existing React Query hooks (`useQuery`, `useMutation`) resolve instantaneously with realistic EARIST data and support interactive mutations (e.g., uploading a file, submitting a defense form, saving rubric scores, signing a request).
2. **No NextAuth Server Dependency:** Replace `next-auth/react` `useSession` / `signOut` and `src/middleware.ts` with a lightweight client-safe Evaluation Session provider that defaults to the active portal role (`student` on `/student/*`, `panelist` on `/panelist/*`) and allows 1-click role switching.
3. **No WebSocket Connection Errors:** Replace `socket.io-client` in the Collaborative Defense Workspace with a simulated real-time local bus so PDF annotations, collaborator presence badges, and RAP live previews work smoothly offline/on Vercel.
4. **Built-in Sample PDFs:** Ship valid sample PDF documents under `public/sample-docs/` (e.g., sample thesis manuscript, GS-020 adviser form, COR, official defense application, RAP report) so every "Preview Document" dialog and the Panelist PDF Annotation canvas render real pages.

---

## 4. Workflow Discipline for Coding Agents

1. **Check [`docs/IMPLEMENTATION_CHECKLIST.md`](./docs/IMPLEMENTATION_CHECKLIST.md)** before starting work.
2. **Consult [`docs/EVALUATION_GUIDE_AND_SCENARIOS_SPEC.md`](./docs/EVALUATION_GUIDE_AND_SCENARIOS_SPEC.md)** for the required Scenario Switcher states and Coach-Mark Arrow steps on each page.
3. **Keep commits and work packages modular:** Complete one Work Package at a time, run `npm run build` (or typecheck) when appropriate, and update the checklist status.
