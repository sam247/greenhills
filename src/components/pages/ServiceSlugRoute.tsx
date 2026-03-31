import { notFound } from "next/navigation";
import { servicePages } from "@/data/servicePages";
import ServicePageTemplate from "@/components/seo/ServicePageTemplate";

export function ServiceSlugRoute({ slug }: { slug: string }) {
  const page = servicePages.find((p) => p.slug === slug);
  if (!page) notFound();
  return <ServicePageTemplate data={page} />;
}
