import { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/env";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = SITE_URL;

  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 1,
    },
    {
      url: `${siteUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${siteUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];
}
