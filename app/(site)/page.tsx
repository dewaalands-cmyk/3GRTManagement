import { SiteApp } from "@/components/SiteApp";
import { getContent } from "@/lib/content";
import { getServices, getEvents, getTestimonials, getPartners } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [content, services, events, testimonials, partners] = await Promise.all([
    getContent(), getServices(), getEvents(), getTestimonials(), getPartners(),
  ]);

  return (
    <SiteApp
      content={content}
      services={services}
      events={events}
      testimonials={testimonials}
      partners={partners}
    />
  );
}
