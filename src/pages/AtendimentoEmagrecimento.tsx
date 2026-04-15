import SEOHead from "@/components/SEOHead";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AtendimentoTemplate from "@/components/AtendimentoTemplate";

const AtendimentoEmagrecimento = () => {
  return (
    <main className="min-h-screen bg-background">
      <SEOHead
        title="Emagrecimento e Saúde Metabólica"
        description="Atendimento clínico para dificuldade de emagrecer, resistência insulínica e síndrome metabólica. Com Dra. Júlia Longo, Kobrasol, São José SC."
        path="/atendimento/emagrecimento-metabolico"
      />
      <Header />

      <AtendimentoTemplate
        title="Emagrecimento e saúde metabólica"
        doctor="Dra. Júlia Longo Rodrigues Schmitz"
        crm="CRM/SC 34242"
        paraQuem={[
          "Dificuldade persistente de emagrecer apesar de dietas e exercícios",
          "Resistência insulínica ou pré-diabetes sem acompanhamento individualizado",
          "Síndrome metabólica com múltiplos fatores de risco",
          "Fadiga crônica e alterações de energia sem explicação nos exames de rotina",
          "[Placeholder — adicionar situação clínica específica]",
        ]}
        paraNao={[
          "Cirurgia bariátrica — encaminhamos para equipe cirúrgica quando indicado",
          "Transtornos alimentares graves que exigem equipe multidisciplinar com psiquiatra",
          "[Placeholder — adicionar limite adicional]",
        ]}
        processo="A consulta inicial mapeia histórico de peso, tentativas anteriores, hábitos alimentares e de sono, histórico hormonal, medicações em uso e exames prévios. A investigação laboratorial é direcionada pelo quadro, não por protocolo fixo. O plano terapêutico inclui orientação nutricional, ajustes de rotina, medicação quando indicada e acompanhamento com retornos programados."
        abordagem="A abordagem é baseada em princípios da medicina funcional — olhar o organismo como um sistema integrado, não apenas tratar números isolados. O objetivo é entender as causas da dificuldade metabólica, não apenas prescrever restrição calórica. Resultados variam individualmente."
        faq={[
          {
            question: "Quanto tempo dura a primeira consulta?",
            answer: "[Placeholder — preencher com duração real]",
          },
          {
            question: "Preciso trazer exames anteriores?",
            answer: "[Placeholder — preencher com orientação]",
          },
          {
            question: "A abordagem inclui medicação?",
            answer: "[Placeholder — preencher com explicação sobre quando medicação é indicada]",
          },
          {
            question: "O atendimento é pelo convênio?",
            answer: "[Placeholder — preencher]",
          },
        ]}
        whatsappMessage="Olá, vim pela página de emagrecimento e saúde metabólica e gostaria de agendar uma avaliação com Dra. Júlia."
      />

      <Footer />
    </main>
  );
};

export default AtendimentoEmagrecimento;
