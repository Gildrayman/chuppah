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
    coming = case when st = 'yes' then greatest(1, least(coalesce(n, invited), 30)) when st = 'no' then 0 else null end,
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
