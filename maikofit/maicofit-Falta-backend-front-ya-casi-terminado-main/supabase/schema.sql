-- MaicoFit — Esquema de base de datos (Supabase / Postgres)
-- Ejecutar completo en: Supabase Dashboard → SQL Editor → New query → Run.
-- Es idempotente: se puede correr más de una vez sin romper nada.

-- ─────────────────────────────────────────────
-- profiles: espejo de auth.users, creado por trigger
-- ─────────────────────────────────────────────
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  brevo_synced boolean not null default false,
  created_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ─────────────────────────────────────────────
-- checkouts: cada intento de compra (= "carrito")
-- El id se usa como external_reference en Mercado Pago.
-- ─────────────────────────────────────────────
create table if not exists public.checkouts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  plan_id text not null check (plan_id in ('esencial', '1a1')),
  kind text not null check (kind in ('subscription', 'one_time')),
  status text not null default 'started'
    check (status in ('started', 'pending', 'completed', 'failed', 'abandoned')),
  amount numeric not null,
  discount_applied boolean not null default false,
  mp_preference_id text,
  mp_preapproval_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists checkouts_user_idx on public.checkouts (user_id);

-- ─────────────────────────────────────────────
-- subscriptions: plan Esencial (débito automático mensual MP)
-- ─────────────────────────────────────────────
create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  checkout_id uuid references public.checkouts(id),
  mp_preapproval_id text not null unique,
  status text not null default 'pending'
    check (status in ('pending', 'authorized', 'paused', 'cancelled')),
  amount numeric,
  last_payment_at timestamptz,
  cancelled_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
-- Imposible tener dos suscripciones vivas a la vez (anti doble pago a nivel DB)
create unique index if not exists subscriptions_one_active_per_user
  on public.subscriptions (user_id)
  where (status in ('pending', 'authorized'));

-- ─────────────────────────────────────────────
-- orders: plan 1 a 1 (pago único via Checkout Pro)
-- ─────────────────────────────────────────────
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  checkout_id uuid references public.checkouts(id),
  mp_payment_id text not null unique,
  status text not null check (status in ('pending', 'approved', 'rejected', 'refunded')),
  amount numeric,
  paid_at timestamptz,
  created_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────
-- webhook_events: log + idempotencia de webhooks de MP
-- ─────────────────────────────────────────────
create table if not exists public.webhook_events (
  id bigint generated always as identity primary key,
  dedup_key text not null unique,
  type text,
  action text,
  payload jsonb,
  status text not null default 'received' check (status in ('received', 'processed', 'error')),
  error text,
  created_at timestamptz not null default now(),
  processed_at timestamptz
);

-- ─────────────────────────────────────────────
-- brevo_jobs: outbox de reintentos para llamadas a Brevo fallidas
-- ─────────────────────────────────────────────
create table if not exists public.brevo_jobs (
  id bigint generated always as identity primary key,
  kind text not null,
  payload jsonb not null,
  status text not null default 'pending' check (status in ('pending', 'sent', 'failed')),
  attempts int not null default 0,
  last_error text,
  created_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────
-- popup_leads: emails capturados por el exit popup (10% off)
-- ─────────────────────────────────────────────
create table if not exists public.popup_leads (
  id bigint generated always as identity primary key,
  email text not null unique,
  synced_to_brevo boolean not null default false,
  created_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────
-- RLS: los usuarios solo LEEN sus propias filas.
-- Toda escritura la hace el servidor con la service role key.
-- ─────────────────────────────────────────────
alter table public.profiles enable row level security;
alter table public.checkouts enable row level security;
alter table public.subscriptions enable row level security;
alter table public.orders enable row level security;
alter table public.webhook_events enable row level security;
alter table public.brevo_jobs enable row level security;
alter table public.popup_leads enable row level security;

drop policy if exists "own profile select" on public.profiles;
create policy "own profile select" on public.profiles
  for select using (auth.uid() = id);

drop policy if exists "own profile update" on public.profiles;
create policy "own profile update" on public.profiles
  for update using (auth.uid() = id);

drop policy if exists "own checkouts select" on public.checkouts;
create policy "own checkouts select" on public.checkouts
  for select using (auth.uid() = user_id);

drop policy if exists "own subscriptions select" on public.subscriptions;
create policy "own subscriptions select" on public.subscriptions
  for select using (auth.uid() = user_id);

drop policy if exists "own orders select" on public.orders;
create policy "own orders select" on public.orders
  for select using (auth.uid() = user_id);

-- webhook_events / brevo_jobs / popup_leads: RLS sin policies → solo service role.
