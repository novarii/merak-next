'use client';

import { useEffect, useState } from 'react';

import { ChatKitPanel } from '@/components/ChatKitPanel';
import { AgentProfileCard } from '@/components/AgentProfileCard';
import type { AgentProfileBadge } from '@/components/AgentProfileCard';
import { SiteHeader } from '@/components/SiteHeader';
import { useAgentProfiles } from '@/hooks/useAgentProfiles';
import { deriveAccountNavigation } from '@/lib/accountNavigation';
import { getSupabaseBrowserClient } from '@/lib/supabaseBrowserClient';

export default function ChatPage() {
  const {
    profiles,
    loading,
    error,
    loadProfiles,
    clearProfiles,
  } = useAgentProfiles();

  const [accountNav, setAccountNav] = useState(() => deriveAccountNavigation(null));

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

  const formatLabel = (value: string) =>
    value
      .replace(/[-_]/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());

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
                onProfilesLoad={loadProfiles}
                onThreadChange={clearProfiles}
              />
            </div>
          </aside>

          {/* Right Column: Recommended Agents */}
          <main className="flex-1">
            <header className="mb-8">
              <h1 className="text-3xl font-semibold text-slate-900">Recommended Agents</h1>
              <p className="mt-2 text-sm text-slate-600">
                Review agent profiles surfaced during your conversations.
              </p>
            </header>

            <div className="space-y-4 rounded-3xl border border-slate-200/60 bg-white/75 p-8 shadow-lg">
              {loading ? (
                <p className="text-sm text-slate-500">Loading profiles…</p>
              ) : null}

              {error ? (
                <p className="text-sm text-rose-500">
                  Unable to load agent profiles: {error}
                </p>
              ) : null}

              {!loading && !error && profiles.length === 0 ? (
                <p className="text-sm text-slate-500">
                  Start a conversation to see matching agent profiles.
                </p>
              ) : null}

              {profiles.map((profile, index) => {
                const formattedRate =
                  profile.base_rate !== null
                    ? `$${profile.base_rate.toLocaleString(undefined, {
                        maximumFractionDigits: 0,
                      })}/hr`
                    : 'Pricing on request';

                const specialties = [
                  formatLabel(profile.agent_type),
                  profile.industry ?? null,
                  profile.languages[0] ?? null,
                ].filter((value): value is string => Boolean(value));

                const spotlightBadges: Array<{ label: string; tone: AgentProfileBadge['tone'] }> = [
                  { label: 'Top Choice', tone: 'blue' },
                  { label: 'Great Fit', tone: 'rose' },
                  { label: 'Strong Match', tone: 'slate' },
                ];

                const rotationBadge = spotlightBadges[index % spotlightBadges.length];
                const badges: AgentProfileBadge[] = [];

                if (index === 0) {
                  badges.push({
                    id: `${profile.id}-spotlight-top-choice`,
                    label: 'Top Choice',
                    tone: 'blue',
                  });
                  const secondaryBadge = spotlightBadges[(index + 1) % spotlightBadges.length];
                  badges.push({
                    id: `${profile.id}-spotlight-secondary`,
                    label: secondaryBadge.label,
                    tone: secondaryBadge.tone,
                  });
                } else {
                  badges.push({
                    id: `${profile.id}-spotlight-rotation`,
                    label: rotationBadge.label,
                    tone: rotationBadge.tone,
                  });
                }

                const hiresLabel =
                  profile.success_rate !== null
                    ? `${profile.success_rate.toFixed(0)}% success rate`
                    : profile.experience_years !== null
                    ? `${profile.experience_years} years experience`
                    : undefined;

                return (
                  <AgentProfileCard
                    key={profile.id}
                    name={profile.name}
                    role={formatLabel(profile.agent_type)}
                    creator={profile.tagline ?? 'Independent Agent'}
                    specialties={specialties}
                    priceLabel={formattedRate}
                    description={profile.description ?? undefined}
                    hiresLabel={hiresLabel}
                    badges={badges}
                    isBookmarked={index === 0}
                    matchScore={
                      profile.success_rate !== null
                        ? Math.round(profile.success_rate)
                        : undefined
                    }
                    matchHighlights={specialties.slice(0, 3)}
                  />
                );
              })}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
