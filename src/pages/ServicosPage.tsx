import Header from "@/components/Header";
import Services from "@/components/Services";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import SEO from "@/components/SEO";

const ServicosPage = () => {
  return (
    <main className="min-h-screen bg-background">
      <SEO
        title="Serviços"
        description="Áreas de cuidado da Curae Santé: medicina estética, tecnologias, emagrecimento, saúde metabólica, performance e saúde hormonal feminina."
        path="/servicos"
      />
      <Header />
      <div className="pt-20">
        <Services />
      </div>
      <Footer />
      <WhatsAppButton />
    </main>
  );
};

export default ServicosPage;
