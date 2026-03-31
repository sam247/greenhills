export interface ServicePageData {
  slug: string;
  category: "service" | "industry";
  title: string;
  subtitle: string;
  intro: string;
  includes: string[];
  audience: string;
  localParagraph: string;
  relatedLinks: { label: string; path: string }[];
  trustPoints?: string[];
  faq?: { question: string; answer: string }[];
  ctaText?: string;
  ctaSubtext?: string;
  location?: string;
}

// SLUG_TO_SERVICE removed — use SERVICES from src/data/services.ts instead

export const servicePages: ServicePageData[] = [
  {
    slug: "domestic-electrician",
    category: "service",
    title: "Domestic Electrician in Hertfordshire",
    subtitle: "Safe, reliable electrical work for your home — from full rewires to single sockets.",
    intro: "Whether you're renovating an older property, adding an extension, or need a new consumer unit, our domestic electricians handle it all. We work with homeowners, landlords, and tenants across Hertfordshire to keep homes safe and fully compliant.",
    includes: [
      "Full and partial rewires",
      "Consumer unit (fuse board) upgrades",
      "Additional sockets, switches, and lighting",
      "Kitchen and bathroom electrical installations",
      "Outdoor lighting and garden electrics",
      "Landlord electrical safety certificates",
      "Fault finding and emergency repairs",
    ],
    audience: "Homeowners, landlords, tenants, and property developers across Hertfordshire. Whether it's a Victorian terrace that needs a full rewire or a new-build that needs finishing, we can help.",
    localParagraph: "We've worked on homes across Hertfordshire for years — from period properties in St Albans to new developments in Watford and family homes in Hemel Hempstead. Our electricians know the area and can usually attend within a few days.",
    relatedLinks: [
      { label: "EV Charger Installation", path: "/services/ev-charger-installation" },
      { label: "Smart Home Wiring", path: "/services/smart-home-wiring" },
      { label: "EICR Testing", path: "/services/eicr-testing" },
    ],
    trustPoints: [
      "NICEIC approved contractor",
      "Part P registered for building regulations compliance",
      "Over 60 years of combined experience",
      "All work tested, certified, and guaranteed",
      "Clean, tidy, and respectful in your home",
    ],
    faq: [
      {
        question: "How long does a full house rewire take?",
        answer: "Most homes take 5–7 working days depending on size. We'll give you a clear timeline before we start.",
      },
      {
        question: "Do I need a new consumer unit?",
        answer: "If your fuse board is over 15 years old or doesn't have RCD protection, we'd usually recommend an upgrade for safety and compliance.",
      },
      {
        question: "Do you provide landlord certificates?",
        answer: "Yes. We carry out Electrical Installation Condition Reports (EICRs) for landlords, which are a legal requirement for rental properties.",
      },
      {
        question: "Are you insured?",
        answer: "Fully insured with public liability cover. All our work is certified and guaranteed.",
      },
    ],
  },
  {
    slug: "ev-charger-installation",
    category: "service",
    title: "EV Charger Installation in Hertfordshire",
    subtitle: "Home and workplace charging points, professionally installed and certified.",
    intro: "Switching to an electric vehicle? We install EV chargers at homes and workplaces across Hertfordshire. From a simple home wallbox to a multi-point commercial setup, we handle the full installation including any upgrades to your electrical supply.",
    includes: [
      "Home EV charger installation (all major brands)",
      "Workplace and commercial charging points",
      "Electrical supply assessment and upgrades",
      "Consumer unit upgrades where needed",
      "Dedicated EV circuit installation",
      "Part P certification and building control notification",
      "Advice on charger selection and energy tariffs",
    ],
    audience: "Homeowners with electric or hybrid vehicles, businesses wanting to offer staff or customer charging, and landlords looking to future-proof rental properties.",
    localParagraph: "We install EV chargers across Hertfordshire — from driveways in Watford and Hemel Hempstead to office car parks in Stevenage and St Albans. We know local regulations and can advise on the best setup for your property.",
    relatedLinks: [
      { label: "Domestic Electrician", path: "/services/domestic-electrician" },
      { label: "Smart Home Wiring", path: "/services/smart-home-wiring" },
      { label: "Commercial Electrical", path: "/services/commercial-electrical-installation" },
    ],
    trustPoints: [
      "Approved installer for leading EV charger brands",
      "NICEIC approved and Part P registered",
      "Full electrical assessment included",
      "All installations certified and compliant",
      "Over 60 years of combined electrical experience",
    ],
    faq: [
      {
        question: "How long does an EV charger installation take?",
        answer: "Most home installations are completed in half a day. If your consumer unit needs upgrading, it may take a full day.",
      },
      {
        question: "Do I need to upgrade my fuse board?",
        answer: "Not always, but if your current board doesn't have a spare way or lacks RCD protection, we may recommend an upgrade.",
      },
      {
        question: "Can you install chargers at a business?",
        answer: "Yes. We install single and multi-point commercial charging setups for offices, car parks, and retail sites.",
      },
      {
        question: "Which charger brands do you install?",
        answer: "We work with all major brands. We'll help you choose the right charger based on your vehicle, budget, and energy setup.",
      },
    ],
  },
  {
    slug: "smart-home-wiring",
    category: "service",
    title: "Smart Home Wiring in Hertfordshire",
    subtitle: "Future-proof your home with structured cabling, smart lighting, and automated controls.",
    intro: "Planning a new build, renovation, or just want more control over your lighting and heating? We install the wiring infrastructure that makes smart homes work properly — no flickering Wi-Fi switches, just reliable, hardwired systems that last.",
    includes: [
      "Structured data cabling (Cat6/Cat6a throughout)",
      "Smart lighting circuits and dimmer systems",
      "Multi-room audio and AV pre-wiring",
      "Automated blind and curtain wiring",
      "Home network cabinet installation",
      "Smart thermostat wiring",
      "Outdoor smart lighting and security camera cabling",
    ],
    audience: "Homeowners building or renovating, property developers creating premium specifications, and anyone wanting reliable smart home infrastructure rather than aftermarket wireless add-ons.",
    localParagraph: "We've wired smart homes across Hertfordshire — from new builds in Watford to barn conversions near St Albans. We work alongside builders, architects, and AV installers to get the cabling right first time.",
    relatedLinks: [
      { label: "Domestic Electrician", path: "/services/domestic-electrician" },
      { label: "EV Charger Installation", path: "/services/ev-charger-installation" },
      { label: "Commercial Electrical", path: "/services/commercial-electrical-installation" },
    ],
    trustPoints: [
      "Experienced in new-build and renovation projects",
      "Work alongside architects and AV specialists",
      "NICEIC approved and Part P registered",
      "Neat, structured cabling — not bodge jobs",
      "Over 60 years of combined experience",
    ],
    faq: [
      {
        question: "Is it better to hardwire smart home systems?",
        answer: "Yes, in most cases. Hardwired systems are more reliable than wireless and don't depend on Wi-Fi signal strength.",
      },
      {
        question: "Can you add smart wiring to an existing home?",
        answer: "We can, though it's easiest during a renovation when walls are open. We'll assess your property and advise on the best approach.",
      },
      {
        question: "Do you work with specific smart home brands?",
        answer: "We install the wiring infrastructure that works with any system — Lutron, Control4, Sonos, Hue, and others. We can also recommend AV partners.",
      },
    ],
  },
  {
    slug: "commercial-electrical-installation",
    category: "service",
    title: "Commercial Electrical Installation in Hertfordshire",
    subtitle: "Offices, retail, warehouses, and more — fully compliant commercial electrical work.",
    intro: "From office fit-outs and shop refurbishments to warehouse lighting and three-phase installations, we deliver commercial electrical work that meets every regulation. We work with business owners, facilities managers, and contractors across Hertfordshire.",
    includes: [
      "Full commercial electrical installations",
      "Office and retail fit-outs",
      "Three-phase power installations",
      "Emergency lighting and fire alarm systems",
      "LED lighting upgrades and energy-saving solutions",
      "Data cabling and containment systems",
      "Periodic inspection and testing (EICR)",
      "Maintenance contracts",
    ],
    audience: "Business owners, facilities managers, property developers, and main contractors who need reliable, regulation-compliant commercial electrical work across Hertfordshire.",
    localParagraph: "We've completed commercial projects across Hertfordshire — from office blocks in Watford and retail units in St Albans to industrial estates in Hemel Hempstead. We understand the pace of commercial work and deliver on time.",
    relatedLinks: [
      { label: "EICR Testing", path: "/services/eicr-testing" },
      { label: "Electrical Services for Schools", path: "/industries/schools" },
      { label: "Domestic Electrician", path: "/services/domestic-electrician" },
    ],
    trustPoints: [
      "NICEIC approved contractor",
      "Experience with multi-site commercial projects",
      "Over 60 years of combined electrical experience",
      "Full compliance with BS 7671 wiring regulations",
      "Maintenance contracts available",
    ],
    faq: [
      {
        question: "Can you work outside normal business hours?",
        answer: "Yes. We regularly carry out commercial work evenings and weekends to minimise disruption to your business.",
      },
      {
        question: "Do you handle fire alarm installations?",
        answer: "Yes, we install and maintain fire alarm systems to BS 5839 standards.",
      },
      {
        question: "Can you work as a subcontractor?",
        answer: "We regularly work alongside main contractors on commercial fit-out and construction projects.",
      },
      {
        question: "Do you offer maintenance contracts?",
        answer: "Yes. We offer ongoing maintenance agreements for businesses that need regular testing, PAT testing, and emergency callout cover.",
      },
    ],
  },
  {
    slug: "eicr-testing",
    category: "service",
    title: "EICR Testing in Hertfordshire",
    subtitle: "Electrical Installation Condition Reports for landlords, businesses, and homeowners.",
    intro: "An EICR (Electrical Installation Condition Report) checks whether your property's electrical installation is safe. It's a legal requirement for landlords before each new tenancy, and recommended every 5 years for homeowners. We carry out thorough inspections and provide clear, honest reports.",
    includes: [
      "Full electrical installation inspection and testing",
      "Detailed condition report with observations and recommendations",
      "Coding of any defects (C1, C2, C3, FI)",
      "Remedial work to address any failures",
      "Landlord compliance certificates",
      "Commercial EICR for business premises",
      "Re-inspection after remedial work",
    ],
    audience: "Landlords who need to meet legal requirements, homeowners buying or selling property, businesses due for periodic testing, and estate agents managing rental portfolios.",
    localParagraph: "We carry out EICR inspections across Hertfordshire — from rental flats in Watford to commercial premises in Stevenage. Most reports are completed in a single visit, and we can usually book you in within a week.",
    relatedLinks: [
      { label: "Domestic Electrician", path: "/services/domestic-electrician" },
      { label: "Commercial Electrical", path: "/services/commercial-electrical-installation" },
      { label: "Electrical Services for Schools", path: "/industries/schools" },
    ],
    trustPoints: [
      "NICEIC approved — reports accepted by all local authorities",
      "Part P registered for domestic work",
      "Clear, jargon-free reports",
      "Remedial work carried out in-house",
      "Over 60 years of combined experience",
    ],
    faq: [
      {
        question: "Is an EICR a legal requirement for landlords?",
        answer: "Yes. Since 2020, landlords in England must have a valid EICR before a new tenancy begins and renew it every 5 years.",
      },
      {
        question: "How long does an EICR take?",
        answer: "A typical domestic EICR takes 2–4 hours depending on the size of the property and number of circuits.",
      },
      {
        question: "What happens if the EICR fails?",
        answer: "We'll explain any issues clearly and can carry out the remedial work needed to bring your installation up to standard. We then re-test and issue a satisfactory report.",
      },
      {
        question: "How often should I get an EICR?",
        answer: "Every 5 years for rental properties (legal requirement), every 5 years recommended for homeowners, and every 5 years or on change of use for commercial premises.",
      },
    ],
  },
  {
    slug: "schools",
    category: "industry",
    title: "Electrical Services for Schools in Hertfordshire",
    subtitle: "Safe, compliant electrical work for schools — planned around term times and safeguarding requirements.",
    intro: "Schools have unique electrical needs — from aging wiring in older buildings to emergency lighting compliance, fire alarm systems, and the everyday maintenance that keeps classrooms running. We work with schools across Hertfordshire, scheduling around term times and following all safeguarding procedures.",
    includes: [
      "Full and partial rewiring of school buildings",
      "Emergency lighting installation and testing",
      "Fire alarm installation, servicing, and certification",
      "EICR inspections and periodic testing",
      "LED lighting upgrades to reduce energy costs",
      "Additional power and data points for IT suites",
      "Playground and external lighting",
      "Ongoing maintenance contracts",
    ],
    audience: "Head teachers, school business managers, academy trusts, and local authority facilities teams responsible for maintaining safe, compliant school buildings across Hertfordshire.",
    localParagraph: "We've worked with primary schools, secondary schools, and academies across Hertfordshire — from Watford and St Albans to Stevenage and Hitchin. We understand the safeguarding, DBS, and scheduling requirements that come with working in school environments.",
    relatedLinks: [
      { label: "EICR Testing", path: "/services/eicr-testing" },
      { label: "Commercial Electrical", path: "/services/commercial-electrical-installation" },
      { label: "Domestic Electrician", path: "/services/domestic-electrician" },
    ],
    trustPoints: [
      "DBS-checked engineers",
      "Experience working in school environments",
      "Work scheduled during holidays and outside school hours",
      "NICEIC approved and fully compliant",
      "Ongoing maintenance contracts available",
      "Over 60 years of combined experience",
    ],
    faq: [
      {
        question: "Can you work during school holidays?",
        answer: "Yes. We schedule most school work during half terms, Easter, and summer holidays to minimise disruption. Emergency work can be done during term time.",
      },
      {
        question: "Are your engineers DBS checked?",
        answer: "Yes. All engineers who work in school environments hold valid DBS certificates.",
      },
      {
        question: "Do you offer maintenance contracts for schools?",
        answer: "Yes. We offer annual maintenance agreements covering periodic testing, emergency lighting checks, fire alarm servicing, and general electrical maintenance.",
      },
      {
        question: "Can you help with energy-saving upgrades?",
        answer: "Yes. LED lighting upgrades are one of the most cost-effective improvements a school can make. We can assess your current lighting and provide a clear cost-saving projection.",
      },
      {
        question: "Do you work with academy trusts?",
        answer: "Yes. We work with individual schools and multi-academy trusts, and can manage electrical services across multiple sites.",
      },
    ],
    ctaText: "Get a Quote for Your School",
    ctaSubtext: "We'll arrange a site visit at a time that works for you.",
  },
];
