'use client';

import { useCallback, useState } from 'react';
import { ChatKit, useChatKit } from '@openai/chatkit-react';
import {
  CHATKIT_API_URL,
  CHATKIT_API_DOMAIN_KEY,
  STARTER_PROMPTS,
  PLACEHOLDER_INPUT,
  GREETING,
} from '@/lib/config';

type ChatKitPanelProps = {
  onProfilesLoad: (agentIds: string[]) => Promise<{
    success: boolean;
    count?: number;
    error?: string;
  }>;
  onThreadChange?: () => void;
  onSearchAnimationToggle?: (active: boolean) => void;
};

export function ChatKitPanel({
  onProfilesLoad,
  onThreadChange,
  onSearchAnimationToggle,
}: ChatKitPanelProps) {
  const [composerPlaceholder, setComposerPlaceholder] = useState(PLACEHOLDER_INPUT);
  const BUSY_PLACEHOLDER = 'Hang tight, the assistant is responding…';

  const setBusy = useCallback((busy: boolean) => {
    setComposerPlaceholder(busy ? BUSY_PLACEHOLDER : PLACEHOLDER_INPUT);
  }, []);

  const chatkit = useChatKit({
    api: { 
      url: CHATKIT_API_URL, 
      domainKey: CHATKIT_API_DOMAIN_KEY 
    },
    theme: 'light', // Always light theme
    header: {},
    startScreen: {
      greeting: GREETING,
      prompts: STARTER_PROMPTS,
    },
    composer: {
      placeholder: composerPlaceholder,
      attachments: {
        enabled: false,
      },
    },
    onClientTool: async (invocation) => {
      if (invocation.name === 'run_search_animation') {
        const active = Boolean(invocation.params?.active);
        onSearchAnimationToggle?.(active);
        return { success: true };
      }

      if(invocation.name === 'display_agent_profiles') {
        const agentIds = invocation.params.agent_ids;
        return await onProfilesLoad(agentIds);
      }
      return { success: false };
    },

    onResponseStart: () => {
      setBusy(true);
    },
    onResponseEnd: () => {
      setBusy(false);
    },
    onThreadChange: () => {
      setBusy(false);
      onSearchAnimationToggle?.(false);
      onThreadChange?.(); // Clear profiles on new thread
    },
    onError: ({ error }) => {
      console.error('ChatKit error', error);
      setBusy(false);
      onSearchAnimationToggle?.(false);
    },
  });

  return (
    <div className="relative h-full w-full overflow-hidden">
      <div className="pointer-events-none absolute left-5 top-5 z-10 rounded-full border border-slate-200/60 bg-white/85 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-slate-600 shadow-sm">
        AI Assistant
      </div>
      <ChatKit control={chatkit.control} className="block h-full w-full" />
    </div>
  );
}
