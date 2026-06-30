"use client";
import { useState } from "react";
import { Plus, Trash2, Loader2, Check, Save } from "lucide-react";
import { Label, Input, Textarea } from "@/components/forms/FormField";
import { ImageUpload } from "@/components/admin/ImageUpload";
import type { SiteContentData } from "@/lib/content";

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

function StringList({ label, items, onChange }: { label: string; items: string[]; onChange: (v: string[]) => void }) {
  return (
    <div>
      <Label htmlFor={label}>{label}</Label>
      <div className="space-y-2">
        {items.map((it, i) => (
          <div key={i} className="flex gap-2">
            <Input value={it} onChange={(e) => onChange(items.map((x, j) => (j === i ? e.target.value : x)))} />
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

function ObjectList({ label, items, fields, blank, onChange }: {
  label: string; items: any[]; fields: { key: string; label: string; textarea?: boolean }[];
  blank: any; onChange: (v: any[]) => void;
}) {
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
              <Trash2 className="h-3.5 w-3.5" /> Hapus
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

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-line bg-ink-2 p-6">
      <h2 className="mb-5 font-heading text-lg font-bold uppercase tracking-wide text-bone">{title}</h2>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

const SAVE_KEYS: (keyof SiteContentData)[] = [
  "logoUrl", "fontScale", "bgOverlay", "heroBg", "heroBgSlides", "heroBgDuration",
  "hero", "stats", "whyus", "about", "timeline", "tentangBg", "whyusBg", "timelineBg",
];

export function BerandaEditor({ initial }: { initial: SiteContentData }) {
  const [data, setData] = useState<SiteContentData>(initial);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const set = (patch: Partial<SiteContentData>) => setData((d) => ({ ...d, ...patch }));

  async function saveAll() {
    setSaving(true);
    setSaved(false);
    try {
      await Promise.all(
        SAVE_KEYS.map((key) =>
          fetch("/api/admin/content", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ key, value: data[key] }),
          })
        )
      );
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {
      alert("Gagal menyimpan");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-5">
      {/* Header sticky dengan tombol simpan global */}
      <div className="sticky top-16 z-20 flex items-center justify-between rounded-2xl border border-line bg-ink-2/90 px-6 py-4 backdrop-blur-lg">
        <h1 className="font-heading text-lg font-bold uppercase tracking-wide text-bone">Kelola Beranda</h1>
        <button
          onClick={saveAll}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-full bg-crimson px-6 py-2.5 font-heading text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-crimson-dark disabled:opacity-60"
        >
          {saving ? <><Loader2 className="h-4 w-4 animate-spin" /> Menyimpan...</>
            : saved ? <><Check className="h-4 w-4" /> Tersimpan!</>
            : <><Save className="h-4 w-4" /> Simpan Semua</>}
        </button>
      </div>

      <Section title="Logo Situs">
        <p className="text-sm text-muted">Logo yang tampil di pojok kiri atas navbar admin dan situs utama. Format PNG/SVG transparan direkomendasikan.</p>
        <ImageUpload value={data.logoUrl} onChange={(v) => set({ logoUrl: v })} />
      </Section>

      <Section title="Ukuran Font">
        <p className="text-sm text-muted">Skala ukuran teks di seluruh situs. 100% = ukuran default.</p>
        <div className="flex items-center gap-4">
          <input type="range" min={75} max={130} step={5} value={data.fontScale} onChange={(e) => set({ fontScale: Number(e.target.value) })} className="flex-1 accent-crimson" />
          <span className="w-14 rounded-lg border border-line bg-ink-3 px-3 py-2 text-center font-heading text-sm font-semibold text-bone">{data.fontScale}%</span>
        </div>
        <div className="mt-1 flex justify-between text-xs text-muted-dark"><span>75% (Kecil)</span><span>130% (Besar)</span></div>
      </Section>

      <Section title="Overlay Background">
        <p className="text-sm text-muted">Seberapa gelap lapisan hitam di atas gambar background. Semakin tinggi = semakin gelap.</p>
        <div className="flex items-center gap-4">
          <input type="range" min={0} max={100} step={5} value={data.bgOverlay} onChange={(e) => set({ bgOverlay: Number(e.target.value) })} className="flex-1 accent-crimson" />
          <span className="w-14 rounded-lg border border-line bg-ink-3 px-3 py-2 text-center font-heading text-sm font-semibold text-bone">{data.bgOverlay}%</span>
        </div>
        <div className="mt-1 flex justify-between text-xs text-muted-dark"><span>Terang</span><span>Gelap</span></div>
      </Section>

      <Section title="Background Beranda (Slideshow)">
        <p className="text-sm text-muted">
          Upload beberapa gambar untuk slideshow otomatis. Gambar berganti sesuai durasi yang diatur.
          Jika hanya 1 gambar, tidak ada animasi slide.
        </p>

        {/* Durasi */}
        <div className="flex items-center gap-3">
          <Label htmlFor="heroBgDuration">Durasi tiap slide</Label>
          <input
            type="number"
            min={1}
            max={60}
            value={data.heroBgDuration ?? 5}
            onChange={(e) => set({ heroBgDuration: Number(e.target.value) })}
            className="w-20 rounded-lg border border-line bg-ink-3 px-3 py-2 text-center font-heading text-sm font-semibold text-bone focus:border-amber focus:outline-none"
          />
          <span className="text-sm text-muted">detik</span>
        </div>

        {/* Daftar slide */}
        <div className="space-y-3">
          {(data.heroBgSlides ?? []).map((slide, i) => (
            <div key={i} className="rounded-xl border border-line bg-ink-3 p-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="font-heading text-sm font-semibold uppercase tracking-wide text-bone">
                  Slide {i + 1}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const s = [...(data.heroBgSlides ?? [])];
                    s.splice(i, 1);
                    set({ heroBgSlides: s });
                  }}
                  className="inline-flex items-center gap-1 text-xs text-crimson-light hover:text-crimson"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Hapus
                </button>
              </div>
              <ImageUpload
                value={slide}
                onChange={(v) => {
                  const s = [...(data.heroBgSlides ?? [])];
                  s[i] = v;
                  set({ heroBgSlides: s });
                }}
              />
            </div>
          ))}

          <button
            type="button"
            onClick={() => set({ heroBgSlides: [...(data.heroBgSlides ?? []), ""] })}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-amber hover:underline"
          >
            <Plus className="h-4 w-4" /> Tambah Slide
          </button>
        </div>
      </Section>

      <Section title="Hero">
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

      <Section title="Statistik">
        <ObjectList
          label="Daftar Statistik"
          items={data.stats}
          fields={[{ key: "value", label: "Angka (mis. 12+)" }, { key: "label", label: "Keterangan" }]}
          blank={{ value: "", label: "" }}
          onChange={(v) => set({ stats: v })}
        />
      </Section>

      <Section title="Mengapa Kami (Why Us)">
        <Field label="Judul" textarea value={data.whyus.title} onChange={(v) => set({ whyus: { ...data.whyus, title: v } })} />
        <Field label="Subjudul" textarea value={data.whyus.subtitle} onChange={(v) => set({ whyus: { ...data.whyus, subtitle: v } })} />
        <StringList label="Poin Keunggulan" items={data.whyus.items} onChange={(v) => set({ whyus: { ...data.whyus, items: v } })} />
        <div className="space-y-2">
          <Label htmlFor="whyusMedia">Foto / Video 1:1 (tampil di kiri)</Label>
          <p className="text-xs text-muted">Upload foto atau tempel URL YouTube/video.</p>
          <ImageUpload value={data.whyus.mediaUrl ?? ""} onChange={(v) => set({ whyus: { ...data.whyus, mediaUrl: v } })} />
        </div>
      </Section>

      <Section title="Tentang Kami">
        <Field label="Eyebrow (teks kecil atas)" value={data.about.eyebrow} onChange={(v) => set({ about: { ...data.about, eyebrow: v } })} />
        <Field label="Judul" textarea value={data.about.title} onChange={(v) => set({ about: { ...data.about, title: v } })} />
        <StringList label="Paragraf" items={data.about.paragraphs} onChange={(v) => set({ about: { ...data.about, paragraphs: v } })} />
        <div className="space-y-2">
          <Label htmlFor="aboutMedia">Foto / Video 1:1 (tampil di kanan teks)</Label>
          <p className="text-xs text-muted">Upload foto atau tempel URL YouTube/video.</p>
          <ImageUpload value={data.about.mediaUrl ?? ""} onChange={(v) => set({ about: { ...data.about, mediaUrl: v } })} />
        </div>
      </Section>

      <Section title="Background Perjalanan Kami">
        <p className="text-sm text-muted">Gambar latar untuk section Timeline / Perjalanan Kami.</p>
        <ImageUpload value={data.timelineBg ?? ""} onChange={(v) => set({ timelineBg: v })} />
      </Section>

      <Section title="Timeline (Perjalanan Kami)">
        <ObjectList
          label="Daftar Milestone"
          items={data.timeline}
          fields={[{ key: "year", label: "Tahun" }, { key: "title", label: "Judul" }, { key: "desc", label: "Deskripsi", textarea: true }]}
          blank={{ year: "", title: "", desc: "" }}
          onChange={(v) => set({ timeline: v })}
        />
      </Section>

      <Section title="Background Tentang Kami">
        <p className="text-sm text-muted">Gambar latar untuk section Tentang Kami.</p>
        <ImageUpload value={data.tentangBg} onChange={(v) => set({ tentangBg: v })} />
      </Section>

      <Section title="Background Mengapa Kami">
        <p className="text-sm text-muted">Gambar latar untuk section Mengapa Kami.</p>
        <ImageUpload value={data.whyusBg} onChange={(v) => set({ whyusBg: v })} />
      </Section>
    </div>
  );
}
