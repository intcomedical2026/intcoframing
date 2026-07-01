import type { MetadataRoute } from "next";
import { absoluteUrl, siteOrigin } from "@/lib/site-url";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/studio", "/studio/"],
      },
      {
        userAgent: ["GPTBot", "ChatGPT-User", "ClaudeBot", "PerplexityBot", "Google-Extended"],
        allow: "/",
        disallow: ["/studio", "/studio/"],
      },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: siteOrigin,
  };
}
