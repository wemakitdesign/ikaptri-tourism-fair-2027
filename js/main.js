/**
 * main.js — IKAPTRI Tourism Fair 2027
 * ------------------------------------------------------------
 * - Render konten dinamis dari IKAPTRI_DATA (js/data.js)
 * - Hero slider (autoplay + manual prev/next + dots)
 * - Mini carousel "5 Pilar Kegiatan"
 * - Toggle nav mobile
 *
 * Catatan integrasi CMS (nanti):
 * Saat admin CMS + Supabase sudah jalan, ganti bagian "ambil data"
 * di bawah ini (yang sekarang baca IKAPTRI_DATA langsung) dengan
 * fetch ke Supabase, lalu fallback ke IKAPTRI_DATA kalau gagal/kosong.
 * Struktur render function-nya sudah dipisah supaya tinggal disambung.
 */

const ICONS = {
  plane: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/></svg>',
  building: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="3" width="16" height="18"/><path d="M9 21v-4h6v4M9 7h1M14 7h1M9 11h1M14 11h1M9 15h1M14 15h1"/></svg>',
  pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>',
  ship: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 17l1.5-6h15L21 17"/><path d="M5 17s2 3 7 3 7-3 7-3"/><path d="M8 11V5h8v6"/></svg>',
  dish: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 3v7a4 4 0 0 0 8 0V3M8 3v7M4 3h4M17 3c-1.5 1.5-2 3-2 5a3 3 0 0 0 3 3v10M17 3c1.5 1.5 2 3 2 5a3 3 0 0 1-3 3"/></svg>',
  bank: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10l9-6 9 6"/><path d="M5 10v9M9 10v9M15 10v9M19 10v9M3 19h18"/></svg>',
  cap: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3 2 8l10 5 10-5-10-5Z"/><path d="M6 10.5V16c0 1.5 2.7 3 6 3s6-1.5 6-3v-5.5"/></svg>',
  people: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="8" r="3"/><path d="M2 20c0-3 3-5 7-5s7 2 7 5"/><circle cx="17" cy="9" r="2.5"/><path d="M16 14c2.8.3 5 2 5 4.5"/></svg>',
  handshake: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12l4-4 4 3 3-3 4 4M2 12l3 6h4l1-2M22 12l-3 6h-4l-1-2"/></svg>',
  bulb: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6M10 22h4M12 2a6 6 0 0 0-4 10.5c.6.6 1 1.4 1 2.5h6c0-1.1.4-1.9 1-2.5A6 6 0 0 0 12 2Z"/></svg>',
  rocket: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 16.5c-1 1-1.5 3.5-1.5 3.5s2.5-.5 3.5-1.5 1-2.5 1-2.5-2 0-3 .5Z"/><path d="M12 15c3-1 7-6 7-10 0 0-6.5 0-10 4-1.5 1.7-2.5 4-2 5.5 1.5.5 3.8-.5 5.5-2Z"/><circle cx="15" cy="9" r="1.2"/></svg>',
  stage: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="10" width="18" height="8" rx="1"/><path d="M7 10V6h10v4M10 18v2M14 18v2"/></svg>',
  booth: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16l-1 6H5L4 4Z"/><path d="M6 10v10h12V10M10 14h4"/></svg>',
  badge: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="9" r="5"/><path d="M8 13.5 6 21l6-3 6 3-2-7.5"/></svg>',
  globe: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.5 4 6 4 9s-1.5 6.5-4 9c-2.5-2.5-4-6-4-9s1.5-6.5 4-9Z"/></svg>',
  podium: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="6" r="2.5"/><path d="M8 21v-4a4 4 0 0 1 8 0v4"/><path d="M6 21h12M9 13h6v4H9z"/></svg>',
  camera: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="7" width="13" height="10" rx="1"/><path d="M16 10.5 21 8v8l-5-2.5"/></svg>',
  monitor: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="12" rx="1"/><path d="M8 20h8M12 16v4"/></svg>',
  brochure: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5v15l4-2 4 2 4-2 4 2V5l-4 2-4-2-4 2-4-2Z"/><path d="M9 9h6M9 13h6"/></svg>',
  flyer: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="3" width="12" height="16" rx="1"/><path d="M8 8h6M8 11h6M8 14h3"/><circle cx="17" cy="17" r="4"/><path d="m19.5 19.5 2 2"/></svg>',
  floorplan: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="1"/><path d="M3 9h18M9 9v12"/><path d="M6 15h.01M6 12h.01"/></svg>',
  bell: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a4 4 0 0 0-4 4c0 4-2 5-2 7h12c0-2-2-3-2-7a4 4 0 0 0-4-4Z"/><path d="M10 19a2 2 0 0 0 4 0"/></svg>',
  calendar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/></svg>',
  instagram: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.3" cy="6.7" r="1.1" fill="currentColor" stroke="none"/></svg>',
  facebook: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M14 8.5h-1.5A1.5 1.5 0 0 0 11 10v2M9 12h4M12.5 12v6.5"/></svg>',
  tiktok: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3v10.8a3.3 3.3 0 1 1-2.8-3.26"/><path d="M14 3.5c.4 2.3 2.1 4 4.5 4.3"/></svg>',
  threads: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M15.5 11.5c0-2-1.3-3.2-3.2-3.2-2 0-3.3 1.3-3.3 3.3 0 1.9 1.3 3.1 3.1 3.4 2.4.4 3.4 1.2 3.4 2.6 0 1.5-1.3 2.4-3.1 2.4-1.6 0-2.8-.7-3.2-1.9"/></svg>',
};

