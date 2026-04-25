import Header from "@/components/Header";
import Services from "@/components/Services";
import Procedures from "@/components/Procedures";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import SEO from "@/components/SEO";

const ServicosPage = () => {
  const faqItems = [
    {
      question: "Como funciona a primeira consulta na Curae Santé?",
      answer:
        "A primeira consulta é longa, com escuta clínica, avaliação individualizada e definição de um plano claro para seu objetivo.",
    },
    {
      question: "A clínica atende emagrecimento com abordagem médica?",
      answer:
        "Sim. O atendimento de emagrecimento é médico, com avaliação metabólica e acompanhamento personalizado.",
    },
    {
      question: "Os procedimentos estéticos mantêm naturalidade?",
      answer:
        "Sim. A proposta da clínica é preservar naturalidade, proporção facial e segurança em cada conduta.",
    },
    {
      question: "Como agendar uma avaliação?",
      answer:
        "Você pode agendar pelo WhatsApp oficial da clínica: +55 48 8806-4337.",
    },
  ];

  return (
    <main className="min-h-screen bg-background">
      <SEO
        title="Serviços"
        description="Áreas de cuidado da Curae Santé: saúde clínica, emagrecimento e metabolismo, saúde da pele e procedimentos com avaliação médica individualizada."
        path="/servicos"
        faq={faqItems}
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
