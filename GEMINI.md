# Gemini / Antigravity Agent Instructions (`graduate-system-evaluation`)

> **Read this file and [`CONTEXT.md`](./CONTEXT.md) first at the start of every session or subagent invocation.**

## 1. Golden Rules for Context & Execution

1. **Never execute the entire project in a single monolithic turn.**
   - Work strictly **one Work Package (`WP-*`) at a time** as defined in [`docs/IMPLEMENTATION_CHECKLIST.md`](./docs/IMPLEMENTATION_CHECKLIST.md).
   - After completing a Work Package, update the checkboxes in [`docs/IMPLEMENTATION_CHECKLIST.md`](./docs/IMPLEMENTATION_CHECKLIST.md), verify that the project builds/renders cleanly, and report back to the user before starting the next Work Package.
2. **Use Subagents (`self` / `research`) to prevent Context Rot.**
   - When porting multiple pages from `MuelTech/graduate-system/frontend`, delegate bounded page-porting or research tasks to a `self` or `research` subagent (`Workspace: "inherit"`).
   - Each subagent starts with a **fresh context window** while sharing the same VM workspace and installed `node_modules`.
3. **100% Frontend-Only & Vercel Free-Tier Ready.**
   - Do **not** introduce any runtime backend server, database (Prisma/MySQL), NextAuth server session requirement, or live Socket.io dependency.
   - All data, form submissions, file previews, PDF annotations, rubric scores, e-signatures, and RAP reports must work completely in the browser using deterministic mock data + local state (`localStorage` / React state) + static PDF assets in `public/sample-docs/`.
4. **Exact UI/UX Fidelity with `MuelTech/graduate-system`.**
   - Preserve the exact V2 EARIST design tokens (`--background: #FFF8F0`, `--primary: #e02b20`, `--sidebar: #b71c1c`, `--accent: #f9a825`, `Instrument_Sans` typography, `PortalBreadcrumbs`, shadcn/ui components, layout geometry, and institutional copy) from `MuelTech/graduate-system/frontend`.
   - Keep the Public Navbar and Portal Headers clean and true to `MuelTech/graduate-system` (do not place role-switching toolbars in the top header; respondents select **Applicant**, **Student**, or **Faculty** on `/login`).
   - If `/home/antigravity/MuelTech/graduate-system` is not yet cloned in the current VM session, clone it once for reference:
     ```bash
     git clone --depth=1 https://github.com/MuelTech/graduate-system.git /home/antigravity/MuelTech/graduate-system
     ```

## 2. Canonical Document Index

| Document | Purpose |
| :--- | :--- |
| [`CONTEXT.md`](./CONTEXT.md) | System architecture, scope boundaries (Public + Applicant + Student + Faculty), and mock strategy |
| [`docs/IMPLEMENTATION_CHECKLIST.md`](./docs/IMPLEMENTATION_CHECKLIST.md) | Live progress tracker and bounded Work Packages (`WP-0` to `WP-11`) |
| [`docs/FRONTEND_ARCHITECTURE_AND_MOCK_API_SPEC.md`](./docs/FRONTEND_ARCHITECTURE_AND_MOCK_API_SPEC.md) | Complete source-to-target file map and Mock API endpoint contracts (`api.client.ts`) |
| [`docs/EVALUATION_GUIDE_AND_SCENARIOS_SPEC.md`](./docs/EVALUATION_GUIDE_AND_SCENARIOS_SPEC.md) | Specification for the **Scenario Switcher Bar**, **Plain-Language Arrow Coach-Mark Guides**, and route-by-route behavior |
| [`docs/plans/WP7_WP11_V2_UI_ALIGNMENT_AND_APPLICANT_PORTAL_PLAN.md`](./docs/plans/WP7_WP11_V2_UI_ALIGNMENT_AND_APPLICANT_PORTAL_PLAN.md) | **Active Plan:** V2 UI/UX Overhaul, Public Portal Redesign, 3-Role Login, Full Applicant Portal & Exam Engine, Faculty Essay Evaluations, and Plain-Language Guides |
| [`docs/plans/WP1_WP2_FOUNDATION_AND_EVAL_ENGINE_PLAN.md`](./docs/plans/WP1_WP2_FOUNDATION_AND_EVAL_ENGINE_PLAN.md) | Historical V1 blueprint for Next.js scaffolding, Mock Session/API, Public pages, and Arrow Guide engine |
| [`docs/plans/WP3_WP4_STUDENT_PORTAL_IMPLEMENTATION_PLAN.md`](./docs/plans/WP3_WP4_STUDENT_PORTAL_IMPLEMENTATION_PLAN.md) | Historical V1 blueprint for Student Portal & all 5 unlocked Thesis Journey pages |
| [`docs/plans/WP5_PANELIST_PORTAL_AND_WORKSPACE_PLAN.md`](./docs/plans/WP5_PANELIST_PORTAL_AND_WORKSPACE_PLAN.md) | Historical V1 blueprint for Faculty/Panelist Portal, Defense Workspace, and Adviser workflows |
| [`.agents/skills/graduate-eval-builder/SKILL.md`](./.agents/skills/graduate-eval-builder/SKILL.md) | Reusable skill workflow for porting pages and wiring evaluation guides |
