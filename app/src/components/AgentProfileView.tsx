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

export function AgentProfileView({ profile, onBack }: AgentProfileViewProps) {
  const priceLabel =
    profile.base_rate !== null
      ? `$${profile.base_rate.toLocaleString(undefined, { maximumFractionDigits: 0 })}/hr`
      : 'Pricing on request';

  const agentLabel = formatLabel(profile.agent_type);
  const primaryLanguage = profile.languages[0] ?? 'English';
  const description =
    profile.description ?? 'This agent has not added a longer description yet.';

  return (
    <div className="flex h-full flex-col">
      <button
        type="button"
        onClick={onBack}
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-[#01224d] transition hover:text-[#344e71]"
      >
        <span aria-hidden className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#f0f0f0] text-[#01224d]">
          <svg
            aria-hidden
            viewBox="0 0 24 24"
            className="h-4 w-4 fill-none stroke-current stroke-[2]"
          >
            <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        Back to Marketplace
      </button>

      <section className="space-y-8 overflow-y-auto rounded-3xl border border-slate-200/60 bg-white/80 p-8 shadow-lg">
        <header className="flex flex-col gap-4 text-[#01224d]">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div className="flex-1">
              <h2 className="text-3xl font-semibold text-[#011f46]">{profile.name}</h2>
              <p className="mt-1 text-lg font-medium text-[#344e71]">{agentLabel}</p>
              <p className="mt-1 text-sm text-[#344e71] opacity-80">by {profile.tagline ?? 'Independent Agent'}</p>
            </div>
            <div className="flex flex-none items-start text-right md:items-center md:text-right">
              <p className="text-2xl font-semibold text-[#011f46]">{priceLabel}</p>
            </div>
          </div>

          <dl className="grid gap-4 text-sm text-[#344e71] sm:grid-cols-3">
            <div>
              <dt className="font-semibold text-[#01224d]">Availability</dt>
              <dd className="mt-1 text-sm text-[#01224d]/80">{profile.availability}</dd>
            </div>
            <div>
              <dt className="font-semibold text-[#01224d]">Industry Focus</dt>
              <dd className="mt-1 text-sm text-[#01224d]/80">{profile.industry ?? 'General'}</dd>
            </div>
            <div>
              <dt className="font-semibold text-[#01224d]">Languages</dt>
              <dd className="mt-1 text-sm text-[#01224d]/80">{profile.languages.join(', ') || primaryLanguage}</dd>
            </div>
          </dl>
        </header>

        <div className="aspect-video w-full overflow-hidden rounded-2xl bg-slate-200/80">
          <div className="flex h-full w-full items-center justify-center text-sm font-medium text-[#01224d]">
            Demo Video
          </div>
        </div>

        <section className="space-y-3">
          <h3 className="text-xl font-semibold text-[#01224d]">Description</h3>
          <p className="text-base leading-relaxed text-[#011837]/80">{description}</p>
        </section>

        <section className="grid gap-6 md:grid-cols-[minmax(0,1fr)_240px]">
          <div className="space-y-4">
            <div className="rounded-2xl border border-[#bfbfbf] bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3 text-[#01224d]">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#ffd2d1]">
                  <svg
                    aria-hidden
                    viewBox="0 0 24 24"
                    className="h-5 w-5 text-[#ce5d5b]"
                    fill="currentColor"
                  >
                    <path d="M12 12.9c1.71 0 3.1-1.4 3.1-3.1S13.71 6.7 12 6.7 8.9 8.1 8.9 9.8s1.4 3.1 3.1 3.1z" />
                    <path d="M12 14.6c-2.07 0-6.2 1.05-6.2 3.1v1.55h12.39V17.7c0-2.05-4.13-3.1-6.19-3.1z" />
                  </svg>
                </span>
                <div>
                  <h4 className="text-lg font-semibold">Endorsements</h4>
                  <p className="text-sm text-[#011f46]/70">Professionals who trust this agent</p>
                </div>
              </div>

              <div className="mt-6">
                <p className="text-3xl font-semibold text-[#01224d]">
                  {profile.success_rate !== null ? `${profile.success_rate.toFixed(0)}%` : '1,247'}
                </p>
                <p className="mt-2 text-sm text-[#011f46]/70">
                  {profile.success_rate !== null
                    ? 'Client success rate across staffed projects'
                    : 'Professionals trust this agent'}
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-[#bfbfbf] bg-white p-6 shadow-sm">
              <h4 className="text-lg font-semibold text-[#01224d]">Highlights</h4>
              <ul className="mt-4 space-y-2 text-sm text-[#011f46]/75">
                {profile.languages.slice(0, 3).map((language) => (
                  <li key={language}>Fluent in {language}</li>
                ))}
                {profile.experience_years !== null ? (
                  <li>{profile.experience_years}+ years experience</li>
                ) : null}
                {profile.industry ? <li>Specialized in {profile.industry}</li> : null}
              </ul>
            </div>
          </div>

          <div className="flex flex-col justify-between rounded-2xl border border-[#01224d]/10 bg-[#f5f5f5]/90 p-6">
            <div className="space-y-2">
              <h4 className="text-lg font-semibold text-[#01224d]">Why this agent?</h4>
              <p className="text-sm text-[#011f46]/75">
                Tailored support for your workflows with expertise in {agentLabel.toLowerCase()} projects.
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
