# Implementation Checklist — EARIST Graduate System (Evaluation Edition)

> **Rule for Agents:** Work on **only one Work Package (`WP-*`) at a time**. Update checkboxes (`[ ]` → `[x]`) and the **Current Status Summary** table below after finishing each Work Package.

---

## Current Status Summary

| Work Package | Title | Status | Notes |
| :--- | :--- | :--- | :--- |
| **WP-0** | Documentation, Specs, & Agent Skill Setup | **COMPLETED** | `GEMINI.md`, `CONTEXT.md`, Checklist, Spec, and `graduate-eval-builder` skill created |
| **WP-1** | Base Frontend Scaffolding, Mock API Layer & Public Entry | **COMPLETED** | Next.js App Router at repo root, EARIST theme, UI primitives, Public pages, Role Selector, Mock Session & API router |
| **WP-2** | Evaluation UI Engine (Arrow Coach-Marks, Scenario Switcher & Sample PDFs) | **COMPLETED** | `PageGuideOverlay`, `ScenarioSwitcherBar`, `RoleSwitcherPill`, and `public/sample-docs/*.pdf` + PDF API routes |
| **WP-3** | Student Portal — Layout & Core Pages + Guides | **COMPLETED** | Unlocked Sidebar, Dashboard, Profile, Curriculum, Academic Journey, Repository, Announcements, Notifications |
| **WP-4** | Student Portal — Unlocked Thesis Journey Steps + Multi-State Scenarios | **COMPLETED** | Title Defense, Adviser Request, Proposal Defense, STRIKE / Plagiarism, Final Defense (all states unlocked) |
| **WP-5** | Faculty / Panelist Portal — All Pages & Collaborative Defense Workspace | **COMPLETED** | Dashboard, Profile, My Defenses, Defense Workspace (PDF Annotation, Scoring, RAP), My Advisees, E-Signatures, Repository, Announcements, Notifications |
| **WP-6** | End-to-End QA, Guide Verification & Vercel Deployment Readiness | **COMPLETED** | Full `next build` check, link/route audit, `pdf.worker.min.mjs` static bundle, and `README.md` instructions |
| **WP-7** | V2 Design System Overhaul, Public Portal Redesign & Professional 3-Role Login | **COMPLETED** | V2 60-30-10 tokens (`#FFF8F0` / `#e02b20`), `Instrument_Sans`, shared V2 primitives, V2 Public Landing Page, 3-Role `/login`, and `/register` wizard |
| **WP-8** | Full Applicant Portal (`/applicant/*`) & Interactive Entrance Examination Engine | **COMPLETED** | Applicant Portal 8 routes + 72-MCQ & Essay Entrance Exam |
| **WP-9** | Student Portal V2 Alignment (`<ThesisJourneyShell>`, 2-Step Disclosure & Unified Defense Cards) | **COMPLETED** | V2 `#FFF8F0` / `#b71c1c` collapsible shell, `<ThesisJourneyShell>`, 2-step disclosure, unified 3-card `DefenseStatusPanel`, and plain-language labels |
| **WP-10** | Faculty Portal V2 Alignment (`/faculty/*` Canonical Routes & Entrance Exam Essay Evaluations) | **COMPLETED** | `/faculty/*` canonical routes, V2 collapsible Faculty shell, Entrance Exam Essay Evaluations (`/faculty/essay-evaluations` & `[id]`), and V2 Faculty pages |
| **WP-11** | Comprehensive Page Guide Audit, Plain-Language Naming & End-to-End V2 QA | **COMPLETED** | Complete `data-guide` coverage for Public/Applicant/Student/Faculty, plain-language naming (no `GS-020`/`RAP` jargon), and `npm run build` verification |

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

- [x] **1.1 Project Structure & Config:**
  - Copy base Next.js config (`package.json`, `tsconfig.json`, `postcss.config.mjs`, `next.config.ts`, `src/app/globals.css`, `src/app/layout.tsx`, `public/` assets) from `MuelTech/graduate-system/frontend`.
  - Remove Admin/Applicant-only dependencies or server-only auth barriers so Vercel builds cleanly without environment variables.
- [x] **1.2 Shared UI & Layout Components:**
  - Port `src/components/ui/*`, `src/components/providers.tsx`, `src/components/chatbot/chatbot-widget.tsx`, and `src/components/layout/notification-bell.tsx`.
