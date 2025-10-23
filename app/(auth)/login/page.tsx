'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import localFont from 'next/font/local';
import { useRouter } from 'next/navigation';
import { getSupabaseBrowserClient } from '@/lib/supabaseBrowser';

type AuthMode = 'login' | 'register';

const saprona = localFont({
  display: 'swap',
  variable: '--font-saprona',
  src: [
    { path: '../../../public/fonts/Saprona-Regular.woff2', weight: '400', style: 'normal' },
    { path: '../../../public/fonts/Saprona-Medium.woff2', weight: '500', style: 'normal' },
    { path: '../../../public/fonts/Saprona-SemiBold.woff2', weight: '600', style: 'normal' },
  ],
});

const socialButtons = [
  {
    id: 'google',
    label: 'Continue with Google',
    icon: 'https://www.figma.com/api/mcp/asset/b6d62e65-506a-440c-af33-8128bc26d10d',
  },
  {
    id: 'facebook',
    label: 'Continue with Facebook',
    icon: 'https://www.figma.com/api/mcp/asset/69b8cc24-309e-49a5-b15e-a5e77427b30d',
  },
  {
    id: 'email',
    label: 'Continue with email',
    icon: 'https://www.figma.com/api/mcp/asset/108facf8-4a9a-4ad6-a04d-b5f337cfe60a',
  },
];

export default function LoginPage() {
  const router = useRouter();
  const emailInputRef = useRef<HTMLInputElement | null>(null);
  const [mode, setMode] = useState<AuthMode>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();

    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        router.replace('/search');
      }
    });
  }, [router]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const supabase = getSupabaseBrowserClient();
    const formData = new FormData(event.currentTarget);
    const email = (formData.get('email') as string)?.trim();
    const password = (formData.get('password') as string) ?? '';

    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }

    setError(null);
    setStatus(null);
    setLoading(true);

    try {
      if (mode === 'login') {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

        if (signInError) {
          setError(signInError.message);
          return;
        }

        router.push('/search');
        return;
      }

      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/search`,
        },
      });

      if (signUpError) {
        setError(signUpError.message);
        return;
      }

      if (data.session) {
        router.push('/search');
        return;
      }

      setStatus('Check your email to confirm your account. You will be redirected after verification.');
    } catch (authError) {
      const message =
        authError instanceof Error ? authError.message : 'Unable to complete the request.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-white text-[#1d1d1d] ${saprona.variable}`}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-30 bg-gradient-to-b from-white to-[rgba(55,15,19,0.84)]"
      />
      <Image
        alt=""
        aria-hidden="true"
        fill
        className="pointer-events-none absolute inset-0 -z-20 object-cover opacity-70"
        priority
        src="https://www.figma.com/api/mcp/asset/15aa20e7-b1cd-4d1c-b0ab-df06a70992f6"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-white/20 backdrop-blur-sm"
        style={{
          boxShadow: 'inset 0 0 2px 0 rgba(240, 240, 240, 1)',
        }}
      />

      <main className="relative z-10 w-full px-4 py-16 sm:px-6 lg:px-8">
        <section className="mx-auto w-full max-w-[592px]">
          <div className="relative overflow-hidden rounded-[30px] border border-white/90 bg-white/70 p-8 shadow-[0px_32px_80px_rgba(29,29,29,0.18)] backdrop-blur-[10px] sm:p-10">
            <div className="relative flex flex-col gap-6">
              <Image
                alt="Merak"
                height={45}
                priority
                src="https://www.figma.com/api/mcp/asset/910a3995-3c24-4507-9287-1c2a1d13aef2"
                width={109}
              />

              <div className="space-y-3" style={{ fontFamily: 'var(--font-saprona)' }}>
                <p className="text-[24px] font-semibold leading-tight text-black">
                  Log in or sign up in seconds
                </p>
                <p className="text-[18px] text-black">
                  Use your email or another service to continue with Merak (it’s free)!
                </p>
              </div>

              <div className="flex flex-col gap-3">
                {socialButtons.map((button) => (
                  <button
                    key={button.id}
                    type="button"
                    className="flex w-full items-center gap-6 rounded-[15px] border border-[#1d1d1d] bg-white px-5 py-3 text-left text-[20px] font-semibold text-black transition hover:-translate-y-[1px] hover:bg-[#f9f4f4]"
                    disabled={button.id !== 'email'}
                    aria-disabled={button.id !== 'email'}
                    title={button.id === 'email' ? undefined : 'Coming soon'}
                    onClick={() => {
                      if (button.id === 'email') {
                        emailInputRef.current?.focus();
                      }
                    }}
                  >
                    <span className="relative flex size-10 items-center justify-center">
                      <Image alt="" height={36} src={button.icon} width={36} />
                    </span>
                    {button.label}
                  </button>
                ))}
              </div>

              <form className="mt-2 space-y-5" onSubmit={handleSubmit}>
                <div className="space-y-2 text-[18px]" style={{ fontFamily: 'var(--font-saprona)' }}>
                  <label className="block font-medium text-[#1d1d1d]" htmlFor="email">
                    Email
                  </label>
                  <input
                    ref={emailInputRef}
                    className="w-full rounded-[15px] border border-[#1d1d1d] bg-white px-4 py-3 text-[16px] text-[#1d1d1d] placeholder:text-[#7b7b7b] focus:border-[#1d1d1d] focus:outline-none focus:ring-2 focus:ring-[#1d1d1d]/15"
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="you@example.com"
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2 text-[18px]" style={{ fontFamily: 'var(--font-saprona)' }}>
                  <label className="block font-medium text-[#1d1d1d]" htmlFor="password">
                    Password
                  </label>
                  <input
                    className="w-full rounded-[15px] border border-[#1d1d1d] bg-white px-4 py-3 text-[16px] text-[#1d1d1d] placeholder:text-[#7b7b7b] focus:border-[#1d1d1d] focus:outline-none focus:ring-2 focus:ring-[#1d1d1d]/15"
                    id="password"
                    name="password"
                    type="password"
                    autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                    minLength={6}
                    required
                    placeholder="Enter a secure password"
                    disabled={loading}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-[15px] bg-[#1d1d1d] px-6 py-3 text-[18px] font-semibold text-white transition hover:bg-[#242424] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1d1d1d]/60 disabled:cursor-not-allowed disabled:opacity-70"
                  disabled={loading}
                >
                  {loading ? 'Please wait…' : mode === 'login' ? 'Log In' : 'Create Account'}
                </button>
              </form>

              <p
                className="text-center text-[16px] text-[#1d1d1d]/80"
                style={{ fontFamily: 'var(--font-saprona)' }}
              >
                {mode === 'login' ? 'New to Merak?' : 'Already have an account?'}{' '}
                <button
                  type="button"
                  className="underline-offset-4 hover:underline"
                  onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                >
                  {mode === 'login' ? 'Create one' : 'Log in instead'}
                </button>
              </p>

              {error ? (
                <p className="rounded-[15px] border border-rose-400/40 bg-rose-500/10 px-4 py-3 text-[16px] text-rose-600">
                  {error}
                </p>
              ) : null}

              {status ? (
                <p className="rounded-[15px] border border-emerald-400/40 bg-emerald-500/10 px-4 py-3 text-[16px] text-emerald-700">
                  {status}
                </p>
              ) : null}

              <p
                className="text-[16px] text-[#1d1d1d]"
                style={{ fontFamily: 'var(--font-saprona)' }}
              >
                By continuing, you agree to Merak’s Terms of Use. Read our Privacy Policy.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
