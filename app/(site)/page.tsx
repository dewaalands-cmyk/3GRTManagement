import { SiteApp } from "@/components/SiteApp";
import { getContent } from "@/lib/content";
import { getServices, getEvents, getTestimonials, getPartners, getMerchandises } from "@/lib/data";

export const revalidate = 60;

export default async function HomePage() {
  const [content, services, events, testimonials, partners, merchandises] = await Promise.all([
    getContent(), getServices(), getEvents(), getTestimonials(), getPartners(), getMerchandises(),
  ]);

  return (
    <SiteApp
      content={content}
      services={services}
      events={events}
      testimonials={testimonials}
      partners={partners}
      merchandises={merchandises}
    />
  );
}
