'use client';

import Image from 'next/image';
import { useMemo } from 'react';

import { CircularProgress } from './CircularProgress';

type BadgeTone = 'rose' | 'blue' | 'slate';

export interface AgentProfileBadge {
  id: string;
  label: string;
  tone?: BadgeTone;
}

export interface AgentProfileCardProps {
  name: string;
  role: string;
  creator: string;
  specialties: string[];
  priceLabel: string;
  description?: string;
  hiresLabel?: string;
  avatarUrl?: string | null;
  badges?: AgentProfileBadge[];
  isBookmarked?: boolean;
  onBookmarkToggle?: () => void;
  onViewDetails?: () => void;
  onMoreOptions?: () => void;
  matchScore?: number;
  matchHighlights?: string[];
  className?: string;
}

const BADGE_STYLES: Record<BadgeTone, string> = {
  rose: 'bg-[#ffd2d1] text-[#1d1d1d]',
  blue: 'bg-[#d9e9ff] text-[#1d1d1d]',
  slate: 'bg-slate-200 text-slate-900',
};

export function AgentProfileCard({
  name,
  role,
  creator,
  specialties,
  priceLabel,
  description,
  avatarUrl,
  badges = [],
  isBookmarked = false,
  onBookmarkToggle,
  onViewDetails,
  onMoreOptions,
  matchScore,
  matchHighlights,
  className,
}: AgentProfileCardProps) {
  const badgeItems = useMemo(() => badges.filter((badge) => Boolean(badge.label)), [badges]);
  const resolvedScore = useMemo(
    () => Math.round(Math.max(0, Math.min(100, matchScore ?? 85))),
    [matchScore],
  );
  const highlightItems = useMemo(() => {
    if (matchHighlights?.length) {
      return matchHighlights.slice(0, 3);
    }

    if (specialties.length) {
      return specialties.slice(0, 3);
    }

    return ['High compatibility', 'Trusted by clients'];
  }, [matchHighlights, specialties]);
  const hiresSummary = '50+ Hires';

  return (
    <article
      className={`relative flex flex-col gap-6 overflow-hidden rounded-[25px] border border-[#bfbfbf] bg-white shadow-sm lg:flex-row ${
        className ?? ''
      }`}
      data-testid="agent-profile-card"
    >
      <div className="flex flex-1 flex-col justify-between p-6">
        <div className="flex flex-col items-stretch gap-4 md:flex-row md:items-start md:justify-between md:gap-6">
          <div className="flex flex-1 flex-col items-stretch gap-4 md:flex-row md:items-stretch">
            <div
              className={`relative h-[78px] w-[78px] flex-shrink-0 overflow-hidden rounded-[15px] ${
                avatarUrl ? '' : 'bg-[#d9d9d9]'
              }`}
            >
              {avatarUrl ? (
                <div className="absolute inset-[6px] overflow-hidden rounded-[12px]">
                  <Image
                    alt={`${name} avatar`}
                    src={avatarUrl}
                    fill
                    className="object-cover"
                    sizes="68px"
                  />
                </div>
              ) : null}
            </div>

            <div className="flex h-full flex-1 flex-col justify-between gap-1">
              {badgeItems.length ? (
                <div className="flex flex-wrap items-center gap-2">
                  {badgeItems.map((badge) => (
                    <span
                      key={badge.id}
                      className={`rounded-[6px] px-2 py-1 text-[9px] font-medium normal-case tracking-wide ${BADGE_STYLES[badge.tone ?? 'slate']}`}
                    >
                      {badge.label}
                    </span>
                  ))}
                </div>
              ) : null}

              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between md:gap-0">
                <div className="flex flex-col gap-1">
                  <h3 className="text-lg font-medium text-[#1d1d1d]">{name}</h3>
                  <p className="text-xs text-[#1d1d1d]">
                    <span>{creator}</span>
                    {role ? (
                      <>
                        {' / '}
                        <span className="text-[#8c8c8c]">{`${role} Agent`}</span>
                      </>
                    ) : null}
                  </p>
                </div>

                <div className="flex items-start md:items-center md:justify-end">
                  <p className="text-lg font-medium text-[#1d1d1d]">{priceLabel}</p>
                </div>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onMoreOptions}
            className="inline-flex h-6 w-6 items-center justify-center rounded-[5px] bg-[#f0f0f0] text-[#1d1d1d] transition"
            aria-label="More actions"
          >
            <span className="sr-only">More actions</span>
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-4 w-4 fill-current"
            >
              <circle cx="5" cy="12" r="1.5" />
              <circle cx="12" cy="12" r="1.5" />
              <circle cx="19" cy="12" r="1.5" />
            </svg>
          </button>
        </div>

        <div className="border-t border-[#f0f0f0]" />

        <p className="text-[13px] leading-4 text-[#262626]">
          {description ?? 'No description available at the moment.'}
        </p>

        <div className="border-t border-[#f0f0f0]" />

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs font-semibold tracking-wide text-[#262626]">{hiresSummary}</p>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBookmarkToggle}
              aria-pressed={isBookmarked}
              aria-label={isBookmarked ? 'Remove from favorites' : 'Save to favorites'}
              className="flex h-[33px] w-[33px] items-center justify-center rounded-full bg-[#f0f0f0] text-[#1d1d1d] transition hover:bg-[#e5e5e5]"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#1D1D1D"
                strokeWidth={2}
                className="h-5 w-5"
              >
                <path
                  d="M11.645 20.91a.6.6 0 0 0 .71 0c1.916-1.444 3.712-2.95 5.293-4.562 1.252-1.264 2.102-2.434 2.572-3.637.51-1.302.502-2.604-.417-3.816-.84-1.102-2.084-1.593-3.326-1.593-1.307 0-2.593.567-3.581 1.88C13.274 7.867 11.988 7.3 10.68 7.3c-1.242 0-2.485.49-3.325 1.593-.919 1.212-.928 2.514-.417 3.816.47 1.204 1.32 2.373 2.572 3.637 1.58 1.612 3.377 3.118 5.293 4.562Z"
                />
              </svg>
            </button>

            <button
              type="button"
              onClick={onViewDetails}
              className="inline-flex h-[33px] items-center justify-center rounded-[22px] bg-[#01224d] px-3 py-1 text-sm font-medium text-white transition hover:bg-[#143669]"
            >
              View Details
            </button>
          </div>
        </div>
      </div>

      <aside className="flex-none w-full rounded-[25px] border border-[#BFBFBF] bg-gradient-to-b from-[#01224d] to-[#b60d0a] p-6 lg:w-[200px]">
        <div className="flex h-full flex-col items-center gap-4">
          <CircularProgress
            score={resolvedScore}
            trackColor="rgba(255,255,255,0.15)"
            progressColor="#fef3c7"
            strokeWidth={6}
          />
          <div className="text-center">
            <h3 className="text-lg font-semibold text-white/90">Merak&apos;s Score</h3>
          </div>
          <div className="flex w-full items-center">
            <div className="h-px flex-1 border-t border-white/30" />
          </div>
          <ul className="flex w-full flex-col gap-2">
            {highlightItems.map((item, index) => (
              <li key={`${item}-${index}`} className="flex items-start gap-2 text-sm text-white/80">
                <svg
                  className="mt-[2px] h-4 w-4 flex-shrink-0 text-emerald-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span className="leading-snug text-white/80">{item}</span>
              </li>
            ))}
          </ul>

        </div>
      </aside>
    </article>
  );
}
