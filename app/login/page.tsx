'use client';

import Image from 'next/image';
import Link from 'next/link';
import { FormEvent, useMemo, useState } from 'react';

import { getSupabaseBrowserClient } from '@/lib/supabaseBrowserClient';

const GRID_IMAGE = '/assets/landing/grid-image.svg';
const LOGO_IMAGE =
  'https://www.figma.com/api/mcp/asset/9c0e4fc9-1494-4244-87af-a8e32a8991af';

const AUTH_CALLBACK_PATH = '/auth/callback';

const resolveAuthRedirectUrl = () => {
  const envSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

  if (envSiteUrl) {
    const normalizedEnvUrl = envSiteUrl.replace(/\/+$/, '');
    return `${normalizedEnvUrl}${AUTH_CALLBACK_PATH}`;
  }

  if (typeof window !== 'undefined') {
    return `${window.location.origin}${AUTH_CALLBACK_PATH}`;
  }

  return AUTH_CALLBACK_PATH;
};

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

  const authRedirectUrl = useMemo(() => resolveAuthRedirectUrl(), []);

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
        emailRedirectTo: authRedirectUrl,
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
        redirectTo: authRedirectUrl,
      },
    });

    if (googleError) {
      setError(googleError.message);
      setLoading(false);
    }
    // On success Supabase will redirect, so we do not reset loading state
  };

  return (
    <main className="relative min-h-screen overflow-hidden text-slate-900">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(55,15,19,0.84) 100%)',
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-1/2 -z-10 h-[160vh] -translate-y-1/2 opacity-45 blur-[240px]"
        style={{
          background:
            'radial-gradient(55% 55% at 50% 50%, rgba(142,84,64,0.75) 0%, rgba(142,84,64,0) 75%)',
        }}
      />
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-20">
        <Image
          alt=""
          src={GRID_IMAGE}
          fill
          className="object-cover opacity-80 mix-blend-multiply"
          priority
          sizes="100vw"
        />
      </div>

      <div className="relative z-30 mx-auto flex min-h-screen w-full max-w-[1440px] items-center justify-center px-6 py-24 sm:px-10">
        <div
          className="w-full max-w-md space-y-6 rounded-[34px] border border-white/20 bg-white/10 p-8 shadow-[0_20px_80px_rgba(0,0,0,0.2)] backdrop-blur-xl"
          style={{
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
          }}
        >
          <div className="flex items-center justify-start">
            <Image
              alt="Merak"
              src={LOGO_IMAGE}
              width={120}
              height={32}
              className="h-8 w-auto"
              priority
            />
          </div>
          <div className="space-y-2 text-left">
            <h1 className="text-2xl font-semibold text-white/80">{heading}</h1>
            <p className="text-sm text-white/70">{subheading}</p>
          </div>

          <form className="space-y-4" onSubmit={handleMagicLink}>
            <div className="space-y-2 text-left">
              <label className="text-sm font-medium text-white/80" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                className="w-full rounded-xl border border-white/40 bg-white/10 px-4 py-3 text-sm text-white/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.25)] placeholder:text-white/60 focus:border-black/60 focus:outline-none focus:ring-2 focus:ring-black/40 disabled:opacity-60"
                style={{
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                }}
                placeholder="you@example.com"
                autoComplete="email"
                disabled={loading}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center rounded-xl border border-white/30 bg-gradient-to-r from-[rgba(182,13,10,0.85)] to-[rgba(1,34,77,0.85)] px-4 py-3 text-sm font-medium text-white/80 shadow-[0_16px_40px_rgba(0,0,0,0.25)] transition hover:from-[rgba(182,13,10,0.95)] hover:to-[rgba(1,34,77,0.95)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:opacity-60"
            >
              {loading ? 'Sending...' : view === 'sign-in' ? 'Send magic link' : 'Send sign-up link'}
            </button>
          </form>

          <div className="relative my-4">
            <span className="absolute inset-x-0 top-1/2 -translate-y-1/2 border-t border-white/25" />
            <span className="relative mx-auto block w-fit rounded-full border border-white/10 bg-white/10 px-3 text-xs uppercase tracking-wide text-black/70">
              or
            </span>
          </div>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/30 bg-white/10 px-4 py-3 text-sm font-medium text-white/70 transition hover:border-white/50 hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:opacity-60"
            style={{
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
            }}
          >
            <span>{view === 'sign-in' ? 'Continue with Google' : 'Sign up with Google'}</span>
          </button>

          {(message || error) && (
            <div
              className={`rounded-xl border px-4 py-3 text-sm ${
                error
                  ? 'border-rose-400/70 bg-rose-500/10 text-rose-100'
                  : 'border-emerald-300/70 bg-emerald-500/10 text-emerald-100'
              }`}
            >
              {error ?? message}
            </div>
          )}

          <div className="space-y-2 text-center">
            <p className="text-xs text-white/60">
              Need help?{' '}
              <Link href="/contact" className="font-medium text-white hover:text-white/80">
                Contact support
              </Link>
              .
            </p>
            <p className="text-sm text-white/75">
              {view === 'sign-in' ? "Don't have an account?" : 'Already have an account?'}{' '}
              <button
                type="button"
                className="cursor-pointer rounded-md px-2 py-1 font-medium text-white underline decoration-white/50 transition hover:bg-white/10 hover:decoration-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                onClick={() => {
                  setView((current) => (current === 'sign-in' ? 'sign-up' : 'sign-in'));
                  setMessage(null);
                  setError(null);
                }}
                disabled={loading}
              >
                {view === 'sign-in' ? 'Create one' : 'Sign in'}
              </button>
              .
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
