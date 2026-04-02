"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Script from "next/script";
import { CheckCircle2, MapPin } from "lucide-react";
import Layout from "@/components/layout/Layout";
import CTASection from "@/components/home/CTASection";
import { Button } from "@/components/ui/button";
import type { LocationPageData } from "@/data/locationPages";
import { SITE_URL } from "@/lib/seo-config";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.45, ease: [0, 0, 0.2, 1] as const },
  }),
};

interface Props {
  data: LocationPageData;
}

const LocationPageTemplate = ({ data }: Props) => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Electrician",
    name: "Greenhills Electric",
    url: SITE_URL,
    areaServed: {
      "@type": "Place",
      name: data.town,
      containedInPlace: { "@type": "AdministrativeArea", name: "Hertfordshire" },
    },
    description: data.metaDescription,
  };

  return (
    <Layout>
      <Script id={`ld-location-${data.slug}`} type="application/ld+json">
        {JSON.stringify(jsonLd)}
      </Script>

      <section className="bg-primary text-primary-foreground py-14 md:py-20">
        <div className="container">
          <motion.div
            initial="hidden"
            animate="visible"
            className="max-w-3xl"
          >
            <motion.p variants={fadeUp} custom={0} className="text-sm font-heading font-600 uppercase tracking-wider text-accent mb-3">
              <Link href="/" className="hover:underline">Home</Link>
              <span className="mx-2 opacity-60">/</span>
              <span className="text-primary-foreground/90">{data.town}</span>
            </motion.p>
            <motion.h1 variants={fadeUp} custom={1} className="text-3xl md:text-5xl font-heading font-800 mb-5 leading-tight">
              {data.h1}
            </motion.h1>
            <motion.p variants={fadeUp} custom={2} className="text-base md:text-lg text-primary-foreground/85 leading-relaxed">
              {data.intro}
            </motion.p>
            <motion.div variants={fadeUp} custom={3} className="mt-6 flex flex-wrap gap-3">
              <Button asChild size="lg" className="bg-primary-foreground text-foreground hover:bg-primary-foreground/90 font-heading font-700">
                <Link href="/contact">Get a free quote</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-2 border-primary-foreground/80 text-primary-foreground bg-transparent hover:bg-primary-foreground/10 font-heading font-600">
                <Link href="tel:01442264125">01442 264125</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="py-14 md:py-20">
        <div className="container max-w-3xl">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
            className="text-2xl md:text-3xl font-heading font-800 mb-6"
          >
            Electrical services in {data.town}
          </motion.h2>
          <ul className="space-y-3 mb-10">
            {data.services.map((line, i) => (
              <motion.li
                key={line}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
                className="flex gap-3 text-muted-foreground"
              >
                <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span>{line}</span>
              </motion.li>
            ))}
          </ul>

          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
            className="text-2xl md:text-3xl font-heading font-800 mb-4"
          >
            {data.localSectionTitle}
          </motion.h2>
          <div className="space-y-4 text-muted-foreground leading-relaxed mb-10">
            {data.localBody.map((p, i) => (
              <motion.p
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
              >
                {p}
              </motion.p>
            ))}
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
            className="rounded-xl border border-border bg-muted/30 p-6 md:p-8"
          >
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="h-5 w-5 text-primary" />
              <h3 className="font-heading font-700 text-lg">Also searching for Hertfordshire electricians?</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              We cover Hemel Hempstead and the wider county. Whether you need domestic or commercial work, our NICEIC approved team is here to help with clear pricing and paperwork.
            </p>
            <Link href="/contact" className="text-primary font-heading font-600 text-sm hover:underline">
              Contact Greenhills Electric →
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="py-10 md:py-14 border-t border-border bg-muted/20">
        <div className="container max-w-3xl">
          <h3 className="font-heading font-700 text-lg mb-4">Useful links</h3>
          <ul className="flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-x-6 sm:gap-y-2">
            {data.relatedLinks.map((l) => (
              <li key={l.path}>
                <Link href={l.path} className="text-primary font-medium hover:underline">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CTASection />
    </Layout>
  );
};

export default LocationPageTemplate;
