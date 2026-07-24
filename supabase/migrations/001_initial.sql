-- BitkiAnaliz Pro initial schema
-- Run in Supabase SQL editor or via CLI

create extension if not exists "pgcrypto";

-- Profiles
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text not null default 'producer' check (role in ('producer', 'advisor')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Farms
create table if not exists public.farms (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  owner_id uuid not null references public.profiles(id) on delete cascade,
  location_label text,
  created_at timestamptz not null default now()
);

create table if not exists public.farm_members (
  id uuid primary key default gen_random_uuid(),
  farm_id uuid not null references public.farms(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role text not null default 'member' check (role in ('owner', 'advisor', 'member')),
  created_at timestamptz not null default now(),
  unique (farm_id, user_id)
);

-- Parcels
create table if not exists public.parcels (
  id uuid primary key default gen_random_uuid(),
  farm_id uuid not null references public.farms(id) on delete cascade,
  name text not null,
  crop text,
  area_dekar numeric(10,2),
  lat double precision,
  lon double precision,
  notes text,
  created_at timestamptz not null default now()
);

-- Disease library
create table if not exists public.diseases (
  id text primary key,
  plant text not null,
  name text not null,
  pathogen text,
  symptoms text[] not null default '{}',
  cultural_measures text[] not null default '{}',
  chemical_measures text[] not null default '{}',
  severity_scale text,
  created_at timestamptz not null default now()
);

-- Analyses
create table if not exists public.analyses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  farm_id uuid references public.farms(id) on delete set null,
  parcel_id uuid references public.parcels(id) on delete set null,
  disease_id text references public.diseases(id) on delete set null,
  plant_name text not null,
  diagnosis text not null,
  confidence numeric(5,2) not null default 0,
  severity text,
  alternatives jsonb not null default '[]',
  treatment text[] not null default '{}',
  fertilizer text[] not null default '{}',
  spray_timing text,
  weather_snapshot jsonb,
  image_path text,
  created_at timestamptz not null default now()
);

-- Applications (spray/fertilizer calendar)
create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  farm_id uuid not null references public.farms(id) on delete cascade,
  parcel_id uuid references public.parcels(id) on delete set null,
  user_id uuid not null references public.profiles(id) on delete cascade,
  item_id text,
  item_name text not null,
  active_ingredient text,
  type text not null check (type in ('GÜBRE', 'İLAÇ', 'DİĞER')),
  quantity numeric(12,3),
  unit text,
  scheduled_at timestamptz,
  applied_at timestamptz,
  status text not null default 'planned' check (status in ('planned', 'done', 'cancelled')),
  notes text,
  created_at timestamptz not null default now()
);

-- Inventory
create table if not exists public.inventory_items (
  id uuid primary key default gen_random_uuid(),
  farm_id uuid not null references public.farms(id) on delete cascade,
  item_id text,
  name text not null,
  category text not null check (category in ('GÜBRE', 'İLAÇ', 'DİĞER')),
  quantity numeric(12,3) not null default 0,
  unit text not null default 'kg',
  min_threshold numeric(12,3) not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Notifications
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  farm_id uuid references public.farms(id) on delete cascade,
  type text not null,
  title text not null,
  body text not null,
  read boolean not null default false,
  meta jsonb not null default '{}',
  created_at timestamptz not null default now()
);

-- Push subscriptions
create table if not exists public.push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  endpoint text not null unique,
  p256dh text not null,
  auth text not null,
  created_at timestamptz not null default now()
);

-- Auto profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'role', 'producer')
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Membership helper
create or replace function public.is_farm_member(fid uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.farm_members m
    where m.farm_id = fid and m.user_id = auth.uid()
  ) or exists (
    select 1 from public.farms f
    where f.id = fid and f.owner_id = auth.uid()
  );
$$;

-- RLS
alter table public.profiles enable row level security;
alter table public.farms enable row level security;
alter table public.farm_members enable row level security;
alter table public.parcels enable row level security;
alter table public.diseases enable row level security;
alter table public.analyses enable row level security;
alter table public.applications enable row level security;
alter table public.inventory_items enable row level security;
alter table public.notifications enable row level security;
alter table public.push_subscriptions enable row level security;

create policy "profiles_select_own" on public.profiles for select using (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);

create policy "farms_select_member" on public.farms for select using (public.is_farm_member(id) or owner_id = auth.uid());
create policy "farms_insert_owner" on public.farms for insert with check (owner_id = auth.uid());
create policy "farms_update_member" on public.farms for update using (public.is_farm_member(id) or owner_id = auth.uid());
create policy "farms_delete_owner" on public.farms for delete using (owner_id = auth.uid());

