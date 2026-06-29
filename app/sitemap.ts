import type { MetadataRoute } from "next";

const SITE_URL = "https://www.3grtmanagement.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/#layanan`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/#event`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/#kontak`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
  ];
}
