import Header from "@/components/Header";
import Team from "@/components/Team";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import SEO from "@/components/SEO";

const EquipePage = () => {
  return (
    <main className="min-h-screen bg-background">
      <SEO
        title="Equipe"
        description="Equipe médica da Curae Santé: Dr. Pedro Schmitz e Dra. Júlia Longo, com atendimento humanizado em Kobrasol, São José SC."
        path="/equipe"
      />
      <Header />
      <div className="pt-20">
        <Team />
      </div>
      <Footer />
      <WhatsAppButton />
    </main>
  );
};

export default EquipePage;
