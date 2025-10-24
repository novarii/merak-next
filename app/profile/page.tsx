import { redirect } from 'next/navigation';

import { createSupabaseServerClient } from '@/lib/supabaseServerAuthClient';

export default async function ProfilePage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-6 py-24 text-slate-900">
      <div className="w-full max-w-lg space-y-6 rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">Profile</h1>
          <p className="text-sm text-slate-500">Signed in as {user.email ?? 'your account'}.</p>
        </div>
        <p className="text-sm text-slate-500">
          This page is a placeholder. Add account management features here to let users review their
          plan, update credentials, or manage billing.
        </p>
      </div>
    </main>
  );
}
