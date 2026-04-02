import type { Metadata } from "next";
import Index from "@/components/pages/Index";
import { SITE_URL } from "@/lib/seo-config";

export const metadata: Metadata = {
  title: {
    absolute:
      "Greenhills Electric | Hertfordshire Electricians & Hemel Hempstead Electricians | NICEIC",
  },
  description:
    "Award-winning Hertfordshire electricians — trusted Hemel Hempstead electricians, St Albans, Watford & London. NICEIC approved. Rewires, EV chargers, EICRs, commercial & domestic. Request a callback.",
  keywords: [
    "Hertfordshire electricians",
    "Hemel Hempstead electricians",
    "electricians in Hertfordshire",
    "electricians in Hemel Hempstead",
    "NICEIC electrician",
    "electrical contractors Hertfordshire",
  ],
  alternates: { canonical: SITE_URL },
  openGraph: {
    title: "Greenhills Electric | Hertfordshire & Hemel Hempstead Electricians",
    description:
      "NICEIC approved electricians across Hertfordshire and Hemel Hempstead. Domestic, commercial & emergency electrical services.",
    url: SITE_URL,
  },
};

export default function HomePage() {
  return <Index />;
}
