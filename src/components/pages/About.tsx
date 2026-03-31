"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Users, Award, Clock } from "lucide-react";
import Layout from "@/components/layout/Layout";
import CTASection from "@/components/home/CTASection";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

const values = [
  { icon: ShieldCheck, title: "Safety First", desc: "Every job is completed to the highest safety standards, fully certified and compliant." },
  { icon: Users, title: "Customer Focused", desc: "We treat every customer's property with respect and communicate clearly throughout." },
  { icon: Award, title: "Quality Workmanship", desc: "Our experienced team deliver exceptional results that stand the test of time." },
  { icon: Clock, title: "Reliable & Punctual", desc: "We arrive on time, work efficiently and leave your property clean and tidy." },
];

const accreditations = ["NICEIC Approved Contractor", "Part P Registered", "Trustmark Registered", "ECA Member", "City & Guilds Qualified", "18th Edition BS 7671"];

const About = () => (
  <Layout>
    <section className="bg-primary text-primary-foreground py-20 md:py-28">
      <div className="container">
        <motion.div initial="hidden" animate="visible" className="max-w-3xl">
          <motion.p variants={fadeUp} custom={0} className="text-sm font-heading font-600 uppercase tracking-wider text-accent mb-3">About Us</motion.p>
          <motion.h1 variants={fadeUp} custom={1} className="text-4xl md:text-5xl font-heading font-800 mb-6">
            Over 60 Years of Electrical Excellence
          </motion.h1>
          <motion.p variants={fadeUp} custom={2} className="text-lg text-primary-foreground/80 leading-relaxed">
            Greenhills Electric is a family-run electrical contracting business with over 60 years of combined experience. 
            We provide professional, reliable and fully certified electrical services to commercial and domestic customers 
            across London and the South East.
          </motion.p>
        </motion.div>
      </div>
    </section>

    <section className="py-20 md:py-28">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-16">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <motion.h2 variants={fadeUp} custom={0} className="text-3xl font-heading font-800 mb-6">Our Story</motion.h2>
            <motion.div variants={fadeUp} custom={1} className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Founded with a commitment to delivering the highest standard of electrical work, 
                Greenhills Electric has grown from a small local business into a trusted name in the industry.
              </p>
              <p>
                Our team of fully qualified electricians bring decades of hands-on experience to every project. 
                Whether it's a full commercial installation or a simple domestic repair, we approach every job 
                with the same dedication to quality and safety.
              </p>
              <p>
                We're proud to be NICEIC approved and Part P registered, giving our customers complete peace 
                of mind that all work meets the highest industry standards.
              </p>
            </motion.div>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <motion.h2 variants={fadeUp} custom={0} className="text-3xl font-heading font-800 mb-6">Accreditations</motion.h2>
            <motion.div variants={fadeUp} custom={1} className="grid grid-cols-2 gap-4">
              {accreditations.map((a) => (
                <div key={a} className="flex items-center gap-3 p-4 rounded-lg bg-secondary border border-border">
                  <ShieldCheck className="h-5 w-5 text-primary shrink-0" />
                  <span className="text-sm font-medium">{a}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>

    <section className="py-20 md:py-28 bg-secondary">
      <div className="container">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-16">
          <motion.h2 variants={fadeUp} custom={0} className="text-3xl md:text-4xl font-heading font-800 mb-4">Our Values</motion.h2>
        </motion.div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((v, i) => (
            <motion.div key={v.title} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i} className="text-center">
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <v.icon className="h-7 w-7 text-primary" />
              </div>
              <h3 className="font-heading font-700 text-lg mb-2">{v.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    <CTASection />
  </Layout>
);

export default About;