- [x] **1.3 Mock Session & Deterministic Mock API Engine:**
  - Replace `next-auth/react` calls with a client-safe Evaluation Session layer supporting instant switching between **Student** (`Juan Dela Cruz — MAEd Administration & Supervision`) and **Faculty / Panelist** (`Dr. Maria Clara Santos — Graduate Faculty / Panel Chair`).
  - Implement deterministic mock handler in `src/lib/api.client.ts` and `src/lib/api.server.ts` backed by `src/lib/evaluation-mock/` so all React Query hooks resolve without a backend server.
- [x] **1.4 Public Portal & Respondent Login / Role Selector:**
  - Port `(public)/layout.tsx`, `(public)/page.tsx`, `(public)/about/page.tsx`, `(public)/programs/page.tsx`, `(public)/faq/page.tsx`, `(public)/repository/page.tsx`.
  - Create respondent-friendly `/login` (and prominent hero CTA buttons) with 1-click **"Evaluate as Student"** and **"Evaluate as Faculty / Panelist"** cards.

---

### WP-2: Evaluation UI Engine (Arrow Coach-Marks, Scenario Switcher & Sample PDFs)
**Goal:** Build the reusable evaluation overlays and sample documents so respondents understand every page and can preview every workflow state.

- [x] **2.1 Interactive Arrow Guide (`src/components/evaluation/page-guide-overlay.tsx`):**
  - Spotlight highlight on target DOM elements (`data-guide="..."`).
  - Animated SVG directional arrow pointing directly to the highlighted feature.
  - Step card showing: Step counter (`Step 1 of N`), clear title, explanation of what the section does in the system, and `Previous` / `Next` / `Done` buttons.
  - Header button (`[? Page Guide]`) to re-open the guide on any page at any time.
- [x] **2.2 Scenario Switcher Bar (`src/components/evaluation/scenario-switcher-bar.tsx`):**
  - Compact, clearly labeled evaluation bar at the top of multi-state pages allowing respondents to switch between workflow stages (e.g., *1. Submit Form*, *2. Under Review*, *3. Scheduled Defense*, *4. Completed & Official Records*, *5. Returned for Revision*).
- [x] **2.3 Floating/Header Role Switcher (`src/components/evaluation/role-switcher-pill.tsx`):**
  - Allows respondents to jump between the **Student Portal** and **Faculty / Panelist Portal** (or return to the Evaluation Home) in one click.
- [x] **2.4 Built-in Sample PDF Documents (`public/sample-docs/`):**
  - Generate valid, multi-page institutional sample PDFs (`sample-manuscript.pdf`, `sample-gs020-adviser-request.pdf`, `sample-defense-application.pdf`, `sample-rap-report.pdf`, `sample-cor.pdf`, `sample-strike-certificate.pdf`) and wire `/api/documents/...` & PDF routes to serve them cleanly on Vercel.

---

### WP-3: Student Portal — Layout & Core Pages + Guides
**Goal:** Port the Student Portal chrome with all sidebar items unlocked and implement all general Student pages with hardcoded EARIST data and page guides.

- [x] **3.1 Student Layout (`src/app/(portal)/student/layout.tsx`):**
  - Unlock all 5 **Thesis Journey** steps in the sidebar (`isNavigable = true` for all steps) while displaying realistic status badges.
  - Integrate `RoleSwitcherPill` and `[? Page Guide]` trigger in the Student header.
- [x] **3.2 Student Core Pages:**
  - `/student/dashboard` — Progress summary, active thesis milestone, upcoming defense schedule, recent notifications.
  - `/student/profile` — Student academic profile, degree program, student ID, contact info.
  - `/student/curriculum` — Degree curriculum checklist, completed/enrolled units, GPA summary.
  - `/student/journey` — Visual end-to-end Academic & Thesis Journey timeline with clickable steps.
  - `/student/repository` & `/student/repository/submit` — Graduate Thesis Repository browser, document viewer, and archival submission form.
  - `/student/announcements` — Official Graduate School memos and announcements.
  - `/student/notifications` — Interactive notification list with read/unread toggles.
- [x] **3.3 Wire Arrow Guides (`data-guide` attributes) for all WP-3 pages.**

---

### WP-4: Student Portal — Unlocked Thesis Journey Steps + Multi-State Scenarios
**Goal:** Port all 5 previously restricted Thesis Journey pages with full interactive forms AND the `ScenarioSwitcherBar` so respondents can inspect every workflow state.

