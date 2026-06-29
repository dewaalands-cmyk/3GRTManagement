import { Reveal } from "@/components/ui/Reveal";
import type { TimelineItem } from "@/lib/content";

export function Timeline({ items }: { items: TimelineItem[] }) {
  return (
    <div className="relative mx-auto max-w-4xl">
      {/* garis vertikal — hanya desktop */}
      <span className="absolute left-1/2 top-0 hidden h-full w-0.5 -translate-x-1/2 bg-gradient-to-b from-crimson via-amber/60 to-transparent md:block" />

      <div className="space-y-8 md:space-y-0">
        {items.map((it, i) => {
          const isLeft = i % 2 === 0;
          return (
            <Reveal key={i} delay={i * 0.08}>
              <div className="relative flex items-start gap-4 md:items-center md:gap-0">

                {/* === DESKTOP layout === */}
                {/* Sisi kiri */}
                <div className={`hidden md:flex md:w-1/2 md:pr-14 ${isLeft ? "md:flex-col md:items-end md:text-right" : "md:invisible"}`}>
                  {isLeft && <ItemContent it={it} />}
                </div>

                {/* Titik tengah */}
                <div className="hidden md:flex md:w-0 md:flex-col md:items-center">
                  <span className="relative z-10 flex h-5 w-5 items-center justify-center rounded-full border-2 border-amber bg-crimson shadow-glow">
                    <span className="h-2 w-2 rounded-full bg-white" />
                  </span>
                </div>

                {/* Sisi kanan */}
                <div className={`hidden md:flex md:w-1/2 md:pl-14 ${!isLeft ? "md:flex-col md:items-start md:text-left" : "md:invisible"}`}>
                  {!isLeft && <ItemContent it={it} />}
                </div>

                {/* === MOBILE layout === */}
                <span className="relative z-10 mt-1.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-amber bg-crimson shadow-glow md:hidden">
                  <span className="h-2 w-2 rounded-full bg-white" />
                </span>
                {/* garis mobile */}
                {i < items.length - 1 && (
                  <span className="absolute left-[9px] top-6 h-[calc(100%+2rem)] w-0.5 bg-gradient-to-b from-crimson/60 to-transparent md:hidden" />
                )}
                <div className="flex-1 pb-10 md:hidden">
                  <ItemContent it={it} />
                </div>

              </div>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}

function ItemContent({ it }: { it: TimelineItem }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-ink/60 px-6 py-5 backdrop-blur-sm">
      <span className="inline-block font-heading text-sm font-bold uppercase tracking-[0.2em] text-amber">
        {it.year}
      </span>
      <h3 className="mt-1 font-heading text-2xl font-extrabold uppercase tracking-wide text-white drop-shadow-lg md:text-3xl">
        {it.title}
      </h3>
      <p className="mt-2 text-base font-medium leading-relaxed text-white/80">
        {it.desc}
      </p>
    </div>
  );
}
