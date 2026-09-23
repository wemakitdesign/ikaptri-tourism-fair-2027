/**
 * registration.js — Form Registrasi Peserta
 * ------------------------------------------------------------
 * Arsitektur: coba insert ke Supabase (table `registrations`)
 * kalau supabaseClient sudah terkonfigurasi (lihat supabase-config.js).
 * Kalau belum, fallback: susun pesan WhatsApp otomatis ke CP
 * yang terdaftar di data.js, supaya form tetap benar-benar
 * fungsional sebelum database-nya jadi.
 *
 * Kolom tabel `registrations` yang dipakai nanti di Supabase:
 *   id (uuid, pk)            | created_at (timestamptz, default now())
 *   full_name (text)         | email (text)
 *   whatsapp (text)          | company (text, nullable)
 *   category (text)          | notes (text, nullable)
 */

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("[data-registration-form]");
  if (!form) return;

  const submitBtn = form.querySelector("[data-submit-btn]");
  const statusBox = document.querySelector("[data-form-status]");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    clearErrors(form);

    const data = {
      full_name: form.full_name.value.trim(),
      email: form.email.value.trim(),
      whatsapp: form.whatsapp.value.trim(),
      company: form.company.value.trim(),
      category: form.category.value,
      notes: form.notes.value.trim(),
    };

    const errors = validate(data);
    if (Object.keys(errors).length > 0) {
      showErrors(form, errors);
      return;
    }

    setLoading(submitBtn, true);

    try {
      if (typeof supabaseClient !== "undefined" && supabaseClient) {
        const { error } = await supabaseClient.from("registrations").insert([data]);
        if (error) throw error;
        showSuccess(statusBox, form, "supabase");
      } else {
        openWhatsappFallback(data);
        showSuccess(statusBox, form, "whatsapp");
      }
    } catch (err) {
      console.error("Registration submit error:", err);
      showSuccess(statusBox, form, "whatsapp");
      openWhatsappFallback(data);
    } finally {
      setLoading(submitBtn, false);
    }
  });
});

function validate(data) {
  const errors = {};
  if (!data.full_name) errors.full_name = "Nama lengkap wajib diisi";
  if (!data.email) {
    errors.email = "Email wajib diisi";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = "Format email tidak valid";
  }
  if (!data.whatsapp) {
    errors.whatsapp = "No. WhatsApp wajib diisi";
  } else if (!/^[0-9+\-\s]{8,16}$/.test(data.whatsapp)) {
    errors.whatsapp = "Format nomor tidak valid";
  }
  if (!data.category) errors.category = "Pilih kategori pendaftaran";
  return errors;
}

function clearErrors(form) {
  form.querySelectorAll(".form-field__error").forEach((el) => (el.textContent = ""));
  form.querySelectorAll(".form-field--invalid").forEach((el) => el.classList.remove("form-field--invalid"));
}

function showErrors(form, errors) {
  Object.entries(errors).forEach(([field, message]) => {
    const input = form.querySelector(`[name="${field}"]`);
    if (!input) return;
    const wrap = input.closest(".form-field");
    if (wrap) wrap.classList.add("form-field--invalid");
    const errEl = wrap ? wrap.querySelector(".form-field__error") : null;
    if (errEl) errEl.textContent = message;
  });
  const firstField = form.querySelector(".form-field--invalid input, .form-field--invalid select, .form-field--invalid textarea");
  if (firstField) firstField.focus();
}

function setLoading(btn, isLoading) {
  if (!btn) return;
  btn.disabled = isLoading;
  btn.textContent = isLoading ? "Mengirim..." : "Kirim Registrasi";
}

function showSuccess(statusBox, form, mode) {
  form.reset();
  if (!statusBox) return;
  statusBox.hidden = false;
  statusBox.innerHTML =
    mode === "supabase"
      ? `<strong>Registrasi berhasil dikirim!</strong><p>Terima kasih sudah mendaftar. Tim kami akan menghubungi kamu lewat email/WhatsApp yang didaftarkan.</p>`
      : `<strong>Data kamu sudah siap dikirim!</strong><p>Tab WhatsApp baru akan terbuka untuk menyelesaikan registrasi ke panitia. Kalau tidak otomatis terbuka, cek pop-up blocker di browser kamu.</p>`;
  statusBox.scrollIntoView({ behavior: "smooth", block: "center" });
}

function openWhatsappFallback(data) {
  const phone = (typeof IKAPTRI_DATA !== "undefined" && IKAPTRI_DATA.whatsapp?.phone) || "";
  if (!phone) return;

  const categoryLabel =
    {
      pengunjung: "Pengunjung",
      eksibitor: "Eksibitor / Peserta Pameran",
      media: "Media",
      sponsor: "Sponsor / Partner",
      mahasiswa: "Mahasiswa",
    }[data.category] || data.category;

  const lines = [
    "Halo, saya ingin mendaftar IKAPTRI Tourism Fair 2027.",
    "",
    `Nama: ${data.full_name}`,
    `Email: ${data.email}`,
    `No. WhatsApp: ${data.whatsapp}`,
    data.company ? `Perusahaan/Institusi: ${data.company}` : null,
    `Kategori: ${categoryLabel}`,
    data.notes ? `Catatan: ${data.notes}` : null,
  ].filter(Boolean);

  const url = `https://wa.me/${phone}?text=${encodeURIComponent(lines.join("\n"))}`;
  window.open(url, "_blank", "noopener");
}
