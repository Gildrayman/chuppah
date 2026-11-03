-- =============================================================
-- חופה: סכמת מסד הנתונים (Supabase / PostgreSQL)
-- להרצה פעם אחת ב-Supabase: SQL Editor > New query > Run
-- =============================================================

create extension if not exists pgcrypto;

-- ---------- אירוע (חתונה) ----------
create table if not exists public.events (
  id              uuid primary key default gen_random_uuid(),
  created_by      uuid not null default auth.uid() references auth.users(id) on delete cascade,
  groom           text not null default '',
  bride           text not null default '',
  date            date,
  time            text not null default '19:30',
  venue           text not null default '',
  address         text not null default '',
  budget          numeric not null default 0,
  guest_quota     integer not null default 0,
  price_per_plate numeric not null default 0,
  min_plates      integer not null default 0,
  avg_gift        numeric not null default 0,
  pending_rate    integer not null default 75 check (pending_rate between 0 and 100),
  invite_text     text not null default '',
  sample          boolean not null default false,
  budget_plans    jsonb not null default '{}'::jsonb,   -- {"קטגוריה": סכום}
  pledges         jsonb not null default '{}'::jsonb,   -- {"couple":..,"bride_p":..,"groom_p":..}
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- ---------- חברי אירוע והרשאות ----------
create table if not exists public.event_members (
  event_id   uuid not null references public.events(id) on delete cascade,
  user_id    uuid not null references auth.users(id) on delete cascade,
  role       text not null default 'editor' check (role in ('owner','editor','viewer')),
  email      text,
  created_at timestamptz not null default now(),
  primary key (event_id, user_id)
);

create table if not exists public.event_invites (
  id         uuid primary key default gen_random_uuid(),
  event_id   uuid not null references public.events(id) on delete cascade,
  email      text not null,
  role       text not null default 'editor' check (role in ('editor','viewer')),
  invited_by uuid default auth.uid() references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  unique (event_id, email)
);

-- ---------- מוזמנים ----------
create table if not exists public.guests (
  id           text primary key,
  event_id     uuid not null references public.events(id) on delete cascade,
  name         text not null,
  phone        text not null default '',
  side         text not null default 'shared' check (side in ('groom','bride','shared')),
  grp          text not null default '',
  invited      integer not null default 1 check (invited >= 0),
  status       text not null default 'pending' check (status in ('pending','yes','maybe','no')),
  coming       integer,
  priority     text not null default 'A' check (priority in ('A','B','C')),
  meal         text not null default 'רגיל',
  table_id     text,                       -- מזהה שולחן (seating_tables.id)
  arrived      boolean not null default false,
  sent_at      date,
  reminders    integer not null default 0,
  notes        text not null default '',
  gift_type    text not null default '',
  gift_amount  numeric not null default 0,
  gift_note    text not null default '',
  gift_thanked boolean not null default false,
  updated_at   timestamptz not null default now()
);
create index if not exists guests_event_idx on public.guests(event_id);

-- ---------- שולחנות ----------
create table if not exists public.seating_tables (
  id         text primary key,
  event_id   uuid not null references public.events(id) on delete cascade,
  name       text not null,
  seats      integer not null default 12 check (seats >= 0),
  updated_at timestamptz not null default now()
);
create index if not exists tables_event_idx on public.seating_tables(event_id);

-- ---------- ספקים, חוזים ותשלומים ----------
create table if not exists public.vendors (
  id              text primary key,
  event_id        uuid not null references public.events(id) on delete cascade,
  name            text not null,
  cat             text not null default 'שונות',
  status          text not null default 'lead' check (status in ('lead','offer','closed','rejected')),
  price           numeric not null default 0,
  contact         text not null default '',
  phone           text not null default '',
  notes           text not null default '',
  contract_signed boolean not null default false,
  contract_checks jsonb not null default '{}'::jsonb,
  updated_at      timestamptz not null default now()
);
create index if not exists vendors_event_idx on public.vendors(event_id);

create table if not exists public.vendor_payments (
  id         text primary key,
  event_id   uuid not null references public.events(id) on delete cascade,
  vendor_id  text not null references public.vendors(id) on delete cascade,
  label      text not null default 'תשלום',
  amount     numeric not null default 0,
  due        date,
  paid       boolean not null default false,
  payer      text not null default '' check (payer in ('','couple','bride_p','groom_p')),
  updated_at timestamptz not null default now()
);
create index if not exists payments_event_idx on public.vendor_payments(event_id);

-- ---------- הוצאות נוספות ----------
create table if not exists public.expenses (
  id         text primary key,
  event_id   uuid not null references public.events(id) on delete cascade,
  title      text not null,
  cat        text not null default 'שונות',
  amount     numeric not null default 0,
  paid       boolean not null default false,
  payer      text not null default '' check (payer in ('','couple','bride_p','groom_p')),
  updated_at timestamptz not null default now()
);
create index if not exists expenses_event_idx on public.expenses(event_id);

-- ---------- משימות ----------
create table if not exists public.tasks (
  id          text primary key,
  event_id    uuid not null references public.events(id) on delete cascade,
  phase       text not null default 'כללי',
  title       text not null,
  days_before integer,                     -- ימים לפני החתונה (שלילי = אחרי)
  due         date,                        -- תאריך יעד ידני, גובר על days_before
  done        boolean not null default false,
  owner       text not null default '',
  updated_at  timestamptz not null default now()
);
create index if not exists tasks_event_idx on public.tasks(event_id);

-- ---------- לו"ז יום האירוע ----------
create table if not exists public.schedule_items (
  id         text primary key,
  event_id   uuid not null references public.events(id) on delete cascade,
  time       text not null,
  title      text not null,
  owner      text not null default '',
  updated_at timestamptz not null default now()
);
create index if not exists schedule_event_idx on public.schedule_items(event_id);

-- =============================================================
-- פונקציות עזר להרשאות (security definer כדי להימנע מרקורסיה ב-RLS)
-- =============================================================
create or replace function public.is_member(eid uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from event_members where event_id = eid and user_id = auth.uid());
$$;

create or replace function public.can_edit(eid uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from event_members where event_id = eid and user_id = auth.uid() and role in ('owner','editor'));
$$;

create or replace function public.is_owner(eid uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from event_members where event_id = eid and user_id = auth.uid() and role = 'owner');
$$;

-- מי שיוצר אירוע הופך לבעלים שלו
create or replace function public.add_owner_on_event() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into event_members(event_id, user_id, role, email)
  values (new.id, new.created_by, 'owner', (select email from auth.users where id = new.created_by))
  on conflict do nothing;
  return new;
end $$;
drop trigger if exists trg_add_owner on public.events;
create trigger trg_add_owner after insert on public.events
  for each row execute function public.add_owner_on_event();

-- משתמש שהוזמן במייל מקבל גישה כשהוא מתחבר
create or replace function public.claim_invites() returns integer
language plpgsql security definer set search_path = public as $$
declare n integer;
begin
  insert into event_members(event_id, user_id, role, email)
  select i.event_id, auth.uid(), i.role, lower(auth.email())
  from event_invites i where lower(i.email) = lower(auth.email())
  on conflict (event_id, user_id) do nothing;
  get diagnostics n = row_count;
  delete from event_invites where lower(email) = lower(auth.email());
  return n;
end $$;

-- updated_at אוטומטי
create or replace function public.touch_updated_at() returns trigger
language plpgsql as $$ begin new.updated_at = now(); return new; end $$;
do $$
declare t text;
begin
  foreach t in array array['events','guests','seating_tables','vendors','vendor_payments','expenses','tasks','schedule_items'] loop
    execute format('drop trigger if exists trg_touch on public.%I', t);
    execute format('create trigger trg_touch before update on public.%I for each row execute function public.touch_updated_at()', t);
  end loop;
end $$;

-- =============================================================
-- Row Level Security
-- =============================================================
alter table public.events         enable row level security;
alter table public.event_members  enable row level security;
alter table public.event_invites  enable row level security;

drop policy if exists ev_select on public.events;
drop policy if exists ev_insert on public.events;
drop policy if exists ev_update on public.events;
drop policy if exists ev_delete on public.events;
create policy ev_select on public.events for select using (is_member(id) or created_by = auth.uid());
create policy ev_insert on public.events for insert with check (created_by = auth.uid());
create policy ev_update on public.events for update using (can_edit(id)) with check (can_edit(id));
create policy ev_delete on public.events for delete using (is_owner(id));

drop policy if exists mem_select on public.event_members;
drop policy if exists mem_owner on public.event_members;
create policy mem_select on public.event_members for select using (is_member(event_id));
create policy mem_owner  on public.event_members for all using (is_owner(event_id)) with check (is_owner(event_id));

drop policy if exists inv_select on public.event_invites;
drop policy if exists inv_owner on public.event_invites;
create policy inv_select on public.event_invites for select using (is_member(event_id));
create policy inv_owner  on public.event_invites for all using (is_owner(event_id)) with check (is_owner(event_id));

do $$
declare t text;
begin
  foreach t in array array['guests','seating_tables','vendors','vendor_payments','expenses','tasks','schedule_items'] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('drop policy if exists p_select on public.%I', t);
    execute format('drop policy if exists p_write on public.%I', t);
    execute format('create policy p_select on public.%I for select using (is_member(event_id))', t);
    execute format('create policy p_write on public.%I for all using (can_edit(event_id)) with check (can_edit(event_id))', t);
  end loop;
end $$;

-- =============================================================
-- סנכרון בזמן אמת
-- =============================================================
do $$
declare t text;
begin
  foreach t in array array['events','guests','seating_tables','vendors','vendor_payments','expenses','tasks','schedule_items'] loop
    begin
      execute format('alter publication supabase_realtime add table public.%I', t);
    exception when duplicate_object then null;
    end;
  end loop;
end $$;
