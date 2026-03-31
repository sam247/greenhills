"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, ChevronRight, Phone } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import CTASection from "@/components/home/CTASection";
import type { ServicePageData } from "@/data/servicePages";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.45, ease: [0, 0, 0.2, 1] as const },
  }),
};

const defaultTrustPoints = [
  "NICEIC approved contractor",
  "Part P registered",
  "Over 60 years of combined experience",
  "All work certified and guaranteed",
];

const RecentWorkSection = ({ slug, serviceName }: { slug: string; serviceName: string }) => {
  const supabase = getSupabaseBrowserClient();
  const [images, setImages] = useState<{ url: string; title: string | null; location: string | null }[]>([]);

  useEffect(() => {
    if (!supabase) return;
    supabase
      .from("job_uploads")
      .select("title, location, image_urls")
      .eq("service_slug", slug)
      .order("created_at", { ascending: false })
      .limit(6)
      .then(({ data }) => {
        if (data) {
          const imgs = (data as { title: string | null; location: string | null; image_urls: string[] }[])
            .flatMap(j => j.image_urls.map(url => ({ url, title: j.title, location: j.location })))
            .slice(0, 6);
          setImages(imgs);
        }
      });
  }, [slug, supabase]);

  if (images.length === 0) return null;

  return (
    <section className="py-10 md:py-16 bg-muted/30">
      <div className="container">
        <h2 className="text-2xl md:text-3xl font-heading font-800 mb-6">Recent {serviceName} Work</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((img, i) => (
            <div key={i} className="rounded-lg overflow-hidden border border-border">
              <img src={img.url} alt={img.title || `${serviceName} project`} className="w-full aspect-[4/3] object-cover" loading="lazy" />
              {(img.title || img.location) && (
                <div className="p-3 bg-card">
                  <p className="text-xs text-muted-foreground">{img.title}{img.location ? ` · ${img.location}` : ""}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const ServicePageTemplate = ({ data }: { data: ServicePageData }) => {
  const trustPoints = data.trustPoints ?? defaultTrustPoints;
  const serviceName = data.title.replace(/ in Hertfordshire$/i, "");

  return (
    <Layout>
      {/* Hero */}
      <section className="bg-primary text-primary-foreground py-12 md:py-20">
        <div className="container">
          <nav className="flex items-center gap-1.5 text-xs text-primary-foreground/60 mb-6">
            <Link href="/" className="hover:text-primary-foreground/90 transition-colors">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="capitalize">{data.category === "industry" ? "Industries" : "Services"}</span>
            <ChevronRight className="h-3 w-3" />
            <span className="text-primary-foreground/90">{serviceName}</span>
          </nav>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-5xl font-heading font-800 mb-4"
          >
            {data.title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-base md:text-lg text-primary-foreground/80 max-w-2xl"
          >
            {data.subtitle}
          </motion.p>
        </div>
      </section>

      {/* Intro */}
      <section className="py-10 md:py-16">
        <div className="container">
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed">{data.intro}</p>
        </div>
      </section>

      {/* What We Do */}
      <section className="py-10 md:py-16 bg-muted/30">
        <div className="container">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }}>
            <motion.h2 variants={fadeUp} custom={0} className="text-2xl md:text-3xl font-heading font-800 mb-6">
              What's Included
            </motion.h2>
            <ul className="grid sm:grid-cols-2 gap-3">
              {data.includes.map((item, i) => (
                <motion.li key={i} variants={fadeUp} custom={i + 1} className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm md:text-base">{item}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>

      {/* Mid-page CTA */}
      <section className="py-10 md:py-14 bg-primary/5 border-y border-primary/10">
        <div className="container text-center">
          <p className="text-lg md:text-xl font-heading font-700 mb-2">
            Need help with {serviceName.toLowerCase()}?
          </p>
          <p className="text-muted-foreground mb-6">We cover all of Hertfordshire.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <Button asChild size="lg" className="font-heading font-700">
              <Link href="/contact">{data.ctaText || "Get a Quick Quote (24hr Reply)"} <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="font-heading font-600">
              <a href="tel:01442264125"><Phone className="mr-2 h-4 w-4" /> 01442 264125</a>
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-3">Prefer to speak? Call us</p>
        </div>
      </section>

      {/* Who It's For */}
      <section className="py-10 md:py-16">
        <div className="container">
          <h2 className="text-2xl md:text-3xl font-heading font-800 mb-4">Who It's For</h2>
          <p className="text-muted-foreground leading-relaxed">{data.audience}</p>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-10 md:py-16 bg-muted/30">
        <div className="container">
          <h2 className="text-2xl md:text-3xl font-heading font-800 mb-3">Why Choose Greenhills Electric</h2>
          <p className="text-muted-foreground mb-6">
            We've worked with homes and businesses across Hertfordshire, delivering reliable electrical work you can trust.
          </p>
          <ul className="grid sm:grid-cols-2 gap-3">
            {trustPoints.map((point, i) => (
              <li key={i} className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span className="text-sm md:text-base">{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Recent Work Section */}
      <RecentWorkSection slug={data.slug} serviceName={serviceName} />

      {/* Local Relevance */}
      <section className="py-10 md:py-16">
        <div className="container">
          <h2 className="text-2xl md:text-3xl font-heading font-800 mb-4">Local to Hertfordshire</h2>
          <p className="text-muted-foreground leading-relaxed">{data.localParagraph}</p>
        </div>
      </section>

      {/* Related Services */}
      {data.relatedLinks.length > 0 && (
        <section className="py-10 md:py-16 bg-muted/30">
          <div className="container">
            <h2 className="text-xl md:text-2xl font-heading font-800 mb-6">Related Services</h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
              {data.relatedLinks.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  className="flex items-center gap-2 p-4 rounded-lg border border-border bg-background hover:border-primary/30 hover:shadow-sm transition-all group"
                >
                  <span className="text-sm font-heading font-600 group-hover:text-primary transition-colors">{link.label}</span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary ml-auto transition-colors" />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      {data.faq && data.faq.length > 0 && (
        <section className="py-10 md:py-16">
          <div className="container">
            <h2 className="text-2xl md:text-3xl font-heading font-800 mb-6">Frequently Asked Questions</h2>
            <Accordion type="single" collapsible className="w-full">
              {data.faq.map((item, i) => (
                <AccordionItem key={i} value={`faq-${i}`}>
                  <AccordionTrigger className="text-left text-sm md:text-base font-heading font-600">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
      )}

      {/* Bottom CTA */}
      <CTASection />
    </Layout>
  );
};

export default ServicePageTemplate;
