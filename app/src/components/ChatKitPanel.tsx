'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ChatKit, useChatKit } from '@openai/chatkit-react';
import type { UseChatKitOptions } from '@openai/chatkit-react';
import type { Session, SupabaseClient } from '@supabase/supabase-js';
import {
  CHATKIT_API_URL,
  CHATKIT_API_DOMAIN_KEY,
  PLACEHOLDER_INPUT,
} from '@/lib/config';
import { getSupabaseBrowserClient } from '@/lib/supabaseBrowserClient';

const THREAD_STORAGE_PREFIX = 'chatkit:thread:user:';

type ThreadStorageResult = {
  value: string | null;
  errored: boolean;
};

const getThreadStorageKey = (userId: string) => `${THREAD_STORAGE_PREFIX}${userId}`;

const readStoredThreadId = (userId: string): ThreadStorageResult => {
  if (typeof window === 'undefined') {
    return { value: null, errored: false };
  }

  try {
    return { value: localStorage.getItem(getThreadStorageKey(userId)), errored: false };
  } catch (error) {
    console.warn('Unable to read stored ChatKit thread ID', error);
    return { value: null, errored: true };
  }
};

const persistThreadId = (userId: string, threadId: string | null): boolean => {
  if (typeof window === 'undefined') {
    return false;
  }

  try {
    const key = getThreadStorageKey(userId);
    if (threadId) {
      localStorage.setItem(key, threadId);
    } else {
      localStorage.removeItem(key);
    }
    return true;
  } catch (error) {
    console.warn('Unable to persist ChatKit thread ID', error);
    return false;
  }
};

type ChatKitPanelProps = {
  onProfilesLoad: (agentIds: string[]) => Promise<{
    success: boolean;
    count?: number;
    error?: string;
  }>;
  onThreadChange?: () => void;
  initialPrompt?: string | null;
  onInitialPromptConsumed?: () => void;
};

type ClientToolInvocation = Parameters<
  NonNullable<UseChatKitOptions['onClientTool']>
>[0];

type ThreadChangeEvent = Parameters<
  NonNullable<UseChatKitOptions['onThreadChange']>
>[0];

type ErrorEvent = Parameters<NonNullable<UseChatKitOptions['onError']>>[0];

