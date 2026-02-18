import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
      {
        userAgent: [
          "Googlebot",
          "Bingbot",
          "GPTBot",
          "ChatGPT-User",
          "OAI-SearchBot",
          "Google-Extended",
          "ClaudeBot",
          "Claude-Web",
          "anthropic-ai",
          "PerplexityBot",
          "cohere-ai",
          "FacebookBot",
          "Meta-ExternalAgent",
          "Applebot",
          "Applebot-Extended",
          "Amazonbot",
          "CCBot",
        ],
        allow: "/",
      },
    ],
    sitemap: "https://0xrutts.com/sitemap.xml",
  };
}
