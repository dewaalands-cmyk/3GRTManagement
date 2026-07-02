"use client";
import { useState } from "react";
import { ImageUpload } from "./ImageUpload";
import { VideoUpload } from "./VideoUpload";

function isVideoValue(v: string) {
  return v.startsWith("data:video") || (v.includes("/api/img") && v.includes("t=video"));
}

export function MediaUpload({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [tab, setTab] = useState<"image" | "video">(
    value && isVideoValue(value) ? "video" : "image"
  );

  if (value) {
    return isVideoValue(value)
      ? <VideoUpload value={value} onChange={onChange} />
      : <ImageUpload value={value} onChange={onChange} />;
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setTab("image")}
          className={`rounded-full px-4 py-1.5 font-heading text-xs font-semibold uppercase tracking-wide transition-colors ${
            tab === "image" ? "bg-amber text-ink" : "border border-line text-muted hover:border-amber hover:text-amber"
          }`}
        >
          Gambar
        </button>
        <button
          type="button"
          onClick={() => setTab("video")}
          className={`rounded-full px-4 py-1.5 font-heading text-xs font-semibold uppercase tracking-wide transition-colors ${
            tab === "video" ? "bg-amber text-ink" : "border border-line text-muted hover:border-amber hover:text-amber"
          }`}
        >
          Video
        </button>
      </div>
      {tab === "image"
        ? <ImageUpload value="" onChange={onChange} />
        : <VideoUpload value="" onChange={onChange} />
      }
    </div>
  );
}
