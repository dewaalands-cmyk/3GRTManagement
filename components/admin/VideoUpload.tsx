"use client";
import { useRef, useState } from "react";
import { Video, X, Loader2 } from "lucide-react";

const MAX_INPUT_MB = 500;
const VIDEO_BITRATE = 400_000; // 400 kbps — small enough to stay under Vercel 4.5 MB body limit
const MAX_WIDTH = 854;         // 480p-wide, keeps file small

function formatBytes(bytes: number) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

async function processVideo(
  file: File,
  onProgress: (pct: number) => void,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const videoEl = document.createElement("video");
    videoEl.muted = true;
    videoEl.playsInline = true;
    videoEl.preload = "metadata";

    const blobUrl = URL.createObjectURL(file);
    videoEl.src = blobUrl;

    videoEl.onloadedmetadata = () => {
      const duration = videoEl.duration;

      // Scale down resolution if needed
      const origW = videoEl.videoWidth;
      const origH = videoEl.videoHeight;
      const scale = origW > MAX_WIDTH ? MAX_WIDTH / origW : 1;
      const targetW = Math.round(origW * scale);
      const targetH = Math.round(origH * scale);

      // captureStream() gives video-only by default when we pass only video tracks
      const rawStream: MediaStream =
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (videoEl as any).captureStream?.() ?? (videoEl as any).mozCaptureStream?.();

      if (!rawStream) {
        // Browser unsupported — fall back to raw data URL (no processing)
        URL.revokeObjectURL(blobUrl);
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
        return;
      }

      // Draw into a scaled canvas to reduce resolution
      const canvas = document.createElement("canvas");
      canvas.width = targetW;
      canvas.height = targetH;
      const ctx = canvas.getContext("2d")!;

      // captureStream from canvas gives us a resized, audio-free stream
      const canvasStream = canvas.captureStream(30);

      // Merge in only video tracks from the canvas stream
      const outputStream = new MediaStream(canvasStream.getVideoTracks());

      const mimeType = MediaRecorder.isTypeSupported("video/webm;codecs=vp9")
        ? "video/webm;codecs=vp9"
        : "video/webm;codecs=vp8";

      let recorder: MediaRecorder;
      try {
        recorder = new MediaRecorder(outputStream, {
          mimeType,
          videoBitsPerSecond: VIDEO_BITRATE,
        });
      } catch {
        URL.revokeObjectURL(blobUrl);
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
        return;
      }

      const chunks: Blob[] = [];
      recorder.ondataavailable = (e) => { if (e.data.size > 0) chunks.push(e.data); };
      recorder.onstop = () => {
        URL.revokeObjectURL(blobUrl);
        onProgress(100);
        const blob = new Blob(chunks, { type: "video/webm" });
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      };

      // Draw each frame into the canvas (this drives the encoding)
      let rafId: number;
      function drawFrame() {
        ctx.drawImage(videoEl, 0, 0, targetW, targetH);
        rafId = requestAnimationFrame(drawFrame);
      }

      const progressId = setInterval(() => {
        if (duration > 0)
          onProgress(Math.min(95, (videoEl.currentTime / duration) * 100));
      }, 400);

      videoEl.onended = () => {
        clearInterval(progressId);
        cancelAnimationFrame(rafId);
        recorder.stop();
      };
      videoEl.onerror = () => {
        clearInterval(progressId);
        cancelAnimationFrame(rafId);
        URL.revokeObjectURL(blobUrl);
        reject(new Error("Video load error"));
      };

      recorder.start(100);
      drawFrame();
      videoEl.play().catch((err) => {
        clearInterval(progressId);
        cancelAnimationFrame(rafId);
        URL.revokeObjectURL(blobUrl);
        reject(err);
      });
    };

    videoEl.onerror = () => {
      URL.revokeObjectURL(blobUrl);
      reject(new Error("Cannot load video"));
    };
  });
}

export function VideoUpload({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [info, setInfo] = useState("");

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_INPUT_MB * 1024 * 1024) {
      alert(`Ukuran video maksimal ${MAX_INPUT_MB} MB.`);
      return;
    }

    const originalSize = file.size;
    setProcessing(true);
    setProgress(0);
    setInfo("");

    try {
      const result = await processVideo(file, setProgress);
      const resultBytes = Math.round((result.length - result.indexOf(",") - 1) * 0.75);
      onChange(result);
      setInfo(`${formatBytes(originalSize)} → ${formatBytes(resultBytes)} · tanpa suara`);
    } catch (err) {
      console.error(err);
      alert("Gagal memproses video. Coba lagi atau gunakan format MP4/WebM.");
    } finally {
      setProcessing(false);
      setProgress(0);
      if (ref.current) ref.current.value = "";
    }
  }

  const isVideo = value.startsWith("data:video") || (value.includes("/api/img") && value.includes("t=video"));

  return (
    <div>
      {value ? (
        <div className="relative w-full overflow-hidden rounded-lg border border-line bg-ink-3">
          {isVideo ? (
            <video
              src={value}
              muted
              controls
              playsInline
              className="max-h-64 w-full object-contain"
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="Pratinjau" className="max-h-64 w-full object-contain" />
          )}
          <button
            type="button"
            onClick={() => { onChange(""); setInfo(""); }}
            className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-crimson text-white shadow"
            aria-label="Hapus"
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
          disabled={processing}
          className="flex h-32 w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-line bg-ink-3 text-muted transition-colors hover:border-amber hover:text-amber disabled:opacity-60"
        >
          {processing ? (
            <>
              <Loader2 className="h-6 w-6 animate-spin text-amber" />
              <span className="text-sm text-amber">
                Memproses... {Math.round(progress)}%
              </span>
              <div className="h-1.5 w-48 overflow-hidden rounded-full bg-ink-2">
                <div
                  className="h-full bg-amber transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </>
          ) : (
            <>
              <Video className="h-6 w-6" />
              <span className="text-sm text-center px-4">
                Upload video (maks {MAX_INPUT_MB} MB) · otomatis dikompres &amp; dibisukan
              </span>
            </>
          )}
        </button>
      )}

      <input
        ref={ref}
        type="file"
        accept="video/*"
        onChange={onFile}
        className="hidden"
      />
    </div>
  );
}
