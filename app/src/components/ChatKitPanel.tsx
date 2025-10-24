'use client';

import { useCallback, useState } from 'react';
import { ChatKitOptions } from '@openai/chatkit';
import { ChatKit, useChatKit } from '@openai/chatkit-react';
import {
  CHATKIT_API_URL,
  CHATKIT_API_DOMAIN_KEY,
  PLACEHOLDER_INPUT,
} from '@/lib/config';

type ChatKitPanelProps = {
  onProfilesLoad: (agentIds: string[]) => Promise<{
    success: boolean;
    count?: number;
    error?: string;
  }>;
  onThreadChange?: () => void;
};

export function ChatKitPanel({
  onProfilesLoad,
  onThreadChange,
}: ChatKitPanelProps) {
  const [composerPlaceholder, setComposerPlaceholder] = useState(PLACEHOLDER_INPUT);
  const BUSY_PLACEHOLDER = 'Hang tight, the assistant is responding…';

  const setBusy = useCallback((busy: boolean) => {
    setComposerPlaceholder(busy ? BUSY_PLACEHOLDER : PLACEHOLDER_INPUT);
  }, []);

  const chatKitOptions: ChatKitOptions = {
    api: {
      url: CHATKIT_API_URL,
      domainKey: CHATKIT_API_DOMAIN_KEY,
    },
    theme: {
      colorScheme: 'light',
      radius: 'round',
      density: 'normal',
      color: {
        accent: {
          primary: '#00224D',
          level: 1,
        },
      },
      typography: {
        baseSize: 14,
        fontFamily:
          '"OpenAI Sans", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif',
        fontFamilyMono:
          'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "DejaVu Sans Mono", "Courier New", monospace',
        fontSources: [
          {
            family: 'OpenAI Sans',
            src: 'https://cdn.openai.com/common/fonts/openai-sans/v2/OpenAISans-Regular.woff2',
            weight: 400,
            style: 'normal',
            display: 'swap',
          },
        ],
      },
    },
    composer: {
      placeholder: composerPlaceholder,
      attachments: {
        enabled: false,
      },
    },
    startScreen: {
      greeting: "Let's find your perfect agent",
      prompts: [],
    },
  };

  const chatkit = useChatKit({
    ...chatKitOptions,
    header: {},
    onClientTool: async (invocation) => {
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
      onThreadChange?.(); // Clear profiles on new thread
    },
    onError: ({ error }) => {
      console.error('ChatKit error', error);
      setBusy(false);
    },
  });

  return (
    <div className="relative h-full w-full overflow-hidden">
      <ChatKit control={chatkit.control} className="block h-full w-full" />
    </div>
  );
}
