"use client";
import { useRef, useState } from "react";
import { Upload, X, Link2, Loader2 } from "lucide-react";

const TARGET_BYTES = 1024 * 1024; // 1 MB
const MAX_DIM = 1920;

async function compressImage(file: File): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    const blobUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(blobUrl);

      const canvas = document.createElement("canvas");
      let w = img.naturalWidth;
      let h = img.naturalHeight;

      // Perkecil dimensi jika lebih besar dari MAX_DIM
      if (w > MAX_DIM || h > MAX_DIM) {
        const ratio = Math.min(MAX_DIM / w, MAX_DIM / h);
        w = Math.round(w * ratio);
        h = Math.round(h * ratio);
      }

      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, w, h);

      // Binary search kualitas JPEG sampai ≤ 1 MB
      let lo = 0.1;
      let hi = 0.92;
      let best = "";

      for (let i = 0; i < 10; i++) {
        const mid = (lo + hi) / 2;
        const data = canvas.toDataURL("image/jpeg", mid);
        const bytes = Math.round((data.length - data.indexOf(",") - 1) * 0.75);
        if (bytes <= TARGET_BYTES) {
          best = data;
          lo = mid; // bisa coba kualitas lebih tinggi
        } else {
          hi = mid; // kurangi kualitas
        }
      }

      // Fallback kualitas minimum jika tetap besar
      if (!best) best = canvas.toDataURL("image/jpeg", 0.1);
      resolve(best);
    };

    img.onerror = () => {
      URL.revokeObjectURL(blobUrl);
      // Fallback: baca langsung tanpa kompresi
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    };

    img.src = blobUrl;
  });
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export function ImageUpload({
  value: rawValue,
  onChange,
}: {
  value: string | undefined;
  onChange: (v: string) => void;
}) {
  const value = rawValue ?? "";
  const ref = useRef<HTMLInputElement>(null);
  const [compressing, setCompressing] = useState(false);
  const [info, setInfo] = useState<string>("");

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Terima hingga 20 MB — akan dikompres otomatis
    if (file.size > 20 * 1024 * 1024) {
      alert("Ukuran gambar maksimal 20MB.");
      return;
    }

    const originalSize = file.size;
    setCompressing(true);
    setInfo("");

    try {
      const compressed = await compressImage(file);
      const compressedBytes = Math.round((compressed.length - compressed.indexOf(",") - 1) * 0.75);
      onChange(compressed);

      if (originalSize > compressedBytes) {
        setInfo(`${formatBytes(originalSize)} → ${formatBytes(compressedBytes)}`);
      } else {
        setInfo(formatBytes(compressedBytes));
      }
    } finally {
      setCompressing(false);
      // Reset input agar file yang sama bisa dipilih lagi
      if (ref.current) ref.current.value = "";
    }
  }

  return (
    <div>
      {value ? (
        <div className="relative inline-block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt="Pratinjau"
            className="h-32 w-auto rounded-lg border border-line object-contain"
          />
          <button
            type="button"
            onClick={() => { onChange(""); setInfo(""); }}
            className="absolute -right-2 -top-2 grid h-7 w-7 place-items-center rounded-full bg-crimson text-white"
            aria-label="Hapus gambar"
          >
            <X className="h-4 w-4" />
          </button>
          {info && (
            <p className="mt-1.5 text-xs text-amber">{info}</p>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => ref.current?.click()}
          disabled={compressing}
          className="flex h-32 w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-line bg-ink-3 text-muted transition-colors hover:border-amber hover:text-amber disabled:opacity-60"
        >
          {compressing ? (
            <>
              <Loader2 className="h-6 w-6 animate-spin text-amber" />
              <span className="text-sm text-amber">Mengompres...</span>
            </>
          ) : (
            <>
              <Upload className="h-6 w-6" />
              <span className="text-sm">Klik untuk upload (maks 20MB, otomatis dikompres ke ≤1MB)</span>
            </>
          )}
        </button>
      )}

      <input ref={ref} type="file" accept="image/*" onChange={onFile} className="hidden" />

      <div className="mt-2 flex items-center gap-2">
        <Link2 className="h-4 w-4 shrink-0 text-muted" />
        <input
          type="url"
          value={value.startsWith("data:") ? "" : value}
          onChange={(e) => { onChange(e.target.value); setInfo(""); }}
          placeholder="atau tempel URL gambar"
          className="flex-1 rounded-lg border border-line bg-ink-3 px-3 py-2 text-sm text-bone placeholder:text-muted-dark focus:border-amber focus:outline-none"
        />
      </div>
    </div>
  );
}
