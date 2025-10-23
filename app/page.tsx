'use client';

import type { ChangeEvent } from 'react';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import localFont from 'next/font/local';

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
  return (
    <div
      className={`relative flex min-h-screen flex-col overflow-hidden bg-white text-neutral-900 ${saprona.variable}`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-20 bg-gradient-to-b from-white via-[#f6f2f3] to-[#420f1a]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-30"
        style={{
          backgroundImage:
            'linear-gradient(0deg, rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
          backgroundPosition: 'center',
        }}
      />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-white/10 backdrop-blur-sm" />

      <header className="relative z-20">
        <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between px-6 py-8">
          <a href="/" className="inline-flex items-center" aria-label="Merak home">
            <Image
              alt="Merak logo"
              height={55}
              width={132}
              priority
              src="https://www.figma.com/api/mcp/asset/e234a2bc-e29a-47eb-9aa5-f20bc1047758"
            />
          </a>
          <nav aria-label="Primary">
            <ul
              className="nav__links flex items-center gap-10 text-[20px] font-semibold tracking-[0.01em] text-[#1d1d1d]"
              style={{ fontFamily: 'var(--font-saprona)' }}
            >
              <li>
                <a className="transition hover:text-[#01224d]" href="#marketplace">
                  Marketplace
                </a>
              </li>
              <li>
                <a className="transition hover:text-[#01224d]" href="#about">
                  About Us
                </a>
              </li>
              <li>
                <Link className="transition hover:text-[#01224d]" href="/login">
                  Log In
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="relative z-10 flex flex-1 flex-col">
        <section className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col items-center px-6 pb-24 pt-[54px] text-center md:pt-[54px] lg:pt-[54px]">
          <div className="flex flex-col items-center gap-6 text-center">
            <div className="relative flex flex-col items-center">
              <h1
                className="mx-auto max-w-3xl text-[48px] font-semibold leading-[1.2] text-[#1d1d1d] sm:text-[56px] md:text-[60px] lg:text-[65px]"
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
            <p
              className="max-w-[700px] text-[20px] leading-[1.35] text-[#5b5b5b] sm:text-[21px] md:text-[22px]"
              style={{ fontFamily: 'var(--font-saprona)' }}
            >
              Find, compare, and connect with the tools that fit you.
            </p>
          </div>

          <PromptCard />

          <div className="mt-16 flex flex-wrap items-center justify-center gap-4">
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
      </main>
    </div>
  );
}

function PromptCard() {
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
        autoComplete="off"
        spellCheck={false}
        aria-label="Chat prompt"
        style={{ fontFamily: 'var(--font-saprona)' }}
      />
      <Link
        href="/login"
        className="absolute bottom-6 right-6 inline-flex items-center justify-center rounded-full border border-black bg-black px-5 py-2 text-sm font-medium uppercase tracking-wide text-white transition hover:bg-[#1d1d1d] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
        style={{ fontFamily: 'var(--font-saprona)' }}
      >
        Search
      </Link>
    </div>
  );
}
