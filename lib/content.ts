import { prisma } from "./prisma";
import { toProxyUrl } from "./img-proxy";

// ============================================
// KONTEN HALAMAN — default + pengambilan dari DB
// Admin bisa menimpa nilai ini lewat dashboard "Konten".
// ============================================

export interface StatItem { value: string; label: string }
export interface TimelineItem { year: string; title: string; desc: string }

export interface SiteContentData {
  logoUrl: string;
  bgOverlay: number;
  fontScale: number;
  heroBg: string;
  heroBgSlides: string[];
  heroBgDuration: number;
  tentangBg: string;
  whyusBg: string;
  timelineBg: string;
  layananBg: string;
  eventBg: string;
  galeriBg: string;
  kontakBg: string;
  brandName: string;
  hero: {
    eyebrow: string;
    title: string;
    titleAccent: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
  };
  stats: StatItem[];
  about: {
    eyebrow: string;
    title: string;
    paragraphs: string[];
    mediaUrl: string;
  };
  timeline: TimelineItem[];
  whyus: { title: string; subtitle: string; items: string[]; mediaUrl: string };
  servicesIntro: { eyebrow: string; title: string; subtitle: string };
  sponsorshipIntro: { eyebrow: string; title: string; subtitle: string };
  contact: {
    wa: string;
    waDisplay: string;
    email: string;
    location: string;
    address: string;
    instagram: string;
    tiktok: string;
    youtube: string;
  };
  footerTagline: string;
}

export const DEFAULT_CONTENT: SiteContentData = {
  logoUrl: "",
  bgOverlay: 60,
  fontScale: 100,
  heroBg: "",
  heroBgSlides: [],
  heroBgDuration: 5,
  tentangBg: "",
  whyusBg: "",
  timelineBg: "",
  layananBg: "",
  eventBg: "",
  galeriBg: "",
  kontakBg: "",
  brandName: "3GRT Management",
  hero: {
    eyebrow: "Penyelenggara Combat Sport Profesional — Garut, Indonesia",
    title: "Di Sinilah",
    titleAccent: "Legenda Lahir",
    subtitle:
      "3GRT Management bukan sekadar penyelenggara event. Kami panggung tertinggi para petarung — tempat nama besar ditempa, karier dibangun, dan sejarah ditulis.",
    ctaPrimary: "Jadi Mitra Kami",
    ctaSecondary: "Lihat Event Kami",
  },
  stats: [
    { value: "2", label: "Event Internasional" },
    { value: "12+", label: "Atlet Berprestasi" },
    { value: "2", label: "Negara Terlibat" },
    { value: "100%", label: "Komitmen Profesional" },
  ],
  about: {
    eyebrow: "Tentang Kami",
    title: "Kami Tidak Hanya Menyelenggarakan Event — Kami Menciptakan Panggung",
    paragraphs: [
      "Lahir dari kecintaan sejati terhadap seni bela diri, 3GRT Management tumbuh menjadi kekuatan tersendiri di industri combat sport Indonesia. Kami hadir untuk mereka yang berdarah juang.",
      "Dari Muay Thai, MMA, tinju, hingga kickboxing — kami menangani segalanya: konsep event, matchmaking presisi, manajemen atlet, siaran langsung, hingga penyediaan fight gear. Satu atap, satu standar: kelas dunia.",
    ],
    mediaUrl: "",
  },
  timeline: [
    { year: "2024", title: "Langkah Awal", desc: "3GRT Management resmi berdiri dengan visi menjadi panggung combat sport terdepan di Jawa Barat." },
    { year: "2025", title: "Championship Pertama", desc: "Menggelar 3GRT Championship 2025 di SOR Adiwidjaya Garut dengan atlet dari berbagai daerah." },
    { year: "2025", title: "Go Internasional", desc: "Mendatangkan atlet lintas negara dan menerapkan standar produksi serta keselamatan internasional." },
    { year: "2026", title: "Ekspansi", desc: "Memperluas jaringan kemitraan, manajemen atlet, dan distribusi siaran ke audiens yang lebih luas." },
  ],
  whyus: {
    title: "Ketika Reputasi Berbicara Lebih Keras Dari Kata-Kata",
    subtitle: "Di dunia combat sport, kepercayaan dibangun satu event dalam satu waktu. Inilah alasan promotor, atlet, dan brand memilih 3GRT.",
    items: [
      "Event berskala internasional yang diakui",
      "Atlet dari berbagai negara telah bertanding",
      "Tim produksi & medis bersertifikat",
      "Patuh penuh pada regulasi & standar keselamatan",
    ],
    mediaUrl: "",
  },
  servicesIntro: {
    eyebrow: "Layanan",
    title: "Satu Mitra. Semua Solusi.",
    subtitle: "Dari ide hingga eksekusi, kami menangani setiap detail yang membuat sebuah event combat sport berkelas.",
  },
  sponsorshipIntro: {
    eyebrow: "Paket Sponsorship",
    title: "Bawa Brand Anda ke Atas Ring",
    subtitle: "Pilih paket kemitraan yang sesuai dengan tujuan brand Anda. Semua paket dapat disesuaikan.",
  },
  contact: {
    wa: "6281313661740",
    waDisplay: "0813-1366-1740",
    email: "info@3grtmanagement.com",
    location: "Garut, Jawa Barat, Indonesia",
    address: "SOR Adiwidjaya (Sporthall), Garut",
    instagram: "https://www.instagram.com/3grt_management",
    tiktok: "https://www.tiktok.com/@3.grt_",
    youtube: "https://www.youtube.com/@3GRTCHAMPIONSHIP",
  },
  footerTagline:
    "Penyelenggara event combat sport profesional — berstandar nasional, berjiwa internasional.",
};

