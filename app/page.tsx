'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ChatKitPanel } from '@/components/ChatKitPanel';
import { SearchProgressCarousel } from '@/components/SearchProgressCarousel';
import { useAgentProfiles } from '@/hooks/useAgentProfiles';
import { SEARCH_STATUS_PHRASES } from '@/lib/searchStatusPhrases';

const MIN_LOADER_VISIBLE_MS = 2000;

export default function HomePage() {
  const [isSearchAnimating, setIsSearchAnimating] = useState(false);
  const [showSearchLoader, setShowSearchLoader] = useState(false);
  const loaderTimeoutRef = useRef<number | null>(null);
  const loaderStartRef = useRef<number | null>(null);
  const {
    profiles,
    loading,
    error,
    loadProfiles,
    clearProfiles,
  } = useAgentProfiles();

  const handleSearchAnimationToggle = useCallback((active: boolean) => {
    setIsSearchAnimating(active);
  }, []);

  const handleThreadChange = useCallback(() => {
    setIsSearchAnimating(false);
    clearProfiles();
  }, [clearProfiles]);

  useEffect(() => {
    if (isSearchAnimating) {
      if (loaderTimeoutRef.current !== null) {
        window.clearTimeout(loaderTimeoutRef.current);
        loaderTimeoutRef.current = null;
      }
      loaderStartRef.current = performance.now();
      setShowSearchLoader(true);
    } else {
      const startedAt = loaderStartRef.current ?? performance.now();
      const elapsed = performance.now() - startedAt;
      const remaining = Math.max(MIN_LOADER_VISIBLE_MS - elapsed, 0);

      loaderTimeoutRef.current = window.setTimeout(() => {
        setShowSearchLoader(false);
        loaderTimeoutRef.current = null;
        loaderStartRef.current = null;
      }, remaining + 300);
    }

    return () => {
      if (loaderTimeoutRef.current !== null) {
        window.clearTimeout(loaderTimeoutRef.current);
        loaderTimeoutRef.current = null;
      }
    };
  }, [isSearchAnimating]);

  const formatLabel = (value: string) =>
    value
      .replace(/[-_]/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-200">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl gap-6 px-6 py-10">
        {/* Left Column: ChatKit */}
        <aside className="w-full max-w-md flex-none">
          <div className="sticky top-10 h-[88vh] overflow-hidden rounded-3xl border border-slate-200/60 bg-white shadow-xl ring-1 ring-slate-200/60">
            <ChatKitPanel
              onProfilesLoad={loadProfiles}
              onThreadChange={handleThreadChange}
              onSearchAnimationToggle={handleSearchAnimationToggle}
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

          <div
            className="space-y-4 rounded-3xl border border-slate-200/60 bg-white/75 p-8 shadow-lg"
            aria-busy={showSearchLoader}
          >
            {showSearchLoader ? (
              <div className="py-12">
                <SearchProgressCarousel
                  phrases={SEARCH_STATUS_PHRASES}
                  isActive={isSearchAnimating}
                />
              </div>
            ) : null}

            {!showSearchLoader && loading ? (
              <p className="text-sm text-slate-500">Loading profiles…</p>
            ) : null}

            {error ? (
              <p className="text-sm text-rose-500">
                Unable to load agent profiles: {error}
              </p>
            ) : null}

            {!showSearchLoader && !loading && !error && profiles.length === 0 ? (
              <p className="text-sm text-slate-500">
                Start a conversation to see matching agent profiles.
              </p>
            ) : null}

            {!showSearchLoader && profiles.map((profile) => {
              const formattedRate =
                profile.base_rate !== null
                  ? `$${profile.base_rate.toLocaleString(undefined, {
                      maximumFractionDigits: 0,
                    })}/hr`
                  : '—';
              const formattedSuccess =
                profile.success_rate !== null
                  ? `${profile.success_rate.toFixed(0)}%`
                  : '—';
              const experienceLabel =
                profile.experience_years !== null ? `${profile.experience_years} yrs` : '—';

              return (
                <article
                  key={profile.id}
                  className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm"
                >
                  <header className="flex flex-col gap-2">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <h2 className="text-lg font-semibold text-slate-900">{profile.name}</h2>
                        {profile.tagline ? (
                          <p className="text-sm text-slate-600">{profile.tagline}</p>
                        ) : null}
                      </div>
                      <dl className="text-right text-xs uppercase tracking-wide text-slate-500">
                        <dt className="font-medium text-slate-400">Agent Type</dt>
                        <dd className="font-semibold text-slate-900">
                          {formatLabel(profile.agent_type)}
                        </dd>
                      </dl>
                    </div>

                    <div className="flex flex-wrap gap-2 text-xs font-medium text-slate-600">
                      <span className="rounded-full bg-slate-100 px-3 py-1">
                        {formatLabel(profile.availability)}
                      </span>
                      {profile.industry ? (
                        <span className="rounded-full bg-slate-100 px-3 py-1">
                          {profile.industry}
                        </span>
                      ) : null}
                    </div>
                  </header>

                  {profile.description ? (
                    <p className="mt-4 text-sm text-slate-600">{profile.description}</p>
                  ) : null}

                  <dl className="mt-4 grid grid-cols-3 gap-4 text-sm text-slate-600">
                    <div>
                      <dt className="font-medium text-slate-500">Base Rate</dt>
                      <dd className="font-semibold text-slate-900">{formattedRate}</dd>
                    </div>
                    <div>
                      <dt className="font-medium text-slate-500">Success Rate</dt>
                      <dd className="font-semibold text-slate-900">{formattedSuccess}</dd>
                    </div>
                    <div>
                      <dt className="font-medium text-slate-500">Experience</dt>
                      <dd className="font-semibold text-slate-900">{experienceLabel}</dd>
                    </div>
                  </dl>

                  {profile.languages.length ? (
                    <div className="mt-4">
                      <h3 className="text-xs font-medium uppercase tracking-wide text-slate-500">
                        Languages
                      </h3>
                      <ul className="mt-2 flex flex-wrap gap-2">
                        {profile.languages.map((language) => (
                          <li
                            key={language}
                            className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600"
                          >
                            {language}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </article>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
}
