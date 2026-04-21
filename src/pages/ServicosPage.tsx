import Header from "@/components/Header";
import Services from "@/components/Services";
import Procedures from "@/components/Procedures";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import SEO from "@/components/SEO";

const ServicosPage = () => {
  return (
    <main className="min-h-screen bg-background">
      <SEO
        title="Serviços"
        description="Áreas de cuidado da Curae Santé: saúde clínica, emagrecimento e metabolismo, saúde da pele e procedimentos com avaliação médica individualizada."
        path="/servicos"
      />
      <Header />
      <div className="pt-20">
        <Services />
        <Procedures />
        <CTASection />
      </div>
      <Footer />
      <WhatsAppButton />
    </main>
  );
};

export default ServicosPage;
