import { redirect } from 'next/navigation';

import { createSupabaseServerClient } from '@/lib/supabaseServerAuthClient';

import { SignOutButton } from './SignOutButton';

export default async function ProfilePage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-24">
      <SignOutButton />
    </main>
  );
}