- [x] **4.1 Title Defense (`/student/thesis/title-defense`):**
  - Scenarios: `NOT_SUBMITTED` (3-title proposal package upload form), `APPLICATION_UNDER_REVIEW`, `SCHEDULED` (committee & schedule details), `COMPLETED` (approved title + post-submission record + RAP summary), `REJECTED` (correction & resubmission view).
- [x] **4.2 Adviser Request (`/student/thesis/adviser-request`):**
  - Scenarios: `READY` (browse faculty directory & submit GS-020 request with E-Signature), `PENDING` (GS-020 tracking across Adviser / Chair / Dean), `APPROVED` (signed official GS-020 PDF preview), `DECLINED_RETRY`.
- [x] **4.3 Proposal Defense (`/student/thesis/proposal-defense`):**
  - Scenarios: `ADVISER_REVIEW` (pre-defense manuscript submission & adviser endorsement panel), `READY_TO_APPLY` (official defense application form), `SCHEDULED` (defense schedule & committee), `COMPLETED` (Proposal Defense RAP report & verdict), `REVISION_REQUIRED`.
- [x] **4.4 STRIKE / Plagiarism (`/student/thesis/strike`):**
  - Scenarios: `SUBMIT_MANUSCRIPT` (upload manuscript for similarity check), `WAITING` (verification in progress), `COMPLETED` (9% similarity index report & STRIKE clearance certificate preview).
- [x] **4.5 Final Defense (`/student/thesis/final-defense`):**
  - Scenarios: `FINAL_ADVISER_REVIEW` (final manuscript endorsement), `READY_TO_APPLY`, `SCHEDULED`, `COMPLETED` (Final Defense RAP report, final committee signatures, & proceed to Repository archival).
- [x] **4.6 Wire Arrow Guides (`data-guide` attributes) for all 5 Thesis Journey pages.**

---

### WP-5: Faculty / Panelist Portal — All Pages & Collaborative Defense Workspace
**Goal:** Port all Panelist (Faculty) pages and the full Collaborative Defense Workspace with zero backend/socket dependencies.

- [x] **5.1 Panelist Layout & Core Pages:**
  - `src/app/(portal)/panelist/layout.tsx` with `RoleSwitcherPill` and `[? Page Guide]` trigger.
  - `/panelist/dashboard` — Faculty workload summary, today's/upcoming defense sessions, pending adviser reviews, and signature requests.
  - `/panelist/profile` — Faculty profile, specialization tags, advisee capacity, and academic rank.
  - `/panelist/repository`, `/panelist/announcements`, `/panelist/notifications`.
- [x] **5.2 My Defenses & Collaborative Defense Workspace:**
  - `/panelist/defenses` — Filterable defense assignments (Title, Proposal, Final; Chair vs. Panel Member; Scheduled, In Progress, Concluded) with Manuscript preview dialog and "Open Defense Workspace" CTA.
  - `/panelist/defense-workspace/[scheduleId]` — Full immersive split-screen workspace:
    - Left pane: Interactive PDF Manuscript Viewer with highlight/comment annotations.
    - Right pane tabs: **Rubric Evaluation & Scoring** (interactive criteria sliders/inputs + autosave indicator), **Official RAP Report Editor** (Tiptap rich text / official form preview for Chair), **Deliberation & Verdict** (Pass / Pass with Revisions / Re-defense + Committee E-Signature status).
  - Compatibility routes (`/panelist/scoring/[id]`, `/panelist/defense-lobby/[scheduleId]`, `/panelist/materials`) resolving cleanly.
- [x] **5.3 My Advisees & E-Signatures:**
  - `/panelist/advisees` & `/panelist/advisees/[studentId]` — Manage incoming GS-020 Adviser Requests (Approve/Decline + E-Sign), review advisee manuscripts for Proposal/Final defense endorsement, and view advisee progress.
  - `/panelist/signatures` — Upload/draw faculty e-signature specimen and sign pending official defense/adviser documents.
- [x] **5.4 Wire Arrow Guides (`data-guide` attributes) for all Panelist pages.**

---

### WP-6: End-to-End QA, Guide Verification & Vercel Deployment Readiness
**Goal:** Verify that every route builds and functions cleanly for respondents and prepare the repo for 1-click Vercel deployment.

- [x] **6.1 Production Build & Typecheck Verification:**
  - Run `npm run build` and ensure zero TypeScript or Next.js static/SSR build errors.
