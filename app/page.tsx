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
          className="pointer-events-none absolute inset-x-0 top-1/3 -z-20 h-[65vh] -translate-y-1/2 opacity-40 blur-[160px]"
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
              'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 250%)',
            WebkitMaskImage:
              'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 250%)',
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

        <section className="flex flex-1 items-center justify-center py-12">
          <div
            className="flex w-full max-w-4xl flex-col items-center gap-10 text-center"
            style={{ marginBottom: 126 }}
          >
            <div className="space-y-6">
              <div className="relative flex flex-col items-center">
                <h1
                  className="mx-auto max-w-3xl text-[48px] font-semibold leading-[1.2] text-[#1d1d1d] sm:text-[56px] md:text-[60px] lg:text-[65px]"
                  style={{ fontFamily: 'var(--font-family-primary)' }}
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
                className="mx-auto max-w-[700px] text-[20px] leading-[1.35] text-[#5b5b5b] sm:text-[21px] md:text-[22px]"
                style={{ fontFamily: 'var(--font-family-primary)' }}
              >
                Find, compare, and connect with the tools that fit you.
              </p>
            </div>

            <LandingChatbox />
          </div>
        </section>
      </div>
    </main>
  );
}
