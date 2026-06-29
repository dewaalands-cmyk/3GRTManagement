import { Quote, Star } from "lucide-react";

interface T { quote: string; name: string; role?: string | null; rating: number }

export function TestimonialCard({ t }: { t: T }) {
  const initials = t.name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join("").toUpperCase();
  return (
    <figure className="flex h-full flex-col rounded-2xl border border-line bg-ink-2 p-8">
      <Quote className="h-8 w-8 text-crimson/40" />
      <blockquote className="mt-4 flex-1 text-bone/85">{t.quote}</blockquote>
      <div className="mt-6 flex items-center gap-1 text-amber">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} className={i < t.rating ? "h-4 w-4 fill-amber" : "h-4 w-4 opacity-25"} />
        ))}
      </div>
      <figcaption className="mt-5 flex items-center gap-3 border-t border-line pt-5">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gradient-to-br from-crimson to-amber font-heading text-sm font-bold text-ink">
          {initials}
        </span>
        <span>
          <span className="block font-heading font-semibold text-bone">{t.name}</span>
          {t.role && <span className="block text-sm text-amber">{t.role}</span>}
        </span>
      </figcaption>
    </figure>
  );
}
