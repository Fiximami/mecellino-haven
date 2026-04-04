import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bookings",
};

export default function AdminBookingsPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">Bookings</h2>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Inquiries from the booking form. Wire this table to <code className="rounded bg-zinc-100 px-1 py-0.5 text-xs dark:bg-zinc-800">booking_inquiries</code> in Supabase.
          </p>
        </div>
        <button
          type="button"
          className="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 shadow-sm hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
        >
          Export CSV
        </button>
      </div>
      <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="border-b border-zinc-200 px-4 py-3 dark:border-zinc-800">
          <p className="text-sm font-medium text-zinc-900 dark:text-white">All inquiries</p>
        </div>
        <div className="flex min-h-[240px] items-center justify-center px-4 py-16 text-center text-sm text-zinc-500 dark:text-zinc-400">
          No rows yet. Submissions will appear here after you connect the data layer.
        </div>
      </div>
    </div>
  );
}
