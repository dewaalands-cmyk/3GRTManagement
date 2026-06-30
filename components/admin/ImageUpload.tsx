"use client";
import { useRef, useState } from "react";
import { Upload, X, Link2, Loader2 } from "lucide-react";

const TARGET_BYTES = 512 * 1024; // 0.5 MB
const MAX_DIM = 1920;

function estimateBytes(dataUrl: string): number {
  return Math.round((dataUrl.length - dataUrl.indexOf(",") - 1) * 0.75);
}

function canvasHasTransparency(canvas: HTMLCanvasElement): boolean {
  const ctx = canvas.getContext("2d")!;
  const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
  for (let i = 3; i < data.length; i += 4) {
    if (data[i] < 255) return true;
  }
  return false;
}

function binarySearchQuality(canvas: HTMLCanvasElement, format: string): string {
  let lo = 0.1, hi = 0.92, best = "";
  for (let i = 0; i < 10; i++) {
    const mid = (lo + hi) / 2;
    const data = canvas.toDataURL(format, mid);
    if (estimateBytes(data) <= TARGET_BYTES) { best = data; lo = mid; }
    else hi = mid;
  }
  return best || canvas.toDataURL(format, 0.1);
}

async function compressImage(file: File): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    const blobUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(blobUrl);

      const canvas = document.createElement("canvas");
      let w = img.naturalWidth;
      let h = img.naturalHeight;

      if (w > MAX_DIM || h > MAX_DIM) {
        const ratio = Math.min(MAX_DIM / w, MAX_DIM / h);
        w = Math.round(w * ratio);
        h = Math.round(h * ratio);
      }

      canvas.width = w;
      canvas.height = h;
      // Biarkan background tetap transparan (jangan isi dengan warna)
      canvas.getContext("2d")!.drawImage(img, 0, 0, w, h);

      const transparent = canvasHasTransparency(canvas);

      if (transparent) {
        // Coba WebP (transparan + kompresi lebih baik dari PNG)
        const webp = canvas.toDataURL("image/webp", 0.9);
        if (webp.startsWith("data:image/webp")) {
          resolve(binarySearchQuality(canvas, "image/webp"));
        } else {
          // Browser tidak support WebP export → PNG (transparansi tetap terjaga)
          resolve(canvas.toDataURL("image/png"));
        }
      } else {
        // Tidak ada transparansi → JPEG lebih kecil
        resolve(binarySearchQuality(canvas, "image/jpeg"));
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(blobUrl);
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
        <div className="relative w-full overflow-hidden rounded-lg border border-line bg-ink-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt="Pratinjau"
            className="max-h-64 w-full object-contain"
          />
          <button
            type="button"
            onClick={() => { onChange(""); setInfo(""); }}
            className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-crimson text-white shadow"
            aria-label="Hapus gambar"
          >
            <X className="h-4 w-4" />
          </button>
          {info && (
            <p className="absolute bottom-2 left-2 rounded bg-black/60 px-2 py-0.5 text-xs text-amber">{info}</p>
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
              <span className="text-sm">Klik untuk upload (maks 20MB, otomatis dikompres ke ≤0.5MB)</span>
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
