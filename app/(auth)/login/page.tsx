'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabaseBrowserClient } from '@/lib/supabaseBrowser';

type AuthMode = 'login' | 'register';

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();

    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        router.replace('/search');
      }
    });
  }, [router]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const supabase = getSupabaseBrowserClient();
    const formData = new FormData(event.currentTarget);
    const email = (formData.get('email') as string)?.trim();
    const password = (formData.get('password') as string) ?? '';

    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }

    setError(null);
    setStatus(null);
    setLoading(true);

    try {
      if (mode === 'login') {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

        if (signInError) {
          setError(signInError.message);
          return;
        }

        router.push('/search');
        return;
      }

      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/search`,
        },
      });

      if (signUpError) {
        setError(signUpError.message);
        return;
      }

      if (data.session) {
        router.push('/search');
        return;
      }

      setStatus('Check your email to confirm your account. You will be redirected after verification.');
    } catch (authError) {
      const message =
        authError instanceof Error ? authError.message : 'Unable to complete the request.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-white">
      <header className="border-b border-white/10 bg-slate-950/60 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
          <div className="text-lg font-semibold">Merak</div>
          <button
            type="button"
            className="rounded-full border border-white/15 px-4 py-2 text-sm font-medium text-white hover:border-white/40 hover:bg-white/5"
            onClick={() => router.push('/')}
          >
            Back to Landing
          </button>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8 rounded-3xl border border-white/10 bg-slate-900/60 p-8 shadow-2xl backdrop-blur">
          <div className="space-y-2 text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-emerald-300/80">Welcome to Merak</p>
            <h1 className="text-2xl font-semibold">
              {mode === 'login' ? 'Log in to continue' : 'Create your account'}
            </h1>
            <p className="text-sm text-slate-300">
              {mode === 'login'
                ? 'Access your personalized research workspace.'
                : 'Start building your intelligent research stack.'}
            </p>
          </div>

          <div className="flex items-center gap-3 rounded-full bg-slate-800/60 p-1 text-sm font-medium">
            <button
              type="button"
              className={`flex-1 rounded-full px-4 py-2 ${
                mode === 'login'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-200 hover:text-white'
              }`}
              onClick={() => setMode('login')}
            >
              Log In
            </button>
            <button
              type="button"
              className={`flex-1 rounded-full px-4 py-2 ${
                mode === 'register'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-200 hover:text-white'
              }`}
              onClick={() => setMode('register')}
            >
              Register
            </button>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-200" htmlFor="email">
                Email
              </label>
              <input
                className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/20"
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="you@example.com"
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-200" htmlFor="password">
                Password
              </label>
              <input
                className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/20"
                id="password"
                name="password"
                type="password"
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                minLength={6}
                required
                placeholder="Enter a secure password"
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              className="flex w-full items-center justify-center rounded-2xl bg-emerald-400 px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-emerald-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-200 disabled:cursor-not-allowed disabled:opacity-70"
              disabled={loading}
            >
              {loading ? 'Please wait…' : mode === 'login' ? 'Log In' : 'Create Account'}
            </button>
          </form>

          {error ? (
            <p className="rounded-2xl border border-rose-400/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
              {error}
            </p>
          ) : null}

          {status ? (
            <p className="rounded-2xl border border-emerald-400/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
              {status}
            </p>
          ) : null}
        </div>
      </main>
    </div>
  );
}
