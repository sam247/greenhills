import type { MetadataRoute } from "next";
import { locationPages } from "@/data/locationPages";
import { servicePages } from "@/data/servicePages";
import { SITE_URL } from "@/lib/seo-config";

const STATIC_PATHS: { path: string; changeFrequency: MetadataRoute.Sitemap[0]["changeFrequency"]; priority: number }[] = [
  { path: "", changeFrequency: "weekly", priority: 1 },
  { path: "/about", changeFrequency: "monthly", priority: 0.8 },
  { path: "/commercial", changeFrequency: "monthly", priority: 0.85 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.9 },
  { path: "/domestic", changeFrequency: "monthly", priority: 0.85 },
  { path: "/gallery", changeFrequency: "weekly", priority: 0.7 },
  { path: "/testimonials", changeFrequency: "monthly", priority: 0.7 },
  { path: "/privacy", changeFrequency: "yearly", priority: 0.3 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_PATHS.map(({ path, changeFrequency, priority }) => ({
    url: `${SITE_URL}${path || "/"}`,
    lastModified,
    changeFrequency,
    priority,
  }));

  const serviceEntries: MetadataRoute.Sitemap = servicePages.map((p) => ({
    url: `${SITE_URL}/services/${p.slug}`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.75,
  }));

  const industryEntries: MetadataRoute.Sitemap = servicePages.map((p) => ({
    url: `${SITE_URL}/industries/${p.slug}`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.72,
  }));

  const locationEntries: MetadataRoute.Sitemap = locationPages.map((p) => ({
    url: `${SITE_URL}/locations/${p.slug}`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.82,
  }));

  return [...staticEntries, ...serviceEntries, ...industryEntries, ...locationEntries];
}
