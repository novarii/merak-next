# Supabase Auth Integration

## Status
- Owner: Unassigned
- State: Proposed
- Priority: High

## Problem
We need to ship Merak's authentication via Supabase with both email (magic link + password) and Google OAuth flows. Supabase recently rotated project API keys, so our environment config must be updated before wiring the UI. No in-app authentication entry points exist yet beyond the `/login` placeholder, and server-side session handling is missing.

## Goals
- Enable email-based sign-in (magic links) and traditional email/password in the web app.
- Enable Google OAuth login, handling Supabase redirects and session exchanges.
- Update environment management so the latest Supabase anon + service-role keys are loaded securely.
- Persist authenticated session state across the app (client + server components).

## Deliverables
- `.env.example` updated with the current Supabase URL, anon key, and instructions for service-role usage without committing secrets.
- `app/(auth)/login` UI implementing Supabase Auth (Supabase Auth UI or custom form) with email + Google options.
- Server-side Supabase client helper (`app/src/lib/supabaseServer.ts`) refreshed to use rotated keys and handle cookie-based sessions via `@supabase/ssr`.
- Callback route (e.g., `app/auth/callback/route.ts`) that exchanges Google OAuth codes with `supabase.auth.exchangeCodeForSession`.
- Middleware or layout logic ensuring authenticated routes redirect appropriately when signed out.
- Documentation in `.agent/System` outlining setup, key management, and flows.
- Verification notes showing email and Google login succeed against the Supabase project.

## Approach
1. **Confirm Credentials**
   - Retrieve the latest anon + service-role keys from Supabase Dashboard (logs were rotated; need authoritative source).
   - Store them in 1Password / Vault and update `.env.local`. Do not commit secrets.

2. **Supabase Client Setup**
   - Install `@supabase/ssr` if not already present for Next.js App Router helpers.
   - Refactor `getServiceSupabaseClient` to leverage env vars through a singleton pattern.
   - Add `createClient` utilities for client/server contexts following [Supabase Next.js guide](https://supabase.com/docs/guides/auth/server-side/nextjs).

3. **Auth UI & Flows**
   - Build a login page that offers:
     - Email magic link sign-in (`supabase.auth.signInWithOtp`).
     - Email/password sign-in (`signInWithPassword`) with error handling.
     - Google OAuth button via `signInWithOAuth({ provider: 'google', options: { redirectTo } })`.
   - Configure Google provider in Supabase Dashboard with OAuth credentials and redirect URL.

4. **Callback Handling**
   - Implement an auth callback route (e.g., `app/auth/callback/route.ts`) to handle Supabase PKCE, inspired by the official guide.
   - Redirect users back to requested path or dashboard on success; surface friendly errors otherwise.

5. **Session Management**
   - Use Supabase SSR helpers or middleware to inject `supabase.auth.getSession()` into server components.
   - Guard protected routes (e.g., `/chat`, `/agents`) and provide sign-out handling.

6. **Testing & QA**
   - Manual QA for email magic link (ensure it respects redirect) and Google login in both local & deployed environments.
   - Verify service-role operations (e.g., current `/api/agents`) still succeed with rotated keys.
