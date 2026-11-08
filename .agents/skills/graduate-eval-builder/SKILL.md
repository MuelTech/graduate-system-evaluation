---
name: graduate-eval-builder
description: Workflow and rules for building the EARIST Graduate System UI/UX Evaluation prototype (MuelTech/graduate-system-evaluation) by porting Student and Panelist frontend pages from MuelTech/graduate-system with hardcoded mock state, Scenario Switcher bars, and Arrow Coach-Mark guides for Vercel Free Tier deployment.
---

# Graduate System Evaluation Builder (`graduate-eval-builder`)

Use this skill whenever working on `MuelTech/graduate-system-evaluation`.

## 1. Session Startup Checklist

1. Read `/home/antigravity/MuelTech/graduate-system-evaluation/GEMINI.md` and `/home/antigravity/MuelTech/graduate-system-evaluation/CONTEXT.md`.
2. Read `/home/antigravity/MuelTech/graduate-system-evaluation/docs/IMPLEMENTATION_CHECKLIST.md` to identify the active Work Package (`WP-1` through `WP-6`).
3. Ensure `/home/antigravity/MuelTech/graduate-system` is cloned locally for UI/UX reference. If missing, run:
   ```bash
   git clone --depth=1 https://github.com/MuelTech/graduate-system.git /home/antigravity/MuelTech/graduate-system
   ```

## 2. Page Porting Protocol

When porting a route from `/home/antigravity/MuelTech/graduate-system/frontend/src/app/...`:

1. **Preserve Exact Visuals & Components:**
   - Keep the exact EARIST styling (`--earist-primary`, `--earist-accent`, `--earist-surface-gray`), typography, icons, and `shadcn/ui` structure.
   - Only include **Public**, **Student (`/student/*`)**, and **Panelist (`/panelist/*`)** routes. Do not include Admin or Applicant portals.
2. **Eliminate Backend & Auth Blockers:**
   - Route all `apiClientRequest` / `useQuery` / `useMutation` calls through the deterministic in-memory mock layer (`src/lib/evaluation-mock/`).
   - Never lock Student sidebar navigation: all 5 **Thesis Journey** steps (`Title Defense`, `Adviser Request`, `Proposal Defense`, `STRIKE / Plagiarism`, `Final Defense`) must always be clickable.
3. **Add Multi-State Scenario Switcher (`ScenarioSwitcherBar`):**
   - On any page whose UI changes depending on workflow state (e.g., Title Defense, Adviser Request, Proposal Defense, STRIKE, Final Defense, Defense Workspace), render `<ScenarioSwitcherBar />` at the top so respondents can toggle between states (e.g. *Submit Form*, *Under Review*, *Scheduled*, *Completed*, *Returned*) in a single click.
4. **Add Interactive Arrow Guide (`PageGuideOverlay` & `data-guide`):**
   - Add `data-guide="<step-id>"` attributes to the primary sections of the page matching `docs/EVALUATION_GUIDE_AND_SCENARIOS_SPEC.md`.
   - Register the page's guide steps so the header's **Page Guide** button (and first-visit coach mark) renders directional arrows and explanations for respondents.

## 3. Context Window Hygiene

- Execute **one Work Package (`WP-*`) at a time**.
- For large multi-page Work Packages (`WP-3`, `WP-4`, `WP-5`), delegate page-porting batches to a `self` subagent (`Workspace: "inherit"`) to keep the main conversation context clean.
- After completing a Work Package, update `docs/IMPLEMENTATION_CHECKLIST.md` and run a build/typecheck verification before reporting completion.
