'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
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

  const toggleRef = useRef(onSearchAnimationToggle);

  useEffect(() => {
    toggleRef.current = onSearchAnimationToggle;
  }, [onSearchAnimationToggle]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const originalFetch = window.fetch;
    let isMounted = true;
    
    console.log('[ChatKitPanel] Setting up fetch interceptor for ChatKit search animation');
    const emitToggle = (active: boolean) => {
      if (!isMounted) {
        return;
      }
      toggleRef.current?.(active);
    };

    const inspectStream = async (response: Response) => {
      try {
        const contentType = response.headers.get('content-type') ?? '';
        if (!contentType.toLowerCase().includes('text/event-stream')) {
          return;
        }

        const reader = response.body?.getReader();
        if (!reader) {
          return;
        }

        const decoder = new TextDecoder();
        let buffer = '';
        let isAnimating = false;

        const handleEvent = (eventBlock: string) => {
          if (!eventBlock.trim()) {
            return;
          }

          const payloadLine = eventBlock
            .split('\n')
            .find((line) => line.startsWith('data:'));

          if (!payloadLine) {
            return;
          }

          const payloadText = payloadLine.replace(/^data:\s*/, '').trim();

          if (!payloadText) {
            return;
          }

          try {
            const payload = JSON.parse(payloadText) as {
              type?: string;
              text?: string;
              data?: { event?: string } & Record<string, unknown>;
            };

            if (payload.type !== 'progress_update') {
              console.log('[ChatKitPanel] progress_update type:', payload.type, 'payload:', payload);
              return;
            }

            const marker = payload.text ?? payload.data?.event;

            if (marker === 'search_animation:start') {
              console.log('[ChatKitPanel] progress_update marker:', marker);
              isAnimating = true;
              emitToggle(true);
              return;
            }

            if (marker === 'search_animation:stop') {
              console.log('[ChatKitPanel] progress_update marker:', marker);
              isAnimating = false;
              emitToggle(false);
            }
          } catch (error) {
            if (process.env.NODE_ENV !== 'production') {
              console.warn('Failed to parse ChatKit progress event', error);
            }
          }
        };

        const drainBuffer = (flushRemainder = false) => {
          let separator = buffer.indexOf('\n\n');

          while (separator !== -1) {
            const block = buffer.slice(0, separator);
            buffer = buffer.slice(separator + 2);
            handleEvent(block);
            separator = buffer.indexOf('\n\n');
          }

          if (flushRemainder && buffer.trim()) {
            handleEvent(buffer);
            buffer = '';
          }
        };

        try {
          while (true) {
            const { value, done } = await reader.read();

            if (value) {
              buffer += decoder.decode(value, { stream: !done });
              buffer = buffer.replace(/\r\n/g, '\n');
            }

            if (done) {
              buffer += decoder.decode();
              buffer = buffer.replace(/\r\n/g, '\n');
              drainBuffer(true);
              break;
            }

            drainBuffer(false);
          }
        } catch (error) {
          if (process.env.NODE_ENV !== 'production') {
            console.warn('Error while reading ChatKit stream', error);
          }
        } finally {
          if (isAnimating) {
            emitToggle(false);
          }
        }
      } catch (error) {
        if (process.env.NODE_ENV !== 'production') {
          console.warn('Failed to inspect ChatKit response', error);
        }
      }
    };

    const patchedFetch: typeof window.fetch = async (input, init) => {
      const response = await originalFetch.call(window, input as any, init as any);

      try {
        let url: string | undefined;

        if (typeof input === 'string') {
          url = input;
        } else if (input instanceof URL) {
          url = input.href;
        } else if (typeof Request !== 'undefined' && input instanceof Request) {
          url = input.url;
        }

        let method = init?.method;
        if (!method && typeof Request !== 'undefined' && input instanceof Request) {
          method = input.method;
        }

        if (url) {
          let pathname: string | undefined;

          try {
            pathname = new URL(url, window.location.href).pathname;
          } catch {
            pathname = url;
          }

          if (pathname?.endsWith('/chatkit') && (method ?? 'GET').toUpperCase() === 'POST') {
            const clone = response.clone();
            void inspectStream(clone);
          }
        }
      } catch (error) {
        if (process.env.NODE_ENV !== 'production') {
          console.warn('Unable to inspect ChatKit fetch', error);
        }
      }

      return response;
    };

    window.fetch = patchedFetch as typeof window.fetch;

    return () => {
      isMounted = false;
      window.fetch = originalFetch;
      toggleRef.current?.(false);
    };
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
    onLog: (logEvent) => {
      if (!logEvent) {
        return;
      }

      console.log('[ChatKitPanel] log event received', logEvent);

      const { name, data } = logEvent;
      if (name !== 'threads.stream.event') {
        return;
      }

      const event = data?.event ?? data;
      console.log("[ChatKitPanel] threads.stream.event payload:", event);

      const rawPayload =
        (data && typeof data === 'object' && 'event' in data ? (data as Record<string, unknown>).event : null) ??
        data;

      if (!rawPayload || typeof rawPayload !== 'object') {
        console.log('[ChatKitPanel] threads.stream.event (unhandled payload)', rawPayload);
        return;
      }

      const payload = rawPayload as {
        type?: string;
        text?: string;
        data?: { event?: string } & Record<string, unknown>;
      };

      console.log('[ChatKitPanel] threads.stream.event payload', payload);

      if (payload.type !== 'progress_update') {
        return;
      }

      const progressMarker = payload.data?.event ?? payload.text;

      if (progressMarker === 'search_animation:start') {
        onSearchAnimationToggle?.(true);
        return;
      }

      if (progressMarker === 'search_animation:stop') {
        onSearchAnimationToggle?.(false);
      }
    },
    onClientTool: async (invocation) => {
      if (invocation.name === 'display_agent_profiles') {
        const agentIds = invocation.params.agent_ids;
        return await onProfilesLoad(agentIds);
      }
      if (invocation.name === 'search_waiting_for_confirmation') {
        console.log('[ChatKitPanel] search_waiting_for_confirmation invoked');
        onSearchAnimationToggle?.(true);
        return { success: true };
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

  useEffect(() => {
    const chatKitElement = chatkit.ref.current as unknown as {
      client?: {
        onAny?: (
          callback: (eventName: string, eventData: unknown) => void,
        ) => void | (() => void);
        offAny?: (callback: (eventName: string, eventData: unknown) => void) => void;
      };
    } | null;

    if (!chatKitElement?.client || typeof chatKitElement.client.onAny !== 'function') {
      return;
    }

    const handler = (eventName: string, eventData: unknown) => {
      console.log('📡 ChatKit event:', eventName, eventData);
    };

    const unsubscribe = chatKitElement.client.onAny(handler);

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      } else if (typeof chatKitElement.client?.offAny === 'function') {
        chatKitElement.client.offAny(handler);
      }
    };
  }, [chatkit.ref]);

  return (
    <div className="relative h-full w-full overflow-hidden">
      <div className="pointer-events-none absolute left-5 top-5 z-10 rounded-full border border-slate-200/60 bg-white/85 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-slate-600 shadow-sm">
        AI Assistant
      </div>
      <ChatKit control={chatkit.control} className="block h-full w-full" />
    </div>
  );
}
