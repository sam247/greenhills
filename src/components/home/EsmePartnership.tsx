import Image from "next/image";

const EsmePartnership = () => (
  <section className="bg-background border-b border-border">
    <div className="container py-8 md:py-10 text-center">
      <p className="text-sm md:text-base text-muted-foreground mb-1 font-medium">
        In partnership with{" "}
        <a
          href="https://esme.energy"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary font-heading font-600 hover:underline"
        >
          Esme Energy
        </a>
      </p>
      <p className="text-xs md:text-sm text-muted-foreground/80 mb-6">Home battery company</p>
      <div className="flex flex-col items-center gap-4">
        <Image
          src="/esme.png"
          alt="Esme Energy — home battery company"
          width={240}
          height={96}
          className="h-auto w-auto max-w-[200px] md:max-w-[260px] object-contain"
        />
        <p className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-2xl mx-auto">
          With the ESME Home Battery Storage, you can store electricity efficiently and use it whenever you need it,
          helping you lower bills and protect your home from rising energy prices.
        </p>
      </div>
    </div>
  </section>
);

export default EsmePartnership;
