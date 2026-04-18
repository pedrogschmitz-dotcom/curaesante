import Header from "@/components/Header";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import SEO from "@/components/SEO";

const ContatoPage = () => {
  return (
    <main className="min-h-screen bg-background">
      <SEO
        title="Contato"
        description="Agende sua consulta na Curae Santé em Kobrasol, São José SC. Atendimento humanizado e consulta clínica extensa."
        path="/contato"
      />
      <Header />
      <div className="pt-20">
        <Contact />
      </div>
      <Footer />
      <WhatsAppButton />
    </main>
  );
};

export default ContatoPage;