/**
 * hydrateFromSupabase()
 * Kalau Supabase udah dikonfigurasi (lihat js/supabase-config.js) dan
 * datanya ada isinya, timpa IKAPTRI_DATA dengan data dari database
 * SEBELUM semua render*() dipanggil. Kalau belum dikonfigurasi, error,
 * atau tabelnya masih kosong — diem-diem lanjut pakai IKAPTRI_DATA
 * bawaan dari data.js. Fungsi ini sengaja gak pernah throw supaya
 * halaman publik gak pernah ketahan cuma gara-gara Supabase down.
 */
async function hydrateFromSupabase() {
  if (typeof supabaseClient === "undefined" || !supabaseClient) return;

  try {
    const [hero, settings, contacts, news, gallery, mediaKit, program] = await Promise.all([
      supabaseClient.from("hero_slides").select("*").order("sort_order", { ascending: true }),
      supabaseClient.from("site_settings").select("*").in("key", ["countdown", "event"]),
      supabaseClient.from("contact_persons").select("*").order("sort_order", { ascending: true }),
      supabaseClient.from("news_items").select("*").order("created_at", { ascending: false }),
      supabaseClient.from("gallery_photos").select("*").order("created_at", { ascending: false }),
      supabaseClient.from("media_kit").select("*"),
      supabaseClient.from("program_items").select("*").order("sort_order", { ascending: true }),
    ]);

    if (hero.data && hero.data.length) {
      IKAPTRI_DATA.heroSlides = hero.data.map((row, i) => ({
        id: row.id,
        image: row.image_url,
        alt: `Hero slide ${i + 1}`,
      }));
    }

    if (settings.data) {
      settings.data.forEach((row) => {
        if (row.key === "countdown") IKAPTRI_DATA.countdown = { ...IKAPTRI_DATA.countdown, ...row.value };
        if (row.key === "event") IKAPTRI_DATA.event = { ...IKAPTRI_DATA.event, ...row.value };
      });
    }

    if (contacts.data && contacts.data.length) {
      IKAPTRI_DATA.contactPersons = contacts.data.map((row) => ({ name: row.name, phone: row.phone }));
    }

    if (news.data && news.data.length) {
      IKAPTRI_DATA.newsItems = news.data.map((row) => ({
        title: row.title,
        excerpt: row.excerpt || "",
        content: row.content || row.excerpt || "",
        image: row.image_url || "",
        date: row.created_at,
      }));
    }

    if (gallery.data && gallery.data.length) {
      IKAPTRI_DATA.galleryPhotos = gallery.data.map((row) => row.image_url);
    }

    if (mediaKit.data && mediaKit.data.length) {
      // mapping by id (bukan urutan query) supaya urutan tombol di
      // halaman Media tetap: Brochure, E-Flyer, Floor Plan, Company Profile
      const idToIndex = { brochure: 0, flyer: 1, floorplan: 2, profile: 3 };
      mediaKit.data.forEach((row) => {
        const idx = idToIndex[row.id];
        if (idx !== undefined && IKAPTRI_DATA.mediaKit[idx] && row.file_url) {
          IKAPTRI_DATA.mediaKit[idx].file = row.file_url;
          IKAPTRI_DATA.mediaKit[idx].fileName = row.file_name || null;
        }
      });
    }

    if (program.data && program.data.length) {
      IKAPTRI_DATA.programItems = program.data.map((row) => ({
        dayLabel: row.day_label,
        timeLabel: row.time_label || "",
        title: row.title,
        description: row.description || "",
      }));
    }
  } catch (err) {
    // Supabase gagal/timeout -> diem-diem tetap pakai data.js
    console.warn("hydrateFromSupabase() gagal, pakai data statis:", err);
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  await hydrateFromSupabase();

  renderTopbar();
  renderWhySection();
  renderShowcase();
  renderGoals();
  renderConcept();
  renderFooter();
  renderSocialLinks();

  initMobileNav();
  initHeroSlider();
  initPillarSlider();
  renderWhatsappFloat();
  initCountdown();

  // eksibitor page
  renderEksibitorHero();
  renderCorePillars();
  renderClusters();
  renderTargetStats();
  renderTargetIndustries();
  renderKeyHighlights();
  renderValueProposition();
  renderVenue();
  renderBoothPackage();

  // pengunjung page
  initExperienceZones();
  renderPengunjungMeta();

  // media page
  renderMediaKit();
  renderNews();
  renderGallery();

  // program page
  renderProgramContent();

  initScrollReveal();
});

/* ---------------------------------------------------------------- */
/* RENDER: Topbar / Hero text (event name, date, venue)               */
/* ---------------------------------------------------------------- */
function renderTopbar() {
  const { dateLabel, venue, city } = IKAPTRI_DATA.event;
  const dateEl = document.querySelector("[data-event-date]");
  const venueEl = document.querySelector("[data-event-venue]");
  const cityEl = document.querySelector("[data-event-city]");
  if (dateEl) dateEl.textContent = dateLabel;
  if (venueEl) venueEl.textContent = venue;
  if (cityEl) cityEl.textContent = city;
}

