# WP-7 to WP-11 Implementation Plan — V2 UI/UX Alignment, Applicant Portal & Plain-Language Evaluation Guides

> **Purpose:** Align `MuelTech/graduate-system-evaluation` with the major UI/UX overhaul in `MuelTech/graduate-system` (PRs #49, #50, #51, #52), remove artificial role-switching clutter from the navbar/headers, introduce a professional 3-role Login experience (**Applicant**, **Graduate Student**, **Faculty**), port the full **Applicant Portal** (with an interactive MCQ + Essay Entrance Examination), port the new **Faculty Essay Evaluations** workflow, and overhaul all **Page Guides** to use clear, plain-language naming covering every portal section.

---

## 1. Key UX & Architectural Decisions (Based on Owner Feedback)

### 1.1 Stick to Exact `MuelTech/graduate-system` Header & Public Navbar
- **Public Navbar (`src/components/landing/navbar.tsx`):**
  - Remove the custom `Student View`, `Faculty / Panelist View`, and `Role Selector` buttons that previously replaced the official navbar actions.
  - Use the exact V2 `MuelTech/graduate-system` masthead (`Home`, `News`, `About`, `Programs`, `Research`, `Contact`, plus **`Sign In`** → `/login` and **`Create Account`** → `/register`), accompanied only by a subtle **`Page Guide`** trigger so visitors on the landing page know how to explore the site and click **Sign In**.
- **Portal Top Header (`applicant/layout.tsx`, `student/layout.tsx`, `panelist/layout.tsx`):**
  - Remove `RoleSwitcherPill` (`Viewing as: ... | Switch to ... View | Roles`) from the portal header so respondents focus strictly on their assigned role (**Applicant**, **Student**, or **Faculty**).
  - Match the exact V2 portal header from `MuelTech/graduate-system`:
    - **Left:** Sidebar collapse toggle (`PanelLeft`) + vertical divider + `<PortalBreadcrumbs portal="applicant" | "student" | "faculty" />`
    - **Right:** `<PageGuideTrigger />` + User Name & Portal Role label (`Applicant Portal`, `Student Portal`, `Faculty Portal`) + `<NotificationBell />` + User Avatar.
  - Respondents can switch roles at any time by clicking **Sign Out** in the sidebar, which returns them to `/login`.

### 1.2 Professional Wording & Testing Notice on `/login`
- Replace informal developer phrasing (*"Select Your Evaluation Role"*, *"Instant Respondent Sign-In · Zero Password Friction"*, *"Respondent Role 1/2"*) with polished institutional copy matching `MuelTech/graduate-system`'s `(auth)/login/page.tsx`:
  - **Card Title:** `Sign In to Your Portal`
  - **Subtitle:** `EARIST Graduate School Management System`
  - **System Evaluation & Testing Notice Box:**
    > **System Evaluation & Testing Mode:** This environment is pre-configured with sample academic records for evaluation purposes. Select your participant role below (**Applicant**, **Student**, or **Faculty**) to sign in immediately—no password is required.
  - **3 Role Selector Options (Matching `(auth)/login` layout):**
    1. **Applicant** (`Maria Lourdes G. Villanueva` — Master of Arts in Education Applicant) → `/applicant/dashboard`
    2. **Graduate Student** (`Juan M. Dela Cruz` — MAEd in Administration & Supervision) → `/student/dashboard`
    3. **Faculty Member** (`Dr. Maria Clara R. Santos` — Graduate Faculty, Thesis Adviser & Defense Panel Chair) → `/faculty/dashboard`

### 1.3 Plain-Language Naming Across All Page Guides & Scenario Switchers
- Respondents evaluating the system do not know internal university form numbers or technical acronyms. All Page Guide titles, descriptions, and Scenario Switcher pills must use clear, self-explanatory terminology:

| Legacy / Internal Term | Plain-Language Respondent Term |
| :--- | :--- |
| `GS-020` / `GS-20` / `GS Form No. 020` | **Thesis Adviser Request Form** |
| `RAP` / `RAP Report` | **Rapporteur Report (Defense Evaluation Summary)** |
| `STRIKE` / `STRIKE Clearance` | **Plagiarism & Similarity Check** |
| `DL-9` / `4 Archival Artifacts` | **Final Thesis Archival Documents** |
| `COR` (standalone without label) | **Certificate of Registration (COR)** |
| `Panelist Portal` | **Faculty Portal** |

---

## 2. Work Package Breakdown (`WP-7` to `WP-11`)

### WP-7: V2 Design System Overhaul, Public Portal Redesign & Professional 3-Role Login
**Goal:** Upgrade the global design tokens, shared UI primitives, V2 Public Landing Page, and `/login` + `/register` auth pages to match `MuelTech/graduate-system` (PRs #50, #51, #52).

1. **Global Design Tokens & Typography (`src/app/globals.css`, `src/app/layout.tsx`, `src/app/favicon.ico`):**
   - Port the 60-30-10 warm cream + vibrant red palette (`--background: #FFF8F0`, `--foreground: #333333`, `--primary: #e02b20`, `--secondary: #b71c1c`, `--accent: #f9a825`, `--sidebar: #b71c1c`, `--earist-primary: #e02b20`, `--earist-surface-cream: #FFF8F0`).
   - Configure `Instrument_Sans` in `src/app/layout.tsx`, update page title to `EARIST - Graduate School`, copy the official EARIST seal `favicon.ico`, and mount `<Toaster position="top-center" />`.
2. **Shared UI & Layout Primitives (`src/components/ui/*`, `src/components/layout/*`):**
   - Copy new primitives from `graduate-system/frontend`:
     - `src/components/layout/portal-breadcrumbs.tsx` (`<PortalBreadcrumbs />`)
     - `src/components/ui/filter-bar.tsx` (`<FilterBar />`)
     - `src/components/ui/stat-card.tsx` (`<StatCard />`)
     - `src/components/ui/table-actions.tsx` (`<TableActions />`, `<TableActionButton />`, `<TableActionLink />`)
   - Update existing UI primitives (`table.tsx` with `<TableCard>`, `button.tsx`, `badge.tsx`, `card.tsx`, `page-header.tsx`, `tabs.tsx`, `breadcrumb.tsx`, `sonner.tsx`, `notification-bell.tsx`).
3. **Public Portal V2 Redesign (`src/app/(public)/*`, `src/components/landing/*`, `src/content/public-site-content.ts`):**
   - Copy all new landing assets (`public/images/landing/*`, `public/images/landing/v2/*`, `public/images/landing/news/*`).
   - Port `src/app/(public)/public-site.css` and `src/content/public-site-content.ts`.
   - Port V2 `<Navbar />` (exact `graduate-system` design + compact `<PageGuideTrigger />`), `<HeroSection />` (`100svh` 3-slide carousel), `<NewsSection />` (with multi-photo lightbox), `<AboutSection />`, `<ProgramsSection />`, `<RepositorySection />`, `<ContactSection />`, `<InquiryForm />`, `<Footer />`, and V2 `/about`, `/programs`, `/repository`, `/faq` pages.
4. **Professional 3-Role Login (`/login`) & Applicant Registration (`/register`):**
   - Redesign `src/app/login/page.tsx` to match `graduate-system`'s `(auth)/login` card aesthetic on `#FFF8F0`, presenting the **Applicant**, **Graduate Student**, and **Faculty** role selector, pre-filled demo credentials/persona summary, and a professional **System Evaluation & Testing Mode** notice.
   - Port `src/app/(auth)/register/page.tsx` (2-step Applicant Registration wizard wired to mock program alignment & instant redirect into `/applicant/dashboard`).

---

### WP-8: Full Applicant Portal (`/applicant/*`) & Interactive Entrance Examination Engine
**Goal:** Add the complete Applicant Portal with realistic mock data for all 8 routes, Scenario Switchers for multi-stage screens, and a fully working interactive Entrance Examination (MCQ + Essay + Timer + Auto-Save + Submission).

1. **Applicant Session Persona & Mock Dataset (`src/lib/evaluation-session.ts`, `src/lib/evaluation-mock/`):**
   - Add `"applicant"` to `EvaluationRole` (`"applicant" | "student" | "panelist"`).
   - Add Applicant persona (`Maria Lourdes G. Villanueva`, Applicant ID `APP-2026-0142`, applying for `Master of Arts in Education major in Administration and Supervision`).
   - Add deterministic mock handlers in `src/lib/api.client.ts` for all Applicant & Exam Engine endpoints:
     - `GET /applicant/profile`, `PUT /applicant/profile`
     - `GET /waivers/me`, `GET /api/waivers/me/download` (serves sample Bridging Waiver PDF)
     - `GET /exam/status`, `GET /exam/slots/available`, `POST /exam/schedule`
     - `GET /exam-engine/execution`, `GET /exam-engine/applications/:id/execution`
     - `POST /exam-engine/applications/:id/start`
     - `GET /exam-engine/applications/:id/questions` (returns the full 72 Graduate School Entrance Exam MCQs with reading stimulus passages/media from `MuelTech/graduate-system` + the Graduate Essay question)
     - `GET /exam-engine/applications/:id/drafts`, `PATCH /exam-engine/applications/:id/drafts`
     - `POST /exam-engine/applications/:id/submit`, `GET /exam-engine/applications/:id/finalization`
     - `POST /exam/applications/:id/missed-appeal`
     - `GET /exam/result`
     - `GET /cor/my-upload`, `POST /api/cor/upload`
2. **Applicant Layout (`src/app/(portal)/applicant/layout.tsx`):**
   - Collapsible `#b71c1c` sidebar with all 8 navigation items (`Dashboard`, `Profile`, `Program Alignment`, `Exam Schedule`, `Entrance Exam`, `Exam Results`, `COR Upload`, `Notifications`), `<PortalBreadcrumbs portal="applicant" />`, `<PageGuideTrigger />`, and `<NotificationBell role="APPLICANT" />` (without `RoleSwitcherPill`).
3. **Applicant Portal Pages (`src/app/(portal)/applicant/*`):**
   - `/applicant/dashboard` — Welcome banner, 3-step `Applicant Progress` stepper, and 6-card Bento Grid + `ScenarioSwitcherBar` (*1. New Applicant / Alignment*, *2. Exam Scheduled & Ready*, *3. Exam Passed & COR Upload*).
   - `/applicant/profile` — **Populated with rich mock data** (Personal Information, Contact Details, Undergraduate Degree & GPA, Target Graduate Program, and Application Status summary).
   - `/applicant/alignment` — Program Alignment assessment + `ScenarioSwitcherBar` (*1. Aligned — Cleared for Exam* vs. *2. Non-Aligned — Bridging Waiver Required* with working PDF download).
   - `/applicant/schedule` — Interactive Exam Slot Booking with Table & Calendar views, slot booking confirmation modal, and booked schedule view (`ScenarioSwitcherBar`: *1. Select Exam Slot*, *2. Confirmed Schedule*, *3. Pending Bridging Waiver Lock*).
   - `/applicant/exam` — **Full Interactive Entrance Examination (72 MCQs + Essay)**:
     - `ScenarioSwitcherBar`: *1. Ready to Begin (Exam Instructions)*, *2. Active Exam (72 MCQs & Essay)*, *3. Exam Submitted (Receipt)*, *4. Missed Exam Appeal*.
     - **MCQ Mode**: Stimulus passages/media, all **72 actual entrance exam multiple-choice questions** from `MuelTech/graduate-system`, option selection, Clear Answer, Next/Previous, and right-hand 72-item Question Navigator grid.
     - **Essay Mode**: Graduate Leadership & Research Essay prompt, interactive textarea with live word count badge, auto-save status indicator, and **Submit Examination** confirmation modal that computes MCQ score and transitions to the Finalization Receipt.
   - `/applicant/results` — Detailed `<ResultBreakdown />` (MCQ score, Essay score, total percentage, passing threshold) + Next Steps (`ScenarioSwitcherBar`: *1. Passed*, *2. Awaiting Essay Evaluation*, *3. Passed (Reconsidered)*, *4. Did Not Meet Threshold*).
   - `/applicant/cor-upload` — Drag-and-drop Certificate of Registration (COR) upload + verification states (`ScenarioSwitcherBar`: *1. Upload COR*, *2. Verification Pending*, *3. Verified — Enrolled Student*).
   - `/applicant/notifications` — **Populated with realistic Applicant notifications** (Registration confirmed, Program alignment result, Exam slot confirmation, Exam result released, COR verification update) with interactive Mark Read / Mark All Read buttons.

---

### WP-9: Student Portal V2 Alignment (`<ThesisJourneyShell>`, 2-Step Disclosure & Unified Defense Cards)
**Goal:** Align all Student Portal layouts, components, and Thesis Journey pages with PR #50 in `MuelTech/graduate-system` and remove `RoleSwitcherPill` from the Student header.

1. **Student Layout (`src/app/(portal)/student/layout.tsx`):**
   - Update to `#FFF8F0` shell surface, `#b71c1c` collapsible sidebar, top-left collapse button + `<PortalBreadcrumbs portal="student" />`, and `<PageGuideTrigger />` in the top-right header (removing `RoleSwitcherPill`). Keep all 5 Thesis Journey steps unlocked in the sidebar.
2. **Shared Student Thesis Components (`src/components/student/*`):**
   - Port `<ThesisJourneyShell>` (`thesis-journey-shell.tsx`) with the 5-step horizontal stepper and Approved Thesis Title / Adviser context banner.
   - Port updated `<DefenseStatusPanel>` (`defense-status-panel.tsx`) and `<TitleDefensePostSubmission>` (`title-defense-post-submission.tsx`) with the 3-card layout:
     - Card 1: Smart Status Card with 4-step visual mini-tracker (`Application Submitted` → `GS Verification` → `Defense Schedule / Session` → `Verdict & Report`) and `Current Step Handled By` callout.
     - Card 2: `<DefenseScheduleSummary>` with `<StudentOfficialApplicationRecord>` and `<StudentRapPanel>` (updated to `"Rapporteur Report"` wording).
     - Card 3: `Submitted Defense Documents` with inline `<DocumentViewer>` preview buttons.
3. **Student Thesis Journey Pages (`src/app/(portal)/student/thesis/*`):**
   - Update `title-defense`, `adviser-request`, `proposal-defense`, `strike`, and `final-defense` to wrap content in `<ThesisJourneyShell>`, integrate the 2-step progressive disclosure on `proposal-defense` and `final-defense`, and use plain-language labels on `ScenarioSwitcherBar`.
   - Ensure `GET /thesis/defense/current?stage=TITLE|PROPOSAL|FINAL` resolves stage documents cleanly in `src/lib/evaluation-mock/`.
4. **Student Core Pages (`dashboard`, `profile`, `curriculum`, `journey`, `repository`, `announcements`, `notifications`):**
   - Align headers, cards, badges, and tables with the V2 `#FFF8F0` / `#e02b20` design tokens and Sonner toast feedback.

---

### WP-10: Faculty Portal V2 Alignment (`/faculty/*` Canonical Routes & Entrance Exam Essay Evaluations)
**Goal:** Align the Faculty Portal with PRs #49 and #50 in `MuelTech/graduate-system`, adopt `/faculty/*` canonical URLs and `"Faculty Portal"` branding, and add the new **Essay Evaluations** workflow.

1. **`/faculty/*` Route Rewrite & Layout (`next.config.ts`, `src/app/(portal)/panelist/layout.tsx`):**
   - Add `/faculty/:path*` → `/panelist/:path*` rewrite in `next.config.ts`.
   - Update `panelist/layout.tsx` to `"Faculty Portal"` branding, `#b71c1c` collapsible sidebar, `<PortalBreadcrumbs portal="faculty" />`, `<NotificationBell role="FACULTY" />`, and `<PageGuideTrigger />` (removing `RoleSwitcherPill`).
   - Update sidebar navigation links to `/faculty/dashboard`, `/faculty/defenses`, `/faculty/advisees`, `/faculty/essay-evaluations`, `/faculty/signatures`, `/faculty/announcements`, `/faculty/profile`.
2. **New Faculty Essay Evaluations Workflow (`panelist/essay-evaluations/page.tsx` & `panelist/essay-evaluations/[id]/page.tsx`):**
   - Port `src/components/admin/exam/essay-evaluation-panel.tsx`, `panelist/essay-evaluations/page.tsx`, and `panelist/essay-evaluations/[id]/page.tsx`.
   - Add mock handlers for `GET /exam/applications`, `GET /exam/applications/:id`, and `POST /exam/scores/:id/grade`.
   - Allow Faculty respondents to filter applicant entrance exam submissions (`Pending Evaluation` vs. `Evaluated`), open an applicant's written essay (`Maria Lourdes G. Villanueva` and other sample applicants), score the essay (`0–40` points), submit the grade with toast confirmation, and immediately see the computed `<ResultBreakdown />`.
3. **Updated Faculty Dashboard, Profile, Advisees, Signatures & Defense Workspace:**
   - Update `/faculty/dashboard` (`panelist/dashboard/page.tsx`) to include the **Pending Essay Evaluations** KPI card and `/faculty/*` links.
   - Update `/faculty/profile` (`panelist/profile/page.tsx`) to the 2-column layout with **Classification & Academic Access** badges (`Internal Faculty`, `Thesis / Dissertation Adviser Eligibility`, `Entrance Exam Essay Evaluation: Enabled`).
   - Update `/faculty/signatures`, `/faculty/advisees`, `/faculty/defenses`, and `/faculty/defense-workspace/[scheduleId]` with `"Rapporteur Report"` wording, V2 design tokens, and Sonner mutation toasts.

---

### WP-11: Comprehensive Page Guide Audit, Plain-Language Naming & End-to-End QA
**Goal:** Ensure every page across Public, Applicant, Student, and Faculty portals has complete, accurate `[data-guide]` attributes covering all visible sections and uses clear, plain-language explanations without confusing form codes.

1. **Complete `data-guide` Coverage Audit:**
   - Verify that every step in `src/lib/evaluation-mock/guide-definitions.ts` matches an existing, rendered DOM element on:
     - **Public Portal:** `/` (Hero Carousel, News & Announcements, About Graduate School, Graduate Programs Directory, Research Repository, Contact & Sign In), `/programs`, `/about`, `/repository`, `/faq`, `/login`, `/register`.
     - **Applicant Portal:** `/applicant/dashboard` (Welcome, 3-Step Progress Tracker, 6 Application Status Cards), `/applicant/profile`, `/applicant/alignment`, `/applicant/schedule`, `/applicant/exam` (Instructions/Scenario Switcher, Question & Stimulus Area, Question Navigator & Essay Toggle, Timer & Submit), `/applicant/results`, `/applicant/cor-upload`, `/applicant/notifications`.
     - **Student Portal:** `/student/dashboard` (Welcome, Immediate Next Step, 5-Step Milestones, Scheduled Defense, Quick Links), `/student/profile`, `/student/curriculum`, `/student/journey`, `/student/thesis` + all 5 Thesis Journey pages (including the new `<ThesisJourneyShell>` stepper, 2-step disclosure cards, and 3-card `<DefenseStatusPanel>`), `/student/repository`, `/student/repository/submit`, `/student/announcements`, `/student/notifications`.
     - **Faculty Portal (`/faculty/*` & `/panelist/*`):** `/faculty/dashboard` (KPI Cards including Essay Evaluations, Needs Your Attention, Active/Upcoming Defenses, Waiting on Others), `/faculty/defenses`, `/faculty/defense-workspace/[scheduleId]` (Role/Mode Switcher, Manuscript PDF Annotation Pane, Evaluation Rubric Tab, Rapporteur Report & Verdict Tab), `/faculty/advisees` & `/faculty/advisees/[studentId]`, `/faculty/essay-evaluations` & `/faculty/essay-evaluations/[id]`, `/faculty/signatures`, `/faculty/repository`, `/faculty/announcements`, `/faculty/profile`, `/faculty/notifications`.
2. **Plain-Language Terminology Enforcement:**
   - Audit all strings in `guide-definitions.ts` and `ScenarioSwitcherBar` definitions to replace `"GS-020"` / `"GS-20"`, `"RAP"`, `"STRIKE"`, and `"DL-9"` with clear descriptive names.
3. **Production Build & Route Verification:**
   - Run `npm run build` and verify zero TypeScript, lint, or static generation errors across all routes.
