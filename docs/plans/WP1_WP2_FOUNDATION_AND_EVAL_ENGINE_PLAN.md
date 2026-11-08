# WP-1 & WP-2 Implementation Plan — Foundation, Public Portal, & Evaluation Engine

> **Covers:** `WP-1` (Base Frontend Scaffolding, Mock API Layer & Public Entry) and `WP-2` (Evaluation UI Engine: Arrow Coach-Marks, Scenario Switcher & Sample PDFs).

---

## 1. WP-1 Detailed Frontend Implementation Steps

### Step 1.1: Next.js Project Root Setup
- Place the Next.js application directly at the repository root of `MuelTech/graduate-system-evaluation` so Vercel detects Next.js automatically with zero custom root directory configuration.
- Copy from `/home/antigravity/MuelTech/graduate-system/frontend`:
  - `package.json` (remove unused `next-auth` server dependency or stub `next-auth/react` via `tsconfig.json` path alias `"next-auth/react": ["./src/lib/evaluation-session.tsx"]` so **zero imports in ported pages need to be rewritten for `useSession` / `signOut`!**)
  - `tsconfig.json` (with `@/*` → `./src/*` and `"next-auth/react"` alias)
  - `postcss.config.mjs`, `next.config.ts`, `components.json`
  - `public/` static images/logos from `graduate-system/frontend/public`
  - `src/app/globals.css`, `src/app/layout.tsx`, `src/app/favicon.ico`

> **Key Engineering Trick (`next-auth/react` Path Alias):**
> By mapping `"next-auth/react": ["./src/lib/evaluation-session.tsx"]` in `tsconfig.json`, every existing page from `graduate-system` that imports `import { useSession, signOut } from "next-auth/react"` works out-of-the-box without editing those import lines!

### Step 1.2: Shared UI Components & Providers
- Copy verbatim from `/home/antigravity/MuelTech/graduate-system/frontend/src`:
  - `src/components/ui/*` (all 18 primitives)
  - `src/components/providers/query-provider.tsx`
  - `src/components/layout/notification-bell.tsx`
  - `src/components/chatbot/chatbot-widget.tsx` (update its internal response handler to use deterministic client-side EARIST FAQ responses if backend `/api/chatbot` is absent)
  - `src/components/repository/citation-modal.tsx` & `src/components/repository/repository-browser.tsx`
  - `src/components/shared/adviser-certification-records.tsx` & `src/components/shared/adviser-request-records.tsx`

### Step 1.3: Evaluation Session & Mock API Router
- Create `src/lib/evaluation-session.tsx`:
  - Exports `SessionProvider`, `useSession`, `signIn`, `signOut`, and `useEvaluationContext()`.
  - Automatically infers role from pathname (`/panelist/*` → `panelist` session; `/student/*` → `student` session) while persisting user overrides.
- Create `src/lib/evaluation-mock/`:
  - `dataset.ts`: Rich, realistic EARIST Graduate School mock records (Student profile, 5 Thesis Journey steps with multi-scenario snapshots, 4 Faculty candidates, 4 Panelist defense assignments across Title/Proposal/Final, full Defense Workspace rubric & RAP data, 3 Active Advisees, Memos, Notifications, and 8 Repository publications).
  - `scenario-store.ts`: React hook + external store (`useScenarioStore`) that tracks the currently selected Scenario pill per route (e.g., `title-defense` → `"NOT_SUBMITTED" | "APPLICATION_UNDER_REVIEW" | "SCHEDULED" | "COMPLETED" | "REJECTED"`).
  - `mock-router.ts`: Implements `apiClientRequest(endpoint, options)` matching all endpoints in [`docs/FRONTEND_ARCHITECTURE_AND_MOCK_API_SPEC.md`](../FRONTEND_ARCHITECTURE_AND_MOCK_API_SPEC.md).

