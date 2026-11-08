# Implementation Checklist — EARIST Graduate System (Evaluation Edition)

> **Rule for Agents:** Work on **only one Work Package (`WP-*`) at a time**. Update checkboxes (`[ ]` → `[x]`) and the **Current Status Summary** table below after finishing each Work Package.

---

## Current Status Summary

| Work Package | Title | Status | Notes |
| :--- | :--- | :--- | :--- |
| **WP-0** | Documentation, Specs, & Agent Skill Setup | **COMPLETED** | `GEMINI.md`, `CONTEXT.md`, Checklist, Spec, and `graduate-eval-builder` skill created |
| **WP-1** | Base Frontend Scaffolding, Mock API Layer & Public Entry | **PENDING** | Next.js App Router at repo root (or `frontend/`), EARIST theme, UI primitives, Public pages, Role Switcher |
| **WP-2** | Evaluation UI Engine (Arrow Coach-Marks, Scenario Switcher & Sample PDFs) | **PENDING** | `PageGuideOverlay`, `ScenarioSwitcherBar`, `RoleSwitcherBanner`, and `public/sample-docs/*.pdf` |
| **WP-3** | Student Portal — Layout & Core Pages + Guides | **PENDING** | Unlocked Sidebar, Dashboard, Profile, Curriculum, Academic Journey, Repository, Announcements, Notifications |
| **WP-4** | Student Portal — Unlocked Thesis Journey Steps + Multi-State Scenarios | **PENDING** | Title Defense, Adviser Request, Proposal Defense, STRIKE / Plagiarism, Final Defense (all states unlocked) |
| **WP-5** | Faculty / Panelist Portal — All Pages & Collaborative Defense Workspace | **PENDING** | Dashboard, Profile, My Defenses, Defense Workspace (PDF Annotation, Scoring, RAP), My Advisees, E-Signatures, Repository, Announcements, Notifications |
| **WP-6** | End-to-End QA, Guide Verification & Vercel Deployment Readiness | **PENDING** | Full `next build` check, link/route audit, responsive check, `vercel.json` / README instructions |

---

## Detailed Work Packages

### WP-0: Documentation, Specs, & Agent Skill Setup
- [x] Create root [`GEMINI.md`](../GEMINI.md) with context window management and subagent rules.
- [x] Create root [`CONTEXT.md`](../CONTEXT.md) defining scope (Public + Student + Panelist), Vercel free-tier architecture, and mock strategy.
- [x] Create [`docs/IMPLEMENTATION_CHECKLIST.md`](./IMPLEMENTATION_CHECKLIST.md) with bounded work packages.
- [x] Create [`docs/EVALUATION_GUIDE_AND_SCENARIOS_SPEC.md`](./EVALUATION_GUIDE_AND_SCENARIOS_SPEC.md) detailing every route, Scenario Switcher state, and Coach-Mark Arrow step.
- [x] Create custom skill [`.agents/skills/graduate-eval-builder/SKILL.md`](../.agents/skills/graduate-eval-builder/SKILL.md) and register it in persistent `~/.gemini` storage.

---

### WP-1: Base Frontend Scaffolding, Mock API Layer & Public Entry
**Goal:** Establish the Next.js project structure with the exact EARIST styling, shared `shadcn/ui` components, mock session/API layer, and Public Portal + Respondent Role Entry.

- [ ] **1.1 Project Structure & Config:**
  - Copy base Next.js config (`package.json`, `tsconfig.json`, `postcss.config.mjs`, `next.config.ts`, `src/app/globals.css`, `src/app/layout.tsx`, `public/` assets) from `MuelTech/graduate-system/frontend`.
  - Remove Admin/Applicant-only dependencies or server-only auth barriers so Vercel builds cleanly without environment variables.
- [ ] **1.2 Shared UI & Layout Components:**
  - Port `src/components/ui/*`, `src/components/providers.tsx`, `src/components/chatbot/chatbot-widget.tsx`, and `src/components/layout/notification-bell.tsx`.
- [ ] **1.3 Mock Session & Deterministic Mock API Engine:**
  - Replace `next-auth/react` calls with a client-safe Evaluation Session layer supporting instant switching between **Student** (`Juan Dela Cruz — MAEd Administration & Supervision`) and **Faculty / Panelist** (`Dr. Maria Clara Santos — Graduate Faculty / Panel Chair`).
  - Implement deterministic mock handler in `src/lib/api.client.ts` and `src/lib/api.server.ts` backed by `src/lib/evaluation-mock/` so all React Query hooks resolve without a backend server.
