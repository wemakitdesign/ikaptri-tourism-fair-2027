# Setup Supabase buat Admin CMS — IKAPTRI Tourism Fair 2027

Ikutin urutan ini persis. Total waktu ~15 menit.

## 1. Bikin project Supabase baru
1. Buka [supabase.com](https://supabase.com) → login (boleh pakai akun yang sama kayak IMWTE, atau bikin baru)
2. **New Project** → kasih nama `ikaptri-tourism-fair` → pilih region terdekat (Singapore) → generate password project (simpan baik-baik, beda sama password admin nanti) → Create

## 2. Jalankan schema SQL
1. Di dashboard project, buka menu **SQL Editor** (sidebar kiri)
2. **New query**
3. Buka file `supabase/schema.sql` yang ada di folder project ini, copy semua isinya
4. Paste ke SQL Editor → klik **Run**
5. Kalau sukses, cek menu **Table Editor** — harusnya udah muncul 6 tabel: `hero_slides`, `site_settings`, `contact_persons`, `news_items`, `gallery_photos`, `registrations`

## 3. Bikin bucket Storage (buat upload foto)
Schema.sql di atas sebenernya udah otomatis bikin bucket `site-images`. Tinggal cek aja:
1. Menu **Storage** (sidebar kiri)
2. Harusnya udah ada bucket **site-images** dengan status Public ✅

Kalau belum ada (jarang terjadi), bikin manual: **New bucket** → nama `site-images` → toggle **Public bucket** ON → Create.

## 4. Bikin akun login admin
1. Menu **Authentication** → tab **Users**
2. **Add user** → **Create new user**
3. Isi email & password (ini yang dipakai buat login ke `admin.html` nanti)
4. **PENTING:** centang "Auto Confirm User" biar gak perlu verifikasi email

## 5. Ambil credentials
1. Menu **Settings** (ikon gerigi) → **API**
2. Copy dua nilai ini:
   - **Project URL** (format `https://xxxxx.supabase.co`)
   - **anon public** key (yang panjang, di bagian "Project API keys")

## 6. Pasang credentials ke code
Buka `js/supabase-config.js`, isi 2 baris ini:

```js
const SUPABASE_URL = "https://xxxxx.supabase.co";       // paste Project URL
const SUPABASE_ANON_KEY = "eyJhbGci...";                  // paste anon public key
```

## 7. Aktifkan Supabase SDK di tiap halaman
Di **setiap file HTML** (index.html, eksibitor.html, pengunjung.html, media.html, program.html, registrasi.html, admin.html), cari baris comment ini deket bagian bawah:

```html
<!-- Supabase JS SDK -- uncomment setelah supabase-config.js diisi:
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
-->
```

Hapus `<!--` dan `-->`-nya (uncomment), jadi tinggal:

```html
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
```

## 8. Migrasi konten yang sudah ada (opsional tapi disarankan)
Schema.sql udah otomatis isi `contact_persons` dan `site_settings` (countdown + info acara) dengan data yang sama kayak `data.js` sekarang, jadi begitu Supabase nyambung, tampilannya gak berubah tiba-tiba.

Yang **belum** otomatis ke-isi: `hero_slides`, `news_items`, `gallery_photos` — soalnya isinya foto, dan foto harus diupload manual (bukan lewat SQL). Kalau mau situs tetep pakai foto yang sekarang, gampang: buka `admin.html` → tab Hero Background / Gallery → upload ulang foto-foto yang sama dari folder `assets/images/`.

Kalau kamu SKIP langkah upload ini, gak masalah — situs otomatis tetap pakai foto dari `assets/images/` (fallback ke `data.js`) sampai kamu upload sesuatu lewat admin.

## 9. Deploy & login
1. Push perubahan (`js/supabase-config.js` + semua HTML yang di-uncomment) ke GitHub → Vercel auto-deploy
2. Buka `https://[domain-kamu]/admin`
3. Login pakai email/password dari langkah 4

## Kalau ada yang error
- **"Supabase Belum Dikonfigurasi"** masih muncul di admin.html → cek lagi `SUPABASE_URL`/`SUPABASE_ANON_KEY` udah keisi, dan CDN script di admin.html udah di-uncomment
- **Login gagal** → cek user-nya udah "Auto Confirm" di step 4, atau reset password lewat Supabase dashboard
- **Upload foto gagal** → cek bucket `site-images` statusnya Public
