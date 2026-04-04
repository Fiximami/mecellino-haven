import Link from "next/link";

type AdminSectionCardProps = {
  title: string;
  description: string;
  href: string;
  badge?: string;
};

export function AdminSectionCard({
  title,
  description,
  href,
  badge,
}: AdminSectionCardProps) {
  return (
    <Link
      href={href}
      className="group flex flex-col rounded-xl border border-zinc-200 bg-white p-5 shadow-sm transition-all hover:border-[var(--primary)]/30 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
    >
      <div className="flex items-start justify-between gap-2">
        <h2 className="text-base font-semibold text-zinc-900 dark:text-white">{title}</h2>
        {badge && (
          <span className="shrink-0 rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
            {badge}
          </span>
        )}
      </div>
      <p className="mt-2 flex-1 text-sm text-zinc-600 dark:text-zinc-400">{description}</p>
      <span className="mt-4 text-sm font-medium text-[var(--primary)] group-hover:underline">
        Open section →
      </span>
    </Link>
  );
}
