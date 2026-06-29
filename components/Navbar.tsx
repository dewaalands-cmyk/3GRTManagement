"use client";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Logo } from "./ui/Logo";
import { Button } from "./ui/Button";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "#beranda", id: "beranda", label: "Beranda" },
  { href: "#tentang", id: "tentang", label: "Tentang" },
  { href: "#layanan", id: "layanan", label: "Layanan" },
  { href: "#event", id: "event", label: "Event" },
  { href: "#galeri", id: "galeri", label: "Galeri" },
  { href: "#kontak", id: "kontak", label: "Kontak" },
];

const SECTION_IDS = LINKS.map((l) => l.id);

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("beranda");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scrollspy: deteksi section yang sedang terlihat
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: "-30% 0px -60% 0px" }
    );
    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  // Kunci scroll saat menu mobile terbuka
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  const isActive = (id: string) => activeSection === id;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled ? "border-b border-line bg-ink/85 backdrop-blur-lg" : "border-b border-transparent"
      )}
    >
      <nav className="mx-auto flex w-[92%] max-w-wrap items-center justify-between py-4">
        <Logo />

        {/* Desktop links */}
        <ul className="hidden items-center gap-8 lg:flex">
          {LINKS.map((l) => (
            <li key={l.id}>
              <a
                href={l.href}
                className={cn(
                  "relative font-heading text-sm font-medium uppercase tracking-wide transition-colors",
                  isActive(l.id) ? "text-amber" : "text-bone/80 hover:text-bone"
                )}
              >
                {l.label}
                {isActive(l.id) && (
                  <span className="absolute -bottom-1.5 left-0 h-0.5 w-full bg-amber" />
                )}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden lg:block">
          <Button href="#kontak" size="sm">Jadi Mitra</Button>
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
              <a
                href={l.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "block border-b border-line py-4 font-heading text-2xl font-semibold uppercase tracking-wide",
                  isActive(l.id) ? "text-amber" : "text-bone"
                )}
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="mt-8">
          <Button href="#kontak" className="w-full" onClick={() => setOpen(false)}>Jadi Mitra Kami</Button>
        </div>
      </div>
    </header>
  );
}
