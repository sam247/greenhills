import { notFound } from "next/navigation";
import LocationPageTemplate from "@/components/seo/LocationPageTemplate";
import { locationPages } from "@/data/locationPages";
import { SITE_URL } from "@/lib/seo-config";
import type { Metadata } from "next";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return locationPages.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = locationPages.find((p) => p.slug === slug);
  if (!page) return { title: "Not found" };

  const title = page.title;
  return {
    title,
    description: page.metaDescription,
    keywords: page.keywords,
    alternates: { canonical: `${SITE_URL}/locations/${page.slug}` },
    openGraph: {
      title: `${title} | Greenhills Electric`,
      description: page.metaDescription,
      url: `${SITE_URL}/locations/${page.slug}`,
      siteName: "Greenhills Electric",
    },
  };
}

export default async function LocationPage({ params }: Props) {
  const { slug } = await params;
  const page = locationPages.find((p) => p.slug === slug);
  if (!page) notFound();
  return <LocationPageTemplate data={page} />;
}
