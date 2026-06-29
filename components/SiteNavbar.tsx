"use client";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Logo } from "./ui/Logo";
import { Button } from "./ui/Button";
import { cn } from "@/lib/utils";

const LINKS = [
  { id: "beranda", label: "Beranda" },
  { id: "layanan", label: "Layanan" },
  { id: "event", label: "Event" },
  { id: "kontak", label: "Kontak" },
] as const;

type Section = typeof LINKS[number]["id"];

interface Props {
  active: Section;
  onNavigate: (s: Section) => void;
  logoUrl?: string;
}

export function SiteNavbar({ active, onNavigate, logoUrl }: Props) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  function go(id: Section) {
    onNavigate(id);
    setOpen(false);
  }

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled ? "border-b border-line bg-ink/85 backdrop-blur-lg" : "border-b border-transparent"
      )}
    >
      <nav className="relative mx-auto flex h-14 w-[92%] max-w-wrap items-center justify-between">
        {/* Logo absolut — menonjol di luar tinggi navbar */}
        <button onClick={() => go("beranda")} className="absolute left-0 top-1/2 -translate-y-1/2 focus:outline-none transition-transform duration-300 hover:scale-110 active:scale-95">
          <Logo logoUrl={logoUrl} />
        </button>
        {/* Spacer agar link tidak tertimpa logo */}
        <div className="w-56" />

        {/* Desktop links */}
        <ul className="hidden items-center gap-8 lg:flex">
          {LINKS.map((l) => (
            <li key={l.id}>
              <button
                onClick={() => go(l.id)}
                className={cn(
                  "relative font-heading text-base font-medium uppercase tracking-wide transition-all duration-200 hover:scale-110 active:scale-95",
                  active === l.id ? "text-amber" : "text-bone/80 hover:text-bone"
                )}
              >
                {l.label}
                {active === l.id && (
                  <span className="absolute -bottom-1.5 left-0 h-0.5 w-full bg-amber" />
                )}
              </button>
            </li>
          ))}
        </ul>

        <div className="hidden lg:block">
          <Button size="sm" onClick={() => go("kontak")}>Jadi Mitra</Button>
        </div>

        {/* Burger */}
        <button
          onClick={() => setOpen(true)}
          className="grid h-10 w-10 place-items-center rounded-lg border border-line lg:hidden"
          aria-label="Buka menu"
        >
          <Menu className="h-5 w-5" />
        </button>
      </nav>

      {/* Mobile menu */}
      <div
        className={cn(
          "fixed inset-0 z-50 flex flex-col bg-ink/97 px-[4%] pb-10 pt-24 backdrop-blur transition-opacity lg:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0"
        )}
      >
        <button
          onClick={() => setOpen(false)}
          className="absolute right-[4%] top-6 grid h-11 w-11 place-items-center rounded-lg border border-line"
          aria-label="Tutup menu"
        >
          <X className="h-6 w-6" />
        </button>
        <ul className="flex flex-col gap-1">
          {LINKS.map((l) => (
            <li key={l.id}>
              <button
                onClick={() => go(l.id)}
                className={cn(
                  "block w-full border-b border-line py-4 text-left font-heading text-2xl font-semibold uppercase tracking-wide",
                  active === l.id ? "text-amber" : "text-bone"
                )}
              >
                {l.label}
              </button>
            </li>
          ))}
        </ul>
        <div className="mt-8">
          <Button className="w-full" onClick={() => go("kontak")}>Jadi Mitra Kami</Button>
        </div>
      </div>
    </header>
  );
}
