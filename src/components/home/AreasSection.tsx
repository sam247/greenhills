"use client";

import { motion } from "framer-motion";
import { MapPin } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.5, ease: [0, 0, 0.2, 1] as const },
  }),
};

const towns = [
  "Watford",
  "St Albans",
  "Hemel Hempstead",
  "Stevenage",
  "Hitchin",
  "Berkhamsted",
  "Harpenden",
  "Welwyn Garden City",
  "Hatfield",
  "Rickmansworth",
  "Bushey",
  "Borehamwood",
];

const AreasSection = () => (
  <section className="py-12 md:py-20 bg-muted/30">
    <div className="container">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="text-center mb-8 md:mb-12"
      >
        <motion.p variants={fadeUp} custom={0} className="text-xs md:text-sm font-heading font-600 uppercase tracking-wider text-primary mb-2">
          Hertfordshire & Surrounding Areas
        </motion.p>
        <motion.h2 variants={fadeUp} custom={1} className="text-2xl md:text-4xl font-heading font-800 mb-3">
          Areas We Cover
        </motion.h2>
        <motion.p variants={fadeUp} custom={2} className="text-sm md:text-base text-muted-foreground max-w-xl mx-auto">
          Serving homes and businesses across Hertfordshire with reliable, professional electrical services.
        </motion.p>
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4 max-w-3xl mx-auto"
      >
        {towns.map((town, i) => (
          <motion.div
            key={town}
            variants={fadeUp}
            custom={i + 3}
            className="flex items-center gap-2 px-4 py-3 rounded-lg bg-background border border-border"
          >
            <MapPin className="h-4 w-4 text-primary shrink-0" />
            <span className="text-sm font-heading font-600">{town}</span>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
);

export default AreasSection;
