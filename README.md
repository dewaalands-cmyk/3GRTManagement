# 🥊 3GRT Management — Website + Dashboard Admin

Website company profile penyelenggara event combat sport, lengkap dengan **dashboard admin** untuk mengelola semua konten tanpa menyentuh kode.

Dibuat dengan **Next.js 14 + Tailwind CSS + Prisma + PostgreSQL (Neon)**.

---

## ✨ Fitur

**Sisi Publik (7 halaman):**
- Beranda, Tentang, Layanan, Event, Galeri, Kontak
- Galeri video YouTube dengan lightbox
- Form kontak & pendaftaran atlet (masuk ke dashboard dulu)
- Desain responsif (mobile + desktop), animasi halus, SEO siap

**Dashboard Admin (`/admin`):**
- Kelola Event, Galeri, Testimoni, Mitra, Layanan, Paket Sponsorship
- Editor Konten Halaman (ubah teks hero, tentang, statistik, kontak, dll.)
- Pesan Masuk: tinjau, balas via WhatsApp, tandai selesai, atau hapus spam
- Manajemen multi-admin (tambah admin, reset password)
- Upload gambar langsung (otomatis tersimpan) atau tempel URL

---

## 🚀 Cara Menjalankan di Komputer (Lokal)

### 1. Siapkan Database Neon (gratis)
1. Daftar di [neon.tech](https://neon.tech) → buat project baru.
2. Buka **Dashboard → Connection Details**.
3. Salin **2 connection string**:
   - Yang ada tulisan **`-pooler`** → untuk `DATABASE_URL`
   - Yang **tanpa `-pooler`** → untuk `DIRECT_URL`

### 2. Buat file `.env`
Salin `.env.example` menjadi `.env`, lalu isi:
```env
DATABASE_URL="postgresql://...-pooler...neon.tech/...?sslmode=require"
DIRECT_URL="postgresql://...neon.tech/...?sslmode=require"
SESSION_SECRET="string-acak-panjang-minimal-32-karakter"
```
> 💡 Generate `SESSION_SECRET` cepat: jalankan `openssl rand -base64 32` di terminal, atau ketik karakter acak yang panjang.

### 3. Install & siapkan database
```bash
npm install            # install semua dependency
npx prisma db push     # buat tabel di database
npm run seed           # isi data awal + buat akun admin
npm run dev            # jalankan di http://localhost:3000
```

### 4. Login Admin
Buka **http://localhost:3000/admin**
- Username: **`admin`**
- Password: **`Admin@3grt`**

> ⚠️ **Segera ganti password** setelah login pertama, lewat menu **Pengaturan**.

---

## ☁️ Deploy ke Vercel (lewat Upload Web — tanpa terminal)

1. **Upload ke GitHub**
   - Buat repository baru di [github.com](https://github.com) (Add file → Upload files).
   - Drag semua file project ini (kecuali folder `node_modules` dan `.next` kalau ada).

2. **Import ke Vercel**
   - Buka [vercel.com](https://vercel.com) → **Add New → Project** → pilih repo tadi.

3. **Isi Environment Variables** (di halaman import Vercel, bagian *Environment Variables*):
   | Name | Value |
   |---|---|
   | `DATABASE_URL` | connection string **-pooler** dari Neon |
   | `DIRECT_URL` | connection string **tanpa -pooler** dari Neon |
   | `SESSION_SECRET` | string acak panjang (sama seperti lokal) |

4. Klik **Deploy**. Selesai! 🎉

5. **Isi tabel database** (sekali saja, dari komputer):
   ```bash
   npx prisma db push
   npm run seed
   ```
   (Pakai `.env` yang sama dengan yang di Vercel.)

---

## 📝 Cara Pakai Dashboard

- **Event / Galeri / Testimoni / dll** → klik **Tambah**, isi form, **Simpan**. Klik ikon pensil untuk edit, ikon tong sampah untuk hapus.
- **Galeri video** → pilih tipe "Video", masukkan **ID YouTube** (bagian setelah `v=` atau `youtu.be/`).
- **Konten Halaman** → ubah teks situs (hero, tentang, statistik, kontak), klik **Simpan** di tiap bagian.
- **Pesan Masuk** → semua pesan dari form masuk ke sini. Klik **Balas WhatsApp** untuk membalas, lalu **Tandai Selesai**. Hapus jika spam.
- **Pengaturan** → tambah admin baru atau reset password.

> 💡 **Rendering pintar:** kalau sebuah bagian kosong (mis. belum ada testimoni), section-nya otomatis tidak tampil di situs.

---

## ⚙️ Catatan Teknis

- **Gambar** disimpan sebagai data (base64) di database — praktis, tanpa setup tambahan. Maksimal 2MB per gambar. Untuk skala besar, bisa upgrade ke Vercel Blob nanti.
- **Password** di-hash aman (scrypt). Sesi login pakai cookie ber-enkripsi (JWT).
- Halaman publik memakai `force-dynamic` agar perubahan dari admin langsung tampil.

---

Dibuat oleh **Pagiverse Studio** untuk 3GRT Management.
