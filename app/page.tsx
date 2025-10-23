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
          <img
            alt=""
            src={GRID_IMAGE}
            className="h-full w-full object-cover opacity-80 mix-blend-multiply"
            loading="lazy"
          />
        </div>

        <header className="flex items-center justify-between py-4 md:py-6">
          <a href="/" className="flex items-center">
            <img
              alt="Merak"
              src={LOGO_IMAGE}
              className="h-[54px] w-[132px] object-contain"
              loading="lazy"
            />
          </a>
          <nav className="flex items-center gap-6 text-base font-semibold text-[#1d1d1d] sm:gap-10 sm:text-xl">
            <a className="transition hover:text-slate-950" href="/marketplace">
              Marketplace
            </a>
            <a className="transition hover:text-slate-950" href="/about">
              About Us
            </a>
            <a className="transition hover:text-slate-950" href="/login">
              Log In
            </a>
          </nav>
        </header>

        <div className="flex-1" />
      </div>
    </main>
  );
}
