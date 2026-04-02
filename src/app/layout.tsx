import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { SITE_URL } from "@/lib/seo-config";

export const metadata: Metadata = {
  title: {
    default: "Greenhills Electric | Hertfordshire Electricians | London & South East",
    template: "%s | Greenhills Electric",
  },
  description:
    "NICEIC approved Hertfordshire electricians and London electrical contractors — Hemel Hempstead, St Albans, Watford & beyond. Domestic & commercial rewires, EV chargers, EICRs. Free quotes.",
  robots: { index: true, follow: true },
  alternates: { canonical: SITE_URL },
  openGraph: {
    type: "website",
    url: SITE_URL,
    title: "Greenhills Electric | Hertfordshire Electricians",
    description:
      "NICEIC approved Hertfordshire electricians and London electrical contractors. Hemel Hempstead, Watford, St Albans & wider region. Domestic & commercial. Free quotes.",
    images: [
      {
        url: `${SITE_URL}/logo.png`,
        width: 512,
        height: 128,
        alt: "Greenhills Electric",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Greenhills Electric | Hertfordshire Electricians",
    description:
      "NICEIC approved Hertfordshire electricians. Hemel Hempstead, Watford, St Albans & London. Domestic & commercial electrical services.",
    images: [`${SITE_URL}/logo.png`],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