/* ---------------------------------------------------------------- */
/* RENDER: Why section paragraphs                                     */
/* ---------------------------------------------------------------- */
function renderWhySection() {
  const wrap = document.querySelector("[data-why-text]");
  if (!wrap) return;
  wrap.innerHTML = IKAPTRI_DATA.whySection.paragraphs
    .map((p) => `<p>${p}</p>`)
    .join("");
}

/* ---------------------------------------------------------------- */
/* RENDER: Showcase icon grid ("Lebih dari Sekedar Pameran")          */
/* ---------------------------------------------------------------- */
function renderShowcase() {
  const grid = document.querySelector("[data-showcase-grid]");
  if (!grid) return;
  grid.innerHTML = IKAPTRI_DATA.showcaseCategories
    .map(
      (item) => `
      <div class="showcase__item">
        <div class="showcase__icon">${ICONS[item.icon] || ""}</div>
        <span>${item.label}</span>
      </div>`
    )
    .join("");
}

/* ---------------------------------------------------------------- */
/* RENDER: Tujuan Acara cards                                         */
/* ---------------------------------------------------------------- */
function renderGoals() {
  const wrap = document.querySelector("[data-goals]");
  if (!wrap) return;
  wrap.innerHTML = IKAPTRI_DATA.goals
    .map(
      (text, i) =>
        `<div class="goals__card goals__card--${i + 1}">${text}</div>`
    )
    .join("");
}

/* ---------------------------------------------------------------- */
/* RENDER: Konsep Acara description                                   */
/* ---------------------------------------------------------------- */
function renderConcept() {
  const el = document.querySelector("[data-concept-desc]");
  if (el) el.textContent = IKAPTRI_DATA.conceptDescription;
}

/* ---------------------------------------------------------------- */
/* RENDER: Footer (contact persons + office)                          */
/* ---------------------------------------------------------------- */
function renderFooter() {
  const contactWrap = document.querySelector("[data-contact-list]");
  if (contactWrap) {
    contactWrap.innerHTML = IKAPTRI_DATA.contactPersons
      .map(
        (c) => `
        <div class="footer__contact">
          <strong>${c.name}</strong>
          <span>${c.phone}</span>
        </div>`
      )
      .join("");
  }

  const officeAddr = document.querySelector("[data-office-address]");
  if (officeAddr) officeAddr.textContent = IKAPTRI_DATA.office.address;
}

function renderSocialLinks() {
  const wrap = document.querySelector("[data-social-links]");
  if (!wrap) return;
  wrap.innerHTML = IKAPTRI_DATA.socialLinks
    .map(
      (s) => `
      <a href="${s.url}" target="_blank" rel="noopener" class="footer__social" aria-label="${s.label}">
        ${ICONS[s.platform] || ""}
      </a>`
    )
    .join("");
}

/* ---------------------------------------------------------------- */
/* COUNTDOWN                                                            */
/* ---------------------------------------------------------------- */
function initCountdown() {
  const wrap = document.querySelector("[data-countdown]");
  if (!wrap) return;

  const cfg = IKAPTRI_DATA.countdown;
  wrap.innerHTML = `
    <div class="countdown__left">
      <img src="${cfg.logo}" alt="${cfg.eventName}" class="countdown__logo" />
      <div>
        <span class="countdown__label">${cfg.label}</span>
        <strong class="countdown__event">${cfg.eventName}</strong>
      </div>
    </div>
    <div class="countdown__timer">
      <div class="countdown__unit"><span data-cd-days>00</span><small>Hari</small></div>
      <span class="countdown__sep">:</span>
      <div class="countdown__unit"><span data-cd-hours>00</span><small>Jam</small></div>
      <span class="countdown__sep">:</span>
      <div class="countdown__unit"><span data-cd-minutes>00</span><small>Menit</small></div>
      <span class="countdown__sep">:</span>
      <div class="countdown__unit"><span data-cd-seconds>00</span><small>Detik</small></div>
    </div>
  `;

  const target = new Date(cfg.targetDate).getTime();
  const daysEl = wrap.querySelector("[data-cd-days]");
  const hoursEl = wrap.querySelector("[data-cd-hours]");
  const minutesEl = wrap.querySelector("[data-cd-minutes]");
  const secondsEl = wrap.querySelector("[data-cd-seconds]");

  function pad(n) { return String(n).padStart(2, "0"); }

  function tick() {
    const now = Date.now();
    let diff = Math.max(target - now, 0);

    const days = Math.floor(diff / 86400000);
    diff -= days * 86400000;
    const hours = Math.floor(diff / 3600000);
    diff -= hours * 3600000;
    const minutes = Math.floor(diff / 60000);
    diff -= minutes * 60000;
    const seconds = Math.floor(diff / 1000);

    daysEl.textContent = pad(days);
    hoursEl.textContent = pad(hours);
    minutesEl.textContent = pad(minutes);
    secondsEl.textContent = pad(seconds);
  }

  tick();
  setInterval(tick, 1000);
}

