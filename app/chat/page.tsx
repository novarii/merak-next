'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { ChatKitPanel } from '@/components/ChatKitPanel';
import { AgentListView } from '@/components/AgentListView';
import { AgentProfileView } from '@/components/AgentProfileView';
import { SiteHeader } from '@/components/SiteHeader';
import { useAgentProfiles } from '@/hooks/useAgentProfiles';
import { deriveAccountNavigation } from '@/lib/accountNavigation';
import { getSupabaseBrowserClient } from '@/lib/supabaseBrowserClient';

export default function ChatPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { profiles, loading, error, loadProfiles, clearProfiles } = useAgentProfiles();

  const [accountNav, setAccountNav] = useState(() => deriveAccountNavigation(null));
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const [landingPrompt, setLandingPrompt] = useState<string | null>(null);

  useEffect(() => {
    const promptParam = searchParams.get('prompt');
    if (!promptParam) {
      return;
    }

    const trimmedPrompt = promptParam.trim();
    if (trimmedPrompt) {
      setLandingPrompt(trimmedPrompt);
    }

    const params = new URLSearchParams(searchParams.toString());
    params.delete('prompt');
    const nextQuery = params.toString();
    router.replace(nextQuery ? `/chat?${nextQuery}` : '/chat', { scroll: false });
  }, [router, searchParams]);

  useEffect(() => {
    let isMounted = true;
    let authSubscription: { unsubscribe: () => void } | null = null;

    try {
      const supabase = getSupabaseBrowserClient();

      supabase.auth.getSession().then(({ data: { session } }) => {
        if (isMounted) {
          setAccountNav(deriveAccountNavigation(session));
        }
      });

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        setAccountNav(deriveAccountNavigation(session));
      });

      authSubscription = subscription;
    } catch (error) {
      console.warn('Unable to initialize Supabase session for header state', error);
    }

    return () => {
      isMounted = false;
      authSubscription?.unsubscribe();
    };
  }, []);

  const selectedAgent = useMemo(() => {
    if (!selectedAgentId) {
      return null;
    }

    return profiles.find((profile) => profile.id === selectedAgentId) ?? null;
  }, [profiles, selectedAgentId]);

  useEffect(() => {
    if (selectedAgentId && !profiles.some((profile) => profile.id === selectedAgentId)) {
      setSelectedAgentId(null);
    }
  }, [profiles, selectedAgentId]);

  const handleViewDetails = useCallback((agentId: string) => {
    setSelectedAgentId(agentId);
  }, []);

  const handleBackToMarketplace = useCallback(() => {
    setSelectedAgentId(null);
  }, []);

  const handleThreadChange = useCallback(() => {
    setSelectedAgentId(null);
    clearProfiles();
  }, [clearProfiles]);

  const handleProfilesLoad = useCallback(
    async (agentIds: string[]) => {
      const result = await loadProfiles(agentIds);

      if (selectedAgentId && !agentIds.includes(selectedAgentId)) {
        setSelectedAgentId(null);
      }

      return result;
    },
    [loadProfiles, selectedAgentId],
  );

  const handleInitialPromptConsumed = useCallback(() => {
    setLandingPrompt(null);
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-[#f5f5f5]">
      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-6 pb-10">
        <SiteHeader
          accountLink={accountNav.accountLink}
          accountLabel={accountNav.accountLabel}
          className="border-b border-slate-300/80"
        />
        <div className="flex flex-1 gap-6 py-10">
          {/* Left Column: ChatKit */}
          <aside className="w-full max-w-md flex-none">
            <div className="sticky top-10 h-[88vh] overflow-hidden rounded-3xl border border-slate-200/60 bg-white shadow-xl ring-1 ring-slate-200/60">
              <ChatKitPanel
                initialPrompt={landingPrompt}
                onInitialPromptConsumed={handleInitialPromptConsumed}
                onProfilesLoad={handleProfilesLoad}
                onThreadChange={handleThreadChange}
              />
            </div>
          </aside>

          {/* Right Column: Main Content (list/profile toggle) */}
          <main className="flex-1">
            {selectedAgent ? (
              <AgentProfileView profile={selectedAgent} onBack={handleBackToMarketplace} />
            ) : (
              <AgentListView
                profiles={profiles}
                loading={loading}
                error={error}
                onViewDetailsClick={handleViewDetails}
              />
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
