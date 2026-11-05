-- אישור הגעה עצמי של מוזמנים דרך קישור אישי (בלי התחברות).
-- כל מוזמן מקבל rsvp_token אקראי. הדף rsvp.html קורא ומעדכן רק דרך שתי הפונקציות האלו.
alter table public.guests add column if not exists rsvp_token text not null default '';
alter table public.guests add column if not exists rsvp_at timestamptz;
create unique index if not exists guests_rsvp_token_idx on public.guests(rsvp_token) where rsvp_token <> '';

create or replace function public.rsvp_get(k text) returns json
language sql stable security definer set search_path = public as $$
  select json_build_object(
    'first', coalesce(nullif(g.first_name,''), g.name), 'invited', g.invited, 'status', g.status,
    'coming', g.coming, 'meal', g.meal, 'answered', g.rsvp_at,
    'groom', e.groom, 'bride', e.bride, 'date', e.date, 'time', e.time, 'venue', e.venue, 'address', e.address)
  from public.guests g join public.events e on e.id = g.event_id
  where length(k) >= 16 and g.rsvp_token = k
$$;

create or replace function public.rsvp_submit(k text, st text, n integer, ml text) returns boolean
language plpgsql security definer set search_path = public as $$
declare cnt integer;
begin
  if length(k) < 16 or st not in ('yes','no','maybe') then return false; end if;
  update public.guests set
    status = st,
    coming = case when st = 'yes' then greatest(1, least(coalesce(n, invited), 6)) when st = 'no' then 0 else null end,
    meal = case when ml in ('רגיל','צמחוני','טבעוני','ללא גלוטן','ילדים') then ml else meal end,
    table_id = case when st = 'no' then null else table_id end,
    rsvp_at = now(), updated_at = now()
  where rsvp_token = k;
  get diagnostics cnt = row_count;
  return cnt = 1;
end $$;

revoke all on function public.rsvp_get(text) from public;
revoke all on function public.rsvp_submit(text, text, integer, text) from public;
grant execute on function public.rsvp_get(text) to anon, authenticated;
grant execute on function public.rsvp_submit(text, text, integer, text) to anon, authenticated;

-- מתנות: פרטי ביט/פייבוקס של הזוג, נוסח הודעת יום האירוע, ודיווח עצמי של מוזמן על מתנה
alter table public.events add column if not exists gift_bit text not null default '';
alter table public.events add column if not exists gift_paybox text not null default '';
alter table public.events add column if not exists dayof_text text not null default '';
alter table public.guests add column if not exists gift_reported_at timestamptz;

create or replace function public.rsvp_get(k text) returns json
language sql stable security definer set search_path = public as $$
  select json_build_object(
    'first', coalesce(nullif(g.first_name,''), g.name), 'invited', g.invited, 'status', g.status,
    'coming', g.coming, 'meal', g.meal, 'answered', g.rsvp_at,
    'gift_reported', g.gift_reported_at, 'gift_amount', g.gift_amount,
    'groom', e.groom, 'bride', e.bride, 'date', e.date, 'time', e.time, 'venue', e.venue, 'address', e.address,
    'bit', e.gift_bit, 'paybox', e.gift_paybox)
  from public.guests g join public.events e on e.id = g.event_id
  where length(k) >= 16 and g.rsvp_token = k
$$;

create or replace function public.gift_report(k text, amt numeric, method text, note text) returns boolean
language plpgsql security definer set search_path = public as $$
declare cnt integer;
begin
  if length(k) < 16 or amt is null or amt <= 0 or amt > 100000 then return false; end if;
  update public.guests set
    gift_type = case when method in ('ביט / פייבוקס','העברה בנקאית','מזומן','צ''ק','שובר','מתנה') then method else 'ביט / פייבוקס' end,
    gift_amount = round(amt),
    gift_note = left(trim(coalesce(note,'')), 500),
    gift_reported_at = now(), updated_at = now()
  where rsvp_token = k;
  get diagnostics cnt = row_count;
  return cnt = 1;
end $$;
revoke all on function public.gift_report(text, numeric, text, text) from public;
grant execute on function public.gift_report(text, numeric, text, text) to anon, authenticated;

-- טאב הודעות למוזמנים: נוסחי ההודעות, ומי מקבל מתנות בביט/פייבוקס
alter table public.events add column if not exists msg_texts jsonb not null default '{}'::jsonb;
alter table public.events add column if not exists gift_people jsonb not null default '[]'::jsonb;
alter table public.guests add column if not exists gift_to text not null default '';

create or replace function public.rsvp_get(k text) returns json
language sql stable security definer set search_path = public as $$
  select json_build_object(
    'first', coalesce(nullif(g.first_name,''), g.name), 'invited', g.invited, 'status', g.status,
    'coming', g.coming, 'meal', g.meal, 'answered', g.rsvp_at,
    'gift_reported', g.gift_reported_at, 'gift_amount', g.gift_amount,
    'groom', e.groom, 'bride', e.bride, 'date', e.date, 'time', e.time, 'venue', e.venue, 'address', e.address,
    'paybox', e.gift_paybox, 'people', e.gift_people)
  from public.guests g join public.events e on e.id = g.event_id
  where length(k) >= 16 and g.rsvp_token = k
$$;

create or replace function public.gift_report(k text, amt numeric, method text, note text, p_to text) returns boolean
language plpgsql security definer set search_path = public as $$
declare cnt integer;
begin
  if length(k) < 16 or amt is null or amt <= 0 or amt > 100000 then return false; end if;
  update public.guests set
    gift_type = case when method in ('ביט','פייבוקס','העברה בנקאית') then method else 'ביט' end,
    gift_to = left(trim(coalesce(p_to,'')), 60),
    gift_amount = round(amt),
    gift_note = left(trim(coalesce(note,'')), 500),
    gift_reported_at = now(), updated_at = now()
  where rsvp_token = k;
  get diagnostics cnt = row_count;
  return cnt = 1;
end $$;
revoke all on function public.gift_report(text, numeric, text, text, text) from public;
grant execute on function public.gift_report(text, numeric, text, text, text) to anon, authenticated;
