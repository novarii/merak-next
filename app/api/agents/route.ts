import { NextRequest } from 'next/server';

import { getServiceSupabaseClient } from '@/lib/supabaseServer';

export const runtime = 'nodejs';

const MAX_AGENT_IDS = 50;

export async function POST(req: NextRequest) {
  let payload: unknown;

  try {
    payload = await req.json();
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const agentIds = Array.isArray((payload as { agentIds?: unknown }).agentIds)
    ? (payload as { agentIds: unknown[] }).agentIds
    : null;

  if (!agentIds) {
    return Response.json({ error: 'agentIds must be an array' }, { status: 400 });
  }

  const normalizedIds = agentIds
    .map((value) => (typeof value === 'string' ? value.trim() : ''))
    .filter(Boolean);

  if (!normalizedIds.length) {
    return Response.json({ profiles: [] });
  }

  if (normalizedIds.length > MAX_AGENT_IDS) {
    return Response.json(
      { error: `Request exceeds max of ${MAX_AGENT_IDS} agent IDs` },
      { status: 400 }
    );
  }

  const uniqueIds = Array.from(new Set(normalizedIds));

  try {
    const supabase = getServiceSupabaseClient();
    const { data, error } = await supabase
      .from('agent_profiles')
      .select(
        `
        id,
        name,
        tagline,
        profile_img,
        card_description,
        profile_description,
        developer,
        highlights,
        demo_link,
        base_rate,
        success_rate,
        experience_years,
        availability,
        industry,
        agent_type,
        languages,
        created_at,
        endorsements (
          id,
          endorser_name,
          endorser_role,
          endorsement_text,
          created_at
        )
      `
      )
      .in('id', uniqueIds);

    if (error) {
      console.error('Supabase agent profile lookup failed', error);
      return Response.json({ error: 'Failed to load agent profiles' }, { status: 500 });
    }

    type RawProfile = {
      id: string;
      name: string;
      tagline: string | null;
      profile_img: string | null;
      card_description: string | null;
      profile_description: string | null;
      developer: string | null;
      highlights: string[] | null;
      demo_link: string | null;
      base_rate: string | number | null;
      success_rate: string | number | null;
      experience_years: number | null;
      availability: string;
      industry: string | null;
      agent_type: string;
      languages: string[] | null;
      created_at: string;
      endorsements: RawEndorsement[] | null;
    };

    type RawEndorsement = {
      id: string;
      endorser_name: string;
      endorser_role: string | null;
      endorsement_text: string;
      created_at: string | null;
    };

    const profiles = (data ?? []).map((profile: RawProfile) => ({
      ...profile,
      base_rate:
        profile.base_rate !== null && profile.base_rate !== undefined
          ? Number(profile.base_rate)
          : null,
      success_rate:
        profile.success_rate !== null && profile.success_rate !== undefined
          ? Number(profile.success_rate)
          : null,
      experience_years:
        profile.experience_years !== null && profile.experience_years !== undefined
          ? Number(profile.experience_years)
          : null,
      languages: Array.isArray(profile.languages) ? profile.languages : [],
      highlights: Array.isArray(profile.highlights) ? profile.highlights : [],
      endorsements: Array.isArray(profile.endorsements)
        ? profile.endorsements.map((endorsement) => ({
            ...endorsement,
            endorser_role: endorsement.endorser_role ?? null,
            created_at: endorsement.created_at ?? null,
          }))
        : [],
    }));

    const sortOrder = new Map(uniqueIds.map((id, index) => [id, index]));
    const orderedProfiles = profiles.sort((a, b) => {
      const aIndex = sortOrder.get(a.id) ?? Number.POSITIVE_INFINITY;
      const bIndex = sortOrder.get(b.id) ?? Number.POSITIVE_INFINITY;
      return aIndex - bIndex;
    });

    return Response.json({ profiles: orderedProfiles });
  } catch (err) {
    console.error('Unexpected agent profile lookup error', err);
    return Response.json({ error: 'Failed to load agent profiles' }, { status: 500 });
  }
}
