-- 20250808_ad_signal_schema.sql
create table if not exists competitors (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  website text,
  industry text,
  locations jsonb default '[]'::jsonb,
  created_at timestamptz default now()
);

create table if not exists ads (
  id uuid primary key default gen_random_uuid(),
  platform text not null,
  competitor_id uuid references competitors(id) on delete set null,
  creative_url text,
  creative_type text,
  headline text,
  primary_text text,
  cta text,
  first_seen timestamptz,
  last_seen timestamptz,
  active boolean default false,
  metrics jsonb,
  raw_source jsonb,
  created_at timestamptz default now()
);

create index if not exists ads_platform_idx on ads(platform);
create index if not exists ads_competitor_idx on ads(competitor_id);
create index if not exists ads_first_seen_idx on ads(first_seen);
create index if not exists ads_last_seen_idx on ads(last_seen);
create index if not exists ads_active_idx on ads(active);

create table if not exists searches (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  filters jsonb not null,
  created_at timestamptz default now()
);

create table if not exists exports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  filters jsonb not null,
  type text not null,
  status text default 'completed',
  file_url text,
  created_at timestamptz default now()
);
