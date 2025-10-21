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

export function ChatKitPanel() {
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
    onResponseStart: () => {
      setBusy(true);
    },
    onResponseEnd: () => {
      setBusy(false);
    },
    onThreadChange: () => {
      setBusy(false);
    },
    onError: ({ error }) => {
      console.error('ChatKit error', error);
      setBusy(false);
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