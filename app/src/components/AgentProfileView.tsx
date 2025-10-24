import Image from 'next/image';

import type { AgentProfile } from '@/hooks/useAgentProfiles';

export interface AgentProfileViewProps {
  profile: AgentProfile;
  onBack: () => void;
}

function formatLabel(value: string) {
  return value
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function extractYouTubeId(value: string | null) {
  if (!value) {
    return null;
  }

  if (/^[A-Za-z0-9_-]{11}$/.test(value)) {
    return value;
  }

  try {
    const url = new URL(value);

    if (url.hostname.includes('youtu.be')) {
      const segment = url.pathname.split('/').filter(Boolean)[0];
      return segment ?? null;
    }

    const watchId = url.searchParams.get('v');
    if (watchId) {
      return watchId;
    }

    const pathSegment = url.pathname.split('/').find((segment) => /^[A-Za-z0-9_-]{11}$/.test(segment));
    return pathSegment ?? null;
  } catch {
    return null;
  }
}

export function AgentProfileView({ profile, onBack }: AgentProfileViewProps) {
  const priceLabel =
    profile.base_rate !== null
      ? `$${profile.base_rate.toLocaleString(undefined, { maximumFractionDigits: 0 })}/mo`
      : 'Pricing on request';

  const agentLabel = formatLabel(profile.agent_type);
  const primaryLanguage = profile.languages[0] ?? 'English';
  const shortSummary =
    profile.card_description ?? 'This agent delivers tailored outcomes for your workflows.';
  const description =
    profile.profile_description ?? 'This agent has not added a longer description yet.';
  const highlights = profile.highlights.length
    ? profile.highlights
    : ['High satisfaction from clients', 'Deep domain expertise', 'Responsive collaboration'];

  const demoId = extractYouTubeId(profile.demo_link ?? null);
  const videoSrc = demoId ? `https://www.youtube.com/embed/${demoId}` : null;

  return (
    <div className="flex h-full flex-col">
      <button
        type="button"
        onClick={onBack}
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-[#01224d] transition hover:text-[#344e71]"
      >
        <span
          aria-hidden
          className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#f0f0f0] text-[#01224d]"
        >
          <svg aria-hidden viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current stroke-[2]">
            <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        Back to Marketplace
      </button>

      <section className="space-y-8 overflow-y-auto rounded-3xl border border-slate-200/60 bg-white/80 p-8 shadow-lg">
        <header className="flex flex-col gap-6 text-[#01224d]">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex flex-1 flex-col gap-4 sm:flex-row">
              <div
                className={`relative h-[120px] w-[120px] flex-shrink-0 overflow-hidden rounded-2xl ${
                  profile.profile_img ? '' : 'bg-[#d9d9d9]'
                }`}
              >
                {profile.profile_img ? (
                  <div className="absolute inset-2 overflow-hidden rounded-2xl">
                    <Image
                      alt={`${profile.name} portrait`}
                      src={profile.profile_img}
                      fill
                      className="object-cover"
                      sizes="116px"
                    />
                  </div>
                ) : null}
              </div>

              <div className="flex flex-1 flex-col gap-2">
                <h2 className="text-3xl font-semibold text-[#011f46]">{profile.name}</h2>
                {profile.tagline ? (
                  <p className="text-lg font-medium text-[#344e71]">{profile.tagline}</p>
                ) : null}
              </div>
            </div>

            <div className="flex flex-none flex-col items-end gap-2 text-right">
              <p className="text-2xl font-semibold text-[#011f46]">{priceLabel}</p>
              {profile.success_rate !== null ? (
                <p className="text-sm font-semibold text-emerald-600">
                  {profile.success_rate.toFixed(0)}% client success rate
                </p>
              ) : null}
            </div>
          </div>

          <p className="text-base text-[#011f46]/80">{shortSummary}</p>
        </header>

        <dl className="grid gap-4 rounded-2xl border border-[#bfbfbf]/70 bg-white p-6 text-sm text-[#011f46]/80 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <dt className="font-semibold text-[#01224d]">Availability</dt>
            <dd className="mt-1">{formatLabel(profile.availability)}</dd>
          </div>
          <div>
            <dt className="font-semibold text-[#01224d]">Industry Focus</dt>
            <dd className="mt-1">{profile.industry ?? 'General'}</dd>
          </div>
          <div>
            <dt className="font-semibold text-[#01224d]">Agent Type</dt>
            <dd className="mt-1">{agentLabel}</dd>
          </div>
          <div>
            <dt className="font-semibold text-[#01224d]">Languages</dt>
            <dd className="mt-1">{profile.languages.length ? profile.languages.join(', ') : primaryLanguage}</dd>
          </div>
          <div>
            <dt className="font-semibold text-[#01224d]">Experience</dt>
            <dd className="mt-1">
              {profile.experience_years !== null ? `${profile.experience_years}+ years` : 'Experience on request'}
            </dd>
          </div>
          <div>
            <dt className="font-semibold text-[#01224d]">Developer</dt>
            <dd className="mt-1">{profile.developer ?? 'Independent Agent'}</dd>
          </div>
        </dl>

        <section className="space-y-3">
          <h3 className="text-xl font-semibold text-[#01224d]">Demo Video</h3>
          {videoSrc ? (
            <div className="overflow-hidden rounded-2xl shadow-sm">
              <div className="aspect-video">
                <iframe
                  src={videoSrc}
                  title={`${profile.name} demo video`}
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            </div>
          ) : (
            <div className="flex aspect-video w-full items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-100 text-sm text-[#01224d]/60">
              Demo video coming soon
            </div>
          )}
        </section>

        <section className="space-y-3">
          <h3 className="text-xl font-semibold text-[#01224d]">Full Description</h3>
          <p className="text-base leading-relaxed text-[#011837]/80">{description}</p>
        </section>

        <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_260px]">
          <div className="space-y-4">
            <div className="rounded-2xl border border-[#bfbfbf] bg-white p-6 shadow-sm">
              <h4 className="text-lg font-semibold text-[#01224d]">Highlights</h4>
              <ul className="mt-4 space-y-2 text-sm text-[#011f46]/75">
                {highlights.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-[#bfbfbf] bg-white p-6 shadow-sm">
              <h4 className="text-lg font-semibold text-[#01224d]">Quick Stats</h4>
              <ul className="mt-4 space-y-2 text-sm text-[#011f46]/75">
                <li>
                  <span className="font-semibold text-[#01224d]">Monthly Rate:</span> {priceLabel}
                </li>
                <li>
                  <span className="font-semibold text-[#01224d]">Success Rate:</span>{' '}
                  {profile.success_rate !== null ? `${profile.success_rate.toFixed(0)}%` : 'On request'}
                </li>
                <li>
                  <span className="font-semibold text-[#01224d]">Experience:</span>{' '}
                  {profile.experience_years !== null ? `${profile.experience_years}+ years` : 'On request'}
                </li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col justify-between rounded-2xl border border-[#01224d]/10 bg-[#f5f5f5]/90 p-6">
            <div className="space-y-2">
              <h4 className="text-lg font-semibold text-[#01224d]">Why this agent?</h4>
              <p className="text-sm text-[#011f46]/75">
                Seamless support for your workflows with expertise in {agentLabel.toLowerCase()} and {profile.industry ?? 'multiple industries'}.
              </p>
            </div>
            <div className="mt-6 rounded-xl bg-[#01224d] px-5 py-4 text-center text-white shadow-md">
              <button type="button" className="text-base font-semibold">Hire Now!</button>
            </div>
          </div>
        </section>
      </section>
    </div>
  );
}
