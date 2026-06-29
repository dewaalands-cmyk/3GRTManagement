import { prisma } from "./prisma";

const order = [{ order: "asc" as const }, { createdAt: "desc" as const }];

// Semua fungsi dibungkus try/catch supaya halaman tetap render
// meski DB belum siap (mis. sebelum migrasi/seed).
export async function getEvents() {
  try { return await prisma.event.findMany({ orderBy: order }); } catch { return []; }
}
export async function getGalleries() {
  try { return await prisma.gallery.findMany({ orderBy: order }); } catch { return []; }
}
export async function getTestimonials() {
  try { return await prisma.testimonial.findMany({ orderBy: order }); } catch { return []; }
}
export async function getPartners() {
  try { return await prisma.partner.findMany({ orderBy: order }); } catch { return []; }
}
export async function getServices() {
  try { return await prisma.service.findMany({ orderBy: order }); } catch { return []; }
}
export async function getPackages() {
  try {
    const pkgs = await prisma.package.findMany({ orderBy: order });
    return pkgs.map((p) => ({
      ...p,
      features: typeof p.features === "string"
        ? (() => { try { return JSON.parse(p.features as string); } catch { return []; } })()
        : p.features,
    }));
  } catch { return []; }
}
