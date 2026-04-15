import SEOHead from "@/components/SEOHead";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AtendimentoTemplate from "@/components/AtendimentoTemplate";

const AtendimentoSaudePele = () => {
  return (
    <main className="min-h-screen bg-background">
      <SEOHead
        title="Saúde da Pele"
        description="Atendimento clínico para quadros persistentes de pele — acne adulta, rosácea, queda capilar, melasma. Com Dr. Pedro Schmitz, Kobrasol, São José SC."
        path="/atendimento/saude-da-pele"
      />
      <Header />

      <AtendimentoTemplate
        title="Saúde da pele"
        doctor="Dr. Pedro Schmitz"
        crm="CRM/SC 38229"
        paraQuem={[
          "Acne adulta que não responde aos tratamentos habituais",
          "Rosácea com crises frequentes e sem controle duradouro",
          "Queda capilar progressiva sem causa identificada",
          "Melasma que persiste apesar de cuidados constantes",
          "Dermatites recorrentes e pele reativa sem diagnóstico claro",
          "[Placeholder — adicionar situação clínica específica]",
        ]}
        paraNao={[
          "Procedimentos cirúrgicos — encaminhamos para cirurgião quando necessário",
          "Urgências agudas de pele que exigem pronto-atendimento",
          "[Placeholder — adicionar limite adicional]",
        ]}
        processo="A primeira consulta é extensa: revisamos histórico dermatológico completo, hábitos de rotina, histórico hormonal e metabólico, medicações em uso e tentativas anteriores. A partir desse mapeamento, solicitamos exames direcionados — sem pacote padrão. O plano terapêutico é montado individualmente, com retornos programados para ajuste conforme a resposta da pele."
        abordagem="O foco é entender por que a pele não responde, não apenas tratar o sintoma visível. Muitos quadros de pele persistentes têm causas sistêmicas — hormonais, metabólicas, inflamatórias — que só aparecem quando a investigação é ampla o suficiente. Não prometemos resultados específicos; prometemos um processo clínico completo."
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
            question: "Em quanto tempo costumo ver mudanças?",
            answer: "[Placeholder — preencher de forma realista, sem promessa de resultado]",
          },
          {
            question: "O atendimento é pelo convênio?",
            answer: "[Placeholder — preencher]",
          },
        ]}
        whatsappMessage="Olá, vim pela página de saúde da pele e gostaria de agendar uma avaliação com Dr. Pedro."
      />

      <Footer />
    </main>
  );
};

export default AtendimentoSaudePele;
