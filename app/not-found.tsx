import Image from 'next/image';
import Link from 'next/link';

import { SiteHeader } from '@/components/SiteHeader';
import { deriveAccountNavigation } from '@/lib/accountNavigation';
import { createSupabaseServerClient } from '@/lib/supabaseServerAuthClient';

const GRID_IMAGE = '/assets/landing/grid-image.svg';

export default async function NotFound() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const { accountLink, accountLabel } = deriveAccountNavigation(session);

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
      <div className="relative z-30 mx-auto flex min-h-screen w-full max-w-[1440px] flex-col px-6 pb-20 pt-10 sm:px-10">
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

        <SiteHeader accountLink={accountLink} accountLabel={accountLabel} />

        <section className="flex flex-1 flex-col items-center justify-center gap-10 text-center">
          <div className="flex max-w-3xl flex-col items-center gap-6">
            <h1
              className="text-[48px] font-semibold leading-[1.2] text-[#1d1d1d] sm:text-[56px] md:text-[60px]"
              style={{ fontFamily: 'var(--font-family-primary)' }}
            >
              Coming Soon
            </h1>
            <p
              className="text-lg text-[#5b5b5b] sm:text-xl"
              style={{ fontFamily: 'var(--font-family-primary)' }}
            >
              We&apos;re building out this experience right now. Check back soon or head to the
              Merak home page to keep exploring.
            </p>
            <div className="flex flex-col items-center gap-3 sm:flex-row">
              <Link
                href="/"
                className="rounded-full bg-[#01224d] px-6 py-3 text-base font-semibold text-white shadow-lg transition hover:bg-[#001c3f]"
                style={{ fontFamily: 'var(--font-family-primary)' }}
              >
                Go to Home
              </Link>
              <Link
                href="/chat"
                className="rounded-full border border-[#01224d] px-6 py-3 text-base font-semibold text-[#01224d] transition hover:bg-[#01224d] hover:text-white"
                style={{ fontFamily: 'var(--font-family-primary)' }}
              >
                Try the Chat
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
