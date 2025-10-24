'use client';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { SupabaseClient } from '@supabase/supabase-js';

import { getSupabaseBrowserClient } from '@/lib/supabaseBrowserClient';

export function SignOutButton() {
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignOut = useCallback(async () => {
    setSigningOut(true);
    setError(null);

    let supabase: SupabaseClient;

    try {
      supabase = getSupabaseBrowserClient();
    } catch (clientError) {
      console.error('Failed to load Supabase client for sign out', clientError);
      setError('Supabase is not configured. Please check your environment.');
      setSigningOut(false);
      return;
    }

    const { error: signOutError } = await supabase.auth.signOut();

    if (signOutError) {
      console.error('Failed to sign out', signOutError);
      setError('Unable to sign out. Please try again.');
      setSigningOut(false);
      return;
    }

    router.push('/login');
    router.refresh();
  }, [router]);

  return (
    <div className="flex flex-col items-center gap-3">
      <button
        type="button"
        onClick={handleSignOut}
        disabled={signingOut}
        className="inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
      >
        {signingOut ? 'Signing out…' : 'Sign Out'}
      </button>
      {error ? <p className="text-xs text-rose-500">{error}</p> : null}
    </div>
  );
}
