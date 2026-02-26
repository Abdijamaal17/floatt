-- ═══════════════════════════════════════════════════════════════════════════
-- Floatt — Database Schema
-- Run this in Supabase SQL editor (Dashboard > SQL Editor > New Query)
-- ═══════════════════════════════════════════════════════════════════════════

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ─── users ───────────────────────────────────────────────────────────────────
-- Extends Supabase auth.users with app-level profile data
create table if not exists public.users (
  id                     uuid primary key references auth.users(id) on delete cascade,
  email                  text not null,
  plan                   text not null default 'free' check (plan in ('free', 'pro', 'business', 'agency')),
  stripe_customer_id     text,
  stripe_subscription_id text,
  -- Legal acceptance tracking (required before any scan or subscription)
  terms_accepted         boolean not null default false,
  terms_accepted_at      timestamptz,
  terms_version          text,
  terms_ip               text,
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now()
);

-- ─── domains ─────────────────────────────────────────────────────────────────
create table if not exists public.domains (
  id                   uuid primary key default uuid_generate_v4(),
  user_id              uuid not null references public.users(id) on delete cascade,
  domain               text not null,
  verified             boolean not null default false,
  verification_token   text not null,
  verification_method  text check (verification_method in ('dns', 'file', null)),
  verified_at          timestamptz,
  -- Authorization declaration (what the user claims at domain-add time)
  authorization_type   text check (authorization_type in ('owned', 'authorized')),
  authorized_by        text, -- name of owner/org when authorization_type = 'authorized'
  created_at           timestamptz not null default now(),
  -- A user cannot add the same domain twice
  unique (user_id, domain)
);

-- ─── scans ───────────────────────────────────────────────────────────────────
create table if not exists public.scans (
  id             uuid primary key default uuid_generate_v4(),
  domain_id      uuid not null references public.domains(id) on delete cascade,
  user_id        uuid not null references public.users(id) on delete cascade,
  started_at     timestamptz not null default now(),
  completed_at   timestamptz,
  status         text not null default 'running' check (status in ('running', 'completed', 'failed')),
  findings       jsonb,
  ai_report      jsonb,
  security_score integer check (security_score between 0 and 100)
);

-- ─── scan_authorizations ─────────────────────────────────────────────────────
-- Immutable audit trail — one record per scan trigger proving user consent.
-- Never deleted — retained for legal compliance.
create table if not exists public.scan_authorizations (
  id                      uuid primary key default uuid_generate_v4(),
  user_id                 uuid not null references public.users(id) on delete cascade,
  domain_id               uuid not null references public.domains(id) on delete cascade,
  scan_id                 uuid not null references public.scans(id) on delete cascade,
  confirmed_at            timestamptz not null default now(),
  ip_address              text,
  user_agent              text,
  authorization_statement text not null
);

-- ─── alerts ──────────────────────────────────────────────────────────────────
create table if not exists public.alerts (
  id         uuid primary key default uuid_generate_v4(),
  user_id    uuid not null references public.users(id) on delete cascade,
  domain_id  uuid not null references public.domains(id) on delete cascade,
  scan_id    uuid not null references public.scans(id) on delete cascade,
  type       text not null check (type in ('critical_finding', 'high_finding', 'weekly_digest', 'verification_confirmed')),
  sent_at    timestamptz not null default now()
);

-- ─── Row Level Security ───────────────────────────────────────────────────────
alter table public.users               enable row level security;
alter table public.domains             enable row level security;
alter table public.scans               enable row level security;
alter table public.scan_authorizations enable row level security;
alter table public.alerts              enable row level security;

-- users: only the owner
create policy "users_select_own" on public.users for select using (auth.uid() = id);
create policy "users_insert_own" on public.users for insert with check (auth.uid() = id);
create policy "users_update_own" on public.users for update using (auth.uid() = id);

-- domains: only the owner
create policy "domains_select_own" on public.domains for select using (auth.uid() = user_id);
create policy "domains_insert_own" on public.domains for insert with check (auth.uid() = user_id);
create policy "domains_update_own" on public.domains for update using (auth.uid() = user_id);
create policy "domains_delete_own" on public.domains for delete using (auth.uid() = user_id);

-- scans: only the owner (read/insert only — updates done via admin client)
create policy "scans_select_own" on public.scans for select using (auth.uid() = user_id);
create policy "scans_insert_own" on public.scans for insert with check (auth.uid() = user_id);

-- scan_authorizations: only the owner can view their own records
create policy "scan_auth_select_own" on public.scan_authorizations for select using (auth.uid() = user_id);

-- alerts: only the owner
create policy "alerts_select_own" on public.alerts for select using (auth.uid() = user_id);

-- ─── Trigger: create user profile on signup ───────────────────────────────────
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ─── Indexes ─────────────────────────────────────────────────────────────────
create index if not exists domains_user_id_idx      on public.domains(user_id);
create index if not exists scans_domain_id_idx      on public.scans(domain_id);
create index if not exists scans_user_id_idx        on public.scans(user_id);
create index if not exists scans_started_at_idx     on public.scans(started_at desc);
create index if not exists alerts_user_id_idx       on public.alerts(user_id);
create index if not exists scan_auth_scan_id_idx    on public.scan_authorizations(scan_id);
create index if not exists scan_auth_user_id_idx    on public.scan_authorizations(user_id);
