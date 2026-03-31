"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Building2, Home, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { SLUG_TO_CATEGORY } from "@/data/services";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.05, duration: 0.5 } }),
};

type ProjectCategory = "all" | "commercial" | "domestic";

interface JobUpload {
  id: string;
  title: string | null;
  description: string | null;
  location: string | null;
  service: string;
  service_slug: string | null;
  image_urls: string[];
  created_at: string;
}

const ITEMS_PER_PAGE = 12;

const Gallery = () => {
  const supabase = getSupabaseBrowserClient();
  const [filter, setFilter] = useState<ProjectCategory>("all");
  const [jobs, setJobs] = useState<JobUpload[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  useEffect(() => {
    const fetchJobs = async () => {
      const { data } = await supabase
        .from("job_uploads")
        .select("*")
        .order("created_at", { ascending: false });
      if (data) setJobs(data as JobUpload[]);
      setLoading(false);
    };
    fetchJobs();
  }, []);

  // Flatten jobs into individual image cards
  const allCards = jobs.flatMap(job =>
    job.image_urls.map((url, i) => ({
      id: `${job.id}-${i}`,
      imageUrl: url,
      title: job.title || job.service,
      location: job.location,
      service: job.service,
      category: (job.service_slug ? SLUG_TO_CATEGORY[job.service_slug] : undefined) || "commercial",
      desc: job.description || `${job.service} work${job.location ? ` in ${job.location}` : ""}`,
    }))
  );

  const filtered = filter === "all" ? allCards : allCards.filter(c => c.category === filter);
  const visible = filtered.slice(0, visibleCount);

  return (
    <Layout>
      <section className="bg-primary text-primary-foreground py-20 md:py-28">
        <div className="container">
          <motion.div initial="hidden" animate="visible" className="max-w-3xl">
            <motion.p variants={fadeUp} custom={0} className="text-sm font-heading font-600 uppercase tracking-wider text-accent mb-3">Our Work</motion.p>
            <motion.h1 variants={fadeUp} custom={1} className="text-4xl md:text-5xl font-heading font-800 mb-6">Project Gallery</motion.h1>
            <motion.p variants={fadeUp} custom={2} className="text-lg text-primary-foreground/80">
              Browse our recent commercial and domestic electrical projects across Hertfordshire.
            </motion.p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="container">
          <div className="flex items-center justify-center gap-3 mb-12">
            {[
              { value: "all" as const, label: "All Projects" },
              { value: "commercial" as const, label: "Commercial", icon: Building2 },
              { value: "domestic" as const, label: "Domestic", icon: Home },
            ].map((f) => (
              <Button
                key={f.value}
                variant={filter === f.value ? "default" : "outline"}
                onClick={() => { setFilter(f.value); setVisibleCount(ITEMS_PER_PAGE); }}
                className="font-heading font-600"
              >
                {f.icon && <f.icon className="h-4 w-4 mr-2" />}
                {f.label}
              </Button>
            ))}
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : visible.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              <p className="font-heading font-semibold text-lg">No projects yet</p>
              <p className="text-sm mt-1">Check back soon — we're always adding new work.</p>
            </div>
          ) : (
            <>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {visible.map((card, i) => (
                  <motion.div
                    key={card.id}
                    initial="hidden"
                    animate="visible"
                    variants={fadeUp}
                    custom={i}
                    layout
                  >
                    <div className="group relative rounded-xl overflow-hidden border-2 border-border hover:border-primary/20 transition-all duration-300 bg-card">
                      <div className="aspect-[4/3] overflow-hidden">
                        <img
                          src={card.imageUrl}
                          alt={card.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                      </div>
                      <div className="p-5">
                        <span className="inline-block text-xs font-heading font-600 uppercase tracking-wider text-primary mb-2">
                          {card.service}
                        </span>
                        <h3 className="font-heading font-700 text-sm mb-1">{card.title}</h3>
                        <p className="text-xs text-muted-foreground leading-relaxed">{card.desc}</p>
                        {card.location && (
                          <p className="text-xs text-muted-foreground mt-1">📍 {card.location}</p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {visibleCount < filtered.length && (
                <div className="flex justify-center mt-10">
                  <Button
                    variant="outline"
                    onClick={() => setVisibleCount(prev => prev + ITEMS_PER_PAGE)}
                    className="font-heading font-600"
                  >
                    Load More Projects
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Gallery;
