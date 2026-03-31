"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0, 0, 0.2, 1] as const },
  }),
};

const CTASection = () => (
  <section className="py-12 md:py-28 bg-primary text-primary-foreground">
    <div className="container text-center">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
      >
        <motion.h2 variants={fadeUp} custom={0} className="text-2xl md:text-4xl font-heading font-800 mb-3 md:mb-4">
          Need an Electrician? Let's Talk.
        </motion.h2>
        <motion.p variants={fadeUp} custom={1} className="text-sm md:text-base text-primary-foreground/70 max-w-xl mx-auto mb-6 md:mb-8">
          Get in touch today for a free, no-obligation quote. Whether it's your home or business,
          we're here to help with all your electrical needs.
        </motion.p>
        <motion.div variants={fadeUp} custom={2} className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
          <Button asChild size="lg" className="bg-primary-foreground text-foreground hover:bg-primary-foreground/90 font-heading font-700 text-base w-full sm:w-auto">
            <Link href="/contact">Get a Quick Quote (24hr Reply) <ArrowRight className="ml-2 h-5 w-5" /></Link>
          </Button>
          <Button asChild size="lg" className="bg-transparent border-2 border-white text-white hover:bg-white/10 font-heading font-600 text-base w-full sm:w-auto">
            <a href="tel:01442264125"><Phone className="mr-2 h-5 w-5" /> 01442 264125</a>
          </Button>
        </motion.div>
      </motion.div>
    </div>
  </section>
);

export default CTASection;
