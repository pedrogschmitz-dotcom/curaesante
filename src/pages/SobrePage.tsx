import Header from "@/components/Header";
import HowItWorks from "@/components/HowItWorks";
import Principles from "@/components/Principles";
import About from "@/components/About";
import Location from "@/components/Location";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import SEO from "@/components/SEO";

const SobrePage = () => {
  return (
    <main className="min-h-screen bg-background">
      <SEO
        title="Sobre"
        description="Conheça a Curae Santé — clínica médica em Kobrasol com tempo de consulta, escuta e plano individualizado. Saúde, emagrecimento e qualidade de vida."
        path="/sobre"
      />
      <Header />
      <div className="pt-20">
        <HowItWorks />
        <Principles />
        <About />
        <Location />
        <CTASection />
      </div>
      <Footer />
      <WhatsAppButton />
    </main>
  );
};

export default SobrePage;