/* ---------------------------------------------------------------- */
/* WHATSAPP FLOATING BUTTON                                            */
/* ---------------------------------------------------------------- */
function renderWhatsappFloat() {
  const el = document.querySelector("[data-whatsapp-float]");
  if (!el) return;
  const { phone, message } = IKAPTRI_DATA.whatsapp;
  el.href = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

/* ---------------------------------------------------------------- */
/* SCROLL REVEAL ANIMATION (dijalankan di semua halaman)              */
/* ---------------------------------------------------------------- */
function initScrollReveal() {
  // Level 1: section demi section (fade + slide-up satu blok)
  const sectionTargets = document.querySelectorAll(
    "body > section:not(.hero), body > footer, body > .countdown, body > .registrasi-cta"
  );
  sectionTargets.forEach((el) => el.classList.add("reveal"));

  // Level 2: grid/list card di dalam tiap section — muncul satu-satu
  // (staggered) begitu container-nya kelihatan, bukan serempak.
  const groupSelectors = [
    ".showcase__grid",
    ".goals__cards",
    ".core-pillars__grid",
    ".cluster-section__grid",
    ".target-stats__grid",
    ".target-industries__grid",
    ".info-boxes__grid",
    ".news-grid",
    ".gallery-grid",
    ".mediakit-grid",
    ".footer__grid",
    ".event-meta__row",
    ".form-grid",
    ".booth-card",
    ".venue-booth__grid",
    ".map-section__grid",
    ".floorplan__grid",
    ".partners__row",
    ".program-schedule",
  ];
  const groups = document.querySelectorAll(groupSelectors.join(","));
  groups.forEach((el) => el.classList.add("reveal-group"));

  const allTargets = document.querySelectorAll(".reveal, .reveal-group");
  if (!allTargets.length) return;

  if (!("IntersectionObserver" in window)) {
    allTargets.forEach((el) => el.classList.add("is-inview"));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-inview");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
  );

  allTargets.forEach((el) => io.observe(el));
}

/* ---------------------------------------------------------------- */
/* MOBILE NAV TOGGLE                                                   */
/* ---------------------------------------------------------------- */
function initMobileNav() {
  const toggle = document.querySelector("[data-nav-toggle]");
  const list = document.querySelector("[data-nav-list]");
  if (!toggle || !list) return;
  toggle.addEventListener("click", () => list.classList.toggle("is-open"));
}

/* ---------------------------------------------------------------- */
/* HERO SLIDER                                                        */
/* ---------------------------------------------------------------- */
function initHeroSlider() {
  const track = document.querySelector("[data-hero-slides]");
  const dotsWrap = document.querySelector("[data-hero-dots]");
  const prevBtn = document.querySelector("[data-hero-prev]");
  const nextBtn = document.querySelector("[data-hero-next]");
  if (!track) return;

  const slides = IKAPTRI_DATA.heroSlides;
  const config = IKAPTRI_DATA.heroSliderConfig || {};
  let current = 0;
  let timer = null;

  track.innerHTML = slides
    .map(
      (s, i) => `
      <div class="hero__slide${i === 0 ? " is-active" : ""}"
           style="background-image:url('${s.image}')"
           data-index="${i}"
           aria-label="${s.alt || ""}"></div>`
    )
    .join("");

  if (dotsWrap) {
    dotsWrap.innerHTML = slides
      .map(
        (_, i) =>
          `<button class="hero__dot${i === 0 ? " is-active" : ""}" data-goto="${i}" aria-label="Slide ${i + 1}"></button>`
      )
      .join("");
  }

  const slideEls = () => track.querySelectorAll(".hero__slide");
  const dotEls = () => (dotsWrap ? dotsWrap.querySelectorAll(".hero__dot") : []);

  function goTo(index) {
    const total = slides.length;
    const next = (index + total) % total;
    slideEls().forEach((el, i) => {
      el.classList.remove("is-active", "is-prev");
      if (i === next) el.classList.add("is-active");
      if (i === current && i !== next) el.classList.add("is-prev");
    });
    dotEls().forEach((d, i) => d.classList.toggle("is-active", i === next));
    current = next;
  }

  function nextSlide() { goTo(current + 1); }
  function prevSlide() { goTo(current - 1); }

  function startAutoplay() {
    if (!config.autoplay) return;
    stopAutoplay();
    timer = setInterval(nextSlide, config.intervalMs || 5000);
  }
  function stopAutoplay() {
    if (timer) clearInterval(timer);
  }

  if (nextBtn) nextBtn.addEventListener("click", () => { nextSlide(); startAutoplay(); });
  if (prevBtn) prevBtn.addEventListener("click", () => { prevSlide(); startAutoplay(); });
  if (dotsWrap) {
    dotsWrap.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-goto]");
      if (!btn) return;
      goTo(parseInt(btn.dataset.goto, 10));
      startAutoplay();
    });
  }

  const heroEl = document.querySelector(".hero");
  if (heroEl) {
    heroEl.addEventListener("mouseenter", stopAutoplay);
    heroEl.addEventListener("mouseleave", startAutoplay);
  }

  startAutoplay();
}

