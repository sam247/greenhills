"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Building2, Flame, Lightbulb, Cable, ClipboardCheck, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Layout from "@/components/layout/Layout";
import CTASection from "@/components/home/CTASection";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

const services = [
  { icon: Building2, title: "Electrical Installation", desc: "Complete electrical installations for new builds, offices, retail spaces and industrial premises. Design, install and commission to BS 7671 standards." },
  { icon: Flame, title: "Fire Alarm Systems", desc: "Design, installation, testing and maintenance of fire alarm systems compliant with BS 5839. Addressable and conventional systems available." },
  { icon: Lightbulb, title: "Emergency Lighting", desc: "Installation and testing of emergency lighting systems to BS 5266. Ensuring your building meets all safety requirements." },
  { icon: Cable, title: "Data Cabling", desc: "Structured cabling solutions including Cat5e, Cat6 and fibre optic installations for offices and commercial premises." },
  { icon: ClipboardCheck, title: "Periodic Testing (EICR)", desc: "Electrical Installation Condition Reports for landlords, businesses and commercial properties. Identify faults and ensure compliance." },
];

const Commercial = () => (
  <Layout>
    <section className="bg-primary text-primary-foreground py-20 md:py-28">
      <div className="container">
        <motion.div initial="hidden" animate="visible" className="max-w-3xl">
          <motion.p variants={fadeUp} custom={0} className="text-sm font-heading font-600 uppercase tracking-wider text-accent mb-3">Commercial Services</motion.p>
          <motion.h1 variants={fadeUp} custom={1} className="text-4xl md:text-5xl font-heading font-800 mb-6">
            Electrical Solutions for Your Business
          </motion.h1>
          <motion.p variants={fadeUp} custom={2} className="text-lg text-primary-foreground/80 leading-relaxed">
            From complete fit-outs to periodic testing, we provide comprehensive commercial electrical services 
            that keep your business running safely and efficiently.
          </motion.p>
        </motion.div>
      </div>
    </section>

    <section className="py-20 md:py-28">
      <div className="container">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((s, i) => (
            <motion.div key={s.title} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeUp} custom={i}>
              <Card className="h-full border-2 border-border hover:border-primary/20 transition-all duration-300">
                <CardContent className="p-8">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <s.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-heading font-700 text-lg mb-2">{s.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">{s.desc}</p>
                  <Link href="/contact" className="inline-flex items-center gap-2 text-sm font-heading font-600 text-primary hover:text-primary/80 transition-colors">
                    Request a Quote <ArrowRight className="h-4 w-4" />
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    <CTASection />
  </Layout>
);

export default Commercial;
