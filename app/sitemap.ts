import { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/env";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = SITE_URL;

  return [
    {
      url: siteUrl,
      lastModified: "2026-10-18",
      changeFrequency: "yearly",
      priority: 1,
    },
    {
      url: `${siteUrl}/privacy`,
      lastModified: "2026-10-18",
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${siteUrl}/terms`,
      lastModified: "2026-10-18",
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];
}
