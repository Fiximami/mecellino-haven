import type { Metadata } from "next";
import { AdminDashboardLayout } from "@/components/admin";

export const metadata: Metadata = {
  title: {
    default: "Dashboard",
    template: "%s | Admin | Mecellino Haven",
  },
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <AdminDashboardLayout>{children}</AdminDashboardLayout>;
}
