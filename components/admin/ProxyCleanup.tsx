"use client";
import { useState } from "react";
import { AlertTriangle, Loader2, CheckCircle2, Wrench } from "lucide-react";

export function ProxyCleanup() {
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<{ cleaned: string[]; count: number } | null>(null);
  const [error, setError] = useState("");

  async function run() {
    setRunning(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch("/api/admin/cleanup-proxy", { method: "POST" });
      if (!res.ok) throw new Error("Gagal");
      const data = await res.json();
      setResult(data);
    } catch {
      setError("Gagal menjalankan cleanup. Coba lagi.");
    } finally {
      setRunning(false);
    }
  }

  return (
    <div className="mt-6 rounded-2xl border border-amber/30 bg-amber/5 p-6">
      <div className="mb-4 flex items-start gap-3">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber" />
        <div>
          <h3 className="font-heading font-semibold uppercase tracking-wide text-bone">Perbaiki Gambar Rusak</h3>
          <p className="mt-1 text-sm text-muted">
            Jika ada gambar yang hilang setelah update, jalankan ini untuk membersihkan data gambar yang rusak di database.
            Gambar yang terkena perlu di-upload ulang.
          </p>
        </div>
      </div>

      <button
        onClick={run}
        disabled={running}
        className="inline-flex items-center gap-2 rounded-full bg-amber px-5 py-2.5 font-heading text-sm font-semibold uppercase tracking-wide text-ink transition-colors hover:bg-amber/80 disabled:opacity-50"
      >
        {running ? <><Loader2 className="h-4 w-4 animate-spin" /> Memeriksa...</> : <><Wrench className="h-4 w-4" /> Jalankan Perbaikan</>}
      </button>

      {error && <p className="mt-3 text-sm text-crimson-light">{error}</p>}

      {result && (
        <div className="mt-4 flex items-start gap-2 text-sm">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-400" />
          {result.count === 0 ? (
            <span className="text-green-400">Tidak ada data rusak ditemukan. Database bersih.</span>
          ) : (
            <span className="text-amber">
              Dibersihkan {result.count} entri: <span className="font-mono">{result.cleaned.join(", ")}</span>.
              Silakan upload ulang gambar yang hilang.
            </span>
          )}
        </div>
      )}
    </div>
  );
}
