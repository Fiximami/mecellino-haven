import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Attractions",
};

export default function AdminAttractionsPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">Attractions</h2>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Manage attraction names, descriptions, images, and display order for the public site.
          </p>
        </div>
        <button
          type="button"
          className="rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-90"
        >
          Add attraction
        </button>
      </div>
      <div className="overflow-hidden rounded-xl border border-dashed border-zinc-300 bg-zinc-50/50 dark:border-zinc-700 dark:bg-zinc-900/50">
        <div className="flex min-h-[280px] items-center justify-center px-4 py-16 text-center text-sm text-zinc-500 dark:text-zinc-400">
          Content editor placeholder. Back with a CMS or Supabase collection when ready.
        </div>
      </div>
    </div>
  );
}
