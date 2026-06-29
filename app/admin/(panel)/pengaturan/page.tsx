"use client";
import { useEffect, useState } from "react";
import { Loader2, UserPlus, Trash2, KeyRound, X, Save, ShieldCheck } from "lucide-react";
import { PageTitle } from "@/components/admin/PageTitle";
import { Label, Input } from "@/components/forms/FormField";

type Usr = { id: string; username: string; email?: string | null; createdAt: string };

export default function PengaturanPage() {
  const [users, setUsers] = useState<Usr[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users");
      if (res.ok) setUsers(await res.json());
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => { load(); }, []);

  async function addUser() {
    if (!form.username || !form.password) { setError("Username & password wajib diisi"); return; }
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Gagal"); setSaving(false); return; }
      setAdding(false);
      setForm({ username: "", email: "", password: "" });
      load();
    } catch {
      setError("Terjadi kesalahan");
    } finally {
      setSaving(false);
    }
  }

  async function resetPassword(u: Usr) {
    const pw = prompt(`Password baru untuk "${u.username}":`);
    if (!pw) return;
    const res = await fetch(`/api/admin/users/${u.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: pw }),
    });
    if (res.ok) alert("Password berhasil diubah.");
    else alert("Gagal mengubah password.");
  }

  async function removeUser(u: Usr) {
    if (!confirm(`Hapus admin "${u.username}"?`)) return;
    const res = await fetch(`/api/admin/users/${u.id}`, { method: "DELETE" });
    const data = await res.json();
    if (res.ok) load();
    else alert(data.error || "Gagal menghapus.");
  }

  return (
    <>
      <PageTitle title="Pengaturan" subtitle="Kelola akun admin yang bisa mengakses dashboard." />

      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-muted">{loading ? "Memuat..." : `${users.length} admin`}</p>
        <button onClick={() => { setAdding(true); setError(""); }} className="inline-flex items-center gap-2 rounded-full bg-crimson px-5 py-2.5 font-heading text-sm font-semibold uppercase tracking-wide text-white shadow-glow transition-colors hover:bg-crimson-dark">
          <UserPlus className="h-4 w-4" /> Tambah Admin
        </button>
      </div>

      {loading ? (
        <div className="grid place-items-center py-20"><Loader2 className="h-7 w-7 animate-spin text-crimson" /></div>
      ) : (
        <ul className="space-y-2.5">
          {users.map((u) => (
            <li key={u.id} className="flex items-center gap-4 rounded-xl border border-line bg-ink-2 p-4">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gradient-to-br from-crimson to-amber font-heading text-sm font-bold text-ink">
                {u.username.slice(0, 2).toUpperCase()}
              </span>
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-2 font-heading font-semibold text-bone">
                  {u.username} <ShieldCheck className="h-4 w-4 text-amber" />
                </p>
                <p className="truncate text-sm text-muted">{u.email || "—"} · Dibuat {new Date(u.createdAt).toLocaleDateString("id-ID", { dateStyle: "medium" })}</p>
              </div>
              <div className="flex shrink-0 gap-1.5">
                <button onClick={() => resetPassword(u)} className="grid h-9 w-9 place-items-center rounded-lg border border-line text-bone/70 transition-colors hover:border-amber hover:text-amber" aria-label="Reset password" title="Reset password">
                  <KeyRound className="h-4 w-4" />
                </button>
                <button onClick={() => removeUser(u)} className="grid h-9 w-9 place-items-center rounded-lg border border-line text-bone/70 transition-colors hover:border-crimson hover:text-crimson" aria-label="Hapus" title="Hapus admin">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Modal tambah admin */}
      {adding && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-line bg-ink-2">
            <div className="flex items-center justify-between border-b border-line px-6 py-4">
              <h3 className="font-heading text-lg font-semibold uppercase tracking-wide">Tambah Admin</h3>
              <button onClick={() => setAdding(false)} className="grid h-9 w-9 place-items-center rounded-lg border border-line" aria-label="Tutup"><X className="h-5 w-5" /></button>
            </div>
            <div className="space-y-4 px-6 py-6">
              <div><Label htmlFor="u-name">Username</Label><Input id="u-name" value={form.username} onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))} placeholder="username" /></div>
              <div><Label htmlFor="u-email">Email (opsional)</Label><Input id="u-email" type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} placeholder="email@..." /></div>
              <div><Label htmlFor="u-pass">Password</Label><Input id="u-pass" type="password" value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} placeholder="••••••••" /></div>
              {error && <p className="rounded-lg border border-crimson/30 bg-crimson/10 px-4 py-2.5 text-sm text-crimson-light">{error}</p>}
            </div>
            <div className="flex justify-end gap-3 border-t border-line px-6 py-4">
              <button onClick={() => setAdding(false)} className="rounded-full border border-line px-5 py-2.5 font-heading text-sm font-semibold uppercase tracking-wide text-bone/80 transition-colors hover:bg-ink-3">Batal</button>
              <button onClick={addUser} disabled={saving} className="inline-flex items-center gap-2 rounded-full bg-crimson px-5 py-2.5 font-heading text-sm font-semibold uppercase tracking-wide text-white shadow-glow transition-colors hover:bg-crimson-dark disabled:opacity-60">
                {saving ? <><Loader2 className="h-4 w-4 animate-spin" /> Menyimpan</> : <><Save className="h-4 w-4" /> Simpan</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
