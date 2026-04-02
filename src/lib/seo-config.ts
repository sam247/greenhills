/** Canonical production URL; used for sitemaps, metadata, and JSON-LD. */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://greenhillselectric.co.uk";
