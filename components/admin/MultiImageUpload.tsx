"use client";
import { useRef, useState } from "react";
import { Plus, X, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

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
        if (webp.startsWith("data:image/webp")) {
          resolve(estimateBytes(webp) <= TARGET_BYTES ? webp : binarySearchQuality(canvas, "image/webp"));
          return;
        }
        resolve(canvas.toDataURL("image/png"));
        return;
      }
      if (estimateBytes(canvas.toDataURL("image/jpeg", 0.92)) <= TARGET_BYTES) {
        resolve(canvas.toDataURL("image/jpeg", 0.92));
        return;
      }
      resolve(binarySearchQuality(canvas, "image/jpeg"));
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
  // Keep ref so async onFiles always uses latest value
  const valueRef = useRef(value);
  valueRef.current = value;

  async function onFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setProcessing(true);
    setProgress(0);
    const results: string[] = [];
    for (let i = 0; i < files.length; i++) {
      setProgress(Math.round((i / files.length) * 100));
      results.push(await compressImage(files[i]));
    }
    setProgress(100);
    // Use ref so we always append to the LATEST value, not the stale closure
    onChange([...valueRef.current, ...results]);
    setProcessing(false);
    setProgress(0);
    if (ref.current) ref.current.value = "";
  }

  function remove(idx: number) {
    onChange(valueRef.current.filter((_, i) => i !== idx));
  }

  function move(from: number, to: number) {
    const arr = [...valueRef.current];
    const [item] = arr.splice(from, 1);
    arr.splice(to, 0, item);
    onChange(arr);
  }

  return (
    <div className="space-y-3">
      {value.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {value.map((url, i) => (
            // Use url signature as key (NOT index) so React destroys the correct element on delete
            <div
              key={`${url.length}-${url.slice(-12)}`}
              className="relative aspect-square overflow-hidden rounded-lg border border-line bg-ink-3"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt={`Foto ${i + 1}`} className="h-full w-full object-cover" />

              {/* Always-visible delete button */}
              <button
                type="button"
                onClick={() => remove(i)}
                className="absolute right-1 top-1 z-10 grid h-6 w-6 place-items-center rounded-full bg-crimson text-white shadow-md transition-colors hover:bg-crimson/80"
                aria-label="Hapus foto"
              >
                <X className="h-3.5 w-3.5" />
              </button>

              {/* Order number badge */}
              <span className="absolute bottom-1 left-1 z-10 grid h-5 w-5 place-items-center rounded-full bg-black/70 font-heading text-[10px] font-bold text-white">
                {i + 1}
              </span>

              {/* Always-visible move arrows */}
              <div className="absolute bottom-1 right-1 z-10 flex gap-0.5">
                {i > 0 && (
                  <button
                    type="button"
                    onClick={() => move(i, i - 1)}
                    className="grid h-5 w-5 place-items-center rounded bg-black/70 text-white hover:bg-black/90"
                    aria-label="Geser kiri"
                  >
                    <ChevronLeft className="h-3 w-3" />
                  </button>
                )}
                {i < value.length - 1 && (
                  <button
                    type="button"
                    onClick={() => move(i, i + 1)}
                    className="grid h-5 w-5 place-items-center rounded bg-black/70 text-white hover:bg-black/90"
                    aria-label="Geser kanan"
                  >
                    <ChevronRight className="h-3 w-3" />
                  </button>
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
            <div className="h-1.5 w-32 overflow-hidden rounded-full bg-ink-2">
              <div className="h-full bg-amber transition-all duration-300" style={{ width: `${progress}%` }} />
            </div>
          </>
        ) : (
          <>
            <Plus className="h-4 w-4" />
            <span className="text-sm">
              {value.length > 0 ? `Tambah Foto Lagi (${value.length} foto)` : "Tambah Foto"}
            </span>
          </>
        )}
      </button>

      <input ref={ref} type="file" accept="image/*" multiple onChange={onFiles} className="hidden" />
    </div>
  );
}
