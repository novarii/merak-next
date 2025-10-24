declare module '@openai/chatkit' {
  interface ClientToolInvocation {
    display_agent_profiles(params: {agent_ids: string[]}): { success: boolean };
  }
}
