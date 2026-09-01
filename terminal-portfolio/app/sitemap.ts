import type { MetadataRoute } from "next";

import { portfolioContent } from "@/config/portfolioContent";

export default function sitemap(): MetadataRoute.Sitemap {
  const { siteUrl, resume } = portfolioContent;

  return [
    {
      url: siteUrl,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${siteUrl}${resume.pagePath}`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];
}
