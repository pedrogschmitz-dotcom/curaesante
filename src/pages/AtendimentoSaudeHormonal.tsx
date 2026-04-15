import SEOHead from "@/components/SEOHead";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AtendimentoTemplate from "@/components/AtendimentoTemplate";

const AtendimentoSaudeHormonal = () => {
  return (
    <main className="min-h-screen bg-background">
      <SEOHead
        title="Saúde Hormonal Feminina"
        description="Atendimento clínico para sintomas da perimenopausa e menopausa — sono, humor, energia, peso, ciclo. Com Dra. Júlia Longo, Kobrasol, São José SC."
        path="/atendimento/saude-hormonal-feminina"
      />
      <Header />

      <AtendimentoTemplate
        title="Saúde hormonal feminina"
        doctor="Dra. Júlia Longo Rodrigues Schmitz"
        crm="CRM/SC 34242"
        paraQuem={[
          "Sintomas da perimenopausa — ondas de calor, insônia, alterações de humor, ganho de peso",
          "Menopausa com impacto significativo na qualidade de vida",
          "Alterações do ciclo menstrual sem investigação adequada",
          "Fadiga, perda de libido, ressecamento e outros sintomas hormonais crônicos",
          "[Placeholder — adicionar situação clínica específica]",
        ]}
        paraNao={[
          "Casos que exigem acompanhamento ginecológico cirúrgico — encaminhamos para ginecologista",
          "Pacientes com câncer hormônio-dependente ativo — requer acompanhamento oncológico",
          "[Placeholder — adicionar limite adicional]",
        ]}
        processo="A avaliação inicial é extensa: histórico hormonal completo, sintomas cronológicos, hábitos de sono, alimentação, atividade física, medicações e exames anteriores. A investigação laboratorial é direcionada pelo quadro clínico. O plano pode incluir ajustes de rotina, suplementação, reposição hormonal quando indicada e segura, e acompanhamento com retornos estruturados."
        abordagem="A abordagem é baseada em princípios da medicina funcional, com foco em entender o cenário hormonal completo — não apenas prescrever hormônios. A transição hormonal feminina é um processo fisiológico; o papel do acompanhamento médico é minimizar impactos e preservar qualidade de vida. Resultados variam individualmente."
        faq={[
          {
            question: "A partir de que idade devo procurar esse atendimento?",
            answer: "[Placeholder — preencher com orientação]",
          },
          {
            question: "Preciso trazer exames anteriores?",
            answer: "[Placeholder — preencher com orientação]",
          },
          {
            question: "Toda mulher na menopausa precisa de reposição hormonal?",
            answer: "[Placeholder — preencher de forma equilibrada e sem promessa]",
          },
          {
            question: "O atendimento é pelo convênio?",
            answer: "[Placeholder — preencher]",
          },
        ]}
        whatsappMessage="Olá, vim pela página de saúde hormonal feminina e gostaria de agendar uma avaliação com Dra. Júlia."
      />

      <Footer />
    </main>
  );
};

export default AtendimentoSaudeHormonal;
