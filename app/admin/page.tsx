import { AdminSectionCard } from "@/components/admin/AdminSectionCard";
import { AdminSummaryCard } from "@/components/admin/AdminSummaryCard";

export default function AdminDashboardPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-10">
      <div>
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Overview</h2>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Inaccessible admin scaffold only. Public routes remain information-plus-demonstration; no live intake is
          enabled.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <AdminSummaryCard label="Enquiry demonstrations" value="—" hint="Not connected" />
        <AdminSummaryCard label="Contact messages" value="—" hint="Not connected" />
        <AdminSummaryCard label="Programme records" value="—" hint="Not connected" />
        <AdminSummaryCard label="Media library" value="—" hint="Not connected" />
      </div>

      <div>
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Sections</h2>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Reserved module placeholders. All `/admin/*` routes return 404 on the public site.
        </p>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <li>
            <AdminSectionCard
              title="Enquiries"
              description="Future operational review area for approved programme enquiries only."
              href="/admin/bookings"
              badge="Reserved"
            />
          </li>
          <li>
            <AdminSectionCard
              title="Contacts"
              description="Future general message review area when a monitored channel is approved."
              href="/admin/contacts"
            />
          </li>
          <li>
            <AdminSectionCard
              title="Programme content"
              description="Future editorial module for approved public programme pages."
              href="/admin/attractions"
            />
          </li>
          <li>
            <AdminSectionCard
              title="Programme modules"
              description="Neutral placeholder only. No passes, bundles or ticket products are configured."
              href="/admin/packages"
            />
          </li>
          <li>
            <AdminSectionCard
              title="Media library"
              description="Future approved media management when verified assets exist."
              href="/admin/gallery"
            />
          </li>
        </ul>
      </div>
    </div>
  );
}
