- High – app/page.tsx:12 renders ChatKitPanel without the required onProfilesLoad (and optional onThreadChange) props.
Per the ChatKit React client-tools guide (openai/chatkit-js › guides › client-tools), the onClientTool handler must
return a JSON payload from your handler; with no prop wired up the call will hit undefined, throw, and ChatKit will
treat the display_agent_profiles tool as failed.
- High – app/src/hooks/useAgentProfiles.tsx:27 posts to /api/agents, but there is no app/api/agents/route.ts. Every
tool invocation will therefore 404, causing the hook to surface an error and preventing profile hydration, which is a
core acceptance criterion in .agent/Tasks/task-stream-agent-profiles-display.md.
- Medium – app/page.tsx:16 still shows a static placeholder and never consumes useAgentProfiles; consequently the UI
never renders the streamed Supabase data and clearProfiles is never invoked on thread changes, so the “profile column
rendering” goal remains unmet.
- Low – app/src/types/chatkit-tools.d.ts:1-4 attempts to augment @openai/chatkit with ClientToolInvocation, but that
interface is not exported in the package (node_modules/@openai/chatkit/types/index.d.ts only types onClientTool). The
augmentation is a no-op, so TypeScript does not validate the display_agent_profiles payload.