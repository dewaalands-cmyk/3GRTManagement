"use client";
import { useState } from "react";
import { ImageOff, Loader2, CheckCircle2, Minimize2, RefreshCw } from "lucide-react";

const TARGET_BYTES = 512 * 1024; // 0.5 MB
const MAX_DIM = 1920;

function dataUrlBytes(dataUrl: string): number {
  const b64 = dataUrl.slice(dataUrl.indexOf(",") + 1);
  return Math.round(b64.length * 0.75);
}

function formatBytes(bytes: number): string {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

async function compressDataUrl(dataUrl: string): Promise<string> {
  if (dataUrlBytes(dataUrl) <= TARGET_BYTES) return dataUrl;
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      let w = img.naturalWidth, h = img.naturalHeight;
      if (w > MAX_DIM || h > MAX_DIM) {
        const r = Math.min(MAX_DIM / w, MAX_DIM / h);
        w = Math.round(w * r); h = Math.round(h * r);
      }
      canvas.width = w; canvas.height = h;
      canvas.getContext("2d")!.drawImage(img, 0, 0, w, h);
      let lo = 0.1, hi = 0.92, best = "";
      for (let i = 0; i < 10; i++) {
        const mid = (lo + hi) / 2;
        const data = canvas.toDataURL("image/jpeg", mid);
        if (dataUrlBytes(data) <= TARGET_BYTES) { best = data; lo = mid; }
        else hi = mid;
      }
      resolve(best || canvas.toDataURL("image/jpeg", 0.1));
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
}

type ImgItem = {
  id: string;
  label: string;
  type: "content" | "resource";
  resourceName?: string;
  resourceId?: string;
  contentKey?: string;
  fieldPath?: string; // e.g. "mediaUrl" for nested objects
  dataUrl: string;
  bytes: number;
  done?: boolean;
  saved?: number;
};

async function scanAllImages(): Promise<ImgItem[]> {
  const items: ImgItem[] = [];

  // --- Scan konten ---
  const contentRes = await fetch("/api/admin/content");
  if (contentRes.ok) {
    const rows: { key: string; value: unknown }[] = await contentRes.json();
    for (const row of rows) {
      const v = row.value;
      // direct string data URL
      if (typeof v === "string" && v.startsWith("data:image")) {
        items.push({
          id: `content-${row.key}`,
          label: `Konten: ${row.key}`,
          type: "content",
          contentKey: row.key,
          dataUrl: v,
          bytes: dataUrlBytes(v),
        });
      }
      // object with potential image fields
      if (v && typeof v === "object") {
        const obj = v as Record<string, unknown>;
        for (const field of ["mediaUrl", "imageUrl", "logoUrl", "bgUrl", "heroBg", "tentangBg", "whyusBg", "timelineBg"]) {
          const fv = obj[field];
          if (typeof fv === "string" && fv.startsWith("data:image")) {
            items.push({
              id: `content-${row.key}-${field}`,
              label: `Konten: ${row.key}.${field}`,
              type: "content",
              contentKey: row.key,
              fieldPath: field,
              dataUrl: fv,
              bytes: dataUrlBytes(fv),
            });
          }
        }
      }
    }
  }

  // --- Scan resource ---
  const resources = ["events", "services", "partners", "galleries", "testimoni"] as const;
  const imageFields: Record<string, string[]> = {
    events: ["imageUrl"],
    services: ["imageUrl"],
    partners: ["logoUrl"],
    galleries: ["imageUrl", "url"],
    testimoni: ["avatarUrl"],
  };

  for (const resource of resources) {
    const res = await fetch(`/api/admin/${resource}`);
    if (!res.ok) continue;
    const rows: Record<string, unknown>[] = await res.json();
    for (const row of rows) {
      for (const field of imageFields[resource] ?? []) {
        const fv = row[field];
        if (typeof fv === "string" && fv.startsWith("data:image")) {
          items.push({
            id: `${resource}-${row.id}-${field}`,
            label: `${resource}: "${row.title ?? row.name ?? row.id}" (${field})`,
            type: "resource",
            resourceName: resource,
            resourceId: String(row.id),
            fieldPath: field,
            dataUrl: fv,
            bytes: dataUrlBytes(fv),
          });
        }
      }
    }
  }

  return items.filter((i) => i.bytes > TARGET_BYTES);
}

async function saveItem(item: ImgItem, compressed: string): Promise<boolean> {
  if (item.type === "content") {
    if (item.fieldPath) {
      // fetch current content value, merge, PUT
      const res = await fetch("/api/admin/content");
      if (!res.ok) return false;
      const rows: { key: string; value: unknown }[] = await res.json();
      const row = rows.find((r) => r.key === item.contentKey);
      if (!row || !row.value || typeof row.value !== "object") return false;
      const updated = { ...(row.value as Record<string, unknown>), [item.fieldPath!]: compressed };
      const putRes = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: item.contentKey, value: updated }),
      });
      return putRes.ok;
    } else {
      const putRes = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: item.contentKey, value: compressed }),
      });
      return putRes.ok;
    }
  }

  if (item.type === "resource") {
    const putRes = await fetch(`/api/admin/${item.resourceName}/${item.resourceId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [item.fieldPath!]: compressed }),
    });
    return putRes.ok;
  }

  return false;
}

export function BulkCompressor() {
  const [scanning, setScanning] = useState(false);
  const [items, setItems] = useState<ImgItem[]>([]);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const [progress, setProgress] = useState(0);
  const [totalSaved, setTotalSaved] = useState(0);

  async function scan() {
    setScanning(true);
    setItems([]);
    setDone(false);
    setTotalSaved(0);
    try {
      const found = await scanAllImages();
      setItems(found);
    } finally {
      setScanning(false);
    }
  }

  async function compressAll() {
    setRunning(true);
    setProgress(0);
    let saved = 0;
    const updated = [...items];

    for (let i = 0; i < updated.length; i++) {
      const item = updated[i];
      const compressed = await compressDataUrl(item.dataUrl);
      const compressedBytes = dataUrlBytes(compressed);
      const ok = await saveItem(item, compressed);
      if (ok) {
        saved += item.bytes - compressedBytes;
        updated[i] = { ...item, done: true, saved: item.bytes - compressedBytes };
      }
      setItems([...updated]);
      setProgress(Math.round(((i + 1) / updated.length) * 100));
    }

    setTotalSaved(saved);
    setRunning(false);
    setDone(true);
  }

  const totalBefore = items.reduce((s, i) => s + i.bytes, 0);

  return (
    <div className="mt-10 rounded-2xl border border-line bg-ink-2 p-6">
      <div className="mb-6 flex items-center gap-3">
        <Minimize2 className="h-5 w-5 text-amber" />
        <div>
          <h3 className="font-heading font-semibold uppercase tracking-wide text-bone">Kompres Gambar Tersimpan</h3>
          <p className="text-sm text-muted">Perkecil semua gambar base64 yang sudah tersimpan di database menjadi ≤ 0.5MB</p>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={scan}
          disabled={scanning || running}
          className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-2.5 font-heading text-sm font-semibold uppercase tracking-wide text-bone transition-colors hover:border-amber hover:text-amber disabled:opacity-50"
        >
          {scanning ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
          {scanning ? "Memindai..." : "Pindai Gambar"}
        </button>

        {items.length > 0 && !done && (
          <button
            onClick={compressAll}
            disabled={running}
            className="inline-flex items-center gap-2 rounded-full bg-amber px-5 py-2.5 font-heading text-sm font-semibold uppercase tracking-wide text-ink shadow-glow-amber transition-colors hover:bg-amber/80 disabled:opacity-50"
          >
            {running ? <Loader2 className="h-4 w-4 animate-spin" /> : <Minimize2 className="h-4 w-4" />}
            {running ? `Mengompres... ${progress}%` : `Kompres Semua (${items.length} gambar)`}
          </button>
        )}
      </div>

      {/* Progress bar */}
      {running && (
        <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-ink-3">
          <div
            className="h-full rounded-full bg-gradient-to-r from-crimson to-amber transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* Hasil scan */}
      {items.length === 0 && !scanning && !done && (
        <p className="mt-4 text-sm text-muted">
          Klik "Pindai Gambar" untuk mencari gambar yang perlu dikompres.
        </p>
      )}

      {items.length === 0 && done && (
        <div className="mt-4 flex items-center gap-2 text-sm text-green-400">
          <CheckCircle2 className="h-4 w-4" />
          Semua gambar sudah dalam ukuran optimal!
        </div>
      )}

      {items.length > 0 && (
        <div className="mt-5 space-y-2">
          {done && (
            <div className="mb-4 flex items-center gap-2 rounded-xl border border-amber/20 bg-amber/10 px-4 py-3 text-sm text-amber">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              Selesai! Total penghematan: <strong>{formatBytes(totalSaved)}</strong>
            </div>
          )}

          {!done && (
            <p className="text-sm text-muted">
              Ditemukan <strong className="text-bone">{items.length} gambar</strong> berukuran total{" "}
              <strong className="text-crimson">{formatBytes(totalBefore)}</strong> yang perlu dikompres.
            </p>
          )}

          <ul className="max-h-72 space-y-1.5 overflow-y-auto pr-1">
            {items.map((item) => (
              <li
                key={item.id}
                className={`flex items-center justify-between rounded-lg border px-4 py-2.5 text-sm ${
                  item.done
                    ? "border-green-800/40 bg-green-900/20 text-green-400"
                    : "border-line bg-ink-3 text-bone/80"
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  {item.done ? (
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-green-400" />
                  ) : (
                    <ImageOff className="h-4 w-4 shrink-0 text-muted" />
                  )}
                  <span className="truncate">{item.label}</span>
                </div>
                <span className="ml-3 shrink-0 font-mono text-xs">
                  {item.done && item.saved !== undefined ? (
                    <span className="text-green-400">-{formatBytes(item.saved)}</span>
                  ) : (
                    <span className="text-crimson">{formatBytes(item.bytes)}</span>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