create policy "members_select" on public.farm_members for select using (public.is_farm_member(farm_id) or user_id = auth.uid());
create policy "members_insert" on public.farm_members for insert with check (
  exists (select 1 from public.farms f where f.id = farm_id and f.owner_id = auth.uid())
  or user_id = auth.uid()
);
create policy "members_delete" on public.farm_members for delete using (
  exists (select 1 from public.farms f where f.id = farm_id and f.owner_id = auth.uid())
  or user_id = auth.uid()
);

create policy "parcels_all_member" on public.parcels for all using (public.is_farm_member(farm_id)) with check (public.is_farm_member(farm_id));

create policy "diseases_read_all" on public.diseases for select using (true);

create policy "analyses_select" on public.analyses for select using (
  user_id = auth.uid() or (farm_id is not null and public.is_farm_member(farm_id))
);
create policy "analyses_insert" on public.analyses for insert with check (user_id = auth.uid());
create policy "analyses_update" on public.analyses for update using (user_id = auth.uid());
create policy "analyses_delete" on public.analyses for delete using (user_id = auth.uid());

create policy "applications_all" on public.applications for all using (public.is_farm_member(farm_id)) with check (public.is_farm_member(farm_id));
create policy "inventory_all" on public.inventory_items for all using (public.is_farm_member(farm_id)) with check (public.is_farm_member(farm_id));

create policy "notifications_own" on public.notifications for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "push_own" on public.push_subscriptions for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- Storage bucket for analysis images (run separately if needed)
-- insert into storage.buckets (id, name, public) values ('analyses', 'analyses', false);

-- Seed diseases
insert into public.diseases (id, plant, name, pathogen, symptoms, cultural_measures, chemical_measures, severity_scale) values
('d_tomato_blight', 'Domates', 'Erken Yanıklık', 'Alternaria solani', array['Kahverengi konsantrik lekeler', 'Yaprak sararması'], array['Enfekteli yaprakları uzaklaştırın', 'Hava sirkülasyonunu artırın'], array['Mancozeb veya klorotalonil (etiket dozunda)'], 'orta'),
('d_tomato_late_blight', 'Domates', 'Geç Yanıklık', 'Phytophthora infestans', array['Su ıslaklığı lekeleri', 'Beyaz miselyum'], array['Yağış sonrası sulamayı azaltın', 'Dirençli çeşit kullanın'], array['Metalaksil içeren fungisitler'], 'yüksek'),
('d_powdery_mildew', 'Genel', 'Külleme', 'Erysiphales', array['Beyaz unsu örtü', 'Yaprak kıvrılması'], array['Gölgeyi azaltın', 'Aşırı azottan kaçının'], array['Kükürt veya triadimenol'], 'orta'),
('d_downy_mildew', 'Genel', 'Mildiyö', 'Peronosporaceae', array['Yağlı lekeler', 'Alt yüzde beyazımsı spor'], array['Sabah sulayın', 'Sık ekimden kaçının'], array['Bakırlı preparatlar'], 'yüksek'),
('d_aphid', 'Genel', 'Yaprak Biti', 'Aphidoidea', array['Yaprak kıvrılması', 'Balımsı madde'], array['Doğal düşmanları koruyun', 'Yabancı ot temizliği'], array['Imidacloprid / sabunlu su (düşük basınç)'], 'düşük'),
('d_spider_mite', 'Genel', 'Kırmızı Örümcek', 'Tetranychidae', array['Sarı benekler', 'İnce ağ'], array['Nem artırın', 'Tozlanmayı azaltın'], array['Abamectin'], 'orta'),
('d_iron_def', 'Genel', 'Demir Eksikliği', 'Besin', array['Kloroz (damarlar yeşil)'], array['pH 6-7 aralığına getirin'], array['Demir şelat yaprak uygulaması'], 'düşük'),
('d_n_def', 'Genel', 'Azot Eksikliği', 'Besin', array['Eski yapraklarda sararma'], array['Organik madde ekleyin'], array['Üre veya amonyum sülfat'], 'orta'),
('d_apple_scab', 'Elma', 'Karaleke', 'Venturia inaequalis', array['Zeytin yeşili lekeler', 'Meyvede çatlak'], array['Dökülen yaprakları toplayın'], array['Kaptan / difenokonazol'], 'yüksek'),
('d_grape_powdery', 'Üzüm', 'Bağ Küllemesi', 'Erysiphe necator', array['Beyaz unsu örtü', 'Tane çatlaması'], array['Sürgün seyreltme'], array['Kükürt / tebuconazole'], 'yüksek')
on conflict (id) do nothing;
