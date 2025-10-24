import { useState, useCallback } from 'react';

export interface AgentProfile {
  id: string;
  name: string;
  tagline: string | null;
  profile_img: string | null;
  card_description: string | null;
  profile_description: string | null;
  developer: string | null;
  highlights: string[];
  demo_link: string | null;
  base_rate: number | null;
  success_rate: number | null;
  experience_years: number | null;
  availability: string;
  industry: string | null;
  agent_type: string;
  languages: string[];
  created_at: string;
}

export function useAgentProfiles() {
  const [profiles, setProfiles] = useState<AgentProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadProfiles = useCallback(async (agentIds: string[]) => {
    if (!agentIds.length) {
      setProfiles([]);
      return { success: true, count: 0 };
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/agents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentIds }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      const nextProfiles: AgentProfile[] = Array.isArray(data.profiles)
        ? data.profiles.map((profile: AgentProfile) => {
            const resolvedImage = profile.profile_img
              ? profile.profile_img.startsWith('http')
                ? profile.profile_img
                : `https://amtsrzlqgriywjwvtmet.supabase.co/storage/v1/object/public/profile/${profile.profile_img.replace(/^\//, '')}`
              : null;

            return {
              ...profile,
              profile_img: resolvedImage,
              languages: Array.isArray(profile.languages) ? profile.languages : [],
              highlights: Array.isArray(profile.highlights) ? profile.highlights : [],
            };
          })
        : [];

      setProfiles(nextProfiles);

      return {
        success: true,
        count: nextProfiles.length,
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load profiles';
      setError(errorMessage);
      setProfiles([]);

      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      setLoading(false);
    }
  }, []);

  const clearProfiles = useCallback(() => {
    setProfiles([]);
    setError(null);
  }, []);

  return {
    profiles,
    loading,
    error,
    loadProfiles,
    clearProfiles,
  };
}