/* ---------------------------------------------------------------- */
/* EKSIBITOR PAGE                                                      */
/* ---------------------------------------------------------------- */
function renderEksibitorHero() {
  const wrap = document.querySelector("[data-eksibitor-hero]");
  if (!wrap) return;
  const d = IKAPTRI_DATA.eksibitorHero;
  wrap.innerHTML = `
    <div class="container">
      <img src="assets/images/exhibitor-hero-text1.png" alt="${d.label}" class="selayang__label-img" />
      <img src="assets/images/exhibitor-hero-text2.png" alt="${d.title}" class="selayang__title-img" />
      <p class="selayang__subtitle">${d.subtitle}</p>
      <p class="selayang__paragraph">${d.paragraph}</p>
    </div>
    <div class="page-hero__frame">
      <img src="assets/images/hero-frame.png" alt="" />
    </div>
  `;
}

function renderCorePillars() {
  const wrap = document.querySelector("[data-core-pillars]");
  if (!wrap) return;
  wrap.innerHTML = IKAPTRI_DATA.corePillars
    .map(
      (p) => `
      <div class="pillar-item">
        <div class="pillar-item__icon pillar-item__icon--${p.color}">${ICONS[p.icon] || ""}</div>
        <div>
          <h4>${p.title}</h4>
          <p>${p.desc}</p>
        </div>
      </div>`
    )
    .join("");
}

function renderClusters() {
  const wrap = document.querySelector("[data-clusters]");
  if (!wrap) return;
  wrap.innerHTML = IKAPTRI_DATA.clusters
    .map(
      (c) => `
      <div class="cluster-item">
        <div class="cluster-item__icon cluster-item__icon--${c.color}">${ICONS[c.icon] || ""}</div>
        <div>
          <strong>${c.title}</strong>
          <span>(${c.desc})</span>
        </div>
      </div>`
    )
    .join("");
}

function renderTargetStats() {
  const wrap = document.querySelector("[data-target-stats]");
  if (!wrap) return;
  wrap.innerHTML = IKAPTRI_DATA.targetStats
    .map(
      (s) => `
      <div class="stat-item">
        <div class="stat-item__icon">${ICONS[s.icon] || ""}</div>
        <div class="stat-item__value">${s.value}</div>
        <div class="stat-item__label">${s.label}</div>
      </div>`
    )
    .join("");
}

function renderTargetIndustries() {
  const wrap = document.querySelector("[data-target-industries]");
  if (!wrap) return;
  wrap.innerHTML = IKAPTRI_DATA.targetIndustries
    .map(
      (t) => `
      <div class="industry-item">
        <div class="industry-item__icon">${ICONS[t.icon] || ""}</div>
        <span>${t.label}</span>
      </div>`
    )
    .join("");
}

function renderKeyHighlights() {
  const wrap = document.querySelector("[data-key-highlights]");
  if (!wrap) return;
  const d = IKAPTRI_DATA.keyEventHighlights;
  wrap.innerHTML = `
    <div class="info-box info-box--navy">
      <h3>${d.title}</h3>
      <div class="info-box__body">
        <ul>${d.items.map((i) => `<li>${i}</li>`).join("")}</ul>
        <img src="${d.image}" alt="${d.title}" />
      </div>
    </div>`;
}

function renderValueProposition() {
  const wrap = document.querySelector("[data-value-proposition]");
  if (!wrap) return;
  const d = IKAPTRI_DATA.valueProposition;
  wrap.innerHTML = `
    <div class="info-box info-box--teal">
      <h3>${d.title}</h3>
      <div class="info-box__body">
        <ul>${d.items.map((i) => `<li>${i}</li>`).join("")}</ul>
        <img src="${d.image}" alt="${d.title}" />
      </div>
    </div>`;
}

function renderVenue() {
  const wrap = document.querySelector("[data-venue]");
  if (!wrap) return;
  wrap.innerHTML = `<img src="${IKAPTRI_DATA.venue.image}" alt="${IKAPTRI_DATA.venue.name}" />`;
}

function renderBoothPackage() {
  const wrap = document.querySelector("[data-booth-package]");
  if (!wrap) return;
  const d = IKAPTRI_DATA.boothPackage;
  wrap.innerHTML = `
    <div class="booth-card">
      <div class="booth-card__mockup">
        <img src="assets/images/booth-mockup.png" alt="Standard booth mockup" />
      </div>
      <div class="booth-card__info">
        <span class="pill pill--navy">${d.title}</span>
        <ul>${d.features.map((f) => `<li>${f}</li>`).join("")}</ul>
      </div>
      <div class="booth-card__price">
        <p class="booth-card__price-label">Area Ballroom:</p>
        ${d.pricelist
          .map(
            (p) => `
          <div class="price-row">
            <span class="price-row__swatch price-row__swatch--${p.color}"></span>
            <span class="price-row__area">${p.area}</span>
          </div>`
          )
          .join("")}
        <p class="booth-card__price-label">Area Mezzanine:</p>
        <span class="pill pill--outline">${d.mezzanineNote}</span>
      </div>
    </div>`;
}