### Step 1.4: Public Portal & Respondent Role Entry
- Port from `/home/antigravity/MuelTech/graduate-system/frontend/src`:
  - `src/components/landing/*` (`navbar.tsx`, `hero-section.tsx`, `features-section.tsx`, `how-it-works-section.tsx`, `programs-section.tsx`, `repository-section.tsx`, `announcements-section.tsx`, `portal-section.tsx`, `cta-section.tsx`, `footer.tsx`)
  - `src/app/(public)/layout.tsx`, `page.tsx`, `about/page.tsx`, `programs/page.tsx`, `faq/page.tsx`, `repository/page.tsx`
- Create `src/app/login/page.tsx`:
  - Institutional EARIST Evaluation Entry screen with two prominent interactive cards:
    1. **Evaluate as Graduate Student (`Juan M. Dela Cruz — MAEd-AS`)** → enters `/student/dashboard`
    2. **Evaluate as Faculty / Panelist (`Dr. Maria Clara R. Santos — Panel Chair & Adviser`)** → enters `/panelist/dashboard`

---

## 2. WP-2 Detailed Frontend Implementation Steps

### Step 2.1: Interactive Arrow Coach-Mark Guide (`src/components/evaluation/page-guide-overlay.tsx`)
- **Data Contract (`src/lib/evaluation-mock/guide-definitions.ts`):**
  ```ts
  export interface GuideStep {
    targetSelector: string; // e.g. '[data-guide="scenario-switcher"]'
    title: string;
    description: string;
    placement?: "top" | "bottom" | "left" | "right";
  }
  ```
- **DOM Measurement & Spotlight Rendering:**
  - Uses `getBoundingClientRect()` + `ResizeObserver` / `scroll` listener to track the active step's DOM element (`document.querySelector(step.targetSelector)`).
  - Scrolls the target smoothly into view (`scrollIntoView({ behavior: "smooth", block: "center" })`).
  - Renders an SVG mask overlay covering the viewport with a rounded cutout around the target element + a pulsing gold highlight border (`border-2 border-(--earist-accent)`).
  - Renders a curved SVG directional arrow pointing from the floating Coach-Mark Card directly to the target box.
  - Provides a header trigger button `<PageGuideTrigger />` (`? Page Guide`) in both Student and Panelist headers.

### Step 2.2: Scenario Switcher Bar (`src/components/evaluation/scenario-switcher-bar.tsx`)
- Renders at the top of multi-state pages with `data-guide="scenario-switcher"`.
- Accepts:
  ```ts
  interface ScenarioOption {
    id: string;
    label: string;
    badge?: string;
    description: string;
  }
  ```
- When clicked, updates `useScenarioStore` and triggers `queryClient.invalidateQueries()` so the page immediately re-renders the exact UI for that stage.

### Step 2.3: Role Switcher Pill (`src/components/evaluation/role-switcher-pill.tsx`)
- Compact switcher placed in the portal top header (`data-guide="role-switcher"`):
  - Shows active respondent role (`Viewing as: Student` or `Viewing as: Faculty/Panelist`)
  - 1-click button to switch to the other portal (`Switch to Faculty View` / `Switch to Student View`)

### Step 2.4: Built-in Sample PDF Assets (`public/sample-docs/`)
- Generate clean, valid multi-page PDF files in `public/sample-docs/`:
  1. `sample-manuscript.pdf` (3-page sample EARIST Master's Thesis Manuscript for PDF Viewer & Annotation testing)
  2. `sample-gs020-adviser-request.pdf` (Official GS Form No. 020 Adviser Request Form)
  3. `sample-defense-application.pdf` (Official Defense Application Record)
  4. `sample-rap-report.pdf` (Official Report of Action Taken / RAP Form)
  5. `sample-cor.pdf` (Sample Certificate of Registration)
- Wire Next.js route handlers (`src/app/api/documents/[...path]/route.ts`, `src/app/api/adviser-requests/[requestId]/pdf/route.ts`, `src/app/api/adviser-certifications/[certificationId]/pdf/route.ts`, `src/app/api/student-defense-applications/[scheduleId]/pdf/route.ts`) to redirect or stream the corresponding file from `/sample-docs/*.pdf`.
