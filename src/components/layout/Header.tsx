"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Phone, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const navLinks = [
  { label: "About", path: "/about" },
  { label: "Commercial", path: "/commercial" },
  { label: "Domestic", path: "/domestic" },
  { label: "Gallery", path: "/gallery" },
  { label: "Testimonials", path: "/testimonials" },
];

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-background shadow-sm">
      {/* Top bar */}
      <div className="border-b border-border bg-muted">
        <div className="container flex items-center justify-between py-1.5 md:py-2 text-xs md:text-sm">
          <a href="tel:01442264125" className="flex items-center gap-1.5 md:gap-2 font-medium text-foreground hover:text-primary transition-colors">
            <Phone className="h-3.5 w-3.5 md:h-4 md:w-4" />
            <span className="hidden xs:inline">Call us today</span> <span>01442 264125</span>
          </a>
          <span className="text-[10px] md:text-xs text-muted-foreground">NICEIC Approved • Part P Registered • 60+ Years Experience</span>
        </div>
      </div>

      {/* Main nav */}
      <div className="container flex items-center justify-between py-3 md:py-4">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="Greenhills Electric"
            width={160}
            height={40}
            className="h-7 md:h-10 w-auto"
            priority
          />
        </Link>

        {/* Desktop nav + CTA grouped right */}
        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-muted ${
                pathname === link.path ? "bg-muted text-primary" : "text-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Button asChild className="font-heading font-700 ml-2" size="sm">
            <Link href="/contact">Get a Free Quote</Link>
          </Button>
        </div>

        {/* Mobile controls */}
        <div className="flex items-center gap-2 md:gap-3 lg:hidden">
          <Button asChild className="font-heading font-700 hidden sm:inline-flex" size="sm">
            <Link href="/contact">Get a Free Quote</Link>
          </Button>
          <button
            className="p-2 hover:bg-muted rounded-md transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5 md:h-6 md:w-6" /> : <Menu className="h-5 w-5 md:h-6 md:w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <nav className="lg:hidden border-t border-border pb-4">
          <div className="container flex flex-col gap-1 pt-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                onClick={() => setMobileOpen(false)}
                className={`px-4 py-3 rounded-md text-sm font-medium transition-colors hover:bg-muted ${
                  pathname === link.path ? "bg-muted text-primary" : "text-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Button asChild className="font-heading font-700 mt-2 sm:hidden">
              <Link href="/contact" onClick={() => setMobileOpen(false)}>
                Get a Free Quote
              </Link>
            </Button>
          </div>
        </nav>
      )}
    </header>
  );
};

export default Header;
