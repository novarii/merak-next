declare module "@openai/chatkit" {
  interface ClientToolInvocation<TArgs = Record<string, unknown>> {
    display_agent_profiles(params: {agent_ids: string[]}): {success: boolean};
    wait_for_search_confirmation(): {success: boolean};
  }
}
