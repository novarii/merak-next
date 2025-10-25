'use client';

import Image from 'next/image';
import { FormEvent, useState } from 'react';

const GRID_IMAGE = '/assets/landing/grid-image.svg';
const LOGO_IMAGE =
  'https://www.figma.com/api/mcp/asset/9c0e4fc9-1494-4244-87af-a8e32a8991af';

export default function WaitlistPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email.trim()) {
      setError('Add your email to join the waitlist.');
      return;
    }

    setLoading(true);
    setError(null);
    setMessage(null);

    // Placeholder for future integration with marketing tooling or Supabase
    setTimeout(() => {
      setLoading(false);
      setMessage("You're on the list! We'll reach out soon.");
      setEmail('');
    }, 600);
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
          className="w-full max-w-lg space-y-6 rounded-[34px] border border-white/20 bg-white/10 p-8 shadow-[0_20px_80px_rgba(0,0,0,0.2)] backdrop-blur-xl"
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

          <div className="space-y-3 text-left text-white">
            <h1 className="text-3xl font-semibold text-white/85">Join the Merak Waitlist</h1>
            <p className="text-sm text-white/70">
              Drop your email to be the first to experience the simplest way to connect intelligence.
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2 text-left">
              <label className="text-sm font-medium text-white/80" htmlFor="waitlist-email">
                Email
              </label>
              <input
                id="waitlist-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                placeholder="you@example.com"
                className="w-full rounded-xl border border-white/40 bg-white/10 px-4 py-3 text-sm text-white/85 shadow-[inset_0_1px_0_rgba(255,255,255,0.25)] placeholder:text-white/60 focus:border-black/60 focus:outline-none focus:ring-2 focus:ring-black/40 disabled:opacity-60"
                style={{
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                }}
                disabled={loading}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center rounded-xl border border-white/30 bg-gradient-to-r from-[rgba(182,13,10,0.85)] to-[rgba(1,34,77,0.85)] px-4 py-3 text-sm font-medium text-white/85 shadow-[0_16px_40px_rgba(0,0,0,0.25)] transition hover:from-[rgba(182,13,10,0.95)] hover:to-[rgba(1,34,77,0.95)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:opacity-60"
            >
              {loading ? 'Adding…' : 'Reserve my spot'}
            </button>
          </form>

          {(message || error) && (
            <div
              className={`rounded-xl border px-4 py-3 text-sm ${
                error
                  ? 'border-rose-400/70 bg-rose-500/15 text-rose-100'
                  : 'border-emerald-300/70 bg-emerald-500/15 text-emerald-100'
              }`}
            >
              {error ?? message}
            </div>
          )}

          <p className="text-xs text-white/60">
            Want to talk sooner? Reach us at{' '}
            <a className="underline" href="mailto:team@merak.ai">
              team@merak.ai
            </a>
            .
          </p>
        </div>
      </div>
    </main>
  );
}
