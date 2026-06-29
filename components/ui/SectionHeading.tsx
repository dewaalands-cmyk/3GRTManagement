import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <Reveal className={cn(align === "center" && "text-center", className)}>
      <h2 className="text-3xl leading-[1.05] drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)] sm:text-4xl md:text-5xl">{title}</h2>
      {subtitle && (
        <p className={cn("mt-4 max-w-2xl font-medium text-white/80 drop-shadow-[0_1px_6px_rgba(0,0,0,0.8)]", align === "center" && "mx-auto")}>{subtitle}</p>
      )}
    </Reveal>
  );
}
