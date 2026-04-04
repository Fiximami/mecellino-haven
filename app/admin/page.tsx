import { AdminSectionCard } from "@/components/admin/AdminSectionCard";
import { AdminSummaryCard } from "@/components/admin/AdminSummaryCard";

export default function AdminDashboardPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-10">
      <div>
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Overview</h2>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Snapshot of activity across Mecellino Haven. Connect Supabase to show live data.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <AdminSummaryCard label="Booking inquiries" value="—" hint="Last 30 days" />
        <AdminSummaryCard label="Contact messages" value="—" hint="Awaiting reply" />
        <AdminSummaryCard label="Attractions listed" value="—" hint="Published" />
        <AdminSummaryCard label="Gallery items" value="—" hint="In media library" />
      </div>

      <div>
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Sections</h2>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Manage content and operational areas from each module.
        </p>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <li>
            <AdminSectionCard
              title="Bookings"
              description="Review booking inquiries, statuses, and follow-ups from the public form."
              href="/admin/bookings"
              badge="CRM"
            />
          </li>
          <li>
            <AdminSectionCard
              title="Contacts"
              description="General contact messages and guest communication in one place."
              href="/admin/contacts"
            />
          </li>
          <li>
            <AdminSectionCard
              title="Attractions"
              description="Edit rides, play zones, and featured listings for the public site."
              href="/admin/attractions"
            />
          </li>
          <li>
            <AdminSectionCard
              title="Packages"
              description="Day passes, bundles, and season offerings shown on Visit and marketing pages."
              href="/admin/packages"
            />
          </li>
          <li>
            <AdminSectionCard
              title="Gallery"
              description="Upload, tag, and order photos for the gallery and homepage previews."
              href="/admin/gallery"
            />
          </li>
        </ul>
      </div>
    </div>
  );
}
