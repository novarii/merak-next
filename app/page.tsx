'use client';

import { ChatKitPanel } from '@/components/ChatKitPanel';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-200">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl gap-6 px-6 py-10">
        {/* Left Column: ChatKit */}
        <aside className="w-full max-w-md flex-none">
          <div className="sticky top-10 h-[88vh] overflow-hidden rounded-3xl border border-slate-200/60 bg-white shadow-xl ring-1 ring-slate-200/60">
            <ChatKitPanel />
          </div>
        </aside>

        {/* Right Column: Your Future Listings */}
        <main className="flex-1">
          <header className="mb-8">
            <h1 className="text-3xl font-semibold text-slate-900">Your Listings</h1>
            <p className="mt-2 text-sm text-slate-600">
              Content will appear here
            </p>
          </header>

          {/* Placeholder for your listings */}
          <div className="rounded-3xl border border-slate-200/60 bg-white/75 p-8 shadow-lg">
            <p className="text-center text-slate-500">
              Your listings will appear here
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}