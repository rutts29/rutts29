import type { MetadataRoute } from "next";

import { portfolioContent } from "@/config/portfolioContent";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${portfolioContent.siteUrl}/sitemap.xml`,
  };
}
