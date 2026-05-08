
-- Create prospects table for client acquisition
create table if not exists public.prospects (
    id uuid default gen_random_uuid() primary key,
    name text not null,
    niche text,
    region text,
    country text,
    website text,
    phone text,
    address text,
    rating int default 0, -- 0 to 5, representing tech quality (lower is better for us)
    status text default 'new', -- new, contacted, interested, converted, discarded
    metadata jsonb default '{}'::jsonb,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.prospects enable row level security;

-- Admin policies
create policy "Admins can do everything on prospects"
on public.prospects
for all
to authenticated
using (
  exists (
    select 1 from public.profiles
    where profiles.id = auth.uid()
    and profiles.role = 'admin'
  )
)
with check (
  exists (
    select 1 from public.profiles
    where profiles.id = auth.uid()
    and profiles.role = 'admin'
  )
);

-- Updated_at trigger
create or replace function public.handle_updated_at()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

create trigger set_prospects_updated_at
    before update on public.prospects
    for each row
    execute function public.handle_updated_at();
