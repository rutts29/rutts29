import type { MetadataRoute } from "next";

import { portfolioContent } from "@/config/portfolioContent";

export default function sitemap(): MetadataRoute.Sitemap {
  const { siteUrl } = portfolioContent;

  return [
    {
      url: siteUrl,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${siteUrl}/interactive`,
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];
}
