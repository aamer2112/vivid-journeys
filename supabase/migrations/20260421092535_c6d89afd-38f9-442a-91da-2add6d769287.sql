-- Role enum
create type public.app_role as enum ('traveler', 'business');

-- Profiles
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default 'Traveler',
  role public.app_role not null default 'traveler',
  business_name text,
  points integer not null default 0,
  prompts_used integer not null default 0,
  is_premium boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.profiles enable row level security;

create policy "Profiles readable by owner"
  on public.profiles for select
  using (auth.uid() = id);
create policy "Profiles updatable by owner"
  on public.profiles for update
  using (auth.uid() = id);
create policy "Profiles insertable by owner"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, display_name, role, business_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)),
    coalesce((new.raw_user_meta_data->>'role')::public.app_role, 'traveler'),
    new.raw_user_meta_data->>'business_name'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Trips
create table public.trips (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  destination text not null,
  start_date date,
  end_date date,
  travelers integer not null default 1,
  model_used text,
  plan jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.trips enable row level security;

create policy "Trips readable by everyone"
  on public.trips for select using (true);
create policy "Users insert own trips"
  on public.trips for insert with check (auth.uid() = user_id);
create policy "Users update own trips"
  on public.trips for update using (auth.uid() = user_id);
create policy "Users delete own trips"
  on public.trips for delete using (auth.uid() = user_id);

-- Experiences (traveler reviews for points)
create table public.experiences (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  location text not null,
  rating integer not null check (rating between 1 and 5),
  image_url text,
  notes text,
  points_awarded integer not null default 500,
  created_at timestamptz not null default now()
);
alter table public.experiences enable row level security;

create policy "Experiences readable by everyone"
  on public.experiences for select using (true);
create policy "Users insert own experiences"
  on public.experiences for insert with check (auth.uid() = user_id);
create policy "Users delete own experiences"
  on public.experiences for delete using (auth.uid() = user_id);

-- Hidden gem submissions (business owners)
create type public.gem_status as enum ('pending', 'featured');

create table public.gem_submissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  location text not null,
  category text not null default 'Experience',
  price_from text,
  image_url text,
  description text,
  status public.gem_status not null default 'featured',
  created_at timestamptz not null default now()
);
alter table public.gem_submissions enable row level security;

create policy "Gems readable by everyone"
  on public.gem_submissions for select using (true);
create policy "Business users insert own gems"
  on public.gem_submissions for insert
  with check (
    auth.uid() = user_id
    and exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'business'
    )
  );
create policy "Users update own gems"
  on public.gem_submissions for update using (auth.uid() = user_id);
create policy "Users delete own gems"
  on public.gem_submissions for delete using (auth.uid() = user_id);

-- updated_at trigger helper
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

create trigger trg_profiles_updated before update on public.profiles
  for each row execute function public.set_updated_at();
create trigger trg_trips_updated before update on public.trips
  for each row execute function public.set_updated_at();