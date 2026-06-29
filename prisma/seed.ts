import { PrismaClient } from "@prisma/client";
import { scryptSync, randomBytes } from "crypto";

const prisma = new PrismaClient();

function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

async function main() {
  console.log("🌱 Mulai seeding...");

  // --- Admin default ---
  const username = "admin";
  const password = "Admin@3grt";
  await prisma.user.upsert({
    where: { username },
    update: {},
    create: {
      username,
      email: "admin@3grtmanagement.com",
      passwordHash: hashPassword(password),
    },
  });
  console.log(`✅ Admin siap  ->  username: ${username}  |  password: ${password}`);

  // --- Layanan ---
  if ((await prisma.service.count()) === 0) {
    await prisma.service.createMany({
      data: [
        { title: "Combat Event Organizer & Fight Gear", description: JSON.stringify(["Dari konsep, venue, matchmaking, hingga eksekusi hari-H yang rapi.", "Kami menyediakan fight gear lengkap untuk setiap event."]), order: 1 },
        { title: "Manajemen Atlet", description: JSON.stringify(["Kami kelola karier petarung secara total: pendampingan, jadwal tanding strategis, negosiasi kontrak, hingga branding personal."]), order: 2 },
        { title: "Matchmaking Presisi", description: JSON.stringify(["Penjodohan laga berbasis data — kelas, rekam jejak, gaya bertarung, dan regulasi — untuk laga yang adil dan mendebarkan."]), order: 3 },
        { title: "Siaran & Distribusi Konten", description: JSON.stringify(["Produksi multi-kamera profesional dan live streaming ke audiens luas — event Anda menjangkau jauh melampaui arena."]), order: 4 },
        { title: "Kemitraan & Sponsorship", description: JSON.stringify(["Paket sponsorship fleksibel yang menghubungkan brand Anda dengan audiens combat sport yang loyal."]), order: 5 },
        { title: "Promosi & Hype Building", description: JSON.stringify(["Strategi promosi menyeluruh — teaser, narasi petarung, hingga kampanye media sosial yang membangun hype sebelum bel berbunyi."]), order: 6 },
      ],
    });
    console.log("✅ 6 layanan dibuat");
  }

  // --- Event ---
  if ((await prisma.event.count()) === 0) {
    await prisma.event.createMany({
      data: [
        { title: "3GRT Championship 2025", badge: "INTERNASIONAL", date: "29-30 November 2025", location: "SOR Adiwidjaya (Sporthall), Garut", description: "Ajang combat sport bertaraf internasional pertama 3GRT — mempertemukan atlet terbaik lintas daerah dan negara.", order: 1 },
        { title: "Segera Hadir", badge: "SEGERA", date: "Soon 2026", location: "Akan Diumumkan", description: "Event berikutnya sedang kami siapkan. Nantikan pengumuman resminya.", order: 2 },
        { title: "Segera Hadir", badge: "SEGERA", date: "Soon 2027", location: "Akan Diumumkan", description: "Panggung baru untuk para legenda berikutnya.", order: 3 },
      ],
    });
    console.log("✅ 3 event dibuat");
  }

  // --- Galeri ---
  if ((await prisma.gallery.count()) === 0) {
    await prisma.gallery.createMany({
      data: [
        { title: "Farhan Omar vs Erlangga", type: "video", youtubeId: "HdbFDNvafsk", order: 1 },
        { title: "Indrayanto vs Ucu Rohendi", type: "video", youtubeId: "BBUsKgMYJkU", order: 2 },
        { title: "Putri Yaasin vs Rika Ule", type: "video", youtubeId: "I3imH6XjxBI", order: 3 },
        { title: "Habib Fadli vs Firdaus Aiman", type: "video", youtubeId: "j1GR3EDhO_k", order: 4 },
      ],
    });
    console.log("✅ 4 video galeri dibuat");
  }

  // --- Testimoni ---
  if ((await prisma.testimonial.count()) === 0) {
    await prisma.testimonial.createMany({
      data: [
        { quote: "3GRT memberi saya panggung yang selama ini saya impikan. Profesionalisme mereka dari matchmaking hingga hari-H luar biasa — saya merasa benar-benar dihargai sebagai atlet.", name: "Ahmad Rizky", role: "Atlet Muay Thai", rating: 5, order: 1 },
        { quote: "Sudah kerja sama dengan banyak promotor, tapi 3GRT punya level tersendiri. Manajemen event terorganisir, komunikasi lancar, dan standar keselamatan benar-benar dijaga.", name: "Coach Dani Pratama", role: "Pelatih & Promotor", rating: 5, order: 2 },
        { quote: "Bermitra dengan 3GRT adalah keputusan terbaik. Brand kami mendapat exposure signifikan dan dikaitkan dengan nilai-nilai positif dari dunia sport profesional.", name: "PT Nita Gennaro Mandiri", role: "Mitra Bisnis", rating: 5, order: 3 },
      ],
    });
    console.log("✅ 3 testimoni dibuat");
  }

  // --- Mitra ---
  if ((await prisma.partner.count()) === 0) {
    await prisma.partner.createMany({
      data: [
        { name: "Muay Thai School Garut", url: "https://muaythaischoolgarut.vercel.app/", order: 1 },
        { name: "3GRT Fight Gear", order: 2 },
        { name: "PT Nita Gennaro Mandiri", order: 3 },
      ],
    });
    console.log("✅ 3 mitra dibuat");
  }

  // --- Paket Sponsorship ---
  if ((await prisma.package.count()) === 0) {
    await prisma.package.createMany({
      data: [
        { name: "Bronze", price: "Rp 5.000.000", description: "Untuk brand yang ingin mulai tampil di arena.", features: JSON.stringify(["Logo di backdrop event", "Mention di media sosial", "2 tiket VIP"]), highlighted: false, order: 1 },
        { name: "Gold", price: "Rp 15.000.000", description: "Pilihan paling populer dengan exposure menyeluruh.", features: JSON.stringify(["Semua benefit Bronze", "Logo di ring & banner utama", "Spot iklan saat siaran", "Booth di venue", "6 tiket VIP"]), highlighted: true, order: 2 },
        { name: "Platinum", price: "Hubungi Kami", description: "Kemitraan eksklusif sebagai sponsor utama event.", features: JSON.stringify(["Semua benefit Gold", "Naming rights event", "Segmen khusus saat siaran", "Konten kustom bersama atlet", "Tiket VIP tak terbatas"]), highlighted: false, order: 3 },
      ],
    });
    console.log("✅ 3 paket sponsorship dibuat");
  }

  console.log("🎉 Seeding selesai!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding gagal:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
