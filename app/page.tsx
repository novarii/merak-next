'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LandingPage() {
  const router = useRouter();
  const [message, setMessage] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    router.push('/login');
  };

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-slate-950 text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.25),_transparent_55%)]" />

      <header className="relative border-b border-white/10">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
          <div className="flex items-center gap-3 text-sm font-semibold tracking-wide uppercase text-white/80">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-400/20 text-emerald-200">
              M
            </span>
            Merak
          </div>
          <nav aria-label="Primary navigation">
            <ul className="flex items-center gap-6 text-sm text-slate-200">
              <li>
                <a className="transition hover:text-white" href="#marketplace">
                  Marketplace
                </a>
              </li>
              <li>
                <a className="transition hover:text-white" href="#about">
                  About Us
                </a>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => router.push('/login')}
                  className="rounded-full border border-white/15 px-3 py-1.5 text-sm font-medium text-white transition hover:border-white/40 hover:bg-white/5"
                >
                  Log In
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="relative flex flex-1 flex-col">
        <section className="mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center gap-16 px-6 py-16 lg:flex-row lg:items-center">
          <div className="space-y-8 text-center lg:basis-1/2 lg:text-left">
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
              <span className="block text-slate-200">The</span>
              <span className="block bg-gradient-to-r from-emerald-300 via-emerald-200 to-white bg-clip-text text-transparent">
                Intelligent
              </span>
              <span className="block text-slate-200">Layer</span>
            </h1>
            <p className="text-lg text-slate-300">
              Find, compare, and connect with the AI-native tools that fit you. Build your adaptive
              research stack in minutes.
            </p>
            <div className="flex flex-wrap gap-3 text-sm text-slate-400">
              <span className="rounded-full border border-white/10 px-4 py-2">Curated agents</span>
              <span className="rounded-full border border-white/10 px-4 py-2">
                Intelligent comparison
              </span>
              <span className="rounded-full border border-white/10 px-4 py-2">Instant insights</span>
            </div>
          </div>

          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-900/60 p-6 shadow-2xl backdrop-blur">
            <header className="space-y-1 border-b border-white/10 pb-4">
              <p className="text-xs uppercase tracking-[0.4em] text-emerald-300/80">
                Discover Answers
              </p>
              <h2 className="text-lg font-semibold text-white">Preview the Merak chat</h2>
              <p className="text-sm text-slate-400">
                Try a sample query and we&apos;ll guide you to sign in before showing personalized
                results.
              </p>
            </header>

            <div className="mt-4 space-y-3">
              <div className="rounded-2xl border border-white/5 bg-slate-950/40 p-4 text-sm text-slate-400">
                <p className="font-medium text-slate-200">Agent Assist</p>
                <p className="mt-2 text-slate-400">
                  Ask about integrations, pricing, or best-fit workflows. We&apos;ll route you to the
                  right tools.
                </p>
              </div>

              <form className="space-y-3" onSubmit={handleSubmit}>
                <label className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Sample Prompt
                </label>
                <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                  <textarea
                    className="min-h-[96px] w-full resize-none border-0 bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-0"
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    placeholder="“I need an agent that can monitor my competitor’s launch plans and push updates into Notion.”"
                  />
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>{message.length} / 240</span>
                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 rounded-full bg-emerald-400 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-emerald-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-200"
                    >
                      Search
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
