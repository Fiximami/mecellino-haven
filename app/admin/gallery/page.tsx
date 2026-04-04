import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gallery",
};

export default function AdminGalleryPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">Gallery</h2>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Organize media for the public gallery and homepage preview grid.
          </p>
        </div>
        <button
          type="button"
          className="rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-90"
        >
          Upload images
        </button>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="aspect-square rounded-lg border border-dashed border-zinc-300 bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800"
            aria-hidden
          />
        ))}
      </div>
      <p className="text-center text-sm text-zinc-500 dark:text-zinc-400">
        Connect Supabase Storage or your CDN to replace placeholders with real assets.
      </p>
    </div>
  );
}
