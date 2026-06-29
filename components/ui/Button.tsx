import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "amber" | "ghost" | "dark";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  primary: "bg-crimson text-white hover:bg-crimson-dark shadow-glow",
  amber: "bg-amber text-ink hover:bg-amber-dark",
  ghost: "border border-line bg-white/[0.02] text-bone hover:border-amber hover:text-amber",
  dark: "bg-ink-3 text-bone hover:bg-ink-2 border border-line",
};
const sizes: Record<Size, string> = {
  sm: "px-4 py-2 text-xs",
  md: "px-7 py-3.5 text-sm",
  lg: "px-9 py-4 text-base",
};

interface Props {
  href?: string;
  variant?: Variant;
  size?: Size;
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}

export function Button({ href, variant = "primary", size = "md", className, type = "button", disabled, onClick, children }: Props) {
  const cls = cn(
    "inline-flex items-center justify-center gap-2 rounded-full font-heading font-semibold uppercase tracking-wide transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap",
    variants[variant],
    sizes[size],
    className
  );

  if (href) {
    const external = href.startsWith("http");
    if (external) {
      return <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>{children}</a>;
    }
    return <Link href={href} className={cls}>{children}</Link>;
  }
  return <button type={type} disabled={disabled} onClick={onClick} className={cls}>{children}</button>;
}
