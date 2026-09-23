-- Tambahan: tabel Program Acara
-- Jalankan ini di SQL Editor Supabase (project ikaptri-tourism-fair)

create table if not exists program_items (
  id uuid primary key default gen_random_uuid(),
  day_label text not null,
  time_label text,
  title text not null,
  description text,
  sort_order int not null default 0,
  created_at timestamptz default now()
);

alter table program_items enable row level security;

create policy "public read program_items" on program_items for select using (true);
create policy "admin write program_items" on program_items for insert with check (auth.role() = 'authenticated');
create policy "admin update program_items" on program_items for update using (auth.role() = 'authenticated');
create policy "admin delete program_items" on program_items for delete using (auth.role() = 'authenticated');
