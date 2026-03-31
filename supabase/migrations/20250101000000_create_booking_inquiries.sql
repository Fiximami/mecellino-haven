-- Booking inquiry submissions from the website form
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

-- Enable RLS; allow anonymous insert for the form, restrict read/update to authenticated users or service role
alter table public.booking_inquiries enable row level security;

-- Allow anyone to insert (form submission)
create policy "Allow anonymous insert for booking inquiries"
  on public.booking_inquiries
  for insert
  to anon
  with check (true);

-- Restrict select/update/delete to authenticated users (or add a role later)
create policy "Allow authenticated read and update"
  on public.booking_inquiries
  for all
  to authenticated
  using (true)
  with check (true);

-- Optional: index for admin dashboards
create index if not exists idx_booking_inquiries_created_at on public.booking_inquiries (created_at desc);
create index if not exists idx_booking_inquiries_event_date on public.booking_inquiries (event_date);
create index if not exists idx_booking_inquiries_status on public.booking_inquiries (status);
