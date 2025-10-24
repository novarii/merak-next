'use client';

import Image from 'next/image';
import { useMemo } from 'react';

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
  hiresLabel,
  avatarUrl,
  badges = [],
  isBookmarked = false,
  onBookmarkToggle,
  onViewDetails,
  onMoreOptions,
  className,
}: AgentProfileCardProps) {
  const badgeItems = useMemo(() => badges.filter((badge) => Boolean(badge.label)), [badges]);

  return (
    <article
      className={`flex flex-col gap-6 rounded-[25px] border border-[#bfbfbf] bg-white p-6 shadow-sm ${className ?? ''}`}
      data-testid="agent-profile-card"
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="flex flex-1 flex-col gap-4 md:flex-row md:items-start">
          <div className="relative h-20 w-20 flex-none overflow-hidden rounded-2xl bg-[#d9d9d9]">
            {avatarUrl ? (
              <Image
                alt={`${name} avatar`}
                src={avatarUrl}
                fill
                className="object-cover"
                sizes="80px"
              />
            ) : null}
          </div>

          <div className="flex flex-1 flex-col gap-3">
            {badgeItems.length ? (
              <div className="flex flex-wrap items-center gap-2">
                {badgeItems.map((badge) => (
                  <span
                    key={badge.id}
                    className={`rounded-md px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${BADGE_STYLES[badge.tone ?? 'slate']}`}
                  >
                    {badge.label}
                  </span>
                ))}
              </div>
            ) : null}

            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-col gap-1">
                <h3 className="text-xl font-semibold text-[#1d1d1d]">{`${name} — ${role}`}</h3>
                <p className="text-sm text-[#5b5b5b]">
                  {creator}
                  {specialties.length ? (
                    <>
                      {' '}
                      <span className="text-[#8c8c8c]">{specialties.join(' · ')}</span>
                    </>
                  ) : null}
                </p>
              </div>

              <p className="text-lg font-semibold text-[#1d1d1d]">{priceLabel}</p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onMoreOptions}
          className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-[#f0f0f0] bg-[#f0f0f0] text-[#1d1d1d] transition hover:border-slate-300 hover:text-slate-900"
          aria-label="More actions"
        >
          <span className="sr-only">More actions</span>
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            className="h-4 w-4 stroke-current"
          >
            <circle cx="5" cy="12" r="1.5" />
            <circle cx="12" cy="12" r="1.5" />
            <circle cx="19" cy="12" r="1.5" />
          </svg>
        </button>
      </div>

      <div className="border-t border-dashed border-[#dcdcdc]" />

      <p className="text-sm leading-relaxed text-[#262626]">
        {description ?? 'No description available at the moment.'}
      </p>

      <div className="border-t border-dashed border-[#dcdcdc]" />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {hiresLabel ? (
          <p className="text-xs font-medium uppercase tracking-wide text-[#8c8c8c]">
            {hiresLabel}
          </p>
        ) : (
          <span />
        )}

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBookmarkToggle}
            aria-pressed={isBookmarked}
            aria-label={isBookmarked ? 'Remove from favorites' : 'Save to favorites'}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-[#1d1d1d] transition hover:border-slate-300 hover:text-[#01224d]"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill={isBookmarked ? '#01224d' : 'none'}
              stroke="currentColor"
              strokeWidth={1.5}
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
            className="inline-flex items-center justify-center rounded-full bg-[#01224d] px-6 py-2 text-sm font-medium text-white transition hover:bg-[#143669]"
          >
            View Details
          </button>
        </div>
      </div>
    </article>
  );
}
