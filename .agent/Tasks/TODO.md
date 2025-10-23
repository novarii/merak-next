- Low – app/src/types/chatkit-tools.d.ts:1-4 attempts to augment @openai/chatkit with ClientToolInvocation, but that
interface is not exported in the package (node_modules/@openai/chatkit/types/index.d.ts only types onClientTool). The
augmentation is a no-op, so TypeScript does not validate the display_agent_profiles payload.
