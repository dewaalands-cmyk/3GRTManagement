"use client";
import { useRef, useState } from "react";
import { Plus, X, Loader2, GripVertical } from "lucide-react";

const TARGET_BYTES = 512 * 1024;
const MAX_DIM = 1920;

function estimateBytes(dataUrl: string) {
  return Math.round((dataUrl.length - dataUrl.indexOf(",") - 1) * 0.75);
}

function canvasHasTransparency(canvas: HTMLCanvasElement): boolean {
  const ctx = canvas.getContext("2d")!;
  const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
  for (let i = 3; i < data.length; i += 4) if (data[i] < 255) return true;
  return false;
}

function binarySearchQuality(canvas: HTMLCanvasElement, format: string): string {
  let lo = 0.1, hi = 0.92, best = "";
  for (let i = 0; i < 10; i++) {
    const mid = (lo + hi) / 2;
    const data = canvas.toDataURL(format, mid);
    if (estimateBytes(data) <= TARGET_BYTES) { best = data; lo = mid; } else hi = mid;
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
      let w = img.naturalWidth, h = img.naturalHeight;
      if (w > MAX_DIM || h > MAX_DIM) {
        const r = Math.min(MAX_DIM / w, MAX_DIM / h);
        w = Math.round(w * r); h = Math.round(h * r);
      }
      canvas.width = w; canvas.height = h;
      canvas.getContext("2d")!.drawImage(img, 0, 0, w, h);
      const transparent = canvasHasTransparency(canvas);
      if (transparent) {
        const webp = canvas.toDataURL("image/webp", 0.9);
        if (webp.startsWith("data:image/webp")) { resolve(estimateBytes(webp) <= TARGET_BYTES ? webp : binarySearchQuality(canvas, "image/webp")); return; }
        resolve(canvas.toDataURL("image/png"));
        return;
      }
      if (estimateBytes(canvas.toDataURL("image/jpeg", 0.92)) <= TARGET_BYTES) { resolve(canvas.toDataURL("image/jpeg", 0.92)); return; }
      resolve(binarySearchQuality(canvas, "image/jpeg"));
    };
    img.onerror = () => { URL.revokeObjectURL(blobUrl); const reader = new FileReader(); reader.onload = () => resolve(reader.result as string); reader.readAsDataURL(file); };
    img.src = blobUrl;
  });
}

export function MultiImageUpload({
  value,
  onChange,
}: {
  value: string[];
  onChange: (v: string[]) => void;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  async function onFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setProcessing(true);
    setProgress(0);
    const results: string[] = [];
    for (let i = 0; i < files.length; i++) {
      setProgress(Math.round(((i) / files.length) * 100));
      results.push(await compressImage(files[i]));
    }
    setProgress(100);
    onChange([...value, ...results]);
    setProcessing(false);
    setProgress(0);
    if (ref.current) ref.current.value = "";
  }

  function remove(idx: number) {
    onChange(value.filter((_, i) => i !== idx));
  }

  function moveUp(idx: number) {
    if (idx === 0) return;
    const arr = [...value];
    [arr[idx - 1], arr[idx]] = [arr[idx], arr[idx - 1]];
    onChange(arr);
  }

  function moveDown(idx: number) {
    if (idx === value.length - 1) return;
    const arr = [...value];
    [arr[idx], arr[idx + 1]] = [arr[idx + 1], arr[idx]];
    onChange(arr);
  }

  return (
    <div className="space-y-3">
      {value.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {value.map((url, i) => (
            <div key={i} className="group relative aspect-square overflow-hidden rounded-lg border border-line bg-ink-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt={`Foto ${i + 1}`} className="h-full w-full object-cover" />

              {/* Order arrows */}
              <div className="absolute left-1 top-1 flex flex-col gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
                <button type="button" onClick={() => moveUp(i)} disabled={i === 0}
                  className="grid h-5 w-5 place-items-center rounded bg-black/70 text-white disabled:opacity-30"
                  title="Geser ke atas"
                >
                  <GripVertical className="h-3 w-3" />
                </button>
              </div>

              {/* Order badge */}
              <span className="absolute bottom-1 left-1 grid h-5 w-5 place-items-center rounded-full bg-black/60 font-heading text-[10px] font-bold text-white">
                {i + 1}
              </span>

              {/* Remove */}
              <button type="button" onClick={() => remove(i)}
                className="absolute right-1 top-1 grid h-6 w-6 place-items-center rounded-full bg-crimson text-white opacity-0 transition-opacity group-hover:opacity-100"
                aria-label="Hapus"
              >
                <X className="h-3.5 w-3.5" />
              </button>

              {/* Move left/right */}
              <div className="absolute bottom-1 right-1 flex gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
                {i > 0 && (
                  <button type="button" onClick={() => moveUp(i)}
                    className="grid h-5 w-5 place-items-center rounded bg-black/70 text-white text-[9px] font-bold"
                  >←</button>
                )}
                {i < value.length - 1 && (
                  <button type="button" onClick={() => moveDown(i)}
                    className="grid h-5 w-5 place-items-center rounded bg-black/70 text-white text-[9px] font-bold"
                  >→</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={() => ref.current?.click()}
        disabled={processing}
        className="flex h-16 w-full items-center justify-center gap-2 rounded-lg border border-dashed border-line bg-ink-3 text-muted transition-colors hover:border-amber hover:text-amber disabled:opacity-60"
      >
        {processing ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin text-amber" />
            <span className="text-sm text-amber">Memproses... {Math.round(progress)}%</span>
          </>
        ) : (
          <>
            <Plus className="h-4 w-4" />
            <span className="text-sm">Tambah Foto {value.length > 0 ? `(${value.length} foto)` : ""}</span>
          </>
        )}
      </button>

      <input ref={ref} type="file" accept="image/*" multiple onChange={onFiles} className="hidden" />
    </div>
  );
}
