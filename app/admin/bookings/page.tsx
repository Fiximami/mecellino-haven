import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Enquiries",
};

export default function AdminBookingsPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">Enquiries</h2>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Inaccessible scaffold only. The public enquiry form is a demonstration and does not transmit or store data.
          No booking or reservation workflow is active.
        </p>
      </div>
      <div className="overflow-hidden rounded-xl border border-dashed border-zinc-300 bg-zinc-50 shadow-sm dark:border-zinc-700 dark:bg-zinc-900/40">
        <div className="flex min-h-[240px] items-center justify-center px-4 py-16 text-center text-sm text-zinc-500 dark:text-zinc-400">
          No operational enquiry queue is connected in this milestone.
        </div>
      </div>
    </div>
  );
}
