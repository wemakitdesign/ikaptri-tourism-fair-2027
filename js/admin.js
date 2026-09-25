/**
 * admin.js — Admin CMS logic untuk IKAPTRI Tourism Fair 2027
 * ------------------------------------------------------------
 * Arsitektur sama dengan imwte_project: Supabase-backed, dengan
 * fallback yang jelas kalau belum dikonfigurasi. File ini HANYA
 * jalan di admin.html.
 *
 * Alur:
 *  1. Kalau supabaseClient belum ada (lihat supabase-config.js) ->
 *     tampilkan notice "belum dikonfigurasi", berhenti di situ.
 *  2. Kalau ada -> cek sesi login. Belum login -> tampilkan form
 *     login. Sudah login -> tampilkan dashboard & load semua panel.
 *
 * Storage: gambar diupload ke Supabase Storage bucket "site-images"
 * (lihat supabase/schema.sql), lalu URL publiknya disimpan di kolom
 * image_url pada tabel terkait.
 */

document.addEventListener("DOMContentLoaded", () => {
  const notice = document.querySelector("[data-admin-not-configured]");
  const loginScreen = document.querySelector("[data-admin-login]");
  const dashboard = document.querySelector("[data-admin-dashboard]");

  if (typeof supabaseClient === "undefined" || !supabaseClient) {
    notice.hidden = false;
    return;
  }

  initAuth();
  initNav();
  initLoginForm();
  document.querySelector("[data-logout-btn]").addEventListener("click", handleLogout);

  /* ---------------------------------------------------------- */
  /* AUTH                                                         */
  /* ---------------------------------------------------------- */
  async function initAuth() {
    const { data } = await supabaseClient.auth.getSession();
    if (data.session) {
      showDashboard();
    } else {
      loginScreen.hidden = false;
    }

    supabaseClient.auth.onAuthStateChange((_event, session) => {
      if (session) {
        showDashboard();
      } else {
        dashboard.hidden = true;
        loginScreen.hidden = false;
      }
    });
  }

  function showDashboard() {
    loginScreen.hidden = true;
    dashboard.hidden = false;
    loadAllPanels();
  }

  function initLoginForm() {
    const form = document.querySelector("[data-login-form]");
    const errorEl = document.querySelector("[data-login-error]");
    const btn = document.querySelector("[data-login-btn]");

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      errorEl.textContent = "";
      btn.disabled = true;
      btn.textContent = "Masuk...";

      const email = form.email.value.trim();
      const password = form.password.value;

      const { error } = await supabaseClient.auth.signInWithPassword({ email, password });

      btn.disabled = false;
      btn.textContent = "Masuk";

      if (error) {
        errorEl.textContent = "Login gagal — cek lagi email & password.";
      }
    });
  }

  function handleLogout() {
    supabaseClient.auth.signOut();
  }

  /* ---------------------------------------------------------- */
  /* NAV                                                          */
  /* ---------------------------------------------------------- */
  function initNav() {
    const navItems = document.querySelectorAll("[data-nav]");
    navItems.forEach((btn) => {
      btn.addEventListener("click", () => {
        navItems.forEach((b) => b.classList.remove("is-active"));
        btn.classList.add("is-active");
        document.querySelectorAll(".admin-panel").forEach((p) => p.classList.remove("is-active"));
        document.querySelector(`[data-panel="${btn.dataset.nav}"]`).classList.add("is-active");
      });
    });
  }

  function loadAllPanels() {
    loadHero();
    loadMediaKit();
    loadProgram();
    loadCountdown();
    loadContacts();
    loadNews();
    loadGallery();
    loadRegistrations();
  }

  /* ---------------------------------------------------------- */
  /* IMAGE UPLOAD HELPER                                          */
  /* ---------------------------------------------------------- */
  async function uploadImage(file, folder) {
    const ext = file.name.split(".").pop();
    const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const { error } = await supabaseClient.storage.from("site-images").upload(path, file);
    if (error) throw error;
    const { data } = supabaseClient.storage.from("site-images").getPublicUrl(path);
    return data.publicUrl;
  }

  /* ---------------------------------------------------------- */
  /* HERO (background images only)                                */
  /* ---------------------------------------------------------- */
  async function loadHero() {
    const listEl = document.querySelector("[data-hero-list]");
    listEl.innerHTML = `<p class="admin-empty">Memuat...</p>`;

    const { data, error } = await supabaseClient
      .from("hero_slides")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error || !data || !data.length) {
      listEl.innerHTML = `<p class="admin-empty">Belum ada foto. Upload dulu di atas.</p>`;
      return;
    }

    listEl.innerHTML = data
      .map(
        (slide, i) => `
      <div class="admin-card" data-hero-id="${slide.id}">
        <img class="admin-card__thumb" src="${slide.image_url}" alt="Hero slide ${i + 1}" />
        <div class="admin-card__body">
          <strong>Slide ${i + 1}</strong>
          <span>Urutan: ${slide.sort_order}</span>
        </div>
        <div class="admin-card__actions">
          <button data-hero-up title="Naikkan urutan">↑</button>
          <button data-hero-down title="Turunkan urutan">↓</button>
          <button class="admin-btn--danger" data-hero-delete title="Hapus">✕</button>
        </div>
      </div>`
      )
      .join("");

    listEl.querySelectorAll("[data-hero-delete]").forEach((btn, i) => {
      btn.addEventListener("click", () => deleteHeroSlide(data[i].id));
    });
    listEl.querySelectorAll("[data-hero-up]").forEach((btn, i) => {
      btn.addEventListener("click", () => reorderHeroSlide(data, i, -1));
    });
    listEl.querySelectorAll("[data-hero-down]").forEach((btn, i) => {
      btn.addEventListener("click", () => reorderHeroSlide(data, i, 1));
    });
  }

  document.querySelector("[data-hero-upload]").addEventListener("change", async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const url = await uploadImage(file, "hero");
      const { data: existing } = await supabaseClient.from("hero_slides").select("sort_order");
      const nextOrder = existing && existing.length ? Math.max(...existing.map((r) => r.sort_order)) + 1 : 0;
      await supabaseClient.from("hero_slides").insert([{ image_url: url, sort_order: nextOrder }]);
      loadHero();
    } catch (err) {
      alert("Upload gagal: " + err.message);
    }
    e.target.value = "";
  });

  async function deleteHeroSlide(id) {
    if (!confirm("Hapus foto ini dari hero slider?")) return;
    await supabaseClient.from("hero_slides").delete().eq("id", id);
    loadHero();
  }

  async function reorderHeroSlide(list, index, direction) {
    const swapIndex = index + direction;
    if (swapIndex < 0 || swapIndex >= list.length) return;
    const a = list[index];
    const b = list[swapIndex];
    await supabaseClient.from("hero_slides").update({ sort_order: b.sort_order }).eq("id", a.id);
    await supabaseClient.from("hero_slides").update({ sort_order: a.sort_order }).eq("id", b.id);
    loadHero();
  }

  /* ---------------------------------------------------------- */
  /* MEDIA KIT (4 slot tetap: brochure/flyer/floorplan/profile)  */
  /* Beda dari upload foto lain: ini file dokumen (PDF/PPTX/dll), */
  /* jadi ada preview NAMA FILE, bukan thumbnail — pola sama     */
  /* kayak media kit di admin CMS imwte_project.                 */
  /* ---------------------------------------------------------- */
  async function loadMediaKit() {
    const listEl = document.querySelector("[data-mediakit-list]");
    if (!listEl) return;
    listEl.innerHTML = `<p class="admin-empty">Memuat...</p>`;

    const { data: rawData } = await supabaseClient
      .from("media_kit")
      .select("*");

    const MEDIAKIT_ORDER = ["brochure", "flyer", "floorplan", "profile"];
    const data = (rawData || []).slice().sort(
      (a, b) => MEDIAKIT_ORDER.indexOf(a.id) - MEDIAKIT_ORDER.indexOf(b.id)
    );

    if (!data || !data.length) {
      listEl.innerHTML = `<p class="admin-empty">Data media kit belum ada. Pastikan sudah menjalankan supabase/add-media-kit.sql.</p>`;
      return;
    }

    listEl.innerHTML = data
      .map(
        (item) => `
      <div class="admin-card" data-mediakit-id="${item.id}">
        <div class="admin-card__body">
          <strong>${item.label}</strong>
          <span>${item.file_name ? `📄 ${item.file_name}` : "Belum ada file diupload"}</span>
        </div>
        <div class="admin-card__actions">
          ${item.file_url ? `<a href="${item.file_url}" target="_blank" rel="noopener" class="admin-btn" title="Lihat file">👁</a>` : ""}
          <label class="admin-btn admin-btn--primary" title="Upload / ganti file">
            ⬆
            <input type="file" data-mediakit-upload="${item.id}" hidden />
          </label>
          ${item.file_url ? `<button class="admin-btn--danger" data-mediakit-delete="${item.id}" title="Hapus file">✕</button>` : ""}
        </div>
      </div>`
      )
      .join("");

    listEl.querySelectorAll("[data-mediakit-upload]").forEach((input) => {
      input.addEventListener("change", async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const itemId = input.dataset.mediakitUpload;
        try {
          const url = await uploadImage(file, "media-kit");
          await supabaseClient
            .from("media_kit")
            .update({ file_url: url, file_name: file.name, updated_at: new Date().toISOString() })
            .eq("id", itemId);
          loadMediaKit();
        } catch (err) {
          alert("Upload gagal: " + err.message);
        }
        e.target.value = "";
      });
    });

    listEl.querySelectorAll("[data-mediakit-delete]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const itemId = btn.dataset.mediakitDelete;
        if (!confirm("Hapus file ini? Tombol download di website akan nonaktif sampai file baru diupload.")) return;
        await supabaseClient
          .from("media_kit")
          .update({ file_url: null, file_name: null, updated_at: new Date().toISOString() })
          .eq("id", itemId);
        loadMediaKit();
      });
    });
  }

  /* ---------------------------------------------------------- */
  /* PROGRAM ACARA                                                 */
  /* ---------------------------------------------------------- */
  async function loadProgram() {
    const listEl = document.querySelector("[data-program-list]");
    if (!listEl) return;
    listEl.innerHTML = `<p class="admin-empty">Memuat...</p>`;

    const { data } = await supabaseClient
      .from("program_items")
      .select("*")
      .order("sort_order", { ascending: true });

    if (!data || !data.length) {
      listEl.innerHTML = `<p class="admin-empty">Belum ada sesi. Halaman Program di website masih tampil "(TBA)".</p>`;
      return;
    }

    listEl.innerHTML = data
      .map(
        (item, i) => `
      <div class="admin-card" data-program-id="${item.id}">
        <div class="admin-card__body">
          <strong>${item.day_label}${item.time_label ? ` · ${item.time_label}` : ""}</strong>
          <span>${item.title}${item.description ? ` — ${item.description}` : ""}</span>
        </div>
        <div class="admin-card__actions">
          <button data-pg-up title="Naikkan urutan">↑</button>
          <button data-pg-down title="Turunkan urutan">↓</button>
          <button class="admin-btn--danger" data-pg-delete title="Hapus">✕</button>
        </div>
      </div>`
      )
      .join("");

    listEl.querySelectorAll("[data-pg-delete]").forEach((btn, i) => {
      btn.addEventListener("click", async () => {
        if (!confirm(`Hapus sesi "${data[i].title}"?`)) return;
        await supabaseClient.from("program_items").delete().eq("id", data[i].id);
        loadProgram();
      });
    });
    listEl.querySelectorAll("[data-pg-up]").forEach((btn, i) => {
      btn.addEventListener("click", () => reorderProgram(data, i, -1));
    });
    listEl.querySelectorAll("[data-pg-down]").forEach((btn, i) => {
      btn.addEventListener("click", () => reorderProgram(data, i, 1));
    });
  }

  async function reorderProgram(list, index, direction) {
    const swapIndex = index + direction;
    if (swapIndex < 0 || swapIndex >= list.length) return;
    const a = list[index];
    const b = list[swapIndex];
    await supabaseClient.from("program_items").update({ sort_order: b.sort_order }).eq("id", a.id);
    await supabaseClient.from("program_items").update({ sort_order: a.sort_order }).eq("id", b.id);
    loadProgram();
  }

  const programForm = document.querySelector("[data-program-form]");
  if (programForm) {
    programForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const dayLabel = document.querySelector("[data-pg-day]").value.trim();
      const timeLabel = document.querySelector("[data-pg-time]").value.trim();
      const title = document.querySelector("[data-pg-title]").value.trim();
      const description = document.querySelector("[data-pg-desc]").value.trim();
      if (!dayLabel || !title) return;

      const { data: existing } = await supabaseClient.from("program_items").select("sort_order");
      const nextOrder = existing && existing.length ? Math.max(...existing.map((r) => r.sort_order)) + 1 : 0;

      await supabaseClient.from("program_items").insert([
        {
          day_label: dayLabel,
          time_label: timeLabel || null,
          title,
          description: description || null,
          sort_order: nextOrder,
        },
      ]);

      programForm.reset();
      loadProgram();
    });
  }

  /* ---------------------------------------------------------- */
  /* COUNTDOWN & EVENT INFO                                       */
  /* ---------------------------------------------------------- */
  async function loadCountdown() {
    const { data } = await supabaseClient
      .from("site_settings")
      .select("*")
      .in("key", ["countdown", "event"]);

    const settings = {};
    (data || []).forEach((row) => (settings[row.key] = row.value));

    const cd = settings.countdown || IKAPTRI_DATA.countdown;
    const ev = settings.event || IKAPTRI_DATA.event;

    document.querySelector("[data-cd-label]").value = cd.label || "";
    document.querySelector("[data-cd-eventname]").value = cd.eventName || "";
    document.querySelector("[data-cd-target]").value = toDatetimeLocal(cd.targetDate);
    document.querySelector("[data-ev-datelabel]").value = ev.dateLabel || "";
    document.querySelector("[data-ev-venue]").value = ev.venue || "";
  }

  function toDatetimeLocal(isoString) {
    if (!isoString) return "";
    const d = new Date(isoString);
    const pad = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }

  document.querySelector("[data-countdown-form]").addEventListener("submit", async (e) => {
    e.preventDefault();
    const statusEl = document.querySelector("[data-countdown-status]");
    statusEl.textContent = "Menyimpan...";

    const countdownValue = {
      label: document.querySelector("[data-cd-label]").value,
      eventName: document.querySelector("[data-cd-eventname]").value,
      targetDate: new Date(document.querySelector("[data-cd-target]").value).toISOString(),
    };
    const eventValue = {
      dateLabel: document.querySelector("[data-ev-datelabel]").value,
      venue: document.querySelector("[data-ev-venue]").value,
    };

    await supabaseClient.from("site_settings").upsert([
      { key: "countdown", value: countdownValue, updated_at: new Date().toISOString() },
      { key: "event", value: eventValue, updated_at: new Date().toISOString() },
    ]);

    statusEl.textContent = "Tersimpan ✓";
    setTimeout(() => (statusEl.textContent = ""), 2500);
  });

  /* ---------------------------------------------------------- */
  /* CONTACT PERSONS                                              */
  /* ---------------------------------------------------------- */
  async function loadContacts() {
    const listEl = document.querySelector("[data-contact-list]");
    const { data } = await supabaseClient.from("contact_persons").select("*").order("sort_order");

    if (!data || !data.length) {
      listEl.innerHTML = `<p class="admin-empty">Belum ada contact person.</p>`;
      return;
    }

    listEl.innerHTML = data
      .map(
        (c) => `
      <div class="admin-card" data-contact-id="${c.id}">
        <div class="admin-card__body">
          <strong>${c.name}</strong>
          <span>${c.phone}</span>
        </div>
        <div class="admin-card__actions">
          <button data-contact-edit title="Edit">✎</button>
          <button class="admin-btn--danger" data-contact-delete title="Hapus">✕</button>
        </div>
      </div>`
      )
      .join("");

    listEl.querySelectorAll("[data-contact-delete]").forEach((btn, i) => {
      btn.addEventListener("click", async () => {
        if (!confirm(`Hapus ${data[i].name}?`)) return;
        await supabaseClient.from("contact_persons").delete().eq("id", data[i].id);
        loadContacts();
      });
    });
    listEl.querySelectorAll("[data-contact-edit]").forEach((btn, i) => {
      btn.addEventListener("click", () => editContactInline(listEl, data[i], i));
    });
  }

  function editContactInline(listEl, contact, index) {
    const card = listEl.querySelectorAll(".admin-card")[index];
    card.classList.add("admin-card--editing");
    card.innerHTML = `
      <div class="form-field"><label>Nama</label><input type="text" value="${contact.name}" data-edit-name /></div>
      <div class="form-field"><label>No. Telepon</label><input type="text" value="${contact.phone}" data-edit-phone /></div>
      <div class="admin-card__actions">
        <button class="admin-btn admin-btn--primary" data-edit-save>Simpan</button>
        <button class="admin-btn" data-edit-cancel>Batal</button>
      </div>`;
    card.querySelector("[data-edit-save]").addEventListener("click", async () => {
      const name = card.querySelector("[data-edit-name]").value.trim();
      const phone = card.querySelector("[data-edit-phone]").value.trim();
      await supabaseClient.from("contact_persons").update({ name, phone }).eq("id", contact.id);
      loadContacts();
    });
    card.querySelector("[data-edit-cancel]").addEventListener("click", loadContacts);
  }

  document.querySelector("[data-contact-add]").addEventListener("click", async () => {
    const name = prompt("Nama contact person:");
    if (!name) return;
    const phone = prompt("Nomor WhatsApp/telepon (mis. +62-812-xxxx):");
    if (!phone) return;
    const { data: existing } = await supabaseClient.from("contact_persons").select("sort_order");
    const nextOrder = existing && existing.length ? Math.max(...existing.map((r) => r.sort_order)) + 1 : 0;
    await supabaseClient.from("contact_persons").insert([{ name, phone, sort_order: nextOrder }]);
    loadContacts();
  });

  /* ---------------------------------------------------------- */
  /* NEWS                                                         */
  /* ---------------------------------------------------------- */
  async function loadNews() {
    const listEl = document.querySelector("[data-news-list]");
    const { data } = await supabaseClient.from("news_items").select("*").order("created_at", { ascending: false });

    if (!data || !data.length) {
      listEl.innerHTML = `<p class="admin-empty">Belum ada news item.</p>`;
      return;
    }

    listEl.innerHTML = data
      .map(
        (n) => `
      <div class="admin-card" data-news-id="${n.id}">
        <img class="admin-card__thumb" src="${n.image_url || ""}" alt="${n.title}" />
        <div class="admin-card__body">
          <strong>${n.title}</strong>
          <span>${n.content ? n.content.slice(0, 60) + (n.content.length > 60 ? "..." : "") : "Tanpa isi"}</span>
        </div>
        <div class="admin-card__actions">
          <button class="admin-btn--danger" data-news-delete title="Hapus">✕</button>
        </div>
      </div>`
      )
      .join("");

    listEl.querySelectorAll("[data-news-delete]").forEach((btn, i) => {
      btn.addEventListener("click", async () => {
        if (!confirm(`Hapus "${data[i].title}"?`)) return;
        await supabaseClient.from("news_items").delete().eq("id", data[i].id);
        loadNews();
      });
    });
  }

  document.querySelector("[data-news-form]").addEventListener("submit", async (e) => {
    e.preventDefault();
    const form = e.target;
    const statusEl = document.querySelector("[data-news-status]");
    const title = document.querySelector("[data-news-title]").value.trim();
    const content = document.querySelector("[data-news-content]").value.trim();
    const file = document.querySelector("[data-news-image]").files[0];

    if (!title) return;

    statusEl.textContent = "Menyimpan...";

    try {
      let imageUrl = "";
      if (file) {
        imageUrl = await uploadImage(file, "news");
      }

      const { data: existing } = await supabaseClient.from("news_items").select("sort_order");
      const nextOrder = existing && existing.length ? Math.max(...existing.map((r) => r.sort_order)) + 1 : 0;

      const { error } = await supabaseClient
        .from("news_items")
        .insert([{ title, content, image_url: imageUrl, sort_order: nextOrder }]);

      if (error) throw error;

      form.reset();
      statusEl.textContent = "Tersimpan ✓";
      setTimeout(() => (statusEl.textContent = ""), 2500);
      loadNews();
    } catch (err) {
      statusEl.textContent = "";
      alert("Gagal menyimpan news: " + err.message);
    }
  });

  /* ---------------------------------------------------------- */
  /* GALLERY                                                      */
  /* ---------------------------------------------------------- */
  async function loadGallery() {
    const listEl = document.querySelector("[data-gallery-list]");
    const { data } = await supabaseClient.from("gallery_photos").select("*").order("created_at", { ascending: false });

    if (!data || !data.length) {
      listEl.innerHTML = `<p class="admin-empty">Belum ada foto gallery.</p>`;
      return;
    }

    listEl.innerHTML = data
      .map(
        (g) => `
      <div class="admin-card" data-gallery-id="${g.id}">
        <img class="admin-card__thumb" src="${g.image_url}" alt="Gallery photo" />
        <div class="admin-card__actions">
          <button class="admin-btn--danger" data-gallery-delete title="Hapus">✕</button>
        </div>
      </div>`
      )
      .join("");

    listEl.querySelectorAll("[data-gallery-delete]").forEach((btn, i) => {
      btn.addEventListener("click", async () => {
        if (!confirm("Hapus foto ini?")) return;
        await supabaseClient.from("gallery_photos").delete().eq("id", data[i].id);
        loadGallery();
      });
    });
  }

  document.querySelector("[data-gallery-upload]").addEventListener("change", async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const url = await uploadImage(file, "gallery");
      const { data: existing } = await supabaseClient.from("gallery_photos").select("sort_order");
      const nextOrder = existing && existing.length ? Math.max(...existing.map((r) => r.sort_order)) + 1 : 0;
      await supabaseClient.from("gallery_photos").insert([{ image_url: url, sort_order: nextOrder }]);
      loadGallery();
    } catch (err) {
      alert("Upload gagal: " + err.message);
    }
    e.target.value = "";
  });

  /* ---------------------------------------------------------- */
  /* REGISTRATIONS (read-only + export)                           */
  /* ---------------------------------------------------------- */
  let registrationsCache = [];

  async function loadRegistrations() {
    const tbody = document.querySelector("[data-registrations-table] tbody");
    const { data } = await supabaseClient
      .from("registrations")
      .select("*")
      .order("created_at", { ascending: false });

    registrationsCache = data || [];

    if (!registrationsCache.length) {
      tbody.innerHTML = `<tr><td colspan="7" class="admin-empty">Belum ada registrasi masuk.</td></tr>`;
      return;
    }

    tbody.innerHTML = registrationsCache
      .map(
        (r) => `
      <tr>
        <td>${new Date(r.created_at).toLocaleString("id-ID")}</td>
        <td>${r.full_name}</td>
        <td>${r.email}</td>
        <td>${r.whatsapp}</td>
        <td>${r.company || "-"}</td>
        <td>${r.category}</td>
        <td>${r.notes || "-"}</td>
      </tr>`
      )
      .join("");
  }

  document.querySelector("[data-registrations-export]").addEventListener("click", () => {
    if (!registrationsCache.length) {
      alert("Belum ada data buat di-export.");
      return;
    }
    const header = ["Tanggal", "Nama", "Email", "WhatsApp", "Perusahaan", "Kategori", "Catatan"];
    const rows = registrationsCache.map((r) => [
      new Date(r.created_at).toLocaleString("id-ID"),
      r.full_name,
      r.email,
      r.whatsapp,
      r.company || "",
      r.category,
      (r.notes || "").replace(/\n/g, " "),
    ]);
    const csv = [header, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `registrasi-ikaptri-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  });
});
