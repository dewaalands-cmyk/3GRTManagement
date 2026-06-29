import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";

export function CTA({
  title = "Siap Tampil di Panggung Terbesar?",
  subtitle = "Anda punya atlet, brand, dan visi. Kami punya panggung dan pengalamannya. Mari diskusikan langkah berikutnya bersama tim kami.",
  buttonLabel = "Hubungi Kami Sekarang",
}: {
  title?: string;
  subtitle?: string;
  buttonLabel?: string;
}) {
  return (
    <section className="relative overflow-hidden py-24">
      <div aria-hidden className="absolute inset-0 -z-10 bg-ink-2">
        <div className="absolute -left-20 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-crimson/20 blur-[100px]" />
        <div className="absolute -right-20 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-amber/15 blur-[100px]" />
      </div>
      <Reveal className="mx-auto w-[92%] max-w-3xl text-center">
        <h2 className="text-3xl font-extrabold leading-tight sm:text-4xl md:text-5xl">{title}</h2>
        <p className="mx-auto mt-5 max-w-xl text-lg text-bone/80">{subtitle}</p>
        <div className="mt-8 flex justify-center">
          <Button href="#kontak" size="lg">
            {buttonLabel} <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
      </Reveal>
    </section>
  );
}
