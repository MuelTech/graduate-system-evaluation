# Project Context: EARIST Graduate System — UI/UX Evaluation Edition

> **Agent instruction:** Read [`GEMINI.md`](./GEMINI.md) and this file first before implementing or modifying any code. Always check [`docs/IMPLEMENTATION_CHECKLIST.md`](./docs/IMPLEMENTATION_CHECKLIST.md) to see the current active Work Package.

---

## 1. Project Purpose & Background

- **Evaluation Repository:** `MuelTech/graduate-system-evaluation`
- **Source Reference Repository:** `MuelTech/graduate-system` (`https://github.com/MuelTech/graduate-system`)
- **Target Audience:** Thesis evaluation respondents consisting strictly of:
  1. **Students** (Graduate School students evaluating the Student Portal & Thesis Journey)
  2. **Faculty / Panelists** (Advisers, Defense Committee Chairpersons, and Panel Members evaluating the Panelist Portal & Collaborative Defense Workspace)
- **Why this Evaluation Edition exists:**
  - In the production `MuelTech/graduate-system`, strict backend workflow gates lock Student Thesis Journey steps (`LOCKED` / `WAITING`) until prior administrative and defense milestones are completed in the database.
  - For system evaluation, respondents must be able to **freely explore, interact with, and evaluate every screen, state, form, and document workflow** for both **Student** and **Faculty/Panelist** roles—with **guided directional arrows/callouts** explaining how each page works.
- **Deployment Target:** **Vercel Free Tier (Hobby)** as a self-contained Next.js frontend application with zero external backend dependencies.

---

## 2. Scope Boundaries

### Included Portals & Route Families
1. **Public Portal (`(public)`) & Respondent Entry:**
   - `/` (Landing Page with quick "Evaluate as Student" & "Evaluate as Faculty/Panelist" entry points)
   - `/about`, `/programs`, `/faq`, `/repository`
   - `/login` (Simplified Respondent Role Selector / Instant Sign-In without password friction)
2. **Student Portal (`/student/*`):**
   - `/student/dashboard` — Student Dashboard
   - `/student/profile` — Student Profile
   - `/student/curriculum` — Curriculum & Coursework Checklist
   - `/student/journey` — Academic Journey Overview
   - `/student/thesis` — Thesis Journey Hub
   - **Unlocked Thesis Journey Steps (All 5 always navigable):**
     - `/student/thesis/title-defense` — Title Defense Application, Schedule, & Post-Submission Records
     - `/student/thesis/adviser-request` — Official GS-020 Adviser Request & Signing Status
     - `/student/thesis/proposal-defense` — Pre-Defense Adviser Review, Proposal Defense Application, Schedule, & RAP Result
     - `/student/thesis/strike` — STRIKE / Plagiarism Clearance Submission & Certificate Status
     - `/student/thesis/final-defense` — Final Pre-Defense Adviser Review, Final Defense Application, Schedule, & Final RAP Result
   - `/student/repository` & `/student/repository/submit` — Thesis Repository & Final Archival Submission
   - `/student/announcements` — Graduate School Memos & Announcements
   - `/student/notifications` — Student Notifications
3. **Faculty / Panelist Portal (`/panelist/*`):**
   - `/panelist/dashboard` — Panelist Dashboard & Upcoming Defense Summary
   - `/panelist/profile` — Faculty / Panelist Profile
   - `/panelist/defenses` — My Defenses (Unified assignment list across Title, Proposal, and Final stages)
   - `/panelist/defense-workspace/[scheduleId]` — **Collaborative Defense Workspace** (Immersive split-screen PDF Manuscript Annotation, Rubric Evaluation & Scoring, Official RAP Report Editor, Committee Verdict & E-Signature status)
   - `/panelist/advisees` & `/panelist/advisees/[studentId]` — My Advisees (Adviser Requests GS-020 endorsement + Proposal/Final Pre-Defense Manuscript Review & Certification)
   - `/panelist/signatures` — E-Signatures Management & Pending Document Sign-offs
   - `/panelist/repository` — Faculty Thesis Repository
   - `/panelist/announcements` — Faculty Announcements & Memos
   - `/panelist/notifications` — Panelist Notifications

### Excluded Portals
- **Admin Portal (`/admin/*`)** — Excluded (not part of Student/Faculty respondent evaluation).
- **Applicant Portal (`/applicant/*`)** — Excluded (evaluation focuses on enrolled Graduate Student & Faculty/Panelist workflows).

---

## 3. Core Evaluation Architecture

```text
┌──────────────────────────────────────────────────────────────────────┐
│             NEXT.JS APP ROUTER (100% Client / Static Ready)          │
│                     Deployable on Vercel Free Tier                   │
├──────────────────────────────────────────────────────────────────────┤
│  1. Exact UI/UX Components from MuelTech/graduate-system/frontend    │
│     (EARIST Theme, Tailwind v4, shadcn/ui, Lucide Icons, PDF/Tiptap) │
├──────────────────────────────────────────────────────────────────────┤
│  2. Evaluation Enhancement Layer                                     │
│     • RoleSwitcherToolbar (Instant Student <-> Panelist switch)      │
│     • ScenarioSwitcherBar (Toggle stage states: Form / Review /      │
│       Scheduled / Completed / Revision Required)                     │
│     • PageGuideOverlay (Spotlight + Directional Arrows + Tooltips)   │
├──────────────────────────────────────────────────────────────────────┤
│  3. Hardcoded Mock Store & Static Sample Assets                      │
│     • Deterministic EARIST Mock Dataset (src/lib/evaluation-mock/)   │
│     • Interactive Local State (submitting forms updates UI state)    │
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
