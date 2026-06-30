"use client";
import { useState, useEffect, useRef, useMemo } from "react";
import { ArrowRight, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { SiteContentData } from "@/lib/content";

interface Props {
  content: SiteContentData;
  onNavigate?: (section: "beranda" | "layanan" | "event" | "kontak") => void;
}

export function Hero({ content, onNavigate }: Props) {
  const h = content.hero;

  const slides = useMemo(
    () => (content.heroBgSlides ?? []).filter(Boolean),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [JSON.stringify(content.heroBgSlides)]
  );
  const hasSlides = slides.length > 0;
  const durationMs = Math.max(1, content.heroBgDuration ?? 5) * 1000;
  const overlay = `rgba(8,8,8,${((content.bgOverlay ?? 60) / 100).toFixed(2)})`;

  const [current, setCurrent] = useState(0);
  const [loaded, setLoaded] = useState<boolean[]>([]);

  // Preload every slide image so there's no blank flash on first transition
  useEffect(() => {
    if (!hasSlides) return;
    const imgs = slides.map((url, i) => {
      const img = new window.Image();
      img.onload = () =>
        setLoaded((prev) => {
          const next = [...prev];
          next[i] = true;
          return next;
        });
      img.src = url;
      return img;
    });
    return () => imgs.forEach((img) => { img.onload = null; });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slides.join(",")]);

  // Ref keeps the interval callback up-to-date without restarting the timer
  const slidesLenRef = useRef(slides.length);
  useEffect(() => { slidesLenRef.current = slides.length; }, [slides.length]);

  useEffect(() => {
    if (!hasSlides || slides.length < 2) return;
    const id = setInterval(
      () => setCurrent((i) => (i + 1) % slidesLenRef.current),
      durationMs
    );
    return () => clearInterval(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasSlides, slides.length, durationMs]);

  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden pt-24">
      {/* ── Background ── */}
      <div aria-hidden className="absolute inset-0 -z-10">
        {hasSlides ? (
          <>
            {slides.map((url, i) => (
              <div
                key={url}
                style={{
                  position: "absolute",
                  inset: 0,
                  // Use inline transition so Tailwind purging can't remove it
                  opacity: i === current ? 1 : 0,
                  transition: "opacity 1.2s ease-in-out",
                  backgroundImage: `url(${url})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  // keep invisible slides in GPU compositing layer for instant swap
                  willChange: "opacity",
                  // show nothing until image is loaded (avoids gray flash)
                  visibility: loaded[i] || i === 0 ? "visible" : "hidden",
                }}
              />
            ))}
            <div className="absolute inset-0" style={{ backgroundColor: overlay }} />
          </>
        ) : content.heroBg ? (
          <>
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `url(${content.heroBg})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
            <div className="absolute inset-0" style={{ backgroundColor: overlay }} />
          </>
        ) : (
          <>
            <div className="absolute inset-0 bg-ink" />
            <div className="absolute -left-1/4 bottom-0 h-[80%] w-[70%] rounded-full bg-crimson/20 blur-[120px] animate-pulse-glow" />
            <div className="absolute -right-1/4 top-0 h-[60%] w-[60%] rounded-full bg-amber/10 blur-[120px]" />
          </>
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-ink" />
      </div>

      {/* ── Slide dots ── */}
      {hasSlides && slides.length > 1 && (
        <div
          style={{
            position: "absolute",
            bottom: "2rem",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            zIndex: 10,
          }}
        >
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              aria-label={`Slide ${i + 1}`}
              style={{
                borderRadius: "9999px",
                transition: "all 0.3s ease",
                width: i === current ? "1.75rem" : "0.5rem",
                height: i === current ? "0.625rem" : "0.5rem",
                background: i === current ? "#E63946" : "rgba(255,255,255,0.35)",
                border: "none",
                cursor: "pointer",
                padding: 0,
              }}
            />
          ))}
        </div>
      )}

      {/* ── Content ── */}
      <div className="mx-auto w-[92%] max-w-wrap">
        <div className="max-w-3xl">
          <p className="eyebrow animate-fade-up">{h.eyebrow}</p>
          <h1
            className="mt-6 text-5xl font-extrabold leading-[0.95] animate-fade-up sm:text-6xl md:text-7xl"
            style={{ animationDelay: "0.08s" }}
          >
            {h.title}{" "}
            <span className="text-gradient">{h.titleAccent}</span>
          </h1>
          <p
            className="mt-6 max-w-xl text-lg leading-relaxed text-bone/80 animate-fade-up"
            style={{ animationDelay: "0.16s" }}
          >
            {h.subtitle}
          </p>
          <div
            className="mt-9 flex flex-col gap-3 animate-fade-up sm:flex-row"
            style={{ animationDelay: "0.24s" }}
          >
            <Button size="lg" onClick={() => onNavigate?.("kontak")}>
              {h.ctaPrimary} <ArrowRight className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="lg" onClick={() => onNavigate?.("event")}>
              {h.ctaSecondary} <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Statistik */}
        <dl
          className="mt-16 grid grid-cols-2 gap-x-6 gap-y-8 border-t border-line pt-10 animate-fade-up md:grid-cols-4"
          style={{ animationDelay: "0.32s" }}
        >
          {content.stats.map((s, i) => (
            <div key={i}>
              <dt className="font-heading text-4xl font-extrabold text-gradient md:text-5xl">{s.value}</dt>
              <dd className="mt-2 font-heading text-xs font-medium uppercase tracking-widest text-muted">{s.label}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
