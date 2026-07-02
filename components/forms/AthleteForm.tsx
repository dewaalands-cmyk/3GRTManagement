"use client";
import { useState } from "react";
import { UserPlus, CheckCircle2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Label, Input, Textarea } from "./FormField";

const LIGHT_INPUT = "bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-300 focus:border-crimson";
const LIGHT_LABEL = "text-gray-700";

export function AthleteForm({ light = false }: { light?: boolean }) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [form, setForm] = useState({ name: "", contact: "", sport: "", record: "" });

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    const message = `Cabang: ${form.sport}\nRekam jejak: ${form.record}`;
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "atlet", role: "Atlet", subject: "Pendaftaran Atlet", name: form.name, contact: form.contact, message }),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
      setForm({ name: "", contact: "", sport: "", record: "" });
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className={cn(
        "flex flex-col items-center justify-center rounded-2xl p-10 text-center",
        light ? "bg-white shadow-xl border border-gray-100" : "border border-line bg-ink-2"
      )}>
        <CheckCircle2 className="h-14 w-14 text-amber" />
        <h3 className={cn("mt-4 font-heading text-xl font-semibold", light ? "text-gray-900" : "text-bone")}>
          Pendaftaran Terkirim!
        </h3>
        <p className={cn("mt-2 text-sm", light ? "text-gray-600" : "text-muted")}>
          Tim matchmaking kami akan meninjau profil Anda dan menghubungi via kontak yang diberikan.
        </p>
        <button onClick={() => setStatus("idle")} className="mt-5 font-heading text-sm font-semibold uppercase tracking-wide text-crimson hover:underline">
          Daftar lagi
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className={cn(
      "rounded-2xl p-8",
      light ? "bg-white shadow-xl border border-gray-100" : "border border-line bg-ink-2"
    )}>
      <h3 className={cn("font-heading text-xl font-semibold uppercase tracking-wide", light ? "text-gray-900" : "text-bone")}>
        Daftar Sebagai Atlet
      </h3>
      <p className={cn("mt-1 text-sm", light ? "text-gray-600" : "text-muted")}>
        Ingin naik ring bersama 3GRT? Isi data di bawah.
      </p>

      <div className="mt-6 space-y-4">
        <div>
          <Label htmlFor="a-name" className={light ? LIGHT_LABEL : ""}>Nama Lengkap</Label>
          <Input id="a-name" required value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Nama atlet" className={light ? LIGHT_INPUT : ""} />
        </div>
        <div>
          <Label htmlFor="a-contact" className={light ? LIGHT_LABEL : ""}>No. WhatsApp</Label>
          <Input id="a-contact" required value={form.contact} onChange={(e) => set("contact", e.target.value)} placeholder="08xx" className={light ? LIGHT_INPUT : ""} />
        </div>
        <div>
          <Label htmlFor="a-sport" className={light ? LIGHT_LABEL : ""}>Cabang Olahraga</Label>
          <Input id="a-sport" required value={form.sport} onChange={(e) => set("sport", e.target.value)} placeholder="Muay Thai / MMA / Tinju / Kickboxing" className={light ? LIGHT_INPUT : ""} />
        </div>
        <div>
          <Label htmlFor="a-record" className={light ? LIGHT_LABEL : ""}>Rekam Jejak / Pengalaman</Label>
          <Textarea id="a-record" required value={form.record} onChange={(e) => set("record", e.target.value)} placeholder="Kelas, jumlah pertandingan, prestasi, dll." className={light ? LIGHT_INPUT : ""} />
        </div>
      </div>

      {status === "error" && (
        <p className="mt-4 text-sm text-crimson">Gagal mengirim. Coba lagi atau hubungi via WhatsApp.</p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-crimson px-7 py-3.5 font-heading text-sm font-semibold uppercase tracking-wide text-white shadow-glow transition-all duration-200 hover:bg-crimson-dark disabled:opacity-60"
      >
        {status === "loading" ? <><Loader2 className="h-5 w-5 animate-spin" /> Mengirim...</> : <>Daftar Sekarang <UserPlus className="h-4 w-4" /></>}
      </button>
    </form>
  );
}
