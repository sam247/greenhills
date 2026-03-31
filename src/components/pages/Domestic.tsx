"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Home, ZapOff, Plug, CarFront, Cpu, FileCheck, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Layout from "@/components/layout/Layout";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

const services = [
  { icon: ZapOff, title: "Full & Partial Rewires", desc: "Complete house rewires and partial rewires for older properties. Bringing your home's electrics up to current standards safely." },
  { icon: Home, title: "Consumer Unit Upgrades", desc: "Replace outdated fuse boxes with modern consumer units featuring RCD protection. Essential for home safety." },
  { icon: Plug, title: "Extensions & Additions", desc: "Electrical installations for home extensions, loft conversions, kitchens and bathrooms. Full design and installation service." },
  { icon: CarFront, title: "EV Charger Installation", desc: "Home electric vehicle charging point installation. OZEV grant approved installers. All major charger brands supported." },
  { icon: Cpu, title: "Smart Home Wiring", desc: "Future-proof your home with smart lighting, automated systems and structured wiring for modern living." },
  { icon: FileCheck, title: "Landlord Certificates (EICR)", desc: "Electrical Installation Condition Reports for rental properties. Legal requirement for all landlords. Fast turnaround." },
];

const Domestic = () => (
  <Layout>
    <section className="bg-primary text-primary-foreground py-20 md:py-28">
      <div className="container">
        <motion.div initial="hidden" animate="visible" className="max-w-3xl">
          <motion.p variants={fadeUp} custom={0} className="text-sm font-heading font-600 uppercase tracking-wider text-accent mb-3">Domestic Services</motion.p>
          <motion.h1 variants={fadeUp} custom={1} className="text-4xl md:text-5xl font-heading font-800 mb-6">
            Expert Electricians for Your Home
          </motion.h1>
          <motion.p variants={fadeUp} custom={2} className="text-lg text-primary-foreground/80 leading-relaxed">
            Safe, certified electrical work for your home. From simple repairs to full rewires, 
            we're the domestic electricians you can rely on.
          </motion.p>
        </motion.div>
      </div>
    </section>

    <section className="py-20 md:py-28">
      <div className="container">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
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
                    Get a Quote <ArrowRight className="h-4 w-4" />
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    <section className="py-20 bg-secondary text-center">
      <div className="container">
        <h2 className="text-3xl font-heading font-800 mb-4">Need a Home Electrician?</h2>
        <p className="text-muted-foreground mb-8 max-w-xl mx-auto">Contact us for friendly, professional advice and a free quote.</p>
        <Button asChild size="lg" className="font-heading font-700">
          <Link href="/contact">Get a Free Quote <ArrowRight className="ml-2 h-5 w-5" /></Link>
        </Button>
      </div>
    </section>
  </Layout>
);

export default Domestic;
