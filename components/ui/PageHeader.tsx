import { Reveal } from "./Reveal";

export function PageHeader({ eyebrow, title, subtitle }: { eyebrow?: string; title: string; subtitle?: string }) {
  return (
    <section className="relative overflow-hidden border-b border-line pt-36 pb-16">
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="absolute -left-1/4 top-0 h-[120%] w-[60%] rounded-full bg-crimson/15 blur-[120px]" />
        <div className="absolute -right-1/4 top-0 h-[120%] w-[50%] rounded-full bg-amber/10 blur-[120px]" />
      </div>
      <div className="wrap">
        <Reveal>
          <h1 className="max-w-4xl text-4xl font-extrabold leading-[1.05] sm:text-5xl md:text-6xl">{title}</h1>
          {subtitle && <p className="mt-5 max-w-2xl text-lg text-bone/80">{subtitle}</p>}
        </Reveal>
      </div>
    </section>
  );
}
