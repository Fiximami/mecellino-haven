"use client";

import { useState } from "react";
import { useActionState } from "react";
import { submitBookingForm, type BookingSubmitState } from "@/app/actions/booking";
import {
  BOOKING_TYPES,
  bookingInquirySchema,
  type BookingInquiryFormData,
} from "@/lib/validations/booking";
import { cn } from "@/lib/utils";

function getFieldErrors(formData: FormData): Record<string, string[]> {
  const obj: Record<string, unknown> = {};
  formData.forEach((value, key) => {
    if (key === "numberOfGuests") {
      const n = Number(value);
      obj[key] = Number.isNaN(n) ? value : n;
    } else {
      obj[key] = value;
    }
  });
  const parsed = bookingInquirySchema.safeParse(obj);
  if (parsed.success) return {};
  const errors: Record<string, string[]> = {};
  parsed.error.errors.forEach((err) => {
    const path = err.path[0]?.toString() ?? "form";
    if (!errors[path]) errors[path] = [];
    errors[path].push(err.message);
  });
  return errors;
}

export function BookingInquiryForm() {
  const [state, formAction, isPending] = useActionState<BookingSubmitState, FormData>(
    submitBookingForm,
    null
  );

  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFieldErrors({});
    const form = e.currentTarget;
    const formData = new FormData(form);
    const errors = getFieldErrors(formData);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    formAction(formData);
  };

  const errors =
    state?.success === false && state.errors
      ? { ...fieldErrors, ...state.errors }
      : fieldErrors;
  const success = state?.success === true;

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-6 sm:grid-cols-2 sm:gap-8"
      noValidate
    >
      <div className="sm:col-span-2">
        <label
          htmlFor="fullName"
          className="mb-1.5 block text-sm font-medium text-[var(--foreground)]"
        >
          Full name <span className="text-red-500">*</span>
        </label>
        <input
          id="fullName"
          name="fullName"
          type="text"
          autoComplete="name"
          required
          disabled={success}
          className={cn(
            "w-full rounded-lg border bg-[var(--card)] px-4 py-3 text-[var(--foreground)] shadow-[var(--shadow-sm)] transition-colors placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] disabled:opacity-60",
            errors.fullName ? "border-red-500" : "border-[var(--border)]"
          )}
          placeholder="Jane Smith"
        />
        {errors.fullName && (
          <p className="mt-1.5 text-sm text-red-500">{errors.fullName[0]}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="email"
          className="mb-1.5 block text-sm font-medium text-[var(--foreground)]"
        >
          Email <span className="text-red-500">*</span>
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          disabled={success}
          className={cn(
            "w-full rounded-lg border bg-[var(--card)] px-4 py-3 text-[var(--foreground)] shadow-[var(--shadow-sm)] transition-colors placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] disabled:opacity-60",
            errors.email ? "border-red-500" : "border-[var(--border)]"
          )}
          placeholder="jane@example.com"
        />
        {errors.email && (
          <p className="mt-1.5 text-sm text-red-500">{errors.email[0]}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="phone"
          className="mb-1.5 block text-sm font-medium text-[var(--foreground)]"
        >
          Phone number <span className="text-red-500">*</span>
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          required
          disabled={success}
          className={cn(
            "w-full rounded-lg border bg-[var(--card)] px-4 py-3 text-[var(--foreground)] shadow-[var(--shadow-sm)] transition-colors placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] disabled:opacity-60",
            errors.phone ? "border-red-500" : "border-[var(--border)]"
          )}
          placeholder="+1 (555) 123-4567"
        />
        {errors.phone && (
          <p className="mt-1.5 text-sm text-red-500">{errors.phone[0]}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="bookingType"
          className="mb-1.5 block text-sm font-medium text-[var(--foreground)]"
        >
          Booking type <span className="text-red-500">*</span>
        </label>
        <select
          id="bookingType"
          name="bookingType"
          required
          disabled={success}
          className={cn(
            "w-full rounded-lg border bg-[var(--card)] px-4 py-3 text-[var(--foreground)] shadow-[var(--shadow-sm)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--primary)] disabled:opacity-60",
            errors.bookingType ? "border-red-500" : "border-[var(--border)]"
          )}
        >
          <option value="">Select type</option>
          {BOOKING_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        {errors.bookingType && (
          <p className="mt-1.5 text-sm text-red-500">{errors.bookingType[0]}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="eventDate"
          className="mb-1.5 block text-sm font-medium text-[var(--foreground)]"
        >
          Event date <span className="text-red-500">*</span>
        </label>
        <input
          id="eventDate"
          name="eventDate"
          type="date"
          required
          disabled={success}
          className={cn(
            "w-full rounded-lg border bg-[var(--card)] px-4 py-3 text-[var(--foreground)] shadow-[var(--shadow-sm)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--primary)] disabled:opacity-60",
            errors.eventDate ? "border-red-500" : "border-[var(--border)]"
          )}
        />
        {errors.eventDate && (
          <p className="mt-1.5 text-sm text-red-500">{errors.eventDate[0]}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="numberOfGuests"
          className="mb-1.5 block text-sm font-medium text-[var(--foreground)]"
        >
          Number of guests <span className="text-red-500">*</span>
        </label>
        <input
          id="numberOfGuests"
          name="numberOfGuests"
          type="number"
          min={1}
          max={500}
          defaultValue={1}
          disabled={success}
          className={cn(
            "w-full rounded-lg border bg-[var(--card)] px-4 py-3 text-[var(--foreground)] shadow-[var(--shadow-sm)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--primary)] disabled:opacity-60",
            errors.numberOfGuests ? "border-red-500" : "border-[var(--border)]"
          )}
        />
        {errors.numberOfGuests && (
          <p className="mt-1.5 text-sm text-red-500">{errors.numberOfGuests[0]}</p>
        )}
      </div>

      <div className="sm:col-span-2">
        <label
          htmlFor="packageName"
          className="mb-1.5 block text-sm font-medium text-[var(--foreground)]"
        >
          Package name
        </label>
        <input
          id="packageName"
          name="packageName"
          type="text"
          disabled={success}
          className={cn(
            "w-full rounded-lg border bg-[var(--card)] px-4 py-3 text-[var(--foreground)] shadow-[var(--shadow-sm)] transition-colors placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] disabled:opacity-60",
            errors.packageName ? "border-red-500" : "border-[var(--border)]"
          )}
          placeholder="e.g. Family Bundle, Day Pass"
        />
        {errors.packageName && (
          <p className="mt-1.5 text-sm text-red-500">{errors.packageName[0]}</p>
        )}
      </div>

      <div className="sm:col-span-2">
        <label
          htmlFor="notes"
          className="mb-1.5 block text-sm font-medium text-[var(--foreground)]"
        >
          Notes
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={4}
          disabled={success}
          className={cn(
            "w-full resize-y rounded-lg border bg-[var(--card)] px-4 py-3 text-[var(--foreground)] shadow-[var(--shadow-sm)] transition-colors placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] disabled:opacity-60",
            errors.notes ? "border-red-500" : "border-[var(--border)]"
          )}
          placeholder="Special requests, dietary needs, accessibility requirements, etc."
        />
        {errors.notes && (
          <p className="mt-1.5 text-sm text-red-500">{errors.notes[0]}</p>
        )}
      </div>

      {state?.message && (
        <p
          className={cn(
            "sm:col-span-2 rounded-lg px-4 py-3 text-sm",
            state.success
              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
              : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
          )}
        >
          {state.message}
        </p>
      )}

      <div className="sm:col-span-2">
        <button
          type="submit"
          disabled={isPending || success}
          className="w-full rounded-full bg-[var(--primary)] px-6 py-3.5 text-sm font-semibold text-[var(--primary-foreground)] shadow-[var(--shadow-md)] transition-opacity hover:opacity-90 disabled:opacity-60 sm:w-auto sm:min-w-[180px]"
        >
          {isPending ? "Sending…" : success ? "Submitted" : "Submit inquiry"}
        </button>
      </div>
    </form>
  );
}
