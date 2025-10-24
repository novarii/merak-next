import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabaseServerAuthClient';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next') ?? '/';

  if (!code) {
    return NextResponse.redirect(new URL('/login?error=missing_code', request.url));
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error('Supabase session exchange failed', error);
    return NextResponse.redirect(new URL('/login?error=auth_callback', request.url));
  }

  const normalizedNext = next.startsWith('/') ? next : '/';
  const redirectUrl = new URL(normalizedNext, requestUrl.origin);

  return NextResponse.redirect(redirectUrl);
}