// Gabung default dengan nilai dari DB (per key di SiteContent).
// raw=true → kembalikan data URL asli (untuk admin editor agar tidak menyimpan proxy URL).
export async function getContent(opts?: { raw?: boolean }): Promise<SiteContentData> {
  let rows: { key: string; value: unknown }[] = [];
  try {
    const raw = await prisma.siteContent.findMany();
    rows = raw.map((r) => ({
      key: r.key,
      value: typeof r.value === "string" ? (() => { try { return JSON.parse(r.value as string); } catch { return r.value; } })() : r.value,
    }));
  } catch {
    return DEFAULT_CONTENT;
  }
  const map = new Map(rows.map((r) => [r.key, r.value]));
  const merged: SiteContentData = structuredClone(DEFAULT_CONTENT);

  (Object.keys(DEFAULT_CONTENT) as (keyof SiteContentData)[]).forEach((key) => {
    if (map.has(key)) {
      const val = map.get(key);
      // Untuk objek, gabung dangkal supaya field baru tetap ada default-nya.
      const target = merged as unknown as Record<string, unknown>;
      if (val && typeof val === "object" && !Array.isArray(val) && typeof merged[key] === "object" && !Array.isArray(merged[key])) {
        target[key] = { ...(merged[key] as object), ...(val as object) };
      } else {
        target[key] = val;
      }
    }
  });
  if (opts?.raw) return merged;

  // Replace base64 data URLs with proxy URLs so HTML stays small.
  // The /api/img endpoint reads from DB and is cached by Vercel's CDN.
  const IMG_FIELDS: (keyof SiteContentData)[] = [
    "logoUrl", "heroBg", "tentangBg", "whyusBg", "timelineBg",
    "layananBg", "eventBg", "galeriBg", "kontakBg",
  ];
  for (const f of IMG_FIELDS) {
    (merged as unknown as Record<string, unknown>)[f] = toProxyUrl(merged[f] as string, `content:${f}`);
  }
  merged.about.mediaUrl   = toProxyUrl(merged.about.mediaUrl,   "content:about:mediaUrl");
  merged.whyus.mediaUrl   = toProxyUrl(merged.whyus.mediaUrl,   "content:whyus:mediaUrl");
  merged.heroBgSlides     = merged.heroBgSlides.map((url, i) =>
    toProxyUrl(url, `content:heroBgSlides:${i}`)
  );

  return merged;
}

// Daftar key konten yang dikelola (untuk halaman admin Konten).
export const CONTENT_KEYS = Object.keys(DEFAULT_CONTENT) as (keyof SiteContentData)[];
