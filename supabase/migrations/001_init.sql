-- BitkiAnaliz Pro schema
create extension if not exists "pgcrypto";

create type user_role as enum ('producer', 'advisor');
create type app_item_type as enum ('GUBRE', 'ILAC', 'DIGER');
create type notif_type as enum ('weather', 'stock', 'schedule', 'system');
create type severity_level as enum ('low', 'medium', 'high', 'critical');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role user_role not null default 'producer',
  created_at timestamptz not null default now()
);

create table public.farms (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  owner_id uuid not null references public.profiles(id) on delete cascade,
  location_label text,
  created_at timestamptz not null default now()
);

create table public.farm_members (
  id uuid primary key default gen_random_uuid(),
  farm_id uuid not null references public.farms(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role user_role not null default 'advisor',
  unique (farm_id, user_id)
);

create table public.parcels (
  id uuid primary key default gen_random_uuid(),
  farm_id uuid not null references public.farms(id) on delete cascade,
  name text not null,
  crop text,
  area_dekar numeric(10,2) default 0,
  lat double precision,
  lon double precision,
  notes text,
  created_at timestamptz not null default now()
);

create table public.diseases (
  id text primary key,
  plant text not null,
  name text not null,
  pathogen text,
  symptoms text[] not null default '{}',
  cultural_measures text[] not null default '{}',
  chemical_measures text[] not null default '{}',
  severity_hint severity_level default 'medium'
);

create table public.analyses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  farm_id uuid references public.farms(id) on delete set null,
  parcel_id uuid references public.parcels(id) on delete set null,
  image_path text,
  plant_name text,
  diagnosis text,
  confidence numeric(5,2),
  severity severity_level,
  disease_id text references public.diseases(id),
  alternatives jsonb default '[]',
  treatment jsonb default '[]',
  fertilizer jsonb default '[]',
  weather_snapshot jsonb,
  spray_timing_note text,
  created_at timestamptz not null default now()
);

create table public.applications (
  id uuid primary key default gen_random_uuid(),
  farm_id uuid not null references public.farms(id) on delete cascade,
  parcel_id uuid references public.parcels(id) on delete set null,
  user_id uuid not null references public.profiles(id) on delete cascade,
  item_id text,
  item_name text not null,
  active_ingredient text,
  type app_item_type not null default 'DIGER',
  quantity numeric(12,3),
  unit text,
  scheduled_at timestamptz,
  applied_at timestamptz,
  notes text,
  created_at timestamptz not null default now()
);

create table public.inventory_items (
  id uuid primary key default gen_random_uuid(),
  farm_id uuid not null references public.farms(id) on delete cascade,
  item_id text,
  name text not null,
  type app_item_type not null default 'DIGER',
  quantity numeric(12,3) not null default 0,
  unit text not null default 'kg',
  min_threshold numeric(12,3) not null default 0,
  updated_at timestamptz not null default now()
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  farm_id uuid references public.farms(id) on delete cascade,
  type notif_type not null default 'system',
  title text not null,
  body text not null,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

-- Helper: farms accessible to current user
create or replace function public.user_farm_ids()
returns setof uuid
language sql
stable
security definer
set search_path = public
as $$
  select id from farms where owner_id = auth.uid()
  union
  select farm_id from farm_members where user_id = auth.uid();
$$;

alter table public.profiles enable row level security;
alter table public.farms enable row level security;
alter table public.farm_members enable row level security;
alter table public.parcels enable row level security;
alter table public.analyses enable row level security;
alter table public.applications enable row level security;
alter table public.inventory_items enable row level security;
alter table public.notifications enable row level security;
alter table public.diseases enable row level security;

create policy profiles_self on public.profiles for all using (id = auth.uid()) with check (id = auth.uid());
create policy farms_access on public.farms for all using (id in (select public.user_farm_ids())) with check (owner_id = auth.uid());
create policy farm_members_access on public.farm_members for all using (farm_id in (select public.user_farm_ids()));
create policy parcels_access on public.parcels for all using (farm_id in (select public.user_farm_ids()));
create policy analyses_access on public.analyses for all using (farm_id in (select public.user_farm_ids()) or user_id = auth.uid());
create policy applications_access on public.applications for all using (farm_id in (select public.user_farm_ids()));
create policy inventory_access on public.inventory_items for all using (farm_id in (select public.user_farm_ids()));
create policy notifications_self on public.notifications for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy diseases_read on public.diseases for select using (true);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.email),
    coalesce((new.raw_user_meta_data->>'role')::user_role, 'producer')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

insert into storage.buckets (id, name, public) values ('analysis-images', 'analysis-images', false)
on conflict (id) do nothing;
