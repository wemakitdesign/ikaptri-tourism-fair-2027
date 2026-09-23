-- ============================================================
-- IKAPTRI TOURISM FAIR 2027 — Supabase Schema
-- ------------------------------------------------------------
-- Jalankan seluruh file ini di Supabase Dashboard → SQL Editor
-- → paste → Run. Aman dijalankan sekali di project baru.
--
-- Pola sama dengan imwte_project: tabel-tabel ini dibaca PUBLIC
-- (read-only) oleh website, dan cuma bisa ditulis oleh user yang
-- login (admin) lewat admin.html. Kalau tabel-tabel ini kosong /
-- Supabase belum dikonfigurasi, website otomatis fallback ke
-- js/data.js (lihat js/main.js -> hydrateFromSupabase()).
-- ============================================================

-- ------------------------------------------------------------
-- 1. HERO SLIDES
--    Sesuai request: bagian Hero cuma bisa diubah foto
--    background-nya lewat admin (bukan teks/logo).
-- ------------------------------------------------------------
create table if not exists hero_slides (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  sort_order int not null default 0,
  created_at timestamptz default now()
);

-- ------------------------------------------------------------
-- 2. SITE SETTINGS
--    Konten singular (bukan list) disimpan sebagai JSON per key,
--    supaya gak perlu bikin tabel baru tiap ada section baru.
--    Key yang dipakai saat ini: 'countdown', 'event'
--      countdown -> { "label", "eventName", "targetDate" }
--      event     -> { "dateLabel", "venue" }
-- ------------------------------------------------------------
create table if not exists site_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz default now()
);

-- ------------------------------------------------------------
-- 3. CONTACT PERSONS (dipakai di footer semua halaman)
-- ------------------------------------------------------------
create table if not exists contact_persons (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  sort_order int not null default 0
);

-- ------------------------------------------------------------
-- 4. NEWS ITEMS (halaman Media)
-- ------------------------------------------------------------
create table if not exists news_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  excerpt text,
  content text,
  image_url text,
  sort_order int not null default 0,
  created_at timestamptz default now()
);

-- ------------------------------------------------------------
-- 5. GALLERY PHOTOS (halaman Media)
-- ------------------------------------------------------------
create table if not exists gallery_photos (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  sort_order int not null default 0,
  created_at timestamptz default now()
);

-- ------------------------------------------------------------
-- 6. REGISTRATIONS (hasil submit form di registrasi.html)
-- ------------------------------------------------------------
create table if not exists registrations (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  whatsapp text not null,
  company text,
  category text not null,
  notes text,
  created_at timestamptz default now()
);

-- ------------------------------------------------------------
-- 7. MEDIA KIT (4 slot tetap: brochure, flyer, floorplan, profile)
--    Beda dari news/gallery: ini file DOKUMEN (PDF/PPTX/DOCX/dll),
--    bukan foto — makanya kolomnya nyimpen file_name juga buat
--    preview nama file di admin (pola sama kayak imwte_project).
-- ------------------------------------------------------------
create table if not exists media_kit (
  id text primary key,
  label text not null,
  file_url text,
  file_name text,
  updated_at timestamptz default now()
);