- [x] **6.2 Route & Interactive Walkthrough Audit:**
  - Verify all Student and Panelist routes render with populated data, working Scenario Switchers, working PDF previews, and accurate Arrow Guide targets.
- [x] **6.3 README & Vercel Deployment Setup:**
  - Write a clear `README.md` with Vercel deployment instructions and respondent evaluation link guide.

---

### WP-7: V2 Design System Overhaul, Public Portal Redesign & Professional 3-Role Login
**Goal:** Align global design tokens, shared UI primitives, the V2 Public Landing Page, and the `/login` + `/register` pages with `MuelTech/graduate-system` (PRs #50, #51, #52).
> See [`docs/plans/WP7_WP11_V2_UI_ALIGNMENT_AND_APPLICANT_PORTAL_PLAN.md`](./plans/WP7_WP11_V2_UI_ALIGNMENT_AND_APPLICANT_PORTAL_PLAN.md) for full details.

- [x] **7.1 Global 60-30-10 Design Tokens & Typography:**
  - Update `src/app/globals.css`, `src/app/layout.tsx` (`Instrument_Sans`, `<Toaster position="top-center" />`, `EARIST - Graduate School` title), and `src/app/favicon.ico`.
- [x] **7.2 Shared V2 UI & Layout Primitives:**
  - Port `portal-breadcrumbs.tsx`, `filter-bar.tsx`, `stat-card.tsx`, `table-actions.tsx`, and updated `table.tsx` (`<TableCard>`), `button.tsx`, `badge.tsx`, `card.tsx`, `page-header.tsx`, `tabs.tsx`, `breadcrumb.tsx`, `sonner.tsx`, and `notification-bell.tsx`.
- [x] **7.3 Public Portal V2 Redesign (Exact `graduate-system` Design):**
  - Copy `public/images/landing/**`, `src/app/(public)/public-site.css`, and `src/content/public-site-content.ts`.
  - Port V2 `<Navbar />` (removing role-switcher buttons and keeping official `Sign In` / `Create Account` + subtle `Page Guide` button), `<HeroSection />` (`100svh` 3-slide carousel), `<NewsSection />` (with photo lightbox), `<AboutSection />`, `<ProgramsSection />`, `<RepositorySection />`, `<ContactSection />`, `<Footer />`, and V2 `/about`, `/programs`, `/repository`, `/faq`.
- [x] **7.4 Professional 3-Role Login (`/login`) & Registration (`/register`):**
  - Redesign `/login` with the V2 `#FFF8F0` card layout, professional **System Evaluation & Testing Mode** notice, and 3 participant roles (**Applicant**, **Graduate Student**, **Faculty**).
  - Port `/register` 2-step Applicant Registration wizard wired to mock program alignment and `/applicant/dashboard`.

---

### WP-8: Full Applicant Portal (`/applicant/*`) & Interactive Entrance Examination Engine
**Goal:** Implement the complete Applicant Portal with realistic mock data for all 8 routes, Scenario Switchers, and a fully functional Entrance Examination (MCQ + Essay).

- [x] **8.1 Applicant Persona & Exam Engine Mock API:**
  - Add `"applicant"` role (`Maria Lourdes G. Villanueva`) to `src/lib/evaluation-session.ts` and `src/lib/evaluation-mock/`.
  - Implement mock API handlers for `/applicant/profile`, `/waivers/me`, `/exam/status`, `/exam/slots/available`, `/exam/schedule`, `/exam-engine/**` (execution, start, questions, drafts, submit, finalization), `/exam/result`, and `/cor/**`.
- [x] **8.2 Applicant Layout & Core Pages:**
  - Create `src/app/(portal)/applicant/layout.tsx` (`#b71c1c` collapsible sidebar, `<PortalBreadcrumbs portal="applicant" />`, `<PageGuideTrigger />`, no `RoleSwitcherPill`).
  - Implement `/applicant/dashboard`, `/applicant/profile` (populated with full mock profile data), `/applicant/alignment`, `/applicant/schedule`, `/applicant/results`, `/applicant/cor-upload`, and `/applicant/notifications` (populated with mock notifications).
- [x] **8.3 Interactive Entrance Examination (`/applicant/exam`):**
  - Implement full state machine (`READY`, `ACTIVE`, `TERMINAL`, `BLOCKED` appeal gate) + `ScenarioSwitcherBar`.
  - Support answering all **72 Entrance Exam MCQ items** (ported from `MuelTech/graduate-system` with stimulus passages/figures) + the Graduate Essay question with live word count, Question Navigator grid, draft auto-save, and interactive exam submission.

---

### WP-9: Student Portal V2 Alignment (`<ThesisJourneyShell>`, 2-Step Disclosure & Unified Defense Cards)
**Goal:** Upgrade the Student Portal to the V2 `#FFF8F0` / `#b71c1c` shell, remove `RoleSwitcherPill` from the top header, and port `<ThesisJourneyShell>`, 2-step defense disclosure, and unified 3-card `DefenseStatusPanel`.

- [x] **9.1 Student Layout & Header Cleanup:**
  - Update `src/app/(portal)/student/layout.tsx` to V2 collapsible sidebar + `<PortalBreadcrumbs portal="student" />`, remove `RoleSwitcherPill`, and keep all 5 Thesis Journey steps unlocked.
- [x] **9.2 Shared V2 Student Thesis Components:**
  - Port `thesis-journey-shell.tsx`, `defense-status-panel.tsx`, `title-defense-post-submission.tsx`, `student-rap-panel.tsx` (`"Rapporteur Report"` wording), and `student-thesis-journey.ts`.
- [x] **9.3 Student Thesis Journey & Core Pages Update:**
  - Update `title-defense`, `adviser-request`, `proposal-defense` (2-step progressive disclosure), `strike`, and `final-defense` (2-step progressive disclosure) to use `<ThesisJourneyShell>` and plain-language scenario labels.

---

### WP-10: Faculty Portal V2 Alignment (`/faculty/*` Canonical Routes & Entrance Exam Essay Evaluations)
**Goal:** Align the Faculty Portal with PRs #49 & #50, add `/faculty/*` canonical route rewrites, remove `RoleSwitcherPill`, and implement the Entrance Exam Essay Evaluations workflow.

- [x] **10.1 `/faculty/*` Rewrites & Faculty Layout:**
  - Add `/faculty/:path*` → `/panelist/:path*` rewrite in `next.config.ts`.
  - Update `src/app/(portal)/panelist/layout.tsx` to `"Faculty Portal"` branding, `<PortalBreadcrumbs portal="faculty" />`, `/faculty/*` navigation links, and remove `RoleSwitcherPill`.
- [x] **10.2 Entrance Exam Essay Evaluations (`/faculty/essay-evaluations` & `[id]`):**
  - Port `essay-evaluation-panel.tsx`, `panelist/essay-evaluations/page.tsx`, and `panelist/essay-evaluations/[id]/page.tsx` with interactive essay scoring (`POST /exam/scores/:id/grade`) and `<ResultBreakdown />`.
- [x] **10.3 Faculty Dashboard, Profile, Advisees, Signatures & Workspace V2 Alignment:**
  - Update `/faculty/dashboard` (with `Pending Essay Evaluations` KPI), `/faculty/profile` (with `Classification & Academic Access` badges), `/faculty/signatures` (`"Rapporteur Report"` copy), `/faculty/advisees`, `/faculty/defenses`, and `/faculty/defense-workspace/[scheduleId]`.

---

### WP-11: Comprehensive Page Guide Audit, Plain-Language Naming & End-to-End V2 QA
**Goal:** Audit every page across Public, Applicant, Student, and Faculty portals so all visible sections are covered by `PageGuideOverlay` with plain-language descriptions, and verify a clean production build.

- [x] **11.1 Plain-Language Guide & Scenario Naming Overhaul:**
  - Replace all jargon (`GS-020`/`GS-20`, `RAP`, `STRIKE`, `DL-9`) in `guide-definitions.ts` and `ScenarioSwitcherBar` options with clear, self-explanatory respondent labels.
- [x] **11.2 Complete Section Coverage Audit (`data-guide`):**
  - Verify every visible section across Public, Applicant, Student, and Faculty pages has a working `data-guide` target and accurate guide step.
  - Added mobile `PageGuideTrigger` to public landing navbar (`min-[900px]:hidden`) and inside the mobile navigation drawer.
  - Implemented responsive mobile drawer auto-sync (`earist-guide-sidebar-toggle` event) so portal sidebars slide open automatically during guide steps targeting navigation menus, with safe viewport spotlight clamping and centered card geometry on mobile.
- [x] **11.3 Production Build & Verification:**
  - Run `npm run build` and verify zero TypeScript or Next.js build errors (47/47 static pages generated cleanly).

