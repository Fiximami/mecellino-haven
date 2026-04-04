import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contacts",
};

export default function AdminContactsPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">Contacts</h2>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Store general contact or support messages separately from structured booking inquiries.
        </p>
      </div>
      <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="border-b border-zinc-200 px-4 py-3 dark:border-zinc-800">
          <p className="text-sm font-medium text-zinc-900 dark:text-white">Inbox</p>
        </div>
        <div className="flex min-h-[240px] items-center justify-center px-4 py-16 text-center text-sm text-zinc-500 dark:text-zinc-400">
          Add a Supabase table or form endpoint to populate this list.
        </div>
      </div>
    </div>
  );
}
