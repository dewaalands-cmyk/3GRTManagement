import { ArrowRight, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { SiteContentData } from "@/lib/content";

interface Props {
  content: SiteContentData;
  onNavigate?: (section: "beranda" | "layanan" | "event" | "kontak") => void;
}

export function Hero({ content, onNavigate }: Props) {
  const h = content.hero;
  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden pt-24">
      {/* Latar: gradient halus + grid tipis */}
      <div aria-hidden className="absolute inset-0 -z-10">
        {content.heroBg ? (
          <>
            <div className="absolute inset-0" style={{ backgroundImage: `url(${content.heroBg})`, backgroundSize: "cover", backgroundPosition: "center" }} />
            <div className="absolute inset-0" style={{ backgroundColor: `rgba(8,8,8,${((content.bgOverlay ?? 60) / 100).toFixed(2)})` }} />
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
