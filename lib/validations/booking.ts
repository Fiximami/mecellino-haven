import { z } from "zod";

export const BOOKING_TYPES = [
  "Day Visit",
  "Birthday Party",
  "Group Event",
  "School Trip",
  "Other",
] as const;

export const bookingInquirySchema = z.object({
  fullName: z
    .string()
    .min(1, "Full name is required")
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name must be 100 characters or less"),
  email: z.string().min(1, "Email is required").email("Please enter a valid email"),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^[\d\s\-+()]{10,20}$/, "Please enter a valid phone number (10–20 digits)"),
  bookingType: z.enum(BOOKING_TYPES, {
    required_error: "Please select a booking type",
  }),
  eventDate: z
    .string()
    .min(1, "Event date is required")
    .refine((s) => !Number.isNaN(Date.parse(s)), "Please enter a valid date"),
  numberOfGuests: z
    .number({ invalid_type_error: "Please enter a number" })
    .int("Must be a whole number")
    .min(1, "At least 1 guest required")
    .max(500, "Maximum 500 guests"),
  packageName: z.string().max(100).optional().or(z.literal("")),
  notes: z.string().max(1000).optional().or(z.literal("")),
});

export type BookingInquiryFormData = z.infer<typeof bookingInquirySchema>;
