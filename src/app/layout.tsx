import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "./providers";

const siteUrl = "https://greenhillselectric.co.uk";

export const metadata: Metadata = {
  title: {
    default: "Greenhills Electric | Professional Electrical Contractors London",
    template: "%s | Greenhills Electric",
  },
  description:
    "NICEIC approved electrical contractors with 60+ years experience. Commercial and domestic electrical services across London. Get a free quote today.",
  robots: { index: true, follow: true },
  alternates: { canonical: siteUrl },
  openGraph: {
    type: "website",
    url: siteUrl,
    title: "Greenhills Electric | Professional Electrical Contractors London",
    description:
      "NICEIC approved electrical contractors with 60+ years experience. Commercial and domestic electrical services across London. Get a free quote today.",
    images: [
      {
        url: `${siteUrl}/logo.png`,
        width: 512,
        height: 128,
        alt: "Greenhills Electric",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Greenhills Electric | Professional Electrical Contractors London",
    description:
      "NICEIC approved electrical contractors with 60+ years experience. Commercial and domestic electrical services across London. Get a free quote today.",
    images: [`${siteUrl}/logo.png`],
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
