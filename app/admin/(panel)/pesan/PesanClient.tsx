"use client";
import { useEffect, useState } from "react";
import { Loader2, Trash2, Check, MessageCircle, Mail, User, Clock, Inbox } from "lucide-react";
import { PageTitle } from "@/components/admin/PageTitle";
import { cn } from "@/lib/utils";

type Msg = {
  id: string; type: string; name: string; contact: string;
  role?: string | null; subject?: string | null; message: string;
  status: string; createdAt: string;
};

const FILTERS = [
  { key: "pending", label: "Menunggu" },
  { key: "sent", label: "Selesai" },
  { key: "all", label: "Semua" },
];

export default function PesanClient() {
  const [items, setItems] = useState<Msg[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("pending");

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/messages");
      if (res.ok) setItems(await res.json());
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => { load(); }, []);

  async function setStatus(id: string, status: string) {
    await fetch(`/api/admin/messages/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    load();
  }
  async function remove(id: string) {
    if (!confirm("Hapus pesan ini?")) return;
    await fetch(`/api/admin/messages/${id}`, { method: "DELETE" });
    load();
  }

  function waLink(m: Msg) {
    const digits = m.contact.replace(/\D/g, "");
    if (!digits) return null;
    const phone = digits.startsWith("0") ? "62" + digits.slice(1) : digits;
    const text = encodeURIComponent(`Halo ${m.name}, terima kasih sudah menghubungi 3GRT Management. `);
    return `https://wa.me/${phone}?text=${text}`;
  }
  const isEmail = (s: string) => s.includes("@");

  const filtered = filter === "all" ? items : items.filter((m) => m.status === filter);
  const pendingCount = items.filter((m) => m.status === "pending").length;

  return (
    <>
      <PageTitle title="Pesan Masuk" subtitle="Pesan dari form kontak & pendaftaran atlet. Tinjau, balas via WhatsApp, lalu tandai selesai." />

      <div className="mb-6 flex gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={cn(
              "rounded-full px-4 py-2 font-heading text-sm font-semibold uppercase tracking-wide transition-colors",
              filter === f.key ? "bg-crimson text-white" : "border border-line text-bone/70 hover:bg-ink-3"
            )}
          >
            {f.label}
            {f.key === "pending" && pendingCount > 0 && (
              <span className="ml-2 rounded-full bg-white/20 px-1.5 text-xs">{pendingCount}</span>
            )}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid place-items-center py-20"><Loader2 className="h-7 w-7 animate-spin text-crimson" /></div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center rounded-2xl border border-dashed border-line bg-ink-2 py-16 text-center">
          <Inbox className="h-12 w-12 text-muted-dark" />
          <p className="mt-3 text-muted">Tidak ada pesan di kategori ini.</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {filtered.map((m) => {
            const wa = waLink(m);
            return (
              <li key={m.id} className="rounded-2xl border border-line bg-ink-2 p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className={cn("rounded-full px-2.5 py-1 font-heading text-[11px] font-bold uppercase tracking-wider",
                      m.type === "atlet" ? "bg-amber/20 text-amber" : "bg-crimson/20 text-crimson-light")}>
                      {m.type === "atlet" ? "Pendaftaran Atlet" : "Kontak"}
                    </span>
                    {m.status === "sent" && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-green-500/15 px-2.5 py-1 font-heading text-[11px] font-bold uppercase tracking-wider text-green-400">
                        <Check className="h-3 w-3" /> Selesai
                      </span>
                    )}
                  </div>
                  <span className="flex items-center gap-1.5 text-xs text-muted-dark">
                    <Clock className="h-3.5 w-3.5" />
                    {new Date(m.createdAt).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" })}
                  </span>
                </div>

                <div className="mt-4 grid gap-1.5 text-sm">
                  <p className="flex items-center gap-2 font-heading text-base font-semibold text-bone">
                    <User className="h-4 w-4 text-amber" /> {m.name}
                    {m.role && <span className="text-xs font-normal text-muted">• {m.role}</span>}
                  </p>
                  <p className="flex items-center gap-2 text-muted">
                    {isEmail(m.contact) ? <Mail className="h-4 w-4" /> : <MessageCircle className="h-4 w-4" />} {m.contact}
                  </p>
                </div>

                {m.subject && <p className="mt-3 font-heading text-sm font-semibold uppercase tracking-wide text-bone/90">{m.subject}</p>}
                <p className="mt-1.5 whitespace-pre-line rounded-xl border border-line bg-ink-3 p-4 text-sm text-bone/85">{m.message}</p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {isEmail(m.contact) ? (
                    <a href={`mailto:${m.contact}`} className="inline-flex items-center gap-2 rounded-full bg-crimson px-4 py-2 font-heading text-xs font-semibold uppercase tracking-wide text-white transition-colors hover:bg-crimson-dark">
                      <Mail className="h-4 w-4" /> Balas Email
                    </a>
                  ) : wa ? (
                    <a href={wa} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-2 font-heading text-xs font-semibold uppercase tracking-wide text-white transition-opacity hover:opacity-90">
                      <MessageCircle className="h-4 w-4" /> Balas WhatsApp
                    </a>
                  ) : null}

                  {m.status === "pending" ? (
                    <button onClick={() => setStatus(m.id, "sent")} className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 font-heading text-xs font-semibold uppercase tracking-wide text-bone/80 transition-colors hover:border-green-500 hover:text-green-400">
                      <Check className="h-4 w-4" /> Tandai Selesai
                    </button>
                  ) : (
                    <button onClick={() => setStatus(m.id, "pending")} className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 font-heading text-xs font-semibold uppercase tracking-wide text-bone/80 transition-colors hover:bg-ink-3">
                      Tandai Belum
                    </button>
                  )}

                  <button onClick={() => remove(m.id)} className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 font-heading text-xs font-semibold uppercase tracking-wide text-bone/80 transition-colors hover:border-crimson hover:text-crimson">
                    <Trash2 className="h-4 w-4" /> Hapus
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
