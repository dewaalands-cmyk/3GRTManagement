import { Reveal } from "@/components/ui/Reveal";

interface Props {
  title: string;
  description: string | string[];
  imageUrl?: string;
  imagePosition?: "left" | "right";
  index: number;
}

function parseParagraphs(description: string | string[]): string[] {
  if (Array.isArray(description)) return description.filter(Boolean);
  try {
    const parsed = JSON.parse(description);
    if (Array.isArray(parsed)) return parsed.filter(Boolean);
  } catch { /* not JSON */ }
  return description ? [description] : [];
}

export function ServiceBlock({ title, description, imageUrl, imagePosition = "right", index }: Props) {
  const imgLeft = imagePosition === "left";
  const paragraphs = parseParagraphs(description);

  return (
    <div className={`flex flex-col gap-10 py-16 md:py-20 md:flex-row md:items-center ${index > 0 ? "border-t border-white/10" : ""}`}>

      {/* Kolom Teks */}
      <Reveal className={`flex-1 ${imgLeft ? "md:order-2" : "md:order-1"}`}>
        <div className="space-y-6">
          <span className="inline-block font-heading text-xs font-bold uppercase tracking-[0.25em] text-amber">
            Layanan {String(index + 1).padStart(2, "0")}
          </span>
          <h3 className="font-heading text-3xl font-black uppercase leading-tight tracking-wide text-bone drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)] md:text-4xl">
            {title}
          </h3>
          <div className="space-y-4">
            {paragraphs.map((p, i) => (
              <p key={i} className="max-w-xl text-lg leading-relaxed text-white/80 drop-shadow-[0_1px_6px_rgba(0,0,0,0.8)]">
                {p}
              </p>
            ))}
          </div>
        </div>
      </Reveal>

      {/* Kolom Gambar */}
      {imageUrl ? (
        <Reveal className={`w-full md:w-[45%] ${imgLeft ? "md:order-1" : "md:order-2"}`} delay={0.08}>
          <div className="group relative aspect-[4/3] overflow-hidden rounded-2xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl}
              alt={title}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            <div className={`absolute bottom-0 ${imgLeft ? "left-0" : "right-0"} h-1 w-24 bg-gradient-to-r from-crimson to-amber`} />
          </div>
        </Reveal>
      ) : (
        <div className={`hidden w-full md:block md:w-[45%] ${imgLeft ? "md:order-1" : "md:order-2"}`}>
          <div className="flex aspect-[4/3] items-center justify-center rounded-2xl border border-white/10 bg-white/5">
            <span className="font-heading text-6xl font-black uppercase text-white/10">
              {title.slice(0, 2)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
