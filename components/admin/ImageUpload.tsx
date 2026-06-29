"use client";
import { useRef } from "react";
import { Upload, X, Link2 } from "lucide-react";

export function ImageUpload({ value: rawValue, onChange }: { value: string | undefined; onChange: (v: string) => void }) {
  const value = rawValue ?? "";
  const ref = useRef<HTMLInputElement>(null);

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert("Ukuran gambar maksimal 5MB. Kompres dulu ya.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => onChange(reader.result as string);
    reader.readAsDataURL(file);
  }

  return (
    <div>
      {value ? (
        <div className="relative inline-block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="Pratinjau" className="h-32 w-auto rounded-lg border border-line object-contain" />
          <button type="button" onClick={() => onChange("")} className="absolute -right-2 -top-2 grid h-7 w-7 place-items-center rounded-full bg-crimson text-white" aria-label="Hapus gambar">
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <button type="button" onClick={() => ref.current?.click()} className="flex h-32 w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-line bg-ink-3 text-muted transition-colors hover:border-amber hover:text-amber">
          <Upload className="h-6 w-6" />
          <span className="text-sm">Klik untuk upload (maks 5MB)</span>
        </button>
      )}
      <input ref={ref} type="file" accept="image/*" onChange={onFile} className="hidden" />
      <div className="mt-2 flex items-center gap-2">
        <Link2 className="h-4 w-4 shrink-0 text-muted" />
        <input
          type="url"
          value={value.startsWith("data:") ? "" : value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="atau tempel URL gambar"
          className="flex-1 rounded-lg border border-line bg-ink-3 px-3 py-2 text-sm text-bone placeholder:text-muted-dark focus:border-amber focus:outline-none"
        />
      </div>
    </div>
  );
}
