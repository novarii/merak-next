# Repository Guidelines

## Docs
- We keep all important docs in .agent folder and keep them updated. This is the structure:

.agent
- Tasks: PRD & implementation plan for each feature
- System: Document the current state of the system (project structure, tech stack, integration points, database schema, and core functionalities such as agent architecture, LLM layer, etc.)
- SOP: Best practices of execute certain tasks (e.g. how to add a schema migration, how to add a new page route, etc.)
- README.md: an index of all the documentations we have so people know what & where to look for things

## Project Structure & Module Organization
This Next.js 15 app uses the App Router. Routes live in `app/` with the shell in `app/layout.tsx` and the landing page in `app/page.tsx`. Shared UI sits in `app/src/components/`, helpers in `app/src/lib/`, and API proxies (notably `app/api/chatkit/route.ts`) forward traffic to the chat backend. Global styles reside in `app/globals.css`, Tailwind setup in `tailwind.config.ts`, and the `@/*` alias is defined in `tsconfig.json` for intra-project imports.

## Build, Test, and Development Commands
- `npm install` — install node modules (run after cloning or when dependencies change).
- `npm run dev` — start the local dev server on http://localhost:3000 with hot reloading.
- `npm run build` — produce an optimized production bundle; run before deployment.
- `npm run start` — serve the production build locally for smoke testing.
- `npm run lint` — execute the ESLint suite backed by `eslint-config-next`.

## Coding Style & Naming Conventions
Write TypeScript first and default to functional React components. Use two-space indentation, single quotes, and PascalCase or camelCase naming to mirror current files. Prefer concise Tailwind utility classes and colocate styling logic with components. Import internals through the `@/*` alias, and run `npm run lint` before pushing.

## Commit & Pull Request Guidelines
Follow the existing history: short, imperative commit subjects (e.g., `Add chat proxy route`) with optional body lines. PRs should clarify intent, list key changes, attach UI screenshots when front-end behavior shifts, and reference related issues. Ensure `npm run lint` and `npm run build` succeed before review, and call out new env vars or migrations.

## Security & Configuration Tips
Provide the ChatKit bridge URL via `BACKEND_URL` on the server, and expose client-safe overrides with `NEXT_PUBLIC_CHATKIT_API_URL` and `NEXT_PUBLIC_CHATKIT_API_DOMAIN_KEY`. Never commit real secrets; document expected values in `.env.local.sample`. When proxying in `app/api/chatkit/route.ts`, forward only the minimum headers needed for upstream authentication.
