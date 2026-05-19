create table if not exists public.site_config (
  key text primary key,
  value text not null,
  created_at timestamptz not null default timezone('utc'::text, now())
);

alter table public.site_config enable row level security;

drop policy if exists "site_config_select_countdown_target" on public.site_config;
create policy "site_config_select_countdown_target"
on public.site_config
for select
using (key = 'countdown_target');

insert into public.site_config (key, value)
values (
  'countdown_target',
  to_char(timezone('utc', now() + interval '14 days'), 'YYYY-MM-DD"T"HH24:MI:SS"Z"')
)
on conflict (key) do nothing;

