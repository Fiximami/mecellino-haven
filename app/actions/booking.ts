"use server";

import { createClient } from "@/lib/supabase/server";
import { bookingInquirySchema, type BookingInquiryFormData } from "@/lib/validations/booking";

export type BookingSubmitState =
  | { success: true; message: string }
  | { success: false; message: string; errors?: Record<string, string[]> }
  | null;

export async function submitBookingInquiry(
  formData: BookingInquiryFormData
): Promise<BookingSubmitState> {
  const parsed = bookingInquirySchema.safeParse(formData);

  if (!parsed.success) {
    const errors: Record<string, string[]> = {};
    parsed.error.errors.forEach((err) => {
      const path = err.path[0]?.toString() ?? "form";
      if (!errors[path]) errors[path] = [];
      errors[path].push(err.message);
    });
    return {
      success: false,
      message: "Please fix the errors below.",
      errors,
    };
  }

  const data = parsed.data;

  try {
    const supabase = await createClient();
    const { error } = await supabase.from("booking_inquiries").insert({
      full_name: data.fullName.trim(),
      email: data.email.trim().toLowerCase(),
      phone: data.phone.trim(),
      booking_type: data.bookingType,
      event_date: data.eventDate,
      number_of_guests: data.numberOfGuests,
      package_name: data.packageName?.trim() || null,
      notes: data.notes?.trim() || null,
    });

    if (error) {
      console.error("Booking inquiry insert error:", error);
      return {
        success: false,
        message: "Something went wrong. Please try again or contact us directly.",
      };
    }

    return {
      success: true,
      message: "Thank you! We've received your booking inquiry and will be in touch soon.",
    };
  } catch {
    return {
      success: false,
      message: "Something went wrong. Please try again or contact us directly.",
    };
  }
}

export async function submitBookingForm(
  _prevState: BookingSubmitState,
  formData: FormData
): Promise<BookingSubmitState> {
  const fullName = (formData.get("fullName") as string) ?? "";
  const email = (formData.get("email") as string) ?? "";
  const phone = (formData.get("phone") as string) ?? "";
  const bookingType = (formData.get("bookingType") as string) ?? "";
  const eventDate = (formData.get("eventDate") as string) ?? "";
  const numberOfGuests = Number(formData.get("numberOfGuests"));
  const packageName = (formData.get("packageName") as string) ?? "";
  const notes = (formData.get("notes") as string) ?? "";

  return submitBookingInquiry({
    fullName,
    email,
    phone,
    bookingType: bookingType as BookingInquiryFormData["bookingType"],
    eventDate,
    numberOfGuests: Number.isNaN(numberOfGuests) ? 1 : numberOfGuests,
    packageName: packageName || undefined,
    notes: notes || undefined,
  });
}
