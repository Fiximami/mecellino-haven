import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Programme modules",
};

export default function AdminPackagesPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">Programme modules</h2>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Inaccessible scaffold only. Mecellino Haven does not sell day passes, bundles or season tickets. This area
          is retained as a neutral placeholder until an approved operational module is defined.
        </p>
      </div>
      <div className="rounded-xl border border-dashed border-zinc-300 bg-zinc-50 p-8 text-sm text-zinc-600 dark:border-zinc-700 dark:bg-zinc-900/40 dark:text-zinc-400">
        No package, pass or ticket configuration is active in this milestone.
      </div>
    </div>
  );
}
