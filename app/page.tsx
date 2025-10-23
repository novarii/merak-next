'use client';

import type { ChangeEvent, KeyboardEvent } from 'react';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import localFont from 'next/font/local';
import { useRouter } from 'next/navigation';

const saprona = localFont({
  display: 'swap',
  variable: '--font-saprona',
  src: [
    { path: '../public/fonts/Saprona-Regular.woff2', weight: '400', style: 'normal' },
    { path: '../public/fonts/Saprona-Medium.woff2', weight: '500', style: 'normal' },
    { path: '../public/fonts/Saprona-SemiBold.woff2', weight: '600', style: 'normal' },
  ],
});

const typewriterPhrases = [
  'hire your new accountant',
  'hire your new personal assistant',
  'hire your new researcher',
  'hire your new teacher',
];
const promptPrefix = 'Ask Merak to ';
const quickLinks = ['Accountant', 'Customer Support', 'Writing Assistant', 'Researcher'];

export default function LandingPage() {
  const router = useRouter();

  return (
    <main
      className={`relative min-h-screen overflow-hidden bg-gradient-to-b from-[#fdfdfd] via-[#f7f3f1] to-[#3a3a3a] text-slate-900 ${saprona.variable}`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-40"
        style={{
          backgroundImage:
            'linear-gradient(rgba(0,0,0,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.08) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-1/3 h-[60vh] -translate-y-1/2 -z-20 opacity-50 blur-[140px]"
        style={{
          background: 'radial-gradient(50% 50% at 50% 50%, rgba(142,84,64,0.65) 0%, rgba(142,84,64,0) 70%)',
        }}
      />
      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 pb-16 pt-12 lg:px-10">
        <header className="flex items-center justify-between gap-10">
          <a href="/" className="inline-flex items-center" aria-label="Merak home">
            <Image
              alt="Merak logo"
              height={55}
              width={132}
              priority
              src="https://www.figma.com/api/mcp/asset/e234a2bc-e29a-47eb-9aa5-f20bc1047758"
            />
          </a>
          <nav
            aria-label="Primary"
            className="flex items-center gap-10 text-sm font-medium text-slate-800"
            style={{ fontFamily: 'var(--font-saprona)' }}
          >
            <a className="transition hover:text-slate-950" href="#marketplace">
              Marketplace
            </a>
            <a className="transition hover:text-slate-950" href="#about">
              About Us
            </a>
            <button
              type="button"
              className="bg-transparent p-0 text-inherit transition hover:text-slate-950 focus:outline-none"
              onClick={() => router.push('/login')}
            >
              Log In
            </button>
          </nav>
        </header>

        <section className="mt-28 flex flex-1 flex-col justify-center gap-8 pb-24 text-left md:mt-32">
          <div className="flex flex-col items-start gap-6 text-left">
            <p className="text-sm uppercase tracking-[0.35em] text-slate-700" style={{ fontFamily: 'var(--font-saprona)' }}>
              Intelligent Agents For Ambitious Teams
            </p>
            <div className="relative flex flex-col">
              <h1
                className="max-w-3xl text-[48px] font-semibold leading-[1.05] text-slate-950 md:text-[60px] lg:text-[68px]"
                style={{ fontFamily: 'var(--font-saprona)' }}
              >
                <span>The </span>
                <span
                  style={{
                    backgroundImage: 'linear-gradient(0deg, #b60d0a 15%, #01224d 72%)',
                    color: 'transparent',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Intelligent
                </span>
                <span> Layer</span>
              </h1>
            </div>
            <p className="max-w-2xl text-base text-slate-700 md:text-lg" style={{ fontFamily: 'var(--font-saprona)' }}>
              Find, compare, and connect with the tools that fit you.
            </p>
          </div>

          <div className="max-w-[680px]">
            <PromptCard />
          </div>

          <div className="mt-16 flex flex-wrap items-center gap-4">
            {quickLinks.map((label) => (
              <span
                key={label}
                className="rounded-full border border-black/60 bg-[#b76c79] px-6 py-2 text-[18px] font-medium text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.35)]"
                style={{ fontFamily: 'var(--font-saprona)' }}
              >
                {label}
              </span>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

function PromptCard() {
  const router = useRouter();
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [typedLength, setTypedLength] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [message, setMessage] = useState('');
  const currentPhrase = typewriterPhrases[phraseIndex];
  const typedPhrase = currentPhrase.slice(0, typedLength);
  const placeholder = `${promptPrefix}${typedPhrase}`;

  useEffect(() => {
    const updateSpeed = isDeleting ? 60 : 110;
    const shouldHold = !isDeleting && typedLength === currentPhrase.length;
    const holdDuration = 1400;

    const timer = window.setTimeout(() => {
      if (!isDeleting && typedLength < currentPhrase.length) {
        setTypedLength((prev) => prev + 1);
        return;
      }

      if (!isDeleting && typedLength === currentPhrase.length) {
        setIsDeleting(true);
        return;
      }

      if (isDeleting && typedLength > 0) {
        setTypedLength((prev) => prev - 1);
        return;
      }

      setIsDeleting(false);
      setPhraseIndex((prev) => (prev + 1) % typewriterPhrases.length);
    }, shouldHold ? holdDuration : updateSpeed);

    return () => window.clearTimeout(timer);
  }, [currentPhrase, isDeleting, typedLength]);

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(event.target.value);
  };

  const handleSearch = () => {
    router.push('/login');
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();

      if (message.trim()) {
        router.push('/login');
      }
    }
  };

  return (
    <div className="relative mt-14 w-full max-w-[680px] rounded-[36px] border border-black bg-white px-6 py-6 shadow-[0_24px_60px_rgba(54,17,25,0.18)] backdrop-blur-sm">
      <label className="sr-only" htmlFor="prompt-input">
        Ask Merak anything
      </label>
      <textarea
        id="prompt-input"
        className="h-32 w-full resize-none rounded-[28px] border-none bg-white px-4 pb-16 pt-3 text-left text-[18px] text-[#3a2f33] shadow-[inset_0_1px_0_rgba(255,255,255,0.5)] outline-none placeholder:text-[#7b6d71] focus:outline-none focus:ring-2 focus:ring-[#1d1d1d]/20"
        placeholder={placeholder}
        value={message}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        autoComplete="off"
        spellCheck={false}
        aria-label="Chat prompt"
        style={{ fontFamily: 'var(--font-saprona)' }}
      />
      <Link
        href="/login"
        className="absolute bottom-6 right-6 inline-flex items-center justify-center rounded-full border border-black bg-black px-5 py-2 text-sm font-medium uppercase tracking-wide text-white transition hover:bg-[#1d1d1d] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
        style={{ fontFamily: 'var(--font-saprona)' }}
        onClick={handleSearch}
      >
        Search
      </Link>
    </div>
  );
}
