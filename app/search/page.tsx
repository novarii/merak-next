export default function SearchPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 text-white">
      <div className="w-full max-w-xl space-y-4 rounded-3xl border border-white/10 bg-slate-900/80 p-10 text-center shadow-2xl">
        <p className="text-xs uppercase tracking-[0.4em] text-emerald-300/80">Merak Search</p>
        <h1 className="text-3xl font-semibold text-white">Your research workspace</h1>
        <p className="text-sm text-slate-300">
          This is a placeholder for the authenticated search experience. Once Supabase authentication
          is fully wired and agent search is implemented, this screen will populate with live results.
        </p>
      </div>
    </div>
  );
}
