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
import SEO from "@/components/SEO";

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
      <Identification />
      <HowItWorks />
      <Team />
      <Services />
      <Procedures />
      <Principles />
      <CTASection />
      <Location />
      <Testimonials />
      <BlogPreview />
      <InstagramFeed />
      <Footer />
      <WhatsAppButton />
    </main>
  );
};

export default Index;
