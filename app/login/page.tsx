"use client";

import { FormEvent, useMemo, useState } from 'react';
import Link from 'next/link';

import { getSupabaseBrowserClient } from '@/lib/supabaseBrowserClient';

export default function LoginPage() {
  const supabase = getSupabaseBrowserClient();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<'sign-in' | 'sign-up'>('sign-in');

  const heading = useMemo(
    () => (view === 'sign-in' ? 'Welcome back' : "Let's get you started"),
    [view],
  );
  const subheading = useMemo(
    () =>
      view === 'sign-in'
        ? 'Sign in with your email or continue with Google to access Merak.'
        : 'Create your Merak account with a magic link or Google.',
    [view],
  );

  const requestMagicLink = async () => {
    if (!email) {
      setError('Enter your email address to continue.');
      return;
    }

    setLoading(true);
    setMessage(null);
    setError(null);

    const { error: signInError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (signInError) {
      setError(signInError.message);
    } else {
      setMessage('Magic link sent! Check your email to continue.');
    }

    setLoading(false);
  };

  const handleMagicLink = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await requestMagicLink();
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setMessage(null);
    setError(null);

    const { error: googleError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (googleError) {
      setError(googleError.message);
      setLoading(false);
    }
    // On success Supabase will redirect, so we do not reset loading state
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-6 py-24 text-slate-900">
      <div className="w-full max-w-md space-y-6 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold">{heading}</h1>
          <p className="text-sm text-slate-500">{subheading}</p>
        </div>

        <form className="space-y-4" onSubmit={handleMagicLink}>
          <div className="space-y-2 text-left">
            <label className="text-sm font-medium text-slate-700" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
              placeholder="you@example.com"
              autoComplete="email"
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:opacity-50"
          >
            {loading ? 'Sending...' : view === 'sign-in' ? 'Send magic link' : 'Send sign-up link'}
          </button>
        </form>

        <div className="relative my-4">
          <span className="absolute inset-x-0 top-1/2 -translate-y-1/2 border-t border-slate-200" />
          <span className="relative mx-auto block w-fit bg-white px-3 text-xs uppercase tracking-wide text-slate-400">
            or
          </span>
        </div>

        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
        >
          <span>{view === 'sign-in' ? 'Continue with Google' : 'Sign up with Google'}</span>
        </button>

        {(message || error) && (
          <div
            className={`rounded-lg border px-3 py-2 text-sm ${
              error ? 'border-red-200 bg-red-50 text-red-700' : 'border-emerald-200 bg-emerald-50 text-emerald-700'
            }`}
          >
            {error ?? message}
          </div>
        )}

        <div className="space-y-2 text-center">
          <p className="text-xs text-slate-400">
            Need help?{' '}
            <Link href="/contact" className="font-medium text-slate-600 hover:text-slate-900">
              Contact support
            </Link>
            .
          </p>
          <p className="text-sm text-slate-500">
            {view === 'sign-in' ? "Don't have an account?" : 'Already have an account?'}{' '}
            <button
              type="button"
              className="cursor-pointer rounded-md px-2 py-1 font-medium text-slate-700 underline decoration-slate-300 transition hover:bg-slate-100 hover:text-slate-900 hover:decoration-slate-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-400"
              onClick={() => {
                setView((current) => (current === 'sign-in' ? 'sign-up' : 'sign-in'));
                setMessage(null);
                setError(null);
              }}
              disabled={loading}
            >
              {view === 'sign-in' ? 'Create one' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </main>
  );
}