- [ ] **1.4 Public Portal & Respondent Login / Role Selector:**
  - Port `(public)/layout.tsx`, `(public)/page.tsx`, `(public)/about/page.tsx`, `(public)/programs/page.tsx`, `(public)/faq/page.tsx`, `(public)/repository/page.tsx`.
  - Create respondent-friendly `/login` (and prominent hero CTA buttons) with 1-click **"Evaluate as Student"** and **"Evaluate as Faculty / Panelist"** cards.

---

### WP-2: Evaluation UI Engine (Arrow Coach-Marks, Scenario Switcher & Sample PDFs)
**Goal:** Build the reusable evaluation overlays and sample documents so respondents understand every page and can preview every workflow state.

- [ ] **2.1 Interactive Arrow Guide (`src/components/evaluation/page-guide-overlay.tsx`):**
  - Spotlight highlight on target DOM elements (`data-guide="..."`).
  - Animated SVG directional arrow pointing directly to the highlighted feature.
  - Step card showing: Step counter (`Step 1 of N`), clear title, explanation of what the section does in the system, and `Previous` / `Next` / `Done` buttons.
  - Header button (`[? Page Guide]`) to re-open the guide on any page at any time.
- [ ] **2.2 Scenario Switcher Bar (`src/components/evaluation/scenario-switcher-bar.tsx`):**
  - Compact, clearly labeled evaluation bar at the top of multi-state pages allowing respondents to switch between workflow stages (e.g., *1. Submit Form*, *2. Under Review*, *3. Scheduled Defense*, *4. Completed & Official Records*, *5. Returned for Revision*).
- [ ] **2.3 Floating/Header Role Switcher (`src/components/evaluation/role-switcher-pill.tsx`):**
  - Allows respondents to jump between the **Student Portal** and **Faculty / Panelist Portal** (or return to the Evaluation Home) in one click.
- [ ] **2.4 Built-in Sample PDF Documents (`public/sample-docs/`):**
  - Generate valid, multi-page institutional sample PDFs (`sample-manuscript.pdf`, `sample-gs020-adviser-request.pdf`, `sample-defense-application.pdf`, `sample-rap-report.pdf`, `sample-cor.pdf`, `sample-strike-certificate.pdf`) and wire `/api/documents/...` & PDF routes to serve them cleanly on Vercel.

---

### WP-3: Student Portal — Layout & Core Pages + Guides
**Goal:** Port the Student Portal chrome with all sidebar items unlocked and implement all general Student pages with hardcoded EARIST data and page guides.

- [ ] **3.1 Student Layout (`src/app/(portal)/student/layout.tsx`):**
  - Unlock all 5 **Thesis Journey** steps in the sidebar (`isNavigable = true` for all steps) while displaying realistic status badges.
  - Integrate `RoleSwitcherPill` and `[? Page Guide]` trigger in the Student header.
- [ ] **3.2 Student Core Pages:**
  - `/student/dashboard` — Progress summary, active thesis milestone, upcoming defense schedule, recent notifications.
  - `/student/profile` — Student academic profile, degree program, student ID, contact info.
  - `/student/curriculum` — Degree curriculum checklist, completed/enrolled units, GPA summary.
  - `/student/journey` — Visual end-to-end Academic & Thesis Journey timeline with clickable steps.
  - `/student/repository` & `/student/repository/submit` — Graduate Thesis Repository browser, document viewer, and archival submission form.
  - `/student/announcements` — Official Graduate School memos and announcements.
  - `/student/notifications` — Interactive notification list with read/unread toggles.
- [ ] **3.3 Wire Arrow Guides (`data-guide` attributes) for all WP-3 pages.**

---

### WP-4: Student Portal — Unlocked Thesis Journey Steps + Multi-State Scenarios
**Goal:** Port all 5 previously restricted Thesis Journey pages with full interactive forms AND the `ScenarioSwitcherBar` so respondents can inspect every stage of each milestone.

- [ ] **4.1 Title Defense (`/student/thesis/title-defense`):**
  - Scenarios: `NOT_SUBMITTED` (3-title proposal package upload form), `APPLICATION_UNDER_REVIEW`, `SCHEDULED` (committee & schedule details), `COMPLETED` (approved title + post-submission record + RAP summary), `REJECTED` (correction & resubmission view).
