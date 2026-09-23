/**
 * supabase-config.js
 * ------------------------------------------------------------
 * Terhubung ke project Supabase "ikaptri-tourism-fair".
 *
 * Catatan: SUPABASE_ANON_KEY di sini isinya "Publishable key"
 * (format sb_publishable_...) — sistem API key baru Supabase,
 * pengganti langsung anon key lama. Fungsinya identik dengan
 * anon key (aman diexpose ke browser, tunduk ke RLS), jadi
 * createClient() di bawah tetap jalan sama persis.
 *
 * Selama SUPABASE_URL/SUPABASE_ANON_KEY kosong atau CDN script
 * di bawah belum di-uncomment di file HTML, registration.js
 * otomatis fallback ke WhatsApp, dan main.js fallback ke data.js
 * — situs tetap jalan normal.
 */

const SUPABASE_URL = "https://djediremyjvwpbibxxon.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_a1QSOlO0VKzgjt7Acefwdg_H_Ynpd6A";

let supabaseClient = null;

if (SUPABASE_URL && SUPABASE_ANON_KEY && window.supabase) {
  supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}