function initPillarSlider() {
  const wrap = document.querySelector("[data-pillar-slider]");
  const dotsWrap = document.querySelector("[data-pillar-dots]");
  if (!wrap) return;

  const pillars = IKAPTRI_DATA.eventPillars;
  let current = 0;
  let timer = null;

  wrap.innerHTML = pillars
    .map(
      (p, i) => `
      <div class="pillar-slide${i === 0 ? " is-active" : ""}"
           style="background-image:url('${p.image}')" data-index="${i}">
        <div class="pillar-slide__icon">${ICONS[p.icon] || ""}</div>
        <h4>${p.title}</h4>
        <p>${p.desc}</p>
      </div>`
    )
    .join("");

  if (dotsWrap) {
    dotsWrap.innerHTML = pillars
      .map(
        (_, i) =>
          `<button class="${i === 0 ? "is-active" : ""}" data-goto="${i}" aria-label="Pilar ${i + 1}"></button>`
      )
      .join("");
  }

  const slideEls = () => wrap.querySelectorAll(".pillar-slide");
  const dotEls = () => (dotsWrap ? dotsWrap.querySelectorAll("button") : []);

  function goTo(index) {
    const total = pillars.length;
    const next = (index + total) % total;
    slideEls().forEach((el, i) => el.classList.toggle("is-active", i === next));
    dotEls().forEach((d, i) => d.classList.toggle("is-active", i === next));
    current = next;
  }

  function nextSlide() { goTo(current + 1); }

  function startAutoplay() {
    stopAutoplay();
    timer = setInterval(nextSlide, 4000);
  }
  function stopAutoplay() { if (timer) clearInterval(timer); }

  if (dotsWrap) {
    dotsWrap.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-goto]");
      if (!btn) return;
      goTo(parseInt(btn.dataset.goto, 10));
      startAutoplay();
    });
  }

  startAutoplay();
}

/* ---------------------------------------------------------------- */
/* PENGUNJUNG PAGE                                                     */
/* ---------------------------------------------------------------- */
function initExperienceZones() {
  const track = document.querySelector("[data-experience-zones]");
  const viewport = track ? track.closest(".zones-slider__viewport") : null;
  const dotsWrap = document.querySelector("[data-zones-dots]");
  const prevBtn = document.querySelector("[data-zones-prev]");
  const nextBtn = document.querySelector("[data-zones-next]");
  if (!track || !viewport) return;

  const zones = IKAPTRI_DATA.experienceZones;
  const GAP = 20;
  let index = 0;
  let timer = null;

  track.innerHTML = zones
    .map(
      (z, i) => `
      <div class="zone-card${z.textBaked ? " zone-card--baked" : ""}" style="background-image:url('${z.image}')" data-index="${i}">
        ${
          z.textBaked
            ? ""
            : `<span class="zone-card__num">${String(i + 1).padStart(2, "0")}</span>
               <h4>${z.title}</h4>
               <p>${z.desc}</p>`
        }
      </div>`
    )
    .join("");

  function cardWidth() {
    const first = track.querySelector(".zone-card");
    return first ? first.getBoundingClientRect().width : 320;
  }

  function visibleCount() {
    const w = viewport.clientWidth;
    const cw = cardWidth();
    const count = Math.floor((w + GAP) / (cw + GAP));
    return Math.max(1, Math.min(count, zones.length));
  }

  function maxIndex() {
    return Math.max(0, zones.length - visibleCount());
  }

  function renderDots() {
    if (!dotsWrap) return;
    const total = maxIndex() + 1;
    dotsWrap.innerHTML = Array.from({ length: total })
      .map((_, i) => `<button class="${i === index ? "is-active" : ""}" data-goto="${i}" aria-label="Slide ${i + 1}"></button>`)
      .join("");
  }

  function update() {
    const max = maxIndex();
    if (index > max) index = max;
    if (index < 0) index = 0;
    track.style.transform = `translateX(-${index * (cardWidth() + GAP)}px)`;
    if (dotsWrap) {
      dotsWrap.querySelectorAll("button").forEach((d, i) => d.classList.toggle("is-active", i === index));
    }
  }

  function goTo(i) {
    const max = maxIndex();
    index = ((i % (max + 1)) + (max + 1)) % (max + 1);
    update();
  }

  function nextSlide() { goTo(index + 1); }
  function prevSlide() { goTo(index - 1); }

  function startAutoplay() {
    stopAutoplay();
    timer = setInterval(nextSlide, 4000);
  }
  function stopAutoplay() { if (timer) clearInterval(timer); }

  if (nextBtn) nextBtn.addEventListener("click", () => { nextSlide(); startAutoplay(); });
  if (prevBtn) prevBtn.addEventListener("click", () => { prevSlide(); startAutoplay(); });
  if (dotsWrap) {
    dotsWrap.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-goto]");
      if (!btn) return;
      goTo(parseInt(btn.dataset.goto, 10));
      startAutoplay();
    });
  }

  viewport.addEventListener("mouseenter", stopAutoplay);
  viewport.addEventListener("mouseleave", startAutoplay);

  window.addEventListener("resize", () => {
    renderDots();
    update();
  });

  renderDots();
  update();
  startAutoplay();
}

function renderPengunjungMeta() {
  const dateEl = document.querySelector("[data-pengunjung-date]");
  const venueEl = document.querySelector("[data-pengunjung-venue]");
  const hoursEl = document.querySelector("[data-pengunjung-hours]");
  const { dateLabel, venue, city } = IKAPTRI_DATA.event;
  if (dateEl) dateEl.textContent = dateLabel;
  if (venueEl) venueEl.innerHTML = `${venue}<br><small>${city}</small>`;
  if (hoursEl) hoursEl.textContent = `Jam Buka Pameran ${IKAPTRI_DATA.operatingHours}`;
}

