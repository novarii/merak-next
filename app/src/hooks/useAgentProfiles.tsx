import { useState, useCallback } from "react";

export interface AgentProfile {
  agent_id: string;
  name: string;
  role: string;
  hourly_rate: number;
  availability: string;
  industry_tags: string[];
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
      const response = await fetch("/api/agents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agentIds }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setProfiles(data.profiles || []);
      
      return { 
        success: true, 
        count: data.profiles?.length || 0 
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to load profiles";
      setError(errorMessage);
      setProfiles([]);
      
      return { 
        success: false, 
        error: errorMessage 
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