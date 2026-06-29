import { cn } from "@/lib/utils";

interface Props {
  className?: string;
  logoUrl?: string;
}

export function Logo({ className, logoUrl }: Props) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)} aria-label="3GRT Management">
      {logoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={logoUrl} alt="3GRT Management" className="h-32 w-auto max-w-[300px] object-contain" />
      ) : (
        <>
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-crimson to-amber shadow-glow">
            <svg viewBox="0 0 24 24" className="h-5 w-5 fill-white" aria-hidden>
              <path d="M12 2l2.2 5.6L20 8l-4.5 4 1.5 6.5L12 15l-5 3.5L8.5 12 4 8l5.8-.4z" />
            </svg>
          </span>
          <span className="font-heading text-xl font-bold tracking-wider text-bone">
            3GRT<span className="text-crimson">.</span>
          </span>
        </>
      )}
    </span>
  );
}
