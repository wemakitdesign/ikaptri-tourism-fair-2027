-- Tambahan: tabel Media Kit
-- Jalankan ini di SQL Editor Supabase (project ikaptri-tourism-fair)
-- Aman dijalankan meskipun schema.sql utama udah pernah di-run duluan.

create table if not exists media_kit (
  id text primary key,
  label text not null,
  file_url text,
  file_name text,
  updated_at timestamptz default now()
);

alter table media_kit enable row level security;

create policy "public read media_kit" on media_kit for select using (true);
create policy "admin write media_kit" on media_kit for insert with check (auth.role() = 'authenticated');
create policy "admin update media_kit" on media_kit for update using (auth.role() = 'authenticated');

insert into media_kit (id, label) values
  ('brochure', 'Brochure'),
  ('flyer', 'E-Flyer'),
  ('floorplan', 'Floor Plan'),
  ('profile', 'Company Profile')
on conflict (id) do nothing;
