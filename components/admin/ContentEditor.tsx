"use client";
import { useState } from "react";
import { Plus, Trash2, Loader2, Check, Save } from "lucide-react";
import { Label, Input, Textarea } from "@/components/forms/FormField";
import type { SiteContentData } from "@/lib/content";

/* eslint-disable @typescript-eslint/no-explicit-any */

// === Primitif kecil ===
function Field({ label, value, onChange, textarea }: { label: string; value: string; onChange: (v: string) => void; textarea?: boolean }) {
  return (
    <div>
      <Label htmlFor={label}>{label}</Label>
      {textarea
        ? <Textarea id={label} value={value} onChange={(e) => onChange(e.target.value)} />
        : <Input id={label} value={value} onChange={(e) => onChange(e.target.value)} />}
    </div>
  );
}

function StringList({ label, items, onChange, textarea }: { label: string; items: string[]; onChange: (v: string[]) => void; textarea?: boolean }) {
  return (
    <div>
      <Label htmlFor={label}>{label}</Label>
      <div className="space-y-2">
        {items.map((it, i) => (
          <div key={i} className="flex gap-2">
            {textarea
              ? <Textarea value={it} onChange={(e) => onChange(items.map((x, j) => (j === i ? e.target.value : x)))} />
              : <Input value={it} onChange={(e) => onChange(items.map((x, j) => (j === i ? e.target.value : x)))} />}
            <button type="button" onClick={() => onChange(items.filter((_, j) => j !== i))} className="grid h-11 w-11 shrink-0 place-items-center rounded-lg border border-line text-bone/70 hover:border-crimson hover:text-crimson" aria-label="Hapus">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
        <button type="button" onClick={() => onChange([...items, ""])} className="inline-flex items-center gap-1.5 text-sm font-medium text-amber hover:underline">
          <Plus className="h-4 w-4" /> Tambah
        </button>
      </div>
    </div>
  );
}

function ObjectList({ label, items, fields, blank, onChange }: { label: string; items: any[]; fields: { key: string; label: string; textarea?: boolean }[]; blank: any; onChange: (v: any[]) => void }) {
  return (
    <div>
      <Label htmlFor={label}>{label}</Label>
      <div className="space-y-3">
        {items.map((it, i) => (
          <div key={i} className="rounded-xl border border-line bg-ink-3 p-3">
            <div className="grid gap-2 sm:grid-cols-2">
              {fields.map((f) => (
                <div key={f.key} className={f.textarea ? "sm:col-span-2" : ""}>
                  {f.textarea
                    ? <Textarea placeholder={f.label} value={it[f.key] ?? ""} onChange={(e) => onChange(items.map((x, j) => (j === i ? { ...x, [f.key]: e.target.value } : x)))} />
                    : <Input placeholder={f.label} value={it[f.key] ?? ""} onChange={(e) => onChange(items.map((x, j) => (j === i ? { ...x, [f.key]: e.target.value } : x)))} />}
                </div>
              ))}
            </div>
            <button type="button" onClick={() => onChange(items.filter((_, j) => j !== i))} className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-crimson-light hover:underline">
              <Trash2 className="h-3.5 w-3.5" /> Hapus baris
            </button>
          </div>
        ))}
        <button type="button" onClick={() => onChange([...items, { ...blank }])} className="inline-flex items-center gap-1.5 text-sm font-medium text-amber hover:underline">
          <Plus className="h-4 w-4" /> Tambah
        </button>
      </div>
    </div>
  );
}

// === Kartu section dengan tombol simpan ===
function Section({ title, contentKey, value, savingKey, savedKey, onSave, children }: {
  title: string; contentKey: string; value: any;
  savingKey: string; savedKey: string; onSave: (k: string, v: any) => void;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-line bg-ink-2 p-6">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="font-heading text-lg font-bold uppercase tracking-wide text-bone">{title}</h2>
        <button onClick={() => onSave(contentKey, value)} disabled={savingKey === contentKey} className="inline-flex items-center gap-2 rounded-full bg-crimson px-4 py-2 font-heading text-xs font-semibold uppercase tracking-wide text-white transition-colors hover:bg-crimson-dark disabled:opacity-60">
          {savingKey === contentKey ? <><Loader2 className="h-4 w-4 animate-spin" /> Menyimpan</>
            : savedKey === contentKey ? <><Check className="h-4 w-4" /> Tersimpan</>
            : <><Save className="h-4 w-4" /> Simpan</>}
        </button>
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

export function ContentEditor({ initial }: { initial: SiteContentData }) {
  const [data, setData] = useState<SiteContentData>(initial);
  const [savingKey, setSavingKey] = useState("");
  const [savedKey, setSavedKey] = useState("");

  const set = (patch: Partial<SiteContentData>) => setData((d) => ({ ...d, ...patch }));

  async function save(key: string, value: any) {
    setSavingKey(key);
    setSavedKey("");
    try {
      const res = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, value }),
      });
      if (res.ok) {
        setSavedKey(key);
        setTimeout(() => setSavedKey(""), 2500);
      } else {
        alert("Gagal menyimpan");
      }
    } finally {
      setSavingKey("");
    }
  }

  const sp = { savingKey, savedKey, onSave: save };

  return (
    <div className="space-y-5">
      <Section title="Umum" contentKey="brandName" value={data.brandName} {...sp}>
        <Field label="Nama Brand" value={data.brandName} onChange={(v) => set({ brandName: v })} />
        <Field label="Tagline Footer" textarea value={data.footerTagline} onChange={(v) => set({ footerTagline: v })} />
        <p className="text-xs text-muted-dark">Catatan: tombol Simpan di kartu ini hanya menyimpan Nama Brand. Untuk Tagline Footer, gunakan tombol di bawah.</p>
        <button onClick={() => save("footerTagline", data.footerTagline)} className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 font-heading text-xs font-semibold uppercase tracking-wide text-bone/80 hover:bg-ink-3">
          <Save className="h-4 w-4" /> Simpan Tagline Footer
        </button>
      </Section>

      <Section title="Hero (Halaman Depan)" contentKey="hero" value={data.hero} {...sp}>
        <Field label="Eyebrow (teks kecil atas)" value={data.hero.eyebrow} onChange={(v) => set({ hero: { ...data.hero, eyebrow: v } })} />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Judul" value={data.hero.title} onChange={(v) => set({ hero: { ...data.hero, title: v } })} />
          <Field label="Judul Aksen (warna gradien)" value={data.hero.titleAccent} onChange={(v) => set({ hero: { ...data.hero, titleAccent: v } })} />
        </div>
        <Field label="Subjudul" textarea value={data.hero.subtitle} onChange={(v) => set({ hero: { ...data.hero, subtitle: v } })} />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Tombol Utama" value={data.hero.ctaPrimary} onChange={(v) => set({ hero: { ...data.hero, ctaPrimary: v } })} />
          <Field label="Tombol Kedua" value={data.hero.ctaSecondary} onChange={(v) => set({ hero: { ...data.hero, ctaSecondary: v } })} />
        </div>
      </Section>

      <Section title="Statistik" contentKey="stats" value={data.stats} {...sp}>
        <ObjectList label="Daftar Statistik" items={data.stats} fields={[{ key: "value", label: "Angka (mis. 12+)" }, { key: "label", label: "Keterangan" }]} blank={{ value: "", label: "" }} onChange={(v) => set({ stats: v })} />
      </Section>

      <Section title="Tentang Kami" contentKey="about" value={data.about} {...sp}>
        <Field label="Eyebrow" value={data.about.eyebrow} onChange={(v) => set({ about: { ...data.about, eyebrow: v } })} />
        <Field label="Judul" textarea value={data.about.title} onChange={(v) => set({ about: { ...data.about, title: v } })} />
        <StringList label="Paragraf" textarea items={data.about.paragraphs} onChange={(v) => set({ about: { ...data.about, paragraphs: v } })} />
        <StringList label="Poin Keunggulan" items={data.about.points} onChange={(v) => set({ about: { ...data.about, points: v } })} />
      </Section>

      <Section title="Timeline / Perjalanan" contentKey="timeline" value={data.timeline} {...sp}>
        <ObjectList label="Daftar Milestone" items={data.timeline} fields={[{ key: "year", label: "Tahun" }, { key: "title", label: "Judul" }, { key: "desc", label: "Deskripsi", textarea: true }]} blank={{ year: "", title: "", desc: "" }} onChange={(v) => set({ timeline: v })} />
      </Section>

      <Section title="Mengapa Kami" contentKey="whyus" value={data.whyus} {...sp}>
        <Field label="Judul" textarea value={data.whyus.title} onChange={(v) => set({ whyus: { ...data.whyus, title: v } })} />
        <Field label="Subjudul" textarea value={data.whyus.subtitle} onChange={(v) => set({ whyus: { ...data.whyus, subtitle: v } })} />
        <StringList label="Poin" items={data.whyus.items} onChange={(v) => set({ whyus: { ...data.whyus, items: v } })} />
      </Section>

      <Section title="Intro Layanan" contentKey="servicesIntro" value={data.servicesIntro} {...sp}>
        <Field label="Eyebrow" value={data.servicesIntro.eyebrow} onChange={(v) => set({ servicesIntro: { ...data.servicesIntro, eyebrow: v } })} />
        <Field label="Judul" value={data.servicesIntro.title} onChange={(v) => set({ servicesIntro: { ...data.servicesIntro, title: v } })} />
        <Field label="Subjudul" textarea value={data.servicesIntro.subtitle} onChange={(v) => set({ servicesIntro: { ...data.servicesIntro, subtitle: v } })} />
      </Section>

      <Section title="Intro Sponsorship" contentKey="sponsorshipIntro" value={data.sponsorshipIntro} {...sp}>
        <Field label="Eyebrow" value={data.sponsorshipIntro.eyebrow} onChange={(v) => set({ sponsorshipIntro: { ...data.sponsorshipIntro, eyebrow: v } })} />
        <Field label="Judul" value={data.sponsorshipIntro.title} onChange={(v) => set({ sponsorshipIntro: { ...data.sponsorshipIntro, title: v } })} />
        <Field label="Subjudul" textarea value={data.sponsorshipIntro.subtitle} onChange={(v) => set({ sponsorshipIntro: { ...data.sponsorshipIntro, subtitle: v } })} />
      </Section>

      <Section title="Informasi Kontak" contentKey="contact" value={data.contact} {...sp}>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="WhatsApp (kode negara, mis. 62813...)" value={data.contact.wa} onChange={(v) => set({ contact: { ...data.contact, wa: v } })} />
          <Field label="WhatsApp (tampilan)" value={data.contact.waDisplay} onChange={(v) => set({ contact: { ...data.contact, waDisplay: v } })} />
          <Field label="Email" value={data.contact.email} onChange={(v) => set({ contact: { ...data.contact, email: v } })} />
          <Field label="Lokasi" value={data.contact.location} onChange={(v) => set({ contact: { ...data.contact, location: v } })} />
          <Field label="Alamat/Venue" value={data.contact.address} onChange={(v) => set({ contact: { ...data.contact, address: v } })} />
          <Field label="Instagram (URL)" value={data.contact.instagram} onChange={(v) => set({ contact: { ...data.contact, instagram: v } })} />
          <Field label="TikTok (URL)" value={data.contact.tiktok} onChange={(v) => set({ contact: { ...data.contact, tiktok: v } })} />
          <Field label="YouTube (URL)" value={data.contact.youtube} onChange={(v) => set({ contact: { ...data.contact, youtube: v } })} />
        </div>
      </Section>
    </div>
  );
}
