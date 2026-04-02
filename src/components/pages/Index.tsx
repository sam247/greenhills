import Layout from "@/components/layout/Layout";
import HeroSection from "@/components/home/HeroSection";
import EsmePartnership from "@/components/home/EsmePartnership";
import TrustBadges from "@/components/home/TrustBadges";
import ServicesSection from "@/components/home/ServicesSection";
import ProjectsShowcase from "@/components/home/ProjectsShowcase";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import AreasSection from "@/components/home/AreasSection";
import ReviewsSection from "@/components/home/ReviewsSection";
import CTASection from "@/components/home/CTASection";

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <EsmePartnership />
      <TrustBadges />
      <ServicesSection />
      <ProjectsShowcase />
      <WhyChooseUs />
      <AreasSection />
      <ReviewsSection />
      <CTASection />
    </Layout>
  );
};

export default Index;
