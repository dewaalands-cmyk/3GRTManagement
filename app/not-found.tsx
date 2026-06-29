import Link from "next/link";

// Catatan: TIDAK merender <html>/<body> karena sudah disediakan root layout.
export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center px-6 text-center">
      <div>
        <p className="font-heading text-7xl font-extrabold text-crimson sm:text-8xl">404</p>
        <h1 className="mt-3 font-heading text-2xl font-bold uppercase tracking-wide">Halaman tidak ditemukan</h1>
        <p className="mt-3 text-muted">Maaf, halaman yang Anda cari tidak ada atau sudah dipindahkan.</p>
        <Link
          href="/"
          className="mt-8 inline-flex items-center justify-center rounded-full bg-crimson px-7 py-3.5 font-heading text-sm font-semibold uppercase tracking-wide text-white shadow-glow transition-colors hover:bg-crimson-dark"
        >
          Kembali ke Beranda
        </Link>
      </div>
    </main>
  );
}