/* ---------------------------------------------------------------- */
/* PROGRAM PAGE                                                        */
/* ---------------------------------------------------------------- */
function renderProgramContent() {
  const wrap = document.querySelector("[data-program-content]");
  if (!wrap) return;

  const items = IKAPTRI_DATA.programItems;

  if (!items || !items.length) {
    wrap.innerHTML = `<span class="program-tba__badge">(TBA)</span>`;
    return;
  }

  // kelompokin per hari, urutan tetap ngikutin urutan data (sort_order)
  const days = [];
  items.forEach((item) => {
    let day = days.find((d) => d.dayLabel === item.dayLabel);
    if (!day) {
      day = { dayLabel: item.dayLabel, sessions: [] };
      days.push(day);
    }
    day.sessions.push(item);
  });

  wrap.innerHTML = `
    <div class="program-schedule">
      ${days
        .map(
          (day) => `
        <div class="program-day">
          <h3 class="program-day__title">${day.dayLabel}</h3>
          ${day.sessions
            .map(
              (s) => `
            <div class="program-session">
              ${s.timeLabel ? `<span class="program-session__time">${s.timeLabel}</span>` : ""}
              <div class="program-session__body">
                <strong>${s.title}</strong>
                ${s.description ? `<p>${s.description}</p>` : ""}
              </div>
            </div>`
            )
            .join("")}
        </div>`
        )
        .join("")}
    </div>`;
}

/* ---------------------------------------------------------------- */
/* MEDIA PAGE                                                          */
/* ---------------------------------------------------------------- */
function renderMediaKit() {
  const wrap = document.querySelector("[data-media-kit]");
  if (!wrap) return;
  wrap.innerHTML = IKAPTRI_DATA.mediaKit
    .map(
      (m, i) => `
      <button
        type="button"
        class="mediakit-btn mediakit-btn--${m.color}"
        data-mediakit-download="${i}"
        data-file="${m.file}"
        data-filename="${m.fileName || m.label}"
      >
        <span class="mediakit-btn__icon">${ICONS[m.icon] || ""}</span>
        <span data-mediakit-label>${m.label}</span>
      </button>`
    )
    .join("");

  wrap.querySelectorAll("[data-mediakit-download]").forEach((btn) => {
    btn.addEventListener("click", () => downloadMediaKitFile(btn));
  });
}

async function downloadMediaKitFile(btn) {
  const url = btn.dataset.file;
  const suggestedName = btn.dataset.filename || "file";
  const labelEl = btn.querySelector("[data-mediakit-label]");
  const originalLabel = labelEl ? labelEl.textContent : "";

  if (!url || url === "#") {
    alert("File ini belum tersedia. Coba lagi nanti ya.");
    return;
  }

  btn.disabled = true;
  if (labelEl) labelEl.textContent = "Mengunduh...";

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Gagal mengambil file");
    const blob = await res.blob();

    // tebak nama file dari URL kalau nama aslinya gak ada di data
    let fileName = suggestedName;
    if (fileName === originalLabel) {
      const urlParts = url.split("/").pop().split("?")[0];
      if (urlParts.includes(".")) fileName = urlParts;
    }

    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(blobUrl);
  } catch (err) {
    console.warn("Download gagal, buka file di tab baru sebagai fallback:", err);
    window.open(url, "_blank", "noopener");
  } finally {
    btn.disabled = false;
    if (labelEl) labelEl.textContent = originalLabel;
  }
}

function renderNews() {
  const wrap = document.querySelector("[data-news-list]");
  if (!wrap) return;
  const colors = ["navy", "orange", "teal"];
  wrap.innerHTML = IKAPTRI_DATA.newsItems
    .map((n, i) => {
      const dateLabel = n.date
        ? new Date(n.date).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })
        : "";
      return `
      <article class="news-card news-card--${colors[i % colors.length]}" data-news-open="${i}">
        <div class="news-card__img" style="background-image:url('${n.image}')"></div>
        <div class="news-card__body">
          <h4>${n.title}</h4>
          ${dateLabel ? `<span class="news-card__date">${ICONS.calendar} ${dateLabel}</span>` : ""}
        </div>
      </article>`;
    })
    .join("");

  wrap.querySelectorAll("[data-news-open]").forEach((card) => {
    card.addEventListener("click", () => openNewsModal(IKAPTRI_DATA.newsItems[parseInt(card.dataset.newsOpen, 10)]));
  });
}

function openNewsModal(item) {
  let modal = document.querySelector("[data-news-modal]");
  if (!modal) {
    modal = document.createElement("div");
    modal.setAttribute("data-news-modal", "");
    modal.className = "news-modal";
    modal.innerHTML = `
      <div class="news-modal__backdrop" data-news-modal-close></div>
      <div class="news-modal__box">
        <button class="news-modal__close" data-news-modal-close aria-label="Tutup">&times;</button>
        <div class="news-modal__img" data-news-modal-img></div>
        <div class="news-modal__body">
          <h3 data-news-modal-title></h3>
          <p data-news-modal-content></p>
        </div>
      </div>`;
    document.body.appendChild(modal);
    modal.querySelectorAll("[data-news-modal-close]").forEach((el) =>
      el.addEventListener("click", () => modal.classList.remove("is-open"))
    );
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") modal.classList.remove("is-open");
    });
  }

  modal.querySelector("[data-news-modal-img]").style.backgroundImage = `url('${item.image}')`;
  modal.querySelector("[data-news-modal-title]").textContent = item.title;
  modal.querySelector("[data-news-modal-content]").textContent = item.content || item.excerpt || "";
  modal.classList.add("is-open");
}

