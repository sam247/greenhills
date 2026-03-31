"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Layout from "@/components/layout/Layout";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5 } }),
};

type FilterType = "all" | "commercial" | "domestic";

const reviews = [
  { name: "Sarah Mitchell", text: "Greenhills rewired our entire Victorian property. The team were professional, clean and incredibly thorough. They explained every step and the certification was provided immediately. Couldn't recommend them more highly.", rating: 5, type: "domestic" as const, service: "Full Rewire" },
  { name: "James Thompson", text: "Fantastic work on our new office electrical installation. The project was completed on schedule and the quality of workmanship was outstanding. Their attention to detail on the data cabling was particularly impressive.", rating: 5, type: "commercial" as const, service: "Office Fit-Out" },
  { name: "Linda Patel", text: "Had a Tesla charger installed at home. Quick, tidy and they handled all the paperwork for the OZEV grant. Really impressed with the whole process from start to finish.", rating: 5, type: "domestic" as const, service: "EV Charger" },
  { name: "David Chen", text: "We needed a full fire alarm system installed in our warehouse on a tight deadline. Greenhills delivered perfectly — on time, on budget and fully compliant. Will definitely use again.", rating: 5, type: "commercial" as const, service: "Fire Alarm" },
  { name: "Emma Watson", text: "Consumer unit upgrade and additional sockets throughout the house. Professional, punctual and left everything spotless. The price was fair and transparent — no hidden extras.", rating: 5, type: "domestic" as const, service: "Consumer Unit" },
  { name: "Mark Richards", text: "Emergency lighting installation across our hotel. Minimal disruption to guests and the results were excellent. The team were courteous and worked around our operational needs.", rating: 4, type: "commercial" as const, service: "Emergency Lighting" },
  { name: "Catherine Ellis", text: "Brilliant smart home installation. Lutron lighting throughout and integrated blinds. They took the time to understand exactly what we wanted and delivered beyond expectations.", rating: 5, type: "domestic" as const, service: "Smart Home" },
  { name: "Robert King", text: "Regular EICR testing for our rental portfolio. Always reliable, reports are clear and any remedial work is done quickly and fairly priced. A landlord's dream electrician.", rating: 5, type: "domestic" as const, service: "EICR" },
];

const Testimonials = () => {
  const [filter, setFilter] = useState<FilterType>("all");
  const filtered = filter === "all" ? reviews : reviews.filter((r) => r.type === filter);

  return (
    <Layout>
      <section className="bg-primary text-primary-foreground py-20 md:py-28">
        <div className="container">
          <motion.div initial="hidden" animate="visible" className="max-w-3xl">
            <motion.p variants={fadeUp} custom={0} className="text-sm font-heading font-600 uppercase tracking-wider text-accent mb-3">Testimonials</motion.p>
            <motion.h1 variants={fadeUp} custom={1} className="text-4xl md:text-5xl font-heading font-800 mb-6">What Our Customers Say</motion.h1>
            <motion.p variants={fadeUp} custom={2} className="text-lg text-primary-foreground/80">
              Don't just take our word for it — read what our customers have to say about our work.
            </motion.p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="container">
          <div className="flex items-center justify-center gap-3 mb-12">
            {(["all", "commercial", "domestic"] as const).map((f) => (
              <Button key={f} variant={filter === f ? "default" : "outline"} onClick={() => setFilter(f)} className="font-heading font-600 capitalize">
                {f === "all" ? "All Reviews" : f}
              </Button>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {filtered.map((r, i) => (
              <motion.div key={r.name} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}>
                <Card className="h-full">
                  <CardContent className="p-8">
                    <Quote className="h-8 w-8 text-primary/20 mb-4" />
                    <div className="flex gap-1 mb-4">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <Star key={j} className={`h-4 w-4 ${j < r.rating ? "fill-accent text-accent" : "text-border"}`} />
                      ))}
                    </div>
                    <p className="text-muted-foreground leading-relaxed mb-6 italic">"{r.text}"</p>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-heading font-700 text-sm">{r.name}</p>
                        <p className="text-xs text-muted-foreground">{r.service}</p>
                      </div>
                      <span className="text-xs font-heading font-600 uppercase tracking-wider text-primary/60">{r.type}</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Testimonials;
