"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Zap, ArrowRight, Phone, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0, 0, 0.2, 1] as const },
  }),
};

const HeroSection = () => {
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      toast.success("Thanks! We'll call you back shortly.", { description: "One of our team will be in touch within the hour." });
      setForm({ name: "", phone: "", email: "", message: "" });
      setSubmitting(false);
    }, 800);
  };

  return (
    <section className="relative min-h-[70vh] md:min-h-[80vh] flex items-center text-primary-foreground overflow-hidden">
      <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover">
        <source src="/hero-video.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-r from-greenhills-dark/90 via-primary/80 to-primary/60" />
      <div className="container relative py-16 md:py-36">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left — text */}
          <motion.div initial="hidden" animate="visible">
            <motion.div variants={fadeUp} custom={0} className="inline-flex items-center gap-2 bg-primary-foreground/15 text-primary-foreground px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-heading font-600 mb-4 md:mb-6">
              <Zap className="h-3.5 w-3.5 md:h-4 md:w-4" />
              NICEIC Approved Electrical Contractors
            </motion.div>
            <motion.h1 variants={fadeUp} custom={1} className="text-3xl md:text-6xl font-heading font-800 leading-[1.1] mb-4 md:mb-6">
              Award Winning
              <span className="text-primary-foreground/90"> Electricians in Hertfordshire?</span>
            </motion.h1>
            <motion.p variants={fadeUp} custom={2} className="text-base md:text-xl text-primary-foreground/80 mb-6 md:mb-8 max-w-lg leading-relaxed">
              Whether it's a full rewire, EV charger, office fit-out or emergency repair — our qualified team
              delivers safe, certified electrical work you can rely on.
            </motion.p>
            <motion.div variants={fadeUp} custom={3} className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Button asChild size="lg" className="bg-primary-foreground text-foreground hover:bg-primary-foreground/90 font-heading font-700 text-base w-full sm:w-auto">
                <Link href="/contact">Get a Free Quote <ArrowRight className="ml-2 h-5 w-5" /></Link>
              </Button>
              <Button asChild size="lg" className="bg-transparent border-2 border-white text-white hover:bg-white/10 font-heading font-600 text-base w-full sm:w-auto">
                <Link href="/about">Why Choose Us</Link>
              </Button>
            </motion.div>
          </motion.div>

          {/* Right — quick contact form */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6, ease: [0, 0, 0.2, 1] }}
          >
            <div className="bg-background/95 backdrop-blur-md rounded-xl p-6 md:p-8 shadow-2xl border border-border/50">
              <div className="flex items-center gap-2 mb-1">
                <Phone className="h-5 w-5 text-primary" />
                <h2 className="font-heading font-700 text-foreground text-lg">Request a Callback</h2>
              </div>
              <p className="text-muted-foreground text-sm mb-5">Fill in your details and we'll get back to you within the hour.</p>

              <form onSubmit={handleSubmit} className="space-y-3">
                <Input
                  placeholder="Your name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  className="bg-muted/50"
                />
                <Input
                  placeholder="Phone number"
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  required
                  className="bg-muted/50"
                />
                <Input
                  placeholder="Email address"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="bg-muted/50"
                />
                <Textarea
                  placeholder="Brief description of the work needed..."
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="bg-muted/50 min-h-[70px] resize-none"
                  rows={3}
                />
                <Button type="submit" className="w-full font-heading font-700" size="lg" disabled={submitting}>
                  {submitting ? "Sending..." : (
                    <>Request Callback <Send className="ml-2 h-4 w-4" /></>
                  )}
                </Button>
              </form>

              <p className="text-[11px] text-muted-foreground mt-3 text-center">
                We respect your privacy. No spam, ever.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
