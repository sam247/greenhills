"use client";

import { motion } from "framer-motion";
import { Star, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0, 0, 0.2, 1] as const },
  }),
};

const googleReviews = [
  { name: "Sarah M.", text: "Greenhills rewired our entire house. Professional, clean and on time. Couldn't ask for more.", rating: 5 },
  { name: "James T.", text: "Fantastic work on our office fit-out. The team were knowledgeable and the finish was perfect.", rating: 5 },
  { name: "Linda P.", text: "Had an EV charger installed. Quick, tidy and explained everything clearly. Highly recommend.", rating: 5 },
];

const trustpilotReviews = [
  { name: "Mark D.", text: "Used Greenhills for our landlord EICR certificate. Fast, professional and great value. Will use again.", rating: 5 },
  { name: "Emma W.", text: "They fitted a new consumer unit and smoke alarms. Very neat work, fully certified. Excellent service.", rating: 5 },
  { name: "Paul R.", text: "Commercial fire alarm installation done on time and on budget. Highly competent team throughout.", rating: 5 },
];

interface ReviewBlockProps {
  title: string;
  score: string;
  count: string;
  linkText: string;
  linkHref: string;
  reviews: typeof googleReviews;
  source: string;
  accentClass: string;
}

const ReviewBlock = ({ title, score, count, linkText, linkHref, reviews, source, accentClass }: ReviewBlockProps) => (
  <div>
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={fadeUp}
      custom={0}
      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 md:mb-6 max-w-5xl mx-auto"
    >
      <div className="flex items-center gap-3">
        <div className={`w-9 h-9 md:w-10 md:h-10 rounded-lg ${accentClass} flex items-center justify-center`}>
          <Star className="h-4 w-4 md:h-5 md:w-5" />
        </div>
        <div>
          <h3 className="font-heading font-700 text-base md:text-lg">{title}</h3>
          <div className="flex items-center gap-1">
            <span className="text-xs md:text-sm font-heading font-600 text-foreground">{score}</span>
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-3 w-3 md:h-3.5 md:w-3.5 fill-accent text-accent" />
              ))}
            </div>
            <span className="text-xs text-muted-foreground ml-1">({count} reviews)</span>
          </div>
        </div>
      </div>
      <Button variant="ghost" size="sm" className="text-xs font-heading gap-1 self-start sm:self-auto" asChild>
        <a href={linkHref} target="_blank" rel="noopener noreferrer">
          {linkText} <ExternalLink className="h-3 w-3" />
        </a>
      </Button>
    </motion.div>

    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 max-w-5xl mx-auto">
      {reviews.map((review, i) => (
        <motion.div
          key={review.name}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-30px" }}
          variants={fadeUp}
          custom={i}
        >
          <Card className="h-full">
            <CardContent className="p-4 md:p-6">
              <div className="flex gap-0.5 mb-2 md:mb-3">
                {Array.from({ length: review.rating }).map((_, j) => (
                  <Star key={j} className="h-3.5 w-3.5 md:h-4 md:w-4 fill-accent text-accent" />
                ))}
              </div>
              <p className="text-muted-foreground mb-3 md:mb-4 leading-relaxed text-xs md:text-sm italic">"{review.text}"</p>
              <div className="flex items-center gap-2">
                <div className={`w-7 h-7 md:w-8 md:h-8 rounded-full ${accentClass} flex items-center justify-center text-xs font-heading font-700`}>
                  {review.name.charAt(0)}
                </div>
                <div>
                  <p className="font-heading font-600 text-xs md:text-sm">{review.name}</p>
                  <p className="text-xs text-muted-foreground">{source}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  </div>
);

const ReviewsSection = () => (
  <section className="py-12 md:py-28">
    <div className="container">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="text-center mb-8 md:mb-16"
      >
        <motion.p variants={fadeUp} custom={0} className="text-xs md:text-sm font-heading font-600 uppercase tracking-wider text-primary mb-2 md:mb-3">Reviews</motion.p>
        <motion.h2 variants={fadeUp} custom={1} className="text-2xl md:text-4xl font-heading font-800 mb-3 md:mb-4">Trusted by Homeowners & Businesses</motion.h2>
        <motion.p variants={fadeUp} custom={2} className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
          Don't just take our word for it. See what our customers say on Google and Trustpilot.
        </motion.p>
      </motion.div>

      <div className="space-y-12 md:space-y-16">
        <ReviewBlock
          title="Google Reviews"
          score="5.0"
          count="48"
          linkText="Leave a Review"
          linkHref="https://g.page/r/greenhills-electric/review"
          reviews={googleReviews}
          source="Google Review"
          accentClass="bg-primary/10 text-primary"
        />

        <ReviewBlock
          title="Trustpilot"
          score="4.9"
          count="34"
          linkText="View on Trustpilot"
          linkHref="https://www.trustpilot.com/review/greenhillselectric.co.uk"
          reviews={trustpilotReviews}
          source="Trustpilot Review"
          accentClass="bg-[hsl(156,100%,35%)]/10 text-[hsl(156,100%,35%)]"
        />
      </div>
    </div>
  </section>
);

export default ReviewsSection;
