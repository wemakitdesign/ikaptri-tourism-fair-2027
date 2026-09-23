/**
 * data.js — Fallback content untuk IKAPTRI Tourism Fair 2027
 * ------------------------------------------------------------
 * Pola sama seperti imwte_project: object ini dipakai sebagai fallback
 * ketika Supabase belum dikonfigurasi / gagal fetch. Nanti setiap key
 * di sini akan punya tabel/row yang sesuai di Supabase, dan admin CMS
 * akan menimpa (override) nilai default ini.
 *
 * Struktur sengaja dibuat flat & predictable per section supaya mapping
 * ke tabel Supabase gampang:
 *   - heroSlides      -> table: hero_slides
 *   - contactPersons  -> table: contact_persons
 *   - eventPillars    -> table: event_pillars (dipakai di "5 Pilar Kegiatan")
 */

const IKAPTRI_DATA = {
  event: {
    name: "IKAPTRI Tourism Fair 2027",
    tagline: "Alumni Bersatu, Pariwisata Berdaya dan Berkelanjutan",
    dateLabel: "29-30 Januari 2027",
    venue: "Astaka Grand Ballroom, ARTOTEL Gelora Senayan",
    city: "Jakarta - Indonesia",
  },

  // ganti "image" di tiap slide dengan path foto asli setelah diupload.
  // urutan slide = urutan tampil di hero.
  heroSlides: [
    {
      id: 1,
      image: "assets/images/hero-slide-1.jpg",
      alt: "Hero slide 1",
    },
    {
      id: 2,
      image: "assets/images/hero-slide-2.jpg",
      alt: "Hero slide 2",
    },
    {
      id: 3,
      image: "assets/images/hero-slide-3.jpg",
      alt: "Hero slide 3",
    },
    {
      id: 4,
      image: "assets/images/hero-slide-4.jpg",
      alt: "Hero slide 4",
    },
    {
      id: 5,
      image: "assets/images/hero-slide-5.jpg",
      alt: "Hero slide 5",
    },
  ],

  heroSliderConfig: {
    autoplay: true,
    intervalMs: 5000,
    direction: "rtl", // slide masuk dari kanan ke kiri
  },

  whySection: {
    paragraphs: [
      "Selama lebih dari lima dekade, Institut Pariwisata Trisakti telah melahirkan ribuan alumni yang berkiprah sebagai pemimpin di berbagai sektor wisata, MICE, kuliner, hingga kewirausahaan.",
      "Namun hingga saat ini, belum terdapat sebuah agenda tahunan yang secara khusus menjadi wadah untuk mempertemukan seluruh ekosistem tersebut dalam satu platform yang berkelanjutan.",
      "Di sisi lain, industri pariwisata Indonesia terus berkembang dan menghadapi tantangan baru. Transformasi digital, perubahan perilaku wisatawan, kebutuhan akan talenta berkualitas, serta kolaborasi antara dunia pendidikan dan industri menjadi faktor penting dalam menjaga daya saing Indonesia sebagai destinasi wisata dunia.",
      "Oleh karena itu, diperlukan sebuah platform yang tidak hanya menjadi ajang promosi, tetapi juga menghadirkan ruang kolaborasi, pembelajaran, networking, dan peluang bisnis bagi seluruh pemangku kepentingan.",
    ],
  },

  showcaseCategories: [
    { label: "Airlines", icon: "plane" },
    { label: "Hotel & Resort", icon: "building" },
    { label: "Destinasi & Wisata", icon: "pin" },
    { label: "Cruise & Travel Operator", icon: "ship" },
    { label: "Hospitality & Culinary", icon: "dish" },
    { label: "Pemerintah & Tourism Board", icon: "bank" },
    { label: "Alumni Institut Pariwisata Trisakti", icon: "cap" },
    { label: "Mahasiswa", icon: "people" },
    { label: "Investor & Corporate Partner", icon: "handshake" },
  ],

  goals: [
    "Mempertemukan hubungan antara alumni, kampus, industri, dan pemerintah",
    "Mendorong kolaborasi & kemitraan bisnis di sektor pariwisata dan hospitality",
    "Menjadi wadah edukasi & inspirasi bagi mahasiswa dan pelaku industri",
  ],

  conceptDescription:
    "IKAPTRI TOURISM FAIR adalah Business & Networking Platform berskala nasional yang mengintegrasikan pameran, forum pengetahuan, networking, dan experiences dalam satu festival pariwisata yang inspiratif, produktif, dan berkelas.",

  // dipakai oleh mini-carousel "5 PILAR KEGIATAN" di section Konsep Acara,
  // dan juga oleh "5 Experience Zones" di halaman Pengunjung
  eventPillars: [
    {
      id: 1,
      title: "Exhibition & Expo",
      desc: "Pameran produk & layanan pariwisata, travel, hospitality, dan lifestyle",
      icon: "booth",
      image: "assets/images/pilar-1.jpg",
    },
    {
      id: 2,
      title: "Knowledge & Forum",
      desc: "Seminar, talkshow, sharing session dari pakar industri dan praktisi",
      icon: "podium",
      image: "assets/images/pilar-2.jpg",
    },
    {
      id: 3,
      title: "Business Matching",
      desc: "Pertemuan bisnis terjadwal untuk membangun peluang kerja sama",
      icon: "handshake",
      image: "assets/images/pilar-3.jpg",
    },
    {
      id: 4,
      title: "Networking Plaza",
      desc: "Ruang interaksi alumni, industri, komunitas & pemerintah",
      icon: "people",
      image: "assets/images/pilar-4.jpg",
    },
    {
      id: 5,
      title: "Experience Zone",
      desc: "Travel experience, culinary area, culture showcase & entertainment",
      icon: "bell",
      image: "assets/images/pilar-5.jpg",
    },
  ],

  // dipakai khusus di halaman Pengunjung ("5 Experience Zones") — beberapa
  // slide sudah include teks di dalam gambarnya sendiri (textBaked: true),
  // jadi overlay judul/desc dari CSS otomatis disembunyikan untuk slide itu.
  experienceZones: [
    {
      id: 1,
      title: "Exhibition & Expo",
      desc: "Pameran produk & layanan pariwisata, travel, hospitality, dan lifestyle",
      icon: "booth",
      image: "assets/images/pilar-1.jpg",
      textBaked: false,
    },
    {
      id: 2,
      title: "Knowledge & Forum",
      desc: "Seminar, talkshow, sharing session dari pakar industri dan praktisi",
      icon: "podium",
      image: "assets/images/pilar-2.jpg",
      textBaked: false,
    },
    {
      id: 3,
      title: "Business Matching",
      desc: "Pertemuan bisnis terjadwal untuk membangun peluang kerja sama",
      icon: "handshake",
      image: "assets/images/pilar-3.jpg",
      textBaked: false,
    },
    {
      id: 4,
      title: "Alumni Talk",
      desc: "Sesi talk inspiratif bersama alumni sukses dari berbagai sektor pariwisata dan bisnis",
      icon: "podium",
      image: "assets/images/experience-4.jpg",
      textBaked: true,
    },
    {
      id: 5,
      title: "Gala Dinner",
      desc: "Area terbuka untuk menikmati kuliner terbaik, hiburan menarik, dan suasana santai yang mempererat koneksi",
      icon: "dish",
      image: "assets/images/experience-5.jpg",
      textBaked: true,
    },
  ],

  countdown: {
    label: "Menuju",
    eventName: "IKAPTRI Tourism Fair 2027",
    // ISO datetime target hitung mundur (WIB, UTC+7)
    targetDate: "2027-01-29T00:00:00+07:00",
    logo: "assets/images/logo-putih.png",
  },

  contactPersons: [
    { name: "Stevanya", phone: "+62-819-3203-1887" },
    { name: "Patricia Paty", phone: "+62-856-9377-8231" },
  ],

  whatsapp: {
    phone: "6281932031887",
    message: "Halo, saya tertarik dengan IKAPTRI Tourism Fair 2027",
  },

  office: {
    label: "Office",
    address:
      "Jl. Taman Pendidikan II No.2, RT.3/RW.10, Cilandak Bar., Kec. Cilandak, Kota Jakarta Selatan, Daerah Khusus Ibukota Jakarta 12430",
  },

  // ================= EKSIBITOR PAGE =================
  eksibitorHero: {
    label: "SELAYANG PANDANG",
    title: "IKAPTRI TOURISM FAIR 2027",
    subtitle: "Menghubungkan Ekosistem, Menginspirasi Masa Depan Pariwisata Indonesia",
    paragraph:
      "Selama lebih dari lima dekade, Institut Pariwisata Trisakti telah menjadi pilar utama dalam melahirkan puluhan ribu alumni berprestasi, profesional, dan wirausahawan di berbagai sektor industri—mulai dari pariwisata, hospitality, MICE, kuliner, hingga ekonomi kreatif. Di tengah pesatnya transformasi digital dan perubahan perilaku wisatawan global, industri pariwisata Indonesia dituntut untuk terus beradaptasi. Meningkatnya kebutuhan akan talenta berkualitas serta pentingnya sinergi antara dunia pendidikan dan industri menjadi kunci utama dalam menjaga daya saing Indonesia sebagai destinasi wisata unggulan dunia. Menjawab tantangan tersebut, IKAPTRI Tourism Fair 2027 hadir sebagai wadah tahunan kolaboratif dan berkelanjutan yang mempertemukan seluruh pemangku kepentingan dalam satu ekosistem terpadu.",
  },

  corePillars: [
    {
      title: "Connect",
      desc: "Mempertemukan alumni, industri, komunitas, pemerintah, dan pelaku usaha pariwisata dalam satu jaringan yang kuat",
      icon: "handshake",
      color: "teal",
    },
    {
      title: "Learn",
      desc: "Menghadirkan wawasan pengetahuan, dan inspirasi terkini untuk mendorong inovasi dan daya saing industri",
      icon: "bulb",
      color: "blue",
    },
    {
      title: "Grow",
      desc: "Membuka peluang bisnis, kolaborasi, investasi, dan pengembangan karir di industri pariwisata",
      icon: "rocket",
      color: "orange",
    },
  ],

  clusters: [
    { title: "Klaster 1", desc: "Stage & Area Ceremonial (Theater Seat)", icon: "stage", color: "orange" },
    { title: "Klaster 2", desc: "Booth Seller Asosiasi Pariwisata", icon: "booth", color: "navy" },
    { title: "Klaster 3", desc: "Booth Seller Alumni Wirausaha", icon: "booth", color: "navy" },
    { title: "Klaster 4", desc: "IP Trisakti & IKAPTRI (Co-Branded)", icon: "badge", color: "orange" },
    { title: "Klaster 5", desc: "Dinas Pariwisata & UMKM Mitra", icon: "globe", color: "orange" },
    { title: "Klaster 6", desc: "F&B Corner & Culinary Zone", icon: "dish", color: "navy" },
  ],

  targetStats: [
    { value: "40 BOOTH", label: "Exhibitor & Partner", icon: "booth" },
    { value: "3.000-5.000", label: "Pengunjung per hari", icon: "people" },
    { value: "30+", label: "Speakers & Industry Leaders", icon: "podium" },
    { value: "100", label: "Hosted Buyers & Business Delegates", icon: "handshake" },
    { value: "50", label: "Media Partner & Industry Press", icon: "camera" },
  ],

  targetIndustries: [
    { label: "Airlines & Travel", icon: "plane" },
    { label: "Hotel & Resort", icon: "building" },
    { label: "Tourism Board & Destination", icon: "pin" },
    { label: "Cruise & Marine Tourism", icon: "ship" },
    { label: "OTA & Travel Agent", icon: "monitor" },
    { label: "Hospitality Supplier", icon: "dish" },
    { label: "Travel & Tourism Startup", icon: "rocket" },
  ],

  keyEventHighlights: {
    title: "Key Event Highlights",
    items: [
      "International Tourism Forum",
      "Business Matching & Investment Forum",
      "Alumni Business Showcase",
      "Skill Development Workshops",
      "Food Festival & Cultural Performance",
    ],
    image: "assets/images/key-highlight-photo.png",
  },

  valueProposition: {
    title: "Value Proposition",
    items: [
      "Business Growth & Market Expansion",
      "Knowledge Sharing & Industry Insight",
      "Strategic Partnership Opportunities",
      "Networking with Industry Leaders",
      "Lifetime Alumni Engagement",
    ],
    image: "assets/images/value-prop-photo.png",
  },

  venue: {
    image: "assets/images/venue.jpg",
    name: "ARTOTEL Gelora Senayan",
  },

  boothPackage: {
    title: "Standard Booth",
    features: [
      "Partisi R8 system",
      "Fascia board dengan nama perusahaan",
      "1 Meja + 2 kursi",
      "1 Stop kontak",
      "2 Lampu TL",
      "Karpet",
      "Listrik 2 Amp (220 watt)",
    ],
    pricelist: [
      { area: "2X3 m (6sqm)", price: "12.000.000", color: "light-blue" },
      { area: "2X2 m (4sqm)", price: "10.000.000", color: "peach" },
    ],
    mezzanineNote: "PAKET SPONSORSHIP",
  },

  // ================= PENGUNJUNG PAGE =================
  pengunjungHero: {
    title: "TERBUKA UNTUK UMUM!!",
    zonesLabel: "5 Zona Eksplorasi",
    zonesSubLabel: "1 Perjalanan Luar Biasa",
  },

  // "5 Experience Zones" — slider satu-per-satu di halaman Pengunjung.
  // Zone 1-3 pakai foto polos (teks di-render CSS di atasnya, textBaked:false).
  // Zone 4-5 pakai desain kartu yang teksnya sudah menyatu di gambar (textBaked:true),
  // jadi tidak perlu overlay judul/deskripsi lagi dari JS.
  experienceZones: [
    {
      id: 1,
      title: "Exhibition & Expo",
      desc: "Pameran produk & layanan pariwisata, travel, hospitality, dan lifestyle",
      icon: "booth",
      image: "assets/images/pilar-1.jpg",
      textBaked: false,
    },
    {
      id: 2,
      title: "Knowledge & Forum",
      desc: "Seminar, talkshow, sharing session dari pakar industri dan praktisi",
      icon: "podium",
      image: "assets/images/pilar-2.jpg",
      textBaked: false,
    },
    {
      id: 3,
      title: "Business Matching",
      desc: "Pertemuan bisnis terjadwal untuk membangun peluang kerja sama",
      icon: "handshake",
      image: "assets/images/pilar-3.jpg",
      textBaked: false,
    },
    {
      id: 4,
      title: "Alumni Talk",
      desc: "Sesi talk inspiratif bersama alumni sukses dari berbagai sektor pariwisata dan bisnis",
      icon: "podium",
      image: "assets/images/zone-4.png",
      textBaked: false,
    },
    {
      id: 5,
      title: "Gala Dinner",
      desc: "Area terbuka untuk menikmati kuliner terbaik, hiburan menarik, dan suasana santai yang mempererat koneksi",
      icon: "dish",
      image: "assets/images/zone-5.png",
      textBaked: false,
    },
  ],

  operatingHours: "10:00 - 21:00",

  // ================= PROGRAM PAGE =================
  // Kosong = halaman Program tampil badge "(TBA)". Begitu admin
  // nambah sesi lewat CMS, array ini otomatis keisi (lihat
  // hydrateFromSupabase() di main.js) dan halaman ganti jadi jadwal.
  programItems: [],

  // ================= MEDIA PAGE =================
  mediaKit: [
    { label: "Brochure", icon: "brochure", color: "orange", file: "#", fileName: null },
    { label: "E-Flyer", icon: "flyer", color: "navy", file: "#", fileName: null },
    { label: "Floor Plan", icon: "floorplan", color: "teal", file: "#", fileName: null },
    { label: "Company Profile", icon: "building", color: "blue", file: "#", fileName: null },
  ],

  newsItems: [
    {
      title: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut",
      excerpt:
        "Laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.",
      content:
        "Laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis.",
      image: "assets/images/news-1.jpg",
    },
    {
      title: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut",
      excerpt:
        "Laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.",
      content:
        "Laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis.",
      image: "assets/images/news-2.jpg",
    },
    {
      title: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut",
      excerpt:
        "Laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.",
      content:
        "Laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis.",
      image: "assets/images/news-3.jpg",
    },
  ],

  galleryPhotos: [
    "assets/images/gallery-1.jpg",
    "assets/images/gallery-2.jpg",
    "assets/images/gallery-3.jpg",
    "assets/images/gallery-4.jpg",
    "assets/images/gallery-5.jpg",
    "assets/images/gallery-6.jpg",
    "assets/images/gallery-7.jpg",
    "assets/images/gallery-8.jpg",
    "assets/images/gallery-9.jpg",
    "assets/images/gallery-10.jpg",
    "assets/images/gallery-11.jpg",
    "assets/images/gallery-12.jpg",
    "assets/images/gallery-13.jpg",
  ],

};
