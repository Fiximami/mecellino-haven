import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Packages",
};

export default function AdminPackagesPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">Packages</h2>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Configure ticket types, pricing copy, and featured flags for Visit and marketing pages.
          </p>
        </div>
        <button
          type="button"
          className="rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-90"
        >
          New package
        </button>
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        {["Day Pass", "Family Bundle", "Season Pass"].map((name) => (
          <div
            key={name}
            className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
          >
            <p className="font-semibold text-zinc-900 dark:text-white">{name}</p>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">Draft · not synced</p>
            <button
              type="button"
              className="mt-4 text-sm font-medium text-[var(--primary)] hover:underline"
            >
              Edit
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
