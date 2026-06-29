"use client";
import { useState } from "react";
import { Send, CheckCircle2, Loader2 } from "lucide-react";
import { Label, Input, Textarea, Select } from "./FormField";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [form, setForm] = useState({ name: "", contact: "", role: "Atlet", message: "" });

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "kontak", subject: "Pesan dari Form Kontak", ...form }),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
      setForm({ name: "", contact: "", role: "Atlet", message: "" });
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-line bg-ink-2 p-10 text-center">
        <CheckCircle2 className="h-14 w-14 text-amber" />
        <h3 className="mt-4 font-heading text-xl font-semibold text-bone">Pesan Terkirim!</h3>
        <p className="mt-2 text-sm text-muted">Terima kasih. Tim 3GRT akan segera menghubungi Anda melalui kontak yang diberikan.</p>
        <button onClick={() => setStatus("idle")} className="mt-5 font-heading text-sm font-semibold uppercase tracking-wide text-amber hover:underline">
          Kirim pesan lain
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="rounded-2xl border border-line bg-ink-2 p-8">
      <h3 className="font-heading text-xl font-semibold uppercase tracking-wide text-bone">Kirim Pesan</h3>
      <p className="mt-1 text-sm text-muted">Isi formulir, tim kami akan menghubungi Anda.</p>

      <div className="mt-6 space-y-4">
        <div>
          <Label htmlFor="c-name">Nama Lengkap</Label>
          <Input id="c-name" required value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Nama Anda" />
        </div>
        <div>
          <Label htmlFor="c-contact">No. WhatsApp / Email</Label>
          <Input id="c-contact" required value={form.contact} onChange={(e) => set("contact", e.target.value)} placeholder="08xx atau email@..." />
        </div>
        <div>
          <Label htmlFor="c-role">Saya seorang...</Label>
          <Select id="c-role" value={form.role} onChange={(e) => set("role", e.target.value)}>
            <option>Atlet</option>
            <option>Sponsor / Brand</option>
            <option>Promotor</option>
            <option>Lainnya</option>
          </Select>
        </div>
        <div>
          <Label htmlFor="c-msg">Pesan</Label>
          <Textarea id="c-msg" required value={form.message} onChange={(e) => set("message", e.target.value)} placeholder="Ceritakan kebutuhan Anda..." />
        </div>
      </div>

      {status === "error" && (
        <p className="mt-4 text-sm text-crimson-light">Gagal mengirim. Coba lagi atau hubungi via WhatsApp.</p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-crimson px-7 py-3.5 font-heading text-sm font-semibold uppercase tracking-wide text-white shadow-glow transition-all duration-200 hover:bg-crimson-dark disabled:opacity-60"
      >
        {status === "loading" ? <><Loader2 className="h-5 w-5 animate-spin" /> Mengirim...</> : <>Kirim Pesan <Send className="h-4 w-4" /></>}
      </button>
    </form>
  );
}
