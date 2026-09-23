-- Tambahan: kolom "content" (isi lengkap berita) di news_items
-- Jalankan ini di SQL Editor Supabase (project ikaptri-tourism-fair)
-- Aman dijalankan walau tabel news_items udah ada isinya.

alter table news_items add column if not exists content text;
