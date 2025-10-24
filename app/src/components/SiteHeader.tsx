'use client';

import Image from 'next/image';
import Link from 'next/link';

const LOGO_IMAGE =
  'https://www.figma.com/api/mcp/asset/9c0e4fc9-1494-4244-87af-a8e32a8991af';

interface SiteHeaderProps {
  accountLink: string;
  accountLabel: string;
  className?: string;
}

export function SiteHeader({ accountLink, accountLabel, className }: SiteHeaderProps) {
  return (
    <header className={`flex items-center justify-between py-4 md:py-6 ${className ?? ''}`}>
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
        <Link className="transition hover:text-slate-950" href={accountLink}>
          {accountLabel}
        </Link>
      </nav>
    </header>
  );
}
