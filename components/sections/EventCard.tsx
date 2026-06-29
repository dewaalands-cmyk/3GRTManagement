import { MapPin, Calendar, Hourglass } from "lucide-react";
import { SmartImage } from "@/components/ui/SmartImage";

interface EventData {
  title: string;
  badge?: string | null;
  date: string;
  location?: string | null;
  description?: string | null;
  imageUrl?: string | null;
  link?: string | null;
}

export function EventCard({ event }: { event: EventData }) {
  const inner = (
    <>
      <div className="relative aspect-[3/4] overflow-hidden bg-ink-3">
        {event.badge && (
          <span className="absolute left-4 top-4 z-10 rounded-full bg-amber px-3 py-1.5 font-heading text-[11px] font-bold uppercase tracking-wider text-ink">
            {event.badge}
          </span>
        )}
        {event.imageUrl ? (
          <SmartImage
            src={event.imageUrl}
            alt={event.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="grid h-full place-items-center text-white/70-dark">
            <Hourglass className="h-16 w-16 opacity-30" />
          </div>
        )}
      </div>
      <div className="p-6">
        <h3 className="font-heading text-xl font-semibold uppercase tracking-wide text-bone">{event.title}</h3>
        {event.location && (
          <p className="mt-3 flex items-center gap-2 text-sm text-white/70">
            <MapPin className="h-4 w-4 shrink-0 text-crimson" /> {event.location}
          </p>
        )}
        <p className="mt-2 flex items-center gap-2 text-sm text-white/70">
          <Calendar className="h-4 w-4 shrink-0 text-amber" /> {event.date}
        </p>
        {event.description && <p className="mt-4 text-sm leading-relaxed text-white/70">{event.description}</p>}
      </div>
    </>
  );

  const cls = "group block overflow-hidden rounded-2xl border border-line bg-ink-2 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-card";
  return event.link ? (
    <a href={event.link} target="_blank" rel="noopener noreferrer" className={cls}>{inner}</a>
  ) : (
    <div className={cls}>{inner}</div>
  );
}
