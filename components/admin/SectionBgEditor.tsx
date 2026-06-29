"use client";
import { useState } from "react";
import { Loader2, Check, Save } from "lucide-react";
import { ImageUpload } from "@/components/admin/ImageUpload";

interface Props {
  label: string;
  contentKey: string;
  initialValue: string;
}

export function SectionBgEditor({ label, contentKey, initialValue }: Props) {
  const [value, setValue] = useState(initialValue);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function save() {
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: contentKey, value }),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
      } else {
        alert("Gagal menyimpan");
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="mb-6 rounded-2xl border border-line bg-ink-2 p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-heading text-lg font-bold uppercase tracking-wide text-bone">{label}</h2>
        <button onClick={save} disabled={saving} className="inline-flex items-center gap-2 rounded-full bg-crimson px-4 py-2 font-heading text-xs font-semibold uppercase tracking-wide text-white transition-colors hover:bg-crimson-dark disabled:opacity-60">
          {saving ? <><Loader2 className="h-4 w-4 animate-spin" /> Menyimpan</>
            : saved ? <><Check className="h-4 w-4" /> Tersimpan</>
            : <><Save className="h-4 w-4" /> Simpan</>}
        </button>
      </div>
      <p className="mb-4 text-sm text-muted">Gambar latar untuk section ini. Overlay gelap otomatis diterapkan agar konten tetap terbaca.</p>
      <ImageUpload value={value} onChange={setValue} />
    </section>
  );
}
