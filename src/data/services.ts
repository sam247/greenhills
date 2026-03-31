export const SERVICES = [
  { name: "Domestic Electrician", slug: "domestic-electrician", category: "domestic" },
  { name: "EV Charger Installation", slug: "ev-charger-installation", category: "domestic" },
  { name: "Smart Home Wiring", slug: "smart-home-wiring", category: "domestic" },
  { name: "Commercial Electrical Installation", slug: "commercial-electrical-installation", category: "commercial" },
  { name: "EICR Testing", slug: "eicr-testing", category: "commercial" },
] as const;

export type ServiceSlug = (typeof SERVICES)[number]["slug"];
export type ServiceCategory = (typeof SERVICES)[number]["category"];

export const SERVICE_BY_SLUG: Record<string, (typeof SERVICES)[number]> = Object.fromEntries(
  SERVICES.map((s) => [s.slug, s])
);

export const SLUG_TO_CATEGORY: Record<string, ServiceCategory> = Object.fromEntries(
  SERVICES.map((s) => [s.slug, s.category])
);

export const SERVICE_NAME_TO_SLUG: Record<string, ServiceSlug> = Object.fromEntries(
  SERVICES.map((s) => [s.name, s.slug])
);
