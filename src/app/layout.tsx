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
        url: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/18334d74-a5f5-41cd-8dc7-a45dac996272/id-preview-508ca78b--870fd8ba-2626-47fc-83e5-7ec5e0d538b7.lovable.app-1773413640257.png",
        width: 1200,
        height: 630,
        alt: "Greenhills Electric",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Greenhills Electric | Professional Electrical Contractors London",
    description:
      "NICEIC approved electrical contractors with 60+ years experience. Commercial and domestic electrical services across London. Get a free quote today.",
    images: [
      "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/18334d74-a5f5-41cd-8dc7-a45dac996272/id-preview-508ca78b--870fd8ba-2626-47fc-83e5-7ec5e0d538b7.lovable.app-1773413640257.png",
    ],
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
