import type { MetadataRoute } from "next";
import { business } from "@/lib/business";

// Sitemap del sitio público. Ayuda a Google a descubrir e indexar las páginas.
export default function sitemap(): MetadataRoute.Sitemap {
  const base = business.siteUrl;
  return [
    {
      url: `${base}/`,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${base}/catalogo`,
      changeFrequency: "daily",
      priority: 0.8,
    },
  ];
}
