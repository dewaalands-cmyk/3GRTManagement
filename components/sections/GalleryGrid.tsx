"use client";
import { useState } from "react";
import { Play, X } from "lucide-react";
import { SmartImage } from "@/components/ui/SmartImage";

interface G { id: string; title: string; type: string; youtubeId?: string | null; imageUrl?: string | null }

export function GalleryGrid({ items }: { items: G[] }) {
  const [active, setActive] = useState<G | null>(null);

  return (
    <>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {items.map((g) => {
          const thumb = g.type === "video" && g.youtubeId
            ? `https://img.youtube.com/vi/${g.youtubeId}/hqdefault.jpg`
            : g.imageUrl || "";
          return (
            <button
              key={g.id}
              onClick={() => setActive(g)}
              className="group relative aspect-[4/5] overflow-hidden rounded-xl border border-line bg-ink-3 text-left"
            >
              {thumb && (
                <SmartImage src={thumb} alt={g.title} fill sizes="(max-width:768px) 50vw, 25vw" className="object-cover transition-transform duration-500 group-hover:scale-110" />
              )}
              <span className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/10 to-transparent" />
              {g.type === "video" && (
                <span className="absolute left-1/2 top-1/2 grid h-12 w-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-crimson/90 transition-transform duration-300 group-hover:scale-110">
                  <Play className="h-5 w-5 translate-x-0.5 fill-white text-white" />
                </span>
              )}
              <span className="absolute inset-x-0 bottom-0 p-3 font-heading text-xs font-semibold uppercase tracking-wide text-bone">{g.title}</span>
            </button>
          );
        })}
      </div>

      {/* Lightbox */}
      {active && (
        <div
          className="fixed inset-0 z-[100] grid place-items-center bg-black/85 p-4 backdrop-blur"
          onClick={() => setActive(null)}
        >
          <button className="absolute right-5 top-5 grid h-11 w-11 place-items-center rounded-lg border border-line text-bone" aria-label="Tutup">
            <X className="h-6 w-6" />
          </button>
          <div className="w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
            {active.type === "video" && active.youtubeId ? (
              <div className="aspect-video w-full overflow-hidden rounded-xl">
                <iframe
                  className="h-full w-full"
                  src={`https://www.youtube.com/embed/${active.youtubeId}?autoplay=1`}
                  title={active.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : active.imageUrl ? (
              <SmartImage src={active.imageUrl} alt={active.title} width={1280} height={960} className="mx-auto max-h-[80vh] w-auto rounded-xl object-contain" />
            ) : null}
            <p className="mt-3 text-center font-heading text-sm uppercase tracking-wide text-bone">{active.title}</p>
          </div>
        </div>
      )}
    </>
  );
}
