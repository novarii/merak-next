# Task: Search Tool Loading Animation

## Background
Demonstrations of the Merak agent currently jump from “search triggered” to results with no visible intermediate state. Testers need a clear, branded loading experience—aligned with the Lovable reference—that signals the agent is progressing through several backend steps while the `search_agents` tool runs.

## Goal
Introduce a reusable loading animation that displays the Merak logo and cycles through a sequence of status phrases while the search tool is active. The animation must start when a search begins, loop smoothly until completion, and exit gracefully when results are available.

## UX Requirements
- Layout: centered column with static Merak logo followed by the animated status text.
- Text carousel: single-line status phrases cycling every ~3–4 seconds.
- Transition: vertical slide + fade preferred; fallback to cross-fade if motion performance is poor.
- Loop indefinitely while search is running; fade out within ~300 ms after completion.
- Accessible: ensure readable contrast, `aria-live="polite"` for status text, and reduced-motion fallback (respect `prefers-reduced-motion`).

## Implementation Plan
1. **Trigger calibration (demo scope)**
   - FastAPI emits a `run_search_animation` client tool call with `{ active: true }` when `search_agents` starts, and `{ active: false }` immediately before `display_agent_profiles`.
   - Frontend listens for that invocation in `onClientTool`, toggling a simple `isSearchAnimating` state and falling through to `display_agent_profiles` for results.

2. **Build `SearchProgressCarousel` component**
   - Props: `phrases: string[]`, `isActive: boolean`, optional `cycleMs` (default 3500).
   - Internally manage the active phrase index with `useState` + `useEffect`, resetting when `isActive` toggles from false→true.
   - Render logo (SVG or `Image`) and animated text container.

3. **Implement animation**
   - Preferred approach: stack two text nodes; animate with CSS keyframes (`transform: translateY` + `opacity`) using `transition` classes when index changes.
   - Provide reduced-motion variant that uses opacity only.
   - Ensure animation timers pause when component unmounts to avoid memory leaks.

4. **Integrate into search flow**
   - Show the carousel inside the results panel placeholder while `isSearchAnimating` is true; hide results content until completion.
   - On completion, add a short fade-out (CSS transition) before unmounting to avoid abrupt flicker.

## Technical Notes
- Store phrases in a constants module so product can localize/update copy without touching logic.
- Consider CSS variables for durations/opacity to tweak in design QA.
- Ensure the component is tree-shakeable and independent of backend code so it can be reused in other loading contexts.

## Acceptance Criteria
- Loader appears immediately when the agent issues a `client_tool_call` for `search_agents` and remains visible until the tool completes.
- Status text cycles smoothly with the defined animation, meeting reduced-motion accessibility.
- Results view is blocked by the loader during searches and fades in once loading finishes.
- Component passes lint/tests and is documented (Storybook or README snippet).

## Follow-ups
- Capture telemetry on average search duration to fine-tune cycle timing and copy.
- Explore a secondary animation (e.g., progress dots) if users need stronger feedback.
