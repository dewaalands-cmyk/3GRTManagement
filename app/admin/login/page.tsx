"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, Loader2, ArrowLeft } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Gagal masuk");
        setLoading(false);
        return;
      }
      router.replace("/admin");
      router.refresh();
    } catch {
      setError("Terjadi kesalahan. Coba lagi.");
      setLoading(false);
    }
  }

  return (
    <div className="relative grid min-h-screen place-items-center overflow-hidden px-4">
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="absolute -left-1/4 top-1/4 h-96 w-96 rounded-full bg-crimson/15 blur-[120px]" />
        <div className="absolute -right-1/4 bottom-1/4 h-96 w-96 rounded-full bg-amber/10 blur-[120px]" />
      </div>

      <div className="w-full max-w-md rounded-2xl border border-line bg-ink-2 p-10">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-crimson/20 to-amber/20">
          <Lock className="h-7 w-7 text-amber" />
        </div>
        <h1 className="mt-6 text-center font-heading text-2xl font-bold uppercase tracking-wide">Dashboard Admin</h1>
        <p className="mt-2 text-center text-sm text-muted">Masuk untuk mengelola konten 3GRT Management</p>

        <form onSubmit={submit} className="mt-8 space-y-4">
          <div>
            <label htmlFor="username" className="mb-2 block font-heading text-xs font-medium uppercase tracking-wider text-muted">Username</label>
            <input
              id="username" type="text" autoComplete="username" required
              value={form.username} onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
              className="w-full rounded-xl border border-line bg-ink-3 px-4 py-3 text-bone placeholder:text-muted-dark focus:border-amber focus:outline-none"
              placeholder="admin"
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-2 block font-heading text-xs font-medium uppercase tracking-wider text-muted">Password</label>
            <input
              id="password" type="password" autoComplete="current-password" required
              value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
              className="w-full rounded-xl border border-line bg-ink-3 px-4 py-3 text-bone placeholder:text-muted-dark focus:border-amber focus:outline-none"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="rounded-lg border border-crimson/30 bg-crimson/10 px-4 py-2.5 text-sm text-crimson-light">{error}</p>}

          <button
            type="submit" disabled={loading}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-crimson px-7 py-3.5 font-heading text-sm font-semibold uppercase tracking-wide text-white shadow-glow transition-all duration-200 hover:bg-crimson-dark disabled:opacity-60"
          >
            {loading ? <><Loader2 className="h-5 w-5 animate-spin" /> Memproses...</> : "Masuk"}
          </button>
        </form>

        <Link href="/" className="mt-6 flex items-center justify-center gap-1.5 text-sm text-muted transition-colors hover:text-amber">
          <ArrowLeft className="h-4 w-4" /> Kembali ke situs
        </Link>
      </div>
    </div>
  );
}
