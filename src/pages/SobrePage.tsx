import Header from "@/components/Header";
import About from "@/components/About";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import SEO from "@/components/SEO";

const SobrePage = () => {
  return (
    <main className="min-h-screen bg-background">
      <SEO
        title="Sobre"
        description="Conheça a Curae Santé — clínica médica em Kobrasol com cuidado humanizado em saúde da pele, emagrecimento, saúde metabólica e saúde hormonal feminina."
        path="/sobre"
      />
      <Header />
      <div className="pt-20">
        <About />
      </div>
      <Footer />
      <WhatsAppButton />
    </main>
  );
};

export default SobrePage;
