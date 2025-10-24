import Image from 'next/image';

const ICONS = {
  attach: {
    src: '/assets/landing/shadow-overlay.svg',
    alt: 'Attach file',
  },
  headphones: {
    src: '/assets/landing/headphone-icon.svg',
    alt: 'Toggle voice input',
  },
  send: {
    src: '/assets/landing/send-icon.svg',
    alt: 'Send message',
  },
} as const;

type IconKey = keyof typeof ICONS;

interface IconButtonProps {
  icon: IconKey;
  accent?: boolean;
}

const IconButton = ({ icon, accent = false }: IconButtonProps) => {
  const { src, alt } = ICONS[icon];

  return (
    <button
      type="button"
      className={`relative flex size-[34px] items-center justify-center rounded-[20px] border border-white/20 p-1.5 shadow-[inset_0_0_2px_rgba(240,240,240,0.8)] backdrop-blur-md transition hover:border-white/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${accent ? 'bg-gradient-to-r from-[rgba(182,13,10,0.8)] to-[rgba(1,34,77,0.8)] text-white' : 'bg-white/10 text-slate-900'}`}
      style={{ WebkitBackdropFilter: 'blur(10px)' }}
      aria-label={alt}
    >
      <Image alt="" src={src} width={24} height={24} />
    </button>
  );
};

export const LandingChatbox = () => {
  return (
    <div className="relative mx-auto w-full max-w-[720px]">
      <div
        className="relative h-[192px] rounded-[34px] border border-white/20 bg-white/10 shadow-[0_20px_80px_rgba(0,0,0,0.12)]"
        style={{
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
        }}
      >
        <div className="pointer-events-none absolute inset-0 rounded-[34px] border border-white/10" />

        <p className="absolute left-8 right-8 top-8 text-lg text-[#454545]">
          Ask Merak to hire you your new accountant...
        </p>

        <div className="absolute bottom-6 left-6 flex gap-3">
          <IconButton icon="attach" />
        </div>

        <div className="absolute bottom-6 right-6 flex gap-3">
          <IconButton icon="headphones" />
          <IconButton icon="send" accent />
        </div>
      </div>
    </div>
  );
};

