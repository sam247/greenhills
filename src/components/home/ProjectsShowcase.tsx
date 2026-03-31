"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Plug, Lightbulb, BatteryCharging, ShieldAlert, Building2, Home } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0, 0, 0.2, 1] as const },
  }),
};

const projects = [
  {
    icon: Plug,
    title: "Full House Rewire",
    location: "Watford, Hertfordshire",
    type: "Domestic",
    desc: "Complete rewire of a 3-bed semi including new consumer unit, smoke alarms and all certification.",
  },
  {
    icon: Building2,
    title: "Office Fit-Out Electrics",
    location: "St Albans, Hertfordshire",
    type: "Commercial",
    desc: "Full electrical installation for 12-workstation office space with server room and data cabling.",
  },
  {
    icon: BatteryCharging,
    title: "EV Charger Installation",
    location: "Hemel Hempstead, Hertfordshire",
    type: "Domestic",
    desc: "7kW EV charger with dedicated circuit. Installed in under a day with OZEV grant applied.",
  },
  {
    icon: Lightbulb,
    title: "Warehouse LED Upgrade",
    location: "Berkhamsted, Hertfordshire",
    type: "Commercial",
    desc: "Replaced fluorescent fittings with LED panels across 500sqm warehouse. 60% energy saving.",
  },
  {
    icon: ShieldAlert,
    title: "Fire Alarm System",
    location: "Berkhamsted, Hertfordshire",
    type: "Commercial",
    desc: "Design and install of 24-zone addressable fire alarm system for a 3-storey office building.",
  },
  {
    icon: Home,
    title: "Smart Home Pre-Wire",
    location: "Hemel Hempstead, Hertfordshire",
    type: "Domestic",
    desc: "Pre-wiring for smart lighting, motorised blinds, multi-room audio and CCTV in a new build.",
  },
];

const ProjectsShowcase = () => (
  <section className="py-12 md:py-28 bg-secondary">
    <div className="container">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="text-center mb-8 md:mb-16"
      >
        <motion.p variants={fadeUp} custom={0} className="text-xs md:text-sm font-heading font-600 uppercase tracking-wider text-primary mb-2 md:mb-3">Recent Projects</motion.p>
        <motion.h2 variants={fadeUp} custom={1} className="text-2xl md:text-4xl font-heading font-800 mb-3 md:mb-4">Work We're Proud Of</motion.h2>
        <motion.p variants={fadeUp} custom={2} className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
          From quick EV charger installs to large-scale commercial fit-outs, here's a snapshot
          of the electrical work we've recently completed.
        </motion.p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-w-6xl mx-auto">
        {projects.map((project, i) => (
          <motion.div
            key={project.title}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-30px" }}
            variants={fadeUp}
            custom={i}
          >
            <Card className="h-full hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center justify-between mb-3 md:mb-4">
                  <div className="w-9 h-9 md:w-10 md:h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <project.icon className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                  </div>
                  <Badge variant="outline" className="text-xs font-heading">{project.type}</Badge>
                </div>
                <h3 className="font-heading font-700 text-base md:text-lg mb-1">{project.title}</h3>
                <p className="text-xs text-muted-foreground mb-2 md:mb-3">{project.location}</p>
                <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">{project.desc}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
        custom={0}
        className="text-center mt-8 md:mt-10"
      >
        <Button asChild variant="outline" className="font-heading font-600">
          <Link href="/gallery">View Our Full Gallery <ArrowRight className="ml-2 h-4 w-4" /></Link>
        </Button>
      </motion.div>
    </div>
  </section>
);

export default ProjectsShowcase;