function renderGallery() {
  const wrap = document.querySelector("[data-gallery]");
  if (!wrap) return;

  const PER_PAGE = 9;
  const photos = IKAPTRI_DATA.galleryPhotos;
  const totalPages = Math.max(1, Math.ceil(photos.length / PER_PAGE));
  let currentPage = 1;

  const pagerWrap = document.querySelector("[data-gallery-pager]");

  function renderPage() {
    const start = (currentPage - 1) * PER_PAGE;
    const pagePhotos = photos.slice(start, start + PER_PAGE);
    wrap.innerHTML = pagePhotos
      .map(
        (src, i) =>
          `<div class="gallery-item corner-cut" style="background-image:url('${src}')" data-gallery-open="${start + i}"></div>`
      )
      .join("");

    wrap.querySelectorAll("[data-gallery-open]").forEach((el) => {
      el.addEventListener("click", () => openGalleryModal(parseInt(el.dataset.galleryOpen, 10)));
    });

    if (pagerWrap) {
      if (totalPages <= 1) {
        pagerWrap.innerHTML = "";
        return;
      }
      let pagesHtml = "";
      for (let p = 1; p <= totalPages; p++) {
        pagesHtml += `<button class="gallery-pager__page${p === currentPage ? " is-active" : ""}" data-gallery-page="${p}">${p}</button>`;
      }
      pagerWrap.innerHTML = `
        <button class="gallery-pager__nav" data-gallery-prev ${currentPage === 1 ? "disabled" : ""}>&#8249;</button>
        ${pagesHtml}
        <button class="gallery-pager__nav" data-gallery-next ${currentPage === totalPages ? "disabled" : ""}>&#8250;</button>
      `;

      pagerWrap.querySelectorAll("[data-gallery-page]").forEach((btn) => {
        btn.addEventListener("click", () => {
          currentPage = parseInt(btn.dataset.galleryPage, 10);
          renderPage();
          wrap.scrollIntoView({ behavior: "smooth", block: "start" });
        });
      });
      const prevBtn = pagerWrap.querySelector("[data-gallery-prev]");
      const nextBtn = pagerWrap.querySelector("[data-gallery-next]");
      if (prevBtn) prevBtn.addEventListener("click", () => { if (currentPage > 1) { currentPage--; renderPage(); wrap.scrollIntoView({ behavior: "smooth", block: "start" }); } });
      if (nextBtn) nextBtn.addEventListener("click", () => { if (currentPage < totalPages) { currentPage++; renderPage(); wrap.scrollIntoView({ behavior: "smooth", block: "start" }); } });
    }
  }

  renderPage();
}

let galleryModalIndex = 0;

function openGalleryModal(index) {
  const photos = IKAPTRI_DATA.galleryPhotos;
  galleryModalIndex = index;

  let modal = document.querySelector("[data-gallery-modal]");
  if (!modal) {
    modal = document.createElement("div");
    modal.setAttribute("data-gallery-modal", "");
    modal.className = "gallery-modal";
    modal.innerHTML = `
      <div class="gallery-modal__backdrop" data-gallery-modal-close></div>
      <button class="gallery-modal__close" data-gallery-modal-close aria-label="Tutup">&times;</button>
      <button class="gallery-modal__nav gallery-modal__nav--prev" data-gallery-modal-prev aria-label="Sebelumnya">&#8249;</button>
      <img class="gallery-modal__img" data-gallery-modal-img alt="Gallery preview" />
      <button class="gallery-modal__nav gallery-modal__nav--next" data-gallery-modal-next aria-label="Berikutnya">&#8250;</button>
    `;
    document.body.appendChild(modal);

    modal.querySelectorAll("[data-gallery-modal-close]").forEach((el) =>
      el.addEventListener("click", () => modal.classList.remove("is-open"))
    );
    modal.querySelector("[data-gallery-modal-prev]").addEventListener("click", () => {
      const total = IKAPTRI_DATA.galleryPhotos.length;
      galleryModalIndex = (galleryModalIndex - 1 + total) % total;
      updateGalleryModalImg(modal);
    });
    modal.querySelector("[data-gallery-modal-next]").addEventListener("click", () => {
      const total = IKAPTRI_DATA.galleryPhotos.length;
      galleryModalIndex = (galleryModalIndex + 1) % total;
      updateGalleryModalImg(modal);
    });
    document.addEventListener("keydown", (e) => {
      if (!modal.classList.contains("is-open")) return;
      if (e.key === "Escape") modal.classList.remove("is-open");
      if (e.key === "ArrowLeft") modal.querySelector("[data-gallery-modal-prev]").click();
      if (e.key === "ArrowRight") modal.querySelector("[data-gallery-modal-next]").click();
    });
  }

  updateGalleryModalImg(modal);
  modal.classList.add("is-open");
}

function updateGalleryModalImg(modal) {
  modal.querySelector("[data-gallery-modal-img]").src = IKAPTRI_DATA.galleryPhotos[galleryModalIndex];
}
