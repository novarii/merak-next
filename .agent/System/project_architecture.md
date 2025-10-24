# Project Architecture

## Project Goal
Deliver a lightweight marketing assistant UI that embeds OpenAI’s ChatKit experience inside a Next.js 15 app. The app lets users converse with the upstream assistant while providing a scaffold for future listing-management features.

## High-Level Flow
1. A user loads `app/page.tsx`, which renders the gradient layout together with the `ChatKitPanel` component.
2. `ChatKitPanel` (in `app/src/components/ChatKitPanel.tsx`) initializes `useChatKit`, wiring placeholder messaging and response hooks to control the composer state.
3. ChatKit SDK calls are routed to the local API proxy at `app/api/chatkit/route.ts`.
4. The proxy forwards supported events (`threads.create`, `threads.add_user_message`) to the upstream service specified by `BACKEND_URL`, streaming responses back to the ChatKit UI.

## Module Layout
- `app/layout.tsx`: App Router shell with metadata, global fonts, and body styling.
- `app/page.tsx`: Landing surface showing the ChatKit panel and the agent profiles sidebar hydrated via client tools.
- `app/src/components/ChatKitPanel.tsx`: Configures the ChatKit widget, busy-state handling, and disables attachments.
- `app/src/lib/config.ts`: Centralizes environment-driven constants such as `CHATKIT_API_URL`, domain key, greeting text, starter prompts, and composer placeholder.
- `app/src/lib/supabaseServer.ts`: Memoizes a Supabase service-role client for server-side data fetching.
- `app/src/lib/supabaseBrowserClient.ts`: Provides a singleton browser Supabase client using the anon key.
- `app/src/lib/supabaseServerAuthClient.ts`: Creates an SSR-aware Supabase client tied to Next.js cookies for session checks.
- `app/api/chatkit/route.ts`: Serverless proxy that validates ChatKit actions before relaying them upstream.
- `app/api/agents/route.ts`: Looks up detailed agent profiles in Supabase when the client tool requests them.
- `app/login/page.tsx`: Minimal authentication screen supporting email magic links and Google sign-in via Supabase, with sign-in/sign-up toggle.
- `app/profile/page.tsx`: Placeholder authenticated surface that confirms the signed-in user.
- `app/page.tsx`: Landing surface that now checks Supabase session state to swap the header CTA between “Log In” and “Profile”.
- `app/auth/callback/route.ts`: Exchanges Supabase OAuth codes for a session and redirects back to the app.
- `app/globals.css`: Tailwind layer directives plus base body styles.

## Tech Stack & Tooling
- Framework: Next.js 15 (App Router) with React 19 and TypeScript strict mode.
- Styling: Tailwind CSS 4 with utility-first classes and a custom `Inter` font stack.
- UI SDK: `@openai/chatkit-react` for the assistant interface.
- Linting: ESLint via `npm run lint` (Next.js shared configuration).
- Build / Runtime Scripts: `next dev`, `next build`, `next start` exposed through npm scripts.

## Runtime & Integration Details
- Chat API Proxy: `app/api/chatkit/route.ts` accepts POST requests, enforces supported action types, and forwards bodies to `${BACKEND_URL}/chatkit`.
- Agent Profiles API: `app/api/agents/route.ts` validates requested agent IDs, queries Supabase via `getServiceSupabaseClient`, and returns profile details to the ChatKit client tool.
- Streaming: Responses are streamed back via `new Response(resp.body, ...)` to preserve real-time updates expected by ChatKit.
- Error Handling: Unsupported actions return HTTP 400; UI errors log to the console through `onError` to surface failures during development.
- Import Resolution: `tsconfig.json` defines `@/*` pointing at `app/src/*`; rely on this alias instead of long relative paths.

## Environment & Configuration
- Required server variable: `BACKEND_URL` (defaults to `http://127.0.0.1:8000`), pointing to the upstream ChatKit-compatible backend.
- Optional public overrides: `NEXT_PUBLIC_CHATKIT_API_URL` and `NEXT_PUBLIC_CHATKIT_API_DOMAIN_KEY` (client-side safe), falling back to `/chatkit` and `domain_pk_localhost_dev`.
- Supabase public variables: `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` bootstrap browser auth flows and server-side session checks.
- Supabase server variables: `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` must be provided for the agent profile lookup route and server-side auth helpers.
- Local fonts are loaded via Google Fonts in `app/layout.tsx`; ensure network access when running locally.

## Data & Persistence
- Supabase is queried server-side for agent profile enrichment. The service-role key stays on the server; profile data is streamed to the UI through the `/api/agents` route.

## Deployment Notes
- Production builds should execute `npm run build` followed by `npm run start`.
- Ensure the platform supports Next.js Edge/Node runtime with streaming fetch responses.
- Provide environment variables securely (e.g., Vercel project settings). Never commit `.env` files; keep sample configuration in `.env.local.sample` if one is added.

## Future Considerations
- Populate the listings column with actual data or CMS integrations.
- Introduce automated tests (React Testing Library for UI, integration tests for the proxy route) to guard regressions.
- Expand SOP documentation for recurring tasks like adding API routes or configuring new prompts.

## Related Docs
- `.agent/README.md`
