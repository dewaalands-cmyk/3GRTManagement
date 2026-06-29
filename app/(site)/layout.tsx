const SITE_URL = "https://www.3grtmanagement.com";

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SportsOrganization",
      "@id": `${SITE_URL}/#organization`,
      name: "3GRT Management",
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/icon-512.png`,
        width: 512,
        height: 512,
      },
      description:
        "Penyelenggara event combat sport profesional — Muay Thai, MMA, tinju & kickboxing. Berstandar internasional, berjiwa juara.",
      sport: ["Muay Thai", "MMA", "Boxing", "Kickboxing"],
      areaServed: {
        "@type": "Country",
        name: "Indonesia",
      },
      address: {
        "@type": "PostalAddress",
        addressLocality: "Garut",
        addressRegion: "Jawa Barat",
        addressCountry: "ID",
      },
      contactPoint: [
        {
          "@type": "ContactPoint",
          telephone: "+62-813-1366-1740",
          contactType: "customer service",
          availableLanguage: "Indonesian",
        },
      ],
      sameAs: [
        "https://www.instagram.com/3grtmanagement",
        "https://www.youtube.com/@3GRT",
        "https://www.tiktok.com/@3grtmanagement",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "3GRT Management",
      publisher: { "@id": `${SITE_URL}/#organization` },
      inLanguage: "id-ID",
      potentialAction: {
        "@type": "SearchAction",
        target: { "@type": "EntryPoint", urlTemplate: `${SITE_URL}/?q={search_term_string}` },
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "LocalBusiness",
      "@id": `${SITE_URL}/#localbusiness`,
      name: "3GRT Management",
      image: `${SITE_URL}/og-image.jpg`,
      url: SITE_URL,
      telephone: "+62-813-1366-1740",
      email: "info@3grtmanagement.com",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Garut",
        addressRegion: "Jawa Barat",
        postalCode: "44100",
        addressCountry: "ID",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: -7.2167,
        longitude: 107.9,
      },
      openingHoursSpecification: {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        opens: "08:00",
        closes: "17:00",
      },
      priceRange: "$$",
    },
  ],
};

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
