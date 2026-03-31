import { ShieldCheck } from "lucide-react";

const badges = ["NICEIC Approved", "Part P Registered", "Trustmark", "ECA Member", "60+ Years Experience"];

const TrustBadges = () => (
  <section className="bg-secondary border-b border-border">
    <div className="container py-4 md:py-6">
      <div className="flex flex-wrap items-center justify-center gap-3 md:gap-10">
        {badges.map((badge) => (
          <div key={badge} className="flex items-center gap-1.5 md:gap-2 text-xs md:text-sm font-heading font-600 text-secondary-foreground/70">
            <ShieldCheck className="h-4 w-4 md:h-5 md:w-5 text-primary shrink-0" />
            {badge}
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default TrustBadges;
