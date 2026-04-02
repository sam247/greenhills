"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Script from "next/script";
import { ArrowRight, CheckCircle2, ChevronRight, MapPin, Phone } from "lucide-react";
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

      <section className="bg-primary text-primary-foreground py-12 md:py-20">
        <div className="container">
          <nav className="flex items-center gap-1.5 text-xs text-primary-foreground/60 mb-6">
            <Link href="/" className="hover:text-primary-foreground/90 transition-colors">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-primary-foreground/90">{data.town}</span>
          </nav>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-5xl font-heading font-800 mb-4"
          >
            {data.h1}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-base md:text-lg text-primary-foreground/80 max-w-2xl"
          >
            {data.intro}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mt-6 flex flex-wrap gap-3"
          >
            <Button asChild size="lg" className="bg-primary-foreground text-foreground hover:bg-primary-foreground/90 font-heading font-700">
              <Link href="/contact">Get a free quote</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-2 border-primary-foreground/80 text-primary-foreground bg-transparent hover:bg-primary-foreground/10 font-heading font-600">
              <a href="tel:01442264125"><Phone className="mr-2 h-4 w-4" /> 01442 264125</a>
            </Button>
          </motion.div>
        </div>
      </section>

      <section className="py-10 md:py-16 bg-muted/30">
        <div className="container">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }}>
            <motion.h2 variants={fadeUp} custom={0} className="text-2xl md:text-3xl font-heading font-800 mb-6">
              Electrical services in {data.town}
            </motion.h2>
            <ul className="grid sm:grid-cols-2 gap-3">
              {data.services.map((line, i) => (
                <motion.li key={line} variants={fadeUp} custom={i + 1} className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm md:text-base text-muted-foreground">{line}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>

      <section className="py-10 md:py-16">
        <div className="container">
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
          <div className="space-y-4 text-muted-foreground leading-relaxed">
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
        </div>
      </section>

      <section className="py-10 md:py-14 bg-primary/5 border-y border-primary/10">
        <div className="container">
          <div className="rounded-xl border border-border bg-background p-6 md:p-8 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="h-5 w-5 text-primary" />
              <h3 className="font-heading font-700 text-lg md:text-xl">Also searching for Hertfordshire electricians?</h3>
            </div>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-6">
              We cover {data.town} and the wider county. Whether you need domestic or commercial work, our NICEIC approved team is here to help with clear pricing and paperwork.
            </p>
            <div className="flex flex-col sm:flex-row justify-start gap-3">
              <Button asChild size="lg" className="font-heading font-700">
                <Link href="/contact">Get a free quote <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="font-heading font-600">
                <a href="tel:01442264125"><Phone className="mr-2 h-4 w-4" /> 01442 264125</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-10 md:py-16 bg-muted/30">
        <div className="container">
          <h2 className="text-xl md:text-2xl font-heading font-800 mb-6">Useful links</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
            {data.relatedLinks.map((l) => (
              <Link
                key={l.path}
                href={l.path}
                className="flex items-center gap-2 p-4 rounded-lg border border-border bg-background hover:border-primary/30 hover:shadow-sm transition-all group"
              >
                <span className="text-sm font-heading font-600 group-hover:text-primary transition-colors">{l.label}</span>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary ml-auto transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </Layout>
  );
};

export default LocationPageTemplate;
