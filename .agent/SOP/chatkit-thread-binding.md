# SOP: ChatKit Thread Binding

## Purpose
Ensure every ChatKit session is scoped to the authenticated Supabase user, so Redis threads remain isolated per account during the prototype phase.

## Overview
- `app/src/components/ChatKitPanel.tsx` injects the Supabase access token into each ChatKit request via a custom `fetch` handler and tracks the active user ID.
- Thread IDs persist in `localStorage` under `chatkit:thread:user:{user_id}`. We restore the saved ID on login and push updates whenever ChatKit emits `onThreadChange`.
- The Next.js proxy at `app/api/chatkit/route.ts` forwards the `Authorization` header upstream so FastAPI can validate the Supabase JWT.

## Steps
1. **Attach Supabase tokens**
   - `ChatKitPanel` calls `getSupabaseBrowserClient()` and wraps ChatKit API calls with an authenticated fetch, adding `Authorization: Bearer <access_token>` for each request.
   - On 401 responses the panel surfaces a re-auth banner; fresh sessions clear the error automatically.
2. **Restore the thread**
   - After Supabase resolves the session, the panel reads the stored thread ID for that user (if it exists) and calls `chatkit.setThreadId` before rendering.
   - Missing storage gracefully falls back to a new thread and warns the user if persistence failed.
3. **Persist changes**
   - When ChatKit emits `onThreadChange`, the panel updates local storage and clears cached agent profiles via `onThreadChange?.()`.
4. **API proxy expectations**
   - `/api/chatkit` must continue to forward the `Authorization` header so the backend can look up `auth.uid()` and bind Redis keys to `chat:user:{user_id}:thread:{thread_id}:*`.

## Testing
1. Sign in as User A, send a message, refresh the page — the prior thread should reload instead of starting fresh.
2. Sign out, sign in as User B, and confirm a clean thread with no cross-user history.
3. Manually clear `localStorage` for User B (`localStorage.removeItem('chatkit:thread:user:{user_id}')`) and reload — the banner should note the missing thread and a new one is created on send.
4. In DevTools, let the Supabase session expire and fire a request — the overlay should prompt reauth after a 401 from `/chatkit`.

## Related Files
- `app/src/components/ChatKitPanel.tsx`
- `app/api/chatkit/route.ts`
- `.agent/Tasks/task-chatkit-frontend-thread-binding.md`