-- ------------------------------------------------------------
-- 8. PROGRAM ITEMS (jadwal acara — halaman Program)
--    Kalau tabel ini kosong, halaman Program tetap tampilin badge
--    "(TBA)" seperti sekarang. Begitu admin nambah minimal 1 sesi,
--    otomatis ganti jadi tampilan jadwal.
-- ------------------------------------------------------------
create table if not exists program_items (
  id uuid primary key default gen_random_uuid(),
  day_label text not null,
  time_label text,
  title text not null,
  description text,
  sort_order int not null default 0,
  created_at timestamptz default now()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- Aturan: siapa saja boleh BACA konten (biar website publik bisa
-- nampilin), tapi cuma user yang LOGIN (admin) yang boleh
-- tambah/ubah/hapus. Khusus registrations: publik cuma boleh
-- INSERT (submit form), gak boleh baca data orang lain.
-- ============================================================

alter table hero_slides enable row level security;
alter table site_settings enable row level security;
alter table contact_persons enable row level security;
alter table news_items enable row level security;
alter table gallery_photos enable row level security;
alter table registrations enable row level security;
alter table media_kit enable row level security;
alter table program_items enable row level security;

-- hero_slides
create policy "public read hero_slides" on hero_slides for select using (true);
create policy "admin write hero_slides" on hero_slides for insert with check (auth.role() = 'authenticated');
create policy "admin update hero_slides" on hero_slides for update using (auth.role() = 'authenticated');
create policy "admin delete hero_slides" on hero_slides for delete using (auth.role() = 'authenticated');

-- site_settings
create policy "public read site_settings" on site_settings for select using (true);
create policy "admin write site_settings" on site_settings for insert with check (auth.role() = 'authenticated');
create policy "admin update site_settings" on site_settings for update using (auth.role() = 'authenticated');

-- contact_persons
create policy "public read contact_persons" on contact_persons for select using (true);
create policy "admin write contact_persons" on contact_persons for insert with check (auth.role() = 'authenticated');
create policy "admin update contact_persons" on contact_persons for update using (auth.role() = 'authenticated');
create policy "admin delete contact_persons" on contact_persons for delete using (auth.role() = 'authenticated');

-- news_items
create policy "public read news_items" on news_items for select using (true);
create policy "admin write news_items" on news_items for insert with check (auth.role() = 'authenticated');
create policy "admin update news_items" on news_items for update using (auth.role() = 'authenticated');
create policy "admin delete news_items" on news_items for delete using (auth.role() = 'authenticated');

-- gallery_photos
create policy "public read gallery_photos" on gallery_photos for select using (true);
create policy "admin write gallery_photos" on gallery_photos for insert with check (auth.role() = 'authenticated');
create policy "admin update gallery_photos" on gallery_photos for update using (auth.role() = 'authenticated');
create policy "admin delete gallery_photos" on gallery_photos for delete using (auth.role() = 'authenticated');

-- registrations
create policy "public insert registrations" on registrations for insert with check (true);
create policy "admin read registrations" on registrations for select using (auth.role() = 'authenticated');
create policy "admin delete registrations" on registrations for delete using (auth.role() = 'authenticated');

-- media_kit
create policy "public read media_kit" on media_kit for select using (true);
create policy "admin write media_kit" on media_kit for insert with check (auth.role() = 'authenticated');
create policy "admin update media_kit" on media_kit for update using (auth.role() = 'authenticated');

-- program_items
create policy "public read program_items" on program_items for select using (true);
create policy "admin write program_items" on program_items for insert with check (auth.role() = 'authenticated');
create policy "admin update program_items" on program_items for update using (auth.role() = 'authenticated');
create policy "admin delete program_items" on program_items for delete using (auth.role() = 'authenticated');

-- ============================================================
-- STORAGE BUCKET buat upload gambar (hero slides, news, gallery)
-- Jalankan ini juga, atau bikin manual lewat Dashboard -> Storage
-- -> New Bucket -> nama "site-images" -> Public bucket: ON
-- ============================================================
insert into storage.buckets (id, name, public)
values ('site-images', 'site-images', true)
on conflict (id) do nothing;

create policy "public read site-images" on storage.objects
  for select using (bucket_id = 'site-images');

create policy "admin upload site-images" on storage.objects
  for insert with check (bucket_id = 'site-images' and auth.role() = 'authenticated');

create policy "admin delete site-images" on storage.objects
  for delete using (bucket_id = 'site-images' and auth.role() = 'authenticated');

-- ============================================================
-- SEED DATA AWAL (opsional) — isi tabel dengan data yang sudah
-- ada di js/data.js sekarang, supaya pas admin CMS pertama kali
-- dibuka sudah ada isinya, bukan kosong.
-- Ganti URL gambar di bawah sesuai domain final kamu.
-- ============================================================
insert into site_settings (key, value) values
  ('countdown', '{"label":"Menuju","eventName":"IKAPTRI Tourism Fair 2027","targetDate":"2027-01-29T00:00:00+07:00"}'),
  ('event', '{"dateLabel":"29-30 Januari 2027","venue":"Astaka Grand Ballroom, ARTOTEL Gelora Senayan"}')
on conflict (key) do nothing;

insert into contact_persons (name, phone, sort_order) values
  ('Stevanya', '+62-819-3203-1887', 1),
  ('Patricia Paty', '+62-856-9377-8231', 2)
on conflict do nothing;

insert into media_kit (id, label) values
  ('brochure', 'Brochure'),
  ('flyer', 'E-Flyer'),
  ('floorplan', 'Floor Plan'),
  ('profile', 'Company Profile')
on conflict (id) do nothing;
