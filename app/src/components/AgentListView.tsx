import { AgentProfileCard } from '@/components/AgentProfileCard';
import type { AgentProfileCardProps, AgentProfileBadge } from '@/components/AgentProfileCard';
import type { AgentProfile } from '@/hooks/useAgentProfiles';

export interface AgentListViewProps {
  profiles: AgentProfile[];
  loading: boolean;
  error: string | null;
  onViewDetailsClick: (agentId: string) => void;
}

const BADGE_ROTATION: Array<{ label: string; tone: AgentProfileBadge['tone'] }> = [
  { label: 'Top Choice', tone: 'blue' },
  { label: 'Great Fit', tone: 'rose' },
  { label: 'Strong Match', tone: 'slate' },
];

function formatLabel(value: string) {
  return value
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function AgentListView({ profiles, loading, error, onViewDetailsClick }: AgentListViewProps) {
  return (
    <div className="flex h-full flex-col">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold text-slate-900">Recommended Agents</h1>
        <p className="mt-2 text-sm text-slate-600">Review agent profiles surfaced during your conversations.</p>
      </header>

      <div className="flex-1 space-y-4 overflow-y-auto rounded-3xl border border-slate-200/60 bg-white/75 p-8 shadow-lg">
        {loading ? <p className="text-sm text-slate-500">Loading profiles…</p> : null}

        {error ? <p className="text-sm text-rose-500">Unable to load agent profiles: {error}</p> : null}

        {!loading && !error && profiles.length === 0 ? (
          <p className="text-sm text-slate-500">Start a conversation to see matching agent profiles.</p>
        ) : null}

        {profiles.map((profile, index) => {
          const formattedRate =
            profile.base_rate !== null
              ? `$${profile.base_rate.toLocaleString(undefined, { maximumFractionDigits: 0 })}/hr`
              : 'Pricing on request';

          const specialties = [
            formatLabel(profile.agent_type),
            profile.industry ?? null,
            profile.languages[0] ?? null,
          ].filter((value): value is string => Boolean(value));

          const rotationBadge = BADGE_ROTATION[index % BADGE_ROTATION.length];
          const badges: AgentProfileBadge[] = [];

          if (index === 0) {
            badges.push({
              id: `${profile.id}-spotlight-top-choice`,
              label: 'Top Choice',
              tone: 'blue',
            });
            const secondaryBadge = BADGE_ROTATION[(index + 1) % BADGE_ROTATION.length];
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

          const cardProps: AgentProfileCardProps = {
            name: profile.name,
            role: formatLabel(profile.agent_type),
            creator: profile.tagline ?? 'Independent Agent',
            specialties,
            priceLabel: formattedRate,
            description: profile.description ?? undefined,
            hiresLabel,
            badges,
            isBookmarked: index === 0,
            matchScore:
              profile.success_rate !== null ? Math.round(profile.success_rate) : undefined,
            matchHighlights: specialties.slice(0, 3),
            onViewDetails: () => onViewDetailsClick(profile.id),
          };

          return <AgentProfileCard key={profile.id} {...cardProps} />;
        })}
      </div>
    </div>
  );
}
