import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-greenhills-dark text-primary-foreground">
      <div className="container py-10 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Image
              src="/logo.png"
              alt="Greenhills Electric"
              width={160}
              height={40}
              className="h-10 w-auto mb-3 md:mb-4 brightness-0 invert"
            />
            <p className="text-primary-foreground/70 text-xs md:text-sm leading-relaxed">
              Professional electrical contractors with over 60 years of combined experience.
              NICEIC approved and Part P registered.
            </p>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-heading font-700 text-xs md:text-sm uppercase tracking-wider mb-3 md:mb-4 text-accent">Services</h3>
            <ul className="space-y-2 text-xs md:text-sm text-primary-foreground/70">
              <li><Link href="/services/domestic-electrician" className="hover:text-accent transition-colors">Domestic Electrician</Link></li>
              <li><Link href="/services/commercial-electrical-installation" className="hover:text-accent transition-colors">Commercial Electrical</Link></li>
              <li><Link href="/services/ev-charger-installation" className="hover:text-accent transition-colors">EV Charger Installation</Link></li>
              <li><Link href="/services/smart-home-wiring" className="hover:text-accent transition-colors">Smart Home Wiring</Link></li>
              <li><Link href="/services/eicr-testing" className="hover:text-accent transition-colors">EICR Testing</Link></li>
              <li><Link href="/industries/schools" className="hover:text-accent transition-colors">Schools</Link></li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading font-700 text-xs md:text-sm uppercase tracking-wider mb-3 md:mb-4 text-accent">Quick Links</h3>
            <ul className="space-y-2 text-xs md:text-sm text-primary-foreground/70">
              <li><Link href="/about" className="hover:text-accent transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-accent transition-colors">Contact</Link></li>
              <li><Link href="/privacy" className="hover:text-accent transition-colors">Privacy Policy</Link></li>
              <li><Link href="/portal" className="hover:text-accent transition-colors">Login</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="col-span-2 md:col-span-1">
            <h3 className="font-heading font-700 text-xs md:text-sm uppercase tracking-wider mb-3 md:mb-4 text-accent">Contact Us</h3>
            <ul className="space-y-2.5 md:space-y-3 text-xs md:text-sm text-primary-foreground/70">
              <li className="flex items-start gap-2.5 md:gap-3">
                <Phone className="h-3.5 w-3.5 md:h-4 md:w-4 mt-0.5 text-accent shrink-0" />
                <a href="tel:01442264125" className="hover:text-accent transition-colors">01442 264125</a>
              </li>
              <li className="flex items-start gap-2.5 md:gap-3">
                <Mail className="h-3.5 w-3.5 md:h-4 md:w-4 mt-0.5 text-accent shrink-0" />
                <span className="break-all">info@greenhillselectric.co.uk</span>
              </li>
              <li className="flex items-start gap-2.5 md:gap-3">
                <MapPin className="h-3.5 w-3.5 md:h-4 md:w-4 mt-0.5 text-accent shrink-0" />
                <span>Serving London &amp; surrounding areas</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-primary-foreground/10">
        <div className="container py-4 md:py-6 flex flex-col sm:flex-row items-center justify-between gap-3 md:gap-4 text-xs text-primary-foreground/50">
          <p>&copy; {new Date().getFullYear()} Greenhills Electric. All rights reserved.</p>
          <div className="flex items-center gap-4 md:gap-6">
            <span>NICEIC Approved</span>
            <span>Part P Registered</span>
            <span className="hidden sm:inline">Trustmark</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
