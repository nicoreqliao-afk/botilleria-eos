import type { MetadataRoute } from "next";
import { business } from "@/lib/business";

// robots.txt: permite indexar el sitio público, bloquea el panel admin
// y apunta al sitemap.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api"],
    },
    sitemap: `${business.siteUrl}/sitemap.xml`,
    host: business.siteUrl,
  };
}
