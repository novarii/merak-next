"use client";

import type { ChangeEvent, KeyboardEvent } from 'react';
import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

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

const typewriterPhrases = [
  'hire your new SDR',
  'hire your new data analyst',
  'hire your new customer success agent',
  'hire your new marketing automation specialist',
];

const promptPrefix = 'Ask Merak to ';

const quickStartButtons = [
  {
    label: 'Sales Development',
    prompt: 'Find me agents that can automate outbound sales and lead qualification',
  },
  {
    label: 'Customer Support',
    prompt: 'Show me agents for automated customer support and ticketing',
  },
  {
    label: 'Data Analysis',
    prompt: 'I need agents that can analyze business data and generate reports',
  },
  {
    label: 'Content Marketing',
    prompt: 'Find agents for content creation and marketing automation',
  },
] as const;

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
      className={`relative flex size-[34px] items-center justify-center rounded-[20px] border border-white/20 shadow-[inset_0_0_2px_rgba(240,240,240,0.8)] backdrop-blur-md transition hover:border-white/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${accent ? 'bg-gradient-to-r from-[rgba(182,13,10,0.8)] to-[rgba(1,34,77,0.8)] text-white' : 'bg-white/10 text-slate-900'}`}
      style={{ WebkitBackdropFilter: 'blur(10px)' }}
      aria-label={alt}
    >
      <span className="flex h-6 w-6 items-center justify-center">
        <Image alt="" src={src} width={16} height={16} className="h-4 w-4 object-contain" />
      </span>
    </button>
  );
};

interface LandingChatboxProps {
  isAuthenticated?: boolean;
}

export const LandingChatbox = ({ isAuthenticated = false }: LandingChatboxProps) => {
  const router = useRouter();
  const [message, setMessage] = useState('');
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [typedLength, setTypedLength] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const currentPhrase = typewriterPhrases[phraseIndex];
  const typedPhrase = useMemo(
    () => currentPhrase.slice(0, typedLength),
    [currentPhrase, typedLength],
  );

  useEffect(() => {
    if (message) {
      return;
    }

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
  }, [currentPhrase, isDeleting, message, typedLength]);

  const placeholder = `${promptPrefix}${typedPhrase}`;

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(event.target.value);
  };

  const handleSubmit = () => {
    const trimmedMessage = message.trim();
    if (!trimmedMessage) {
      return;
    }

    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    const params = new URLSearchParams({ prompt: trimmedMessage });
    router.push(`/chat?${params.toString()}`);
  };

  const handleQuickPrompt = (prompt: string) => {
    setMessage(prompt);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      if (message.trim().length === 0) {
        return;
      }
      handleSubmit();
    }
  };

  return (
    <div className="relative mx-auto w-full max-w-[720px]">
      <div className="space-y-10">
        <div
          className="relative h-[192px] rounded-[34px] border border-white/20 bg-white/10 shadow-[0_20px_80px_rgba(0,0,0,0.12)]"
          style={{
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
          }}
        >
          <div className="pointer-events-none absolute inset-0 rounded-[34px] border border-white/10" />

          <label className="sr-only" htmlFor="landing-chatbox-input">
            Ask Merak anything
          </label>
          <textarea
            id="landing-chatbox-input"
            className="absolute left-8 right-8 top-6 bottom-20 resize-none border-none bg-transparent text-lg text-[#454545] outline-none placeholder:text-[#5b5b5b] focus:outline-none"
            style={{ fontFamily: 'var(--font-family-primary)' }}
            placeholder={message ? undefined : placeholder}
            value={message}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            autoComplete="off"
            spellCheck={false}
            aria-label="Chat prompt"
          />

          <div className="absolute bottom-6 left-6 flex gap-3">
            <IconButton icon="attach" />
          </div>

          <div className="absolute bottom-6 right-6 flex gap-3">
            <IconButton icon="headphones" />
            <button
              type="button"
              className="relative flex size-[34px] items-center justify-center rounded-[20px] border border-white/20 shadow-[inset_0_0_2px_rgba(240,240,240,0.8)] backdrop-blur-md transition hover:border-white/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white bg-gradient-to-r from-[rgba(182,13,10,0.8)] to-[rgba(1,34,77,0.8)] text-white"
              style={{ WebkitBackdropFilter: 'blur(10px)' }}
              aria-label="Send message"
              onClick={handleSubmit}
            >
              <span className="flex h-6 w-6 items-center justify-center">
                <Image alt="" src={ICONS.send.src} width={16} height={16} className="h-4 w-4 object-contain" />
              </span>
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 md:flex-nowrap">
          {quickStartButtons.map(({ label, prompt }) => (
            <button
              key={label}
              type="button"
              className="cursor-pointer rounded-[20px] border border-white/20 bg-white/10 px-4 py-2 text-[16px] font-medium text-[#f0f0f0] shadow-[inset_0_0_2px_rgba(240,240,240,0.8)] backdrop-blur-md transition hover:border-white/40 hover:bg-white/20 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              style={{ WebkitBackdropFilter: 'blur(10px)', fontFamily: 'var(--font-family-primary)' }}
              onClick={() => handleQuickPrompt(prompt)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
