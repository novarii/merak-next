import Image from 'next/image';
import Link from 'next/link';

import { LandingChatbox } from '@/components/LandingChatbox';

const GRID_IMAGE = '/assets/landing/grid-image.svg';
const LOGO_IMAGE =
  'https://www.figma.com/api/mcp/asset/9c0e4fc9-1494-4244-87af-a8e32a8991af';

export default function LandingPage() {
  return (
    <main className="relative min-h-screen overflow-hidden text-slate-900">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            'linear-gradient(180deg, #ffffff 0%, #ffffff 37.019%, rgba(55,15,19,0.77) 100%)',
        }}
      />
      <div className="relative z-30 mx-auto flex min-h-screen w-full max-w-[1440px] flex-col px-6 pb-16 pt-10 sm:px-10">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-1/3 -z-20 h-[65vh] -translate-y-1/2 opacity-60 blur-[160px]"
          style={{
            background:
              'radial-gradient(50% 50% at 50% 50%, rgba(142,84,64,0.65) 0%, rgba(142,84,64,0) 70%)',
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            maskImage:
              'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 180%)',
            WebkitMaskImage:
              'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 180%)',
          }}
        >
          <Image
            alt=""
            src={GRID_IMAGE}
            fill
            className="opacity-80 mix-blend-multiply object-cover"
            priority
            sizes="100vw"
          />
        </div>

        <header className="flex items-center justify-between py-4 md:py-6">
          <Link href="/" className="flex items-center" aria-label="Merak home">
            <Image
              alt="Merak"
              src={LOGO_IMAGE}
              width={132}
              height={54}
              className="h-[54px] w-[132px] object-contain"
              priority
            />
          </Link>
          <nav className="flex items-center gap-6 text-base font-semibold text-[#1d1d1d] sm:gap-10 sm:text-xl">
            <Link className="transition hover:text-slate-950" href="/marketplace">
              Marketplace
            </Link>
            <Link className="transition hover:text-slate-950" href="/about">
              About Us
            </Link>
            <Link className="transition hover:text-slate-950" href="/login">
              Log In
            </Link>
          </nav>
        </header>

        <section className="flex flex-1 items-center py-12">
          <div className="grid w-full gap-12 lg:grid-cols-[minmax(0,1fr)_520px] lg:items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-3 rounded-full border border-white/40 bg-white/20 px-6 py-2 text-sm uppercase tracking-[0.3em] text-[#1d1d1d] shadow-sm backdrop-blur">
                <span>Marketing Copilot</span>
              </div>
              <h1
                className="max-w-2xl text-[#1d1d1d]"
                style={{
                  fontSize: 'var(--font-size-h1)',
                  lineHeight: 1.05,
                }}
              >
                Find the marketing experts you need, in seconds.
              </h1>
              <p
                className="max-w-xl text-[#454545]"
                style={{ fontSize: 'var(--font-size-body)', lineHeight: 1.5 }}
              >
                Chat with Merak to spin up entire campaigns, source vetted specialists, and manage
                every deliverable without leaving the conversation.
              </p>
            </div>

            <div className="flex justify-center lg:justify-end">
              <LandingChatbox />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