export function ChatKitPanel({
  onProfilesLoad,
  onThreadChange,
  initialPrompt = null,
  onInitialPromptConsumed,
}: ChatKitPanelProps) {
  const [composerPlaceholder, setComposerPlaceholder] = useState(PLACEHOLDER_INPUT);
  const [supabaseClient, setSupabaseClient] = useState<SupabaseClient | null>(null);
  const [supabaseInitError, setSupabaseInitError] = useState<string | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [sessionResolved, setSessionResolved] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [threadId, setThreadId] = useState<string | null>(null);
  const [threadReady, setThreadReady] = useState(false);
  const [threadError, setThreadError] = useState<string | null>(null);
  const threadAppliedRef = useRef<string | null | undefined>(undefined);
  const userIdRef = useRef<string | null>(null);
  const [pendingPrompt, setPendingPrompt] = useState<string | null>(null);

  const BUSY_PLACEHOLDER = 'Hang tight, the assistant is responding…';

  const setBusy = useCallback((busy: boolean) => {
    setComposerPlaceholder(busy ? BUSY_PLACEHOLDER : PLACEHOLDER_INPUT);
  }, []);

  useEffect(() => {
    try {
      const client = getSupabaseBrowserClient();
      setSupabaseClient(client);
      setSupabaseInitError(null);
    } catch (error) {
      console.error('Unable to initialize Supabase client for ChatKit auth binding', error);
      setSupabaseInitError('Supabase is not configured. Check your environment variables.');
    }
  }, []);

  useEffect(() => {
    if (!supabaseClient) {
      return;
    }

    let isMounted = true;

    supabaseClient.auth
      .getSession()
      .then(({ data }) => {
        if (!isMounted) return;
        setSession(data.session ?? null);
        setSessionResolved(true);
        if (data.session?.access_token) {
          setAuthError(null);
        }
      })
      .catch((error) => {
        console.warn('Unable to hydrate Supabase session for ChatKit binding', error);
        if (!isMounted) return;
        setSessionResolved(true);
        setAuthError('Unable to read your session. Please refresh.');
      });

    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange((_event, nextSession) => {
      if (!isMounted) return;
      setSession(nextSession);
      setSessionResolved(true);
      if (nextSession?.access_token) {
        setAuthError(null);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [supabaseClient]);

  const userId = session?.user?.id ?? null;

  useEffect(() => {
    userIdRef.current = userId;
  }, [userId]);

  useEffect(() => {
    if (!sessionResolved) {
      return;
    }

    if (!userId) {
      setThreadReady(false);
      setThreadId(null);
      return;
    }

    const { value, errored } = readStoredThreadId(userId);
    setThreadId(value);
    setThreadReady(true);
    setThreadError(errored ? 'We could not restore your chat history. Start a new conversation to continue.' : null);
  }, [sessionResolved, userId]);

  const authenticatedFetch = useCallback< typeof fetch >(
    async (input, init) => {
      const headers = new Headers(init?.headers ?? {});

      if (!supabaseClient) {
        const response = await fetch(input, { ...init, headers });
        if (response.status === 401) {
          setAuthError('Your session expired. Please sign in again.');
        }
        return response;
      }

      try {
        const { data } = await supabaseClient.auth.getSession();
        const accessToken = data.session?.access_token ?? null;

        if (accessToken) {
          headers.set('Authorization', `Bearer ${accessToken}`);
        } else {
          headers.delete('Authorization');
        }

        const response = await fetch(input, { ...init, headers });

        if (response.status === 401) {
          setAuthError('Your session expired. Please sign in again.');
        } else {
          setAuthError(null);
        }

        return response;
      } catch (error) {
        console.error('Unable to attach Supabase session to ChatKit request', error);
        const response = await fetch(input, { ...init, headers });
        if (response.status === 401) {
          setAuthError('Your session expired. Please sign in again.');
        }
        return response;
      }
    },
    [supabaseClient],
  );

  const chatKitOptions: UseChatKitOptions = useMemo(
    () => ({
      api: {
        url: CHATKIT_API_URL,
        domainKey: CHATKIT_API_DOMAIN_KEY,
        fetch: authenticatedFetch,
      },
      initialThread: threadReady ? threadId ?? null : null,
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
          baseSize: 16,
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
    }),
    [authenticatedFetch, composerPlaceholder, threadId, threadReady],
  );

  const chatkit = useChatKit({
    ...chatKitOptions,
    header: {},
    onClientTool: async (invocation: ClientToolInvocation) => {
      if (invocation.name === 'display_agent_profiles') {
        const agentIdsParam = (invocation.params as Record<string, unknown>).agent_ids;
        const agentIds = Array.isArray(agentIdsParam)
          ? agentIdsParam.filter((value): value is string => typeof value === 'string')
          : [];
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
    onThreadChange: ({ threadId: nextThreadId }: ThreadChangeEvent) => {
      setBusy(false);
      setThreadError(null);

      const resolvedThreadId = nextThreadId ?? null;
      threadAppliedRef.current = resolvedThreadId;
      setThreadId(resolvedThreadId);

      const activeUserId = userIdRef.current;
      if (activeUserId) {
        const persisted = persistThreadId(activeUserId, resolvedThreadId);
        if (!persisted) {
          setThreadError('We could not save your conversation locally. New messages may reset the thread.');
        }
      }

      onThreadChange?.();
    },
    onError: ({ error }: ErrorEvent) => {
      console.error('ChatKit error', error);
      setBusy(false);
      setThreadError('The chat encountered an error. Please try again.');
    },
  });

  const canRenderChatKit =
    !!supabaseClient && !!userId && threadReady && !supabaseInitError && sessionResolved;

  useEffect(() => {
    if (!initialPrompt) {
      return;
    }
    setPendingPrompt(initialPrompt);
  }, [initialPrompt]);

  useEffect(() => {
    if (!pendingPrompt) {
      return;
    }

    if (!canRenderChatKit || !chatkit.ref.current) {
      return;
    }

    const text = pendingPrompt.trim();
    setPendingPrompt(null);
    onInitialPromptConsumed?.();

    if (!text) {
      return;
    }

    let isActive = true;

    const sendPrompt = async () => {
      try {
        await chatkit.setComposerValue({ text });
        await chatkit.sendUserMessage({ text, newThread: true });
      } catch (error) {
        console.error('Unable to send initial prompt from landing page', error);
        if (!isActive) {
          return;
        }

        try {
          await chatkit.setComposerValue({ text });
        } catch (composerError) {
          console.error('Unable to set composer value after initial prompt failure', composerError);
        }
      }
    };

    void sendPrompt();

    return () => {
      isActive = false;
    };
  }, [pendingPrompt, canRenderChatKit, chatkit, onInitialPromptConsumed]);

  useEffect(() => {
    if (!canRenderChatKit) {
      return;
    }

    const targetThread = threadId ?? null;

    if (threadAppliedRef.current === targetThread) {
      return;
    }

    threadAppliedRef.current = targetThread;

    void (async () => {
      try {
        await chatkit.setThreadId(targetThread);
        setThreadError(null);
      } catch (error) {
        console.error('Unable to set ChatKit thread', error);
        setThreadError('We could not load your conversation. Try refreshing the page.');
        threadAppliedRef.current = undefined;
      }
    })();
  }, [canRenderChatKit, chatkit, threadId]);

  const statusBanner = useMemo(() => {
    if (supabaseInitError) {
      return { type: 'error' as const, message: supabaseInitError };
    }

    if (!supabaseClient) {
      return {
        type: 'info' as const,
        message: 'Initializing chat client…',
      };
    }

    if (!sessionResolved) {
      return {
        type: 'info' as const,
        message: 'Checking your session…',
      };
    }

    if (authError) {
      return { type: 'error' as const, message: authError };
    }

    if (!userId) {
      return {
        type: 'info' as const,
        message: 'Sign in to start chatting with Merak agents.',
      };
    }

    if (threadError) {
      return { type: 'error' as const, message: threadError };
    }

    if (!threadReady) {
      return {
        type: 'info' as const,
        message: 'Preparing your conversation…',
      };
    }

    return null;
  }, [authError, sessionResolved, supabaseClient, supabaseInitError, threadError, threadReady, userId]);

  return (
    <div className="relative h-full w-full overflow-hidden">
      {canRenderChatKit ? (
        <>
          <ChatKit control={chatkit.control} className="block h-full w-full" />
          {statusBanner ? (
            <div className="pointer-events-auto absolute inset-0 flex items-center justify-center bg-white/80 p-6 text-center">
              <p
                className={
                  statusBanner.type === 'error'
                    ? 'text-sm font-medium text-rose-600'
                    : 'text-sm font-medium text-slate-700'
                }
              >
                {statusBanner.message}
              </p>
            </div>
          ) : null}
        </>
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-white p-6 text-center">
          <p className="text-sm font-medium text-slate-700">
            {statusBanner?.message ?? 'Preparing the chat experience…'}
          </p>
        </div>
      )}
    </div>
  );
}
