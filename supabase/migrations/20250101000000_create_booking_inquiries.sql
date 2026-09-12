-- DORMANT LEGACY TABLE. Not used by the public site.
-- This repository has no approved live enquiry collection.
-- The table must not be used for YDG intake.
-- Never reuse this table for participant, guardian, consent or safeguarding data.
-- No replacement policies are added until a separately approved role-and-scope
-- model exists.
--
-- If this historical migration was ever applied to an external database,
-- editing this source file does not remediate that database. Deployed
-- policies and privileges must be independently inspected and corrected
-- before any reuse.

create table if not exists public.booking_inquiries (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  full_name text not null,
  email text not null,
  phone text not null,
  booking_type text not null,
  event_date date not null,
  number_of_guests integer not null check (number_of_guests >= 1 and number_of_guests <= 500),
  package_name text,
  notes text,
  status text not null default 'new' check (status in ('new', 'contacted', 'confirmed', 'cancelled'))
);

alter table public.booking_inquiries enable row level security;

revoke all on table public.booking_inquiries from anon;
revoke all on table public.booking_inquiries from authenticated;

create index if not exists idx_booking_inquiries_created_at on public.booking_inquiries (created_at desc);
create index if not exists idx_booking_inquiries_event_date on public.booking_inquiries (event_date);
create index if not exists idx_booking_inquiries_status on public.booking_inquiries (status);
