import { BookingInquiryForm } from "@/components/booking";

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-[var(--foreground)]">
          Booking inquiry
        </h1>
        <p className="mt-2 text-[var(--muted)]">
          Tell us about your visit and we&apos;ll get back to you as soon as we can.
        </p>
      </div>
      <div className="rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--card)] p-6 shadow-[var(--shadow-sm)] sm:p-8">
        <BookingInquiryForm />
      </div>
    </div>
  );
}
