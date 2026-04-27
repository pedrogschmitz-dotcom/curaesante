import { useEffect } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Identification from "@/components/Identification";
import HowItWorks from "@/components/HowItWorks";
import Team from "@/components/Team";
import Services from "@/components/Services";
import Procedures from "@/components/Procedures";
import Principles from "@/components/Principles";
import CTASection from "@/components/CTASection";
import Location from "@/components/Location";
import BlogPreview from "@/components/BlogPreview";
import InstagramFeed from "@/components/InstagramFeed";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import MobileStickyCTA from "@/components/MobileStickyCTA";
import OrganicDivider from "@/components/OrganicDivider";
import SEO from "@/components/SEO";
import SectionReveal from "@/components/SectionReveal";

const Index = () => {
  // Smooth scroll for in-page anchors only (mantido para o indicador do hero)
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a[href^="#"]');
      if (anchor) {
        e.preventDefault();
        const href = anchor.getAttribute("href");
        if (href && href !== "#") {
          const element = document.querySelector(href);
          if (element) element.scrollIntoView({ behavior: "smooth" });
        }
      }
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return (
    <main className="min-h-screen bg-background">
      <SEO path="/" />
      <Header />
      <Hero />
      <SectionReveal delayMs={40}><Identification /></SectionReveal>
      <OrganicDivider />
      <SectionReveal delayMs={60}><HowItWorks /></SectionReveal>
      <SectionReveal delayMs={80}><Team /></SectionReveal>
      <OrganicDivider flip />
      <SectionReveal delayMs={100}><Services /></SectionReveal>
      <SectionReveal delayMs={120}><Procedures /></SectionReveal>
      <SectionReveal delayMs={140}><Principles /></SectionReveal>
      <OrganicDivider />
      <SectionReveal delayMs={160}><CTASection /></SectionReveal>
      <SectionReveal delayMs={180}><Location /></SectionReveal>
      <SectionReveal delayMs={200}><Testimonials /></SectionReveal>
      <SectionReveal delayMs={220}><BlogPreview /></SectionReveal>
      <SectionReveal delayMs={240}><InstagramFeed /></SectionReveal>
      <Footer />
      <MobileStickyCTA />
      <WhatsAppButton />
    </main>
  );
};

export default Index;
