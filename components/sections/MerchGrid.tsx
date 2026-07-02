"use client";
import { useState, useEffect, useCallback } from "react";
import { ShoppingBag, ChevronLeft, ChevronRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { EmptyState } from "@/components/ui/EmptyState";

interface MerchItem {
  id: string;
  name: string;
  description?: string | null;
  price?: string | null;
  mediaUrls?: string[] | null;
  link?: string | null;
  badge?: string | null;
}

function MerchCard({ item }: { item: MerchItem }) {
  const images = (item.mediaUrls ?? []).filter(Boolean);
  const [current, setCurrent] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [errored, setErrored] = useState<Set<number>>(new Set());

  const prev = useCallback(() => setCurrent((c) => (c - 1 + images.length) % images.length), [images.length]);
  const next = useCallback(() => setCurrent((c) => (c + 1) % images.length), [images.length]);

  // Auto-slide on hover
  useEffect(() => {
    if (!isHovered || images.length < 2) return;
    const id = setInterval(next, 2500);
    return () => clearInterval(id);
  }, [isHovered, images.length, next]);

  // Reset to 0 if images change
  useEffect(() => { setCurrent(0); setErrored(new Set()); }, [images.length]);

  const visibleImages = images.filter((_, i) => !errored.has(i));

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-ink-2 transition-all duration-300 hover:-translate-y-1 hover:border-amber/40 hover:shadow-[0_0_30px_rgba(212,168,67,0.1)]">
      {/* Media area */}
      <div
        className="relative aspect-square overflow-hidden bg-ink-3"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {visibleImages.length > 0 ? (
          <>
            {/* Slides — key on URL (not index) so React destroys/creates correctly */}
            {images.map((url, i) => {
              if (errored.has(i)) return null;
              const activeClamped = Math.min(current, visibleImages.length - 1);
              const visibleIdx = visibleImages.indexOf(url);
              const isActive = visibleIdx === activeClamped;
              return (
                <div
                  key={url}
                  style={{
                    position: "absolute", inset: 0,
                    opacity: isActive ? 1 : 0,
                    transition: "opacity 0.5s ease-in-out",
                    zIndex: isActive ? 1 : 0,
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={url}
                    alt={`${item.name} ${i + 1}`}
                    className="h-full w-full object-cover"
                    onError={() => setErrored((prev) => new Set(prev).add(i))}
                  />
                </div>
              );
            })}

            {/* Arrows */}
            {visibleImages.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => { e.preventDefault(); prev(); }}
                  className="absolute left-2 top-1/2 z-10 -translate-y-1/2 grid h-8 w-8 place-items-center rounded-full bg-black/50 text-white opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100 hover:bg-black/70"
                  aria-label="Sebelumnya"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={(e) => { e.preventDefault(); next(); }}
                  className="absolute right-2 top-1/2 z-10 -translate-y-1/2 grid h-8 w-8 place-items-center rounded-full bg-black/50 text-white opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100 hover:bg-black/70"
                  aria-label="Berikutnya"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>

                {/* Dots */}
                <div className="absolute bottom-2 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
                  {visibleImages.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={(e) => { e.preventDefault(); setCurrent(i); }}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        i === Math.min(current, visibleImages.length - 1)
                          ? "w-4 bg-amber"
                          : "w-1.5 bg-white/50 hover:bg-white/80"
                      }`}
                      aria-label={`Foto ${i + 1}`}
                    />
                  ))}
                </div>

                {/* Counter */}
                <span className="absolute right-2 top-2 z-10 rounded-full bg-black/50 px-2 py-0.5 font-heading text-[10px] font-semibold text-white backdrop-blur-sm">
                  {Math.min(current, visibleImages.length - 1) + 1}/{visibleImages.length}
                </span>
              </>
            )}
          </>
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <ShoppingBag className="h-16 w-16 text-white/10" />
          </div>
        )}

        {/* Gradient */}
        <div className="pointer-events-none absolute inset-0 z-[2] bg-gradient-to-t from-black/30 via-transparent to-transparent" />

        {/* Badge */}
        {item.badge && (
          <span className="absolute left-3 top-3 z-10 rounded-full bg-crimson px-3 py-1 font-heading text-[10px] font-bold uppercase tracking-widest text-white shadow">
            {item.badge}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col gap-2 p-5">
        <h3 className="font-heading text-base font-bold uppercase leading-tight tracking-wide text-bone">
          {item.name}
        </h3>
        {item.description && (
          <p className="line-clamp-2 text-sm leading-relaxed text-white/60">
            {item.description}
          </p>
        )}
        <div className="mt-auto flex items-center justify-between pt-3">
          {item.price ? (
            <span className="font-heading text-lg font-extrabold text-amber">{item.price}</span>
          ) : (
            <span className="font-heading text-sm text-muted">Hubungi kami</span>
          )}
          {item.link && (
            <a
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full bg-crimson px-4 py-2 font-heading text-xs font-bold uppercase tracking-wide text-white shadow-glow transition-colors hover:bg-crimson/80"
            >
              <ShoppingBag className="h-3.5 w-3.5" />
              Pesan
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export function MerchGrid({ items }: { items: MerchItem[] }) {
  return (
    <>
      <SectionHeading
        eyebrow="Official Store"
        title="3GRT Merchandise"
        subtitle="Kenakan semangat juang. Koleksi resmi 3GRT Management."
        align="center"
        className="mb-14"
      />

      {items.length === 0 ? (
        <EmptyState title="Belum ada produk" desc="Produk merchandise akan segera tersedia. Pantau terus halaman ini." />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((item) => (
            <Reveal key={item.id}>
              <MerchCard item={item} />
            </Reveal>
          ))}
        </div>
      )}
    </>
  );
}
