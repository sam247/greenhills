export interface LocationPageData {
  slug: string;
  /** Town / area display name */
  town: string;
  /** Page <title> segment (template adds "| Greenhills Electric") */
  title: string;
  /** Meta description — include electrician + location variants naturally */
  metaDescription: string;
  /** Optional extra keywords for metadata */
  keywords: string[];
  h1: string;
  intro: string;
  services: string[];
  localSectionTitle: string;
  localBody: string[];
  /** Internal links shown at bottom */
  relatedLinks: { label: string; path: string }[];
}

export const locationPages: LocationPageData[] = [
  {
    slug: "hemel-hempstead",
    town: "Hemel Hempstead",
    title: "Electricians in Hemel Hempstead | Hertfordshire",
    metaDescription:
      "NICEIC approved Hemel Hempstead electricians for rewires, EV chargers, EICRs, consumer units and emergencies. Hertfordshire electricians serving HP1–HP3. Free quotes from Greenhills Electric.",
    keywords: [
      "Hemel Hempstead electricians",
      "electricians in Hemel Hempstead",
      "Hertfordshire electricians",
      "NICEIC electrician Hemel Hempstead",
      "domestic electrician Hemel Hempstead",
      "commercial electrician Hertfordshire",
    ],
    h1: "Electricians in Hemel Hempstead",
    intro:
      "Looking for reliable Hemel Hempstead electricians? Greenhills Electric is a NICEIC approved contractor working across Hemel Hempstead and wider Hertfordshire. From full rewires and fuse board upgrades to EV chargers and landlord certificates, our Hertfordshire electricians deliver safe, certified work with clear communication and tidy sites.",
    services: [
      "Full and partial house rewires",
      "Consumer unit (fuse board) upgrades",
      "EV charger installation",
      "EICR testing and landlord certificates",
      "Fault finding and emergency electrical repairs",
      "Commercial and office electrical work",
      "Smart lighting and additional circuits",
    ],
    localSectionTitle: "Hertfordshire electricians you can trust in Hemel",
    localBody: [
      "Whether you are in Adeyfield, Boxmoor, Bennetts End or near the town centre, our team is used to working on homes and businesses across Hemel Hempstead. We plan jobs around your schedule and keep disruption to a minimum.",
      "As experienced Hertfordshire electricians, we understand local property types — from post-war estates to newer developments — and we specify solutions that meet current regulations, including Part P where required.",
      "If you are comparing Hemel Hempstead electricians, ask for NICEIC registration, insurance and written quotes. We are happy to explain options in plain English so you can choose what fits your budget.",
    ],
    relatedLinks: [
      { label: "Domestic electrical services", path: "/domestic" },
      { label: "Commercial electrical services", path: "/commercial" },
      { label: "EV charger installation", path: "/services/ev-charger-installation" },
      { label: "Contact us", path: "/contact" },
    ],
  },
];