- [ ] **4.2 Adviser Request (`/student/thesis/adviser-request`):**
  - Scenarios: `SELECT_ADVISER` (browse faculty directory & submit GS-020 request), `PENDING_SIGNATURES` (GS-020 tracking across Adviser / Chair / Dean), `APPROVED` (signed official GS-020 PDF preview).
- [ ] **4.3 Proposal Defense (`/student/thesis/proposal-defense`):**
  - Scenarios: `ADVISER_REVIEW` (pre-defense manuscript submission & adviser endorsement panel), `READY_TO_APPLY` (official defense application form), `SCHEDULED` (defense schedule & committee), `COMPLETED` (Proposal Defense RAP report & verdict).
- [ ] **4.4 STRIKE / Plagiarism (`/student/thesis/strike`):**
  - Scenarios: `SUBMIT_MANUSCRIPT` (upload manuscript for similarity check), `UNDER_VERIFICATION`, `CLEARED` (similarity index report & STRIKE clearance certificate preview).
- [ ] **4.5 Final Defense (`/student/thesis/final-defense`):**
  - Scenarios: `FINAL_ADVISER_REVIEW` (final manuscript endorsement), `READY_TO_APPLY`, `SCHEDULED`, `COMPLETED` (Final Defense RAP report, final committee signatures, & proceed to Repository archival).
- [ ] **4.6 Wire Arrow Guides (`data-guide` attributes) for all 5 Thesis Journey pages.**

---

### WP-5: Faculty / Panelist Portal — All Pages & Collaborative Defense Workspace
**Goal:** Port all Panelist (Faculty) pages and the full Collaborative Defense Workspace with zero backend/socket dependencies.

- [ ] **5.1 Panelist Layout & Core Pages:**
  - `src/app/(portal)/panelist/layout.tsx` with `RoleSwitcherPill` and `[? Page Guide]` trigger.
  - `/panelist/dashboard` — Faculty workload summary, today's/upcoming defense sessions, pending adviser reviews, and signature requests.
  - `/panelist/profile` — Faculty profile, specialization tags, advisee capacity, and academic rank.
  - `/panelist/repository`, `/panelist/announcements`, `/panelist/notifications`.
- [ ] **5.2 My Defenses & Collaborative Defense Workspace:**
  - `/panelist/defenses` — Filterable defense assignments (Title, Proposal, Final; Chair vs. Panel Member; Scheduled, In Progress, Concluded) with Manuscript preview dialog and "Open Defense Workspace" CTA.
  - `/panelist/defense-workspace/[scheduleId]` — Full immersive split-screen workspace:
    - Left pane: Interactive PDF Manuscript Viewer with highlight/comment annotations.
    - Right pane tabs: **Rubric Evaluation & Scoring** (interactive criteria sliders/inputs + autosave indicator), **Official RAP Report Editor** (Tiptap rich text / official form preview for Chair), **Deliberation & Verdict** (Pass / Pass with Revisions / Re-defense + Committee E-Signature status).
  - Compatibility routes (`/panelist/scoring/[id]`, `/panelist/defense-lobby/[scheduleId]`, `/panelist/materials`) resolving cleanly.
- [ ] **5.3 My Advisees & E-Signatures:**
  - `/panelist/advisees` & `/panelist/advisees/[studentId]` — Manage incoming GS-020 Adviser Requests (Approve/Decline + E-Sign), review advisee manuscripts for Proposal/Final defense endorsement, and view advisee progress.
  - `/panelist/signatures` — Upload/draw faculty e-signature specimen and sign pending official defense/adviser documents.
- [ ] **5.4 Wire Arrow Guides (`data-guide` attributes) for all Panelist pages.**

---

### WP-6: End-to-End QA, Guide Verification & Vercel Deployment Readiness
**Goal:** Verify that every route builds and functions cleanly for respondents and prepare the repo for 1-click Vercel deployment.

- [ ] **6.1 Production Build & Typecheck Verification:**
  - Run `npm run build` and ensure zero TypeScript or Next.js static/SSR build errors.
- [ ] **6.2 Route & Interactive Walkthrough Audit:**
  - Verify all Student and Panelist routes render with populated data, working Scenario Switchers, working PDF previews, and accurate Arrow Guide targets.
- [ ] **6.3 README & Vercel Deployment Setup:**
  - Write a clear `README.md` with Vercel deployment instructions and respondent evaluation link guide.
