import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { publicPageMetadata } from "@/lib/public-metadata";

export const metadata: Metadata = {
  ...publicPageMetadata({
    title: "Not found",
    description: "This address is not published on the public website.",
    path: "/parents",
  }),
  robots: { index: false, follow: false },
};

export default function ParentsPage() {
  notFound();
}
