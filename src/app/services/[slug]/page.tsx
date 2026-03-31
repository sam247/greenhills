import { ServiceSlugRoute } from "@/components/pages/ServiceSlugRoute";
import { servicePages } from "@/data/servicePages";
import type { Metadata } from "next";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return servicePages.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = servicePages.find((p) => p.slug === slug);
  if (!page) return { title: "Not found" };
  return {
    title: page.title,
    description: page.subtitle,
  };
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  return <ServiceSlugRoute slug={slug} />;
}
