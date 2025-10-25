# Project Architecture

## Project Goal
Deliver a Supabase-authenticated marketing assistant where users converse with OpenAI’s ChatKit through a controlled Next.js 15 frontend. The app keeps Redis conversations isolated per user while surfacing curated agent recommendations from Supabase.

## High-Level Flow
1. Visitors land on the marketing page (`app/page.tsx`), which renders global chrome and session-aware navigation.
2. Authenticated users open the chat route (`app/chat/page.tsx`). If they are not signed in, Supabase redirects them to `/login`.
3. `ChatKitPanel` (`app/src/components/ChatKitPanel.tsx`) initializes the ChatKit SDK, injects the user’s Supabase access token, restores the saved `threadId`, and mounts the chat UI.
4. ChatKit posts actions to `/chatkit`, handled by the App Router route `app/api/chatkit/route.ts`.
5. The proxy forwards supported ChatKit actions to `${BACKEND_URL}/chatkit`, includes the `Authorization` header, and streams upstream responses back to the browser.
6. Client tool invocations (e.g., `display_agent_profiles`) call `/api/agents`, which fetches rich agent details from Supabase using a service-role key.
7. Thread updates trigger `onThreadChange`, which persists the new thread identifier locally and refreshes the recommended agent feed.

## Module Overview
- **App shell**
  - `app/layout.tsx`: App Router wrapper loading fonts, the ChatKit runtime script, and global Tailwind layers.
  - `app/globals.css`: Tailwind reset plus baseline body and typography styles.

- **Marketing & navigation**
  - `app/page.tsx`: Marketing landing page that reuses `SiteHeader` to toggle the CTA between “Log In” and “Profile”.
  - `app/src/components/SiteHeader.tsx`: Header/CTA component that renders navigation links and uses `deriveAccountNavigation` for session-aware labels.
  - `app/src/lib/accountNavigation.ts`: Helper that maps Supabase sessions to header destinations.

- **Authentication**
  - `app/login/page.tsx`: Email magic-link and OAuth sign-in form backed by the Supabase browser client.
  - `app/auth/callback/route.ts`: Finalizes OAuth logins and redirects users back into the app.
  - `app/profile/page.tsx`: Minimal authenticated surface exposing a `SignOutButton`.
  - `app/profile/SignOutButton.tsx`: Client component that signs out via `supabase.auth.signOut()` and returns the user to `/login`.
  - `app/src/lib/supabaseBrowserClient.ts`: Singleton Supabase browser client created with `NEXT_PUBLIC_SUPABASE_*` vars.
  - `app/src/lib/supabaseServerAuthClient.ts`: Cookie-aware Supabase client for server components and route handlers.

- **Chat experience**
  - `app/chat/page.tsx`: Primary chat surface combining the sticky `ChatKitPanel` and the recommended agent feed driven by `useAgentProfiles`.
  - `app/src/components/ChatKitPanel.tsx`: ChatKit integration that:
    - Restores/persists `threadId` per Supabase user via `localStorage` (`chatkit:thread:user:{user_id}`).
    - Injects the Supabase `Authorization` header into every ChatKit request.
    - Manages busy-state placeholders and displays overlays for re-authentication or load failures.
    - Clears agent profiles when the active thread changes.
  - `app/src/hooks/useAgentProfiles.tsx`: Fetches agent IDs emitted by ChatKit and hydrates profile cards.
  - `app/src/components/AgentProfileCard.tsx`: Presentational card for agent metadata.

- **APIs & data access**
  - `app/api/chatkit/route.ts`: Validates ChatKit payloads, forwards them upstream, and preserves the bearer token for backend verification.
  - `app/api/agents/route.ts`: Fetches agent details from Supabase using the service-role client (`app/src/lib/supabaseServer.ts`).
  - `app/src/lib/supabaseServer.ts`: Memoized Supabase service-role client for server-only data access.

## Authentication & Thread Binding
- Supabase Auth manages sessions across login, chat, and profile routes. Server routes call `createSupabaseServerClient` to protect authenticated paths.
- `ChatKitPanel` requests the current session in the browser, wrapping ChatKit’s fetch transport to add `Authorization: Bearer <access_token>` to every request.
- 401 responses from the backend trigger a blocking overlay prompting users to sign in again.
- Thread IDs are stored per user in `localStorage`. On mount the panel restores the saved `threadId`, invokes `chatkit.setThreadId`, and keeps Redis namespaces aligned (`chat:user:{user_id}:thread:{thread_id}:*`).

## Data & Persistence
- **Supabase (Postgres)**: Stores agent metadata surfaced by the recommended agent sidebar.
- **Redis (backend)**: Holds ChatKit conversation state, namespaced by Supabase `user_id` and `thread_id`. The frontend does not talk to Redis directly but ensures consistent identifiers so the backend can scope data correctly.

## Environment & Configuration
- `NEXT_PUBLIC_SITE_URL` (client): Base site URL used for Supabase auth callbacks; set to the deployed domain (e.g., `https://app.merak.ai`).
- `BACKEND_URL` (server): Base URL for the FastAPI (or compatible) ChatKit backend proxy.
- `NEXT_PUBLIC_CHATKIT_API_URL`, `NEXT_PUBLIC_CHATKIT_API_DOMAIN_KEY` (client): Optional overrides for ChatKit SDK configuration, defaulting to `/chatkit` and `domain_pk_localhost_dev`.
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` (client): Required for browser auth.
- `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` (server): Allow server routes to query Supabase.
- `SUPABASE_JWT_SECRET` (backend): Used by the upstream FastAPI service to validate access tokens when JWKS fetch is unavailable (e.g., local development).
- All `NEXT_PUBLIC_*` environment variables are inlined at build time; avoid accessing `process.env` directly in the browser console.

## Build, Test, and Tooling
- `npm run dev`: Start the Next.js dev server on `http://localhost:3000`.
- `npm run lint`: Run ESLint (Next.js configuration).
- `npm run build` / `npm run start`: Produce and serve a production bundle.
- Tailwind CSS powers styling; class names live alongside components.

## Future Considerations
- Emit durable thread metadata to Supabase instead of `localStorage` once production persistence is required.
- Add automated tests for the ChatKit proxy, token injection, and agent profile fetch path.
- Expand the profile page with richer account settings and billing management.
- Introduce middleware to auto-refresh Supabase sessions for long-lived chat tabs.

## Related Docs
- `.agent/README.md`
- `.agent/SOP/chatkit-thread-binding.md`
- `.agent/SOP/chatkit-runtime-setup.md`
