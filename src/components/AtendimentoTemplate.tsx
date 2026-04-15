import WhatsAppCTA from "@/components/WhatsAppCTA";
import { Helmet } from "react-helmet-async";

interface FAQ {
  question: string;
  answer: string;
}

interface AtendimentoTemplateProps {
  title: string;
  doctor: string;
  crm: string;
  paraQuem: string[];
  paraNao: string[];
  processo: string;
  abordagem: string;
  faq: FAQ[];
  whatsappMessage: string;
}

const AtendimentoTemplate = ({
  title,
  doctor,
  crm,
  paraQuem,
  paraNao,
  processo,
  abordagem,
  faq,
  whatsappMessage,
}: AtendimentoTemplateProps) => {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq
      .filter((f) => !f.answer.startsWith("[Placeholder"))
      .map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: { "@type": "Answer", text: f.answer },
      })),
  };

  return (
    <>
      {faqSchema.mainEntity.length > 0 && (
        <Helmet>
          <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
        </Helmet>
      )}

      <section className="section-padding pt-32">
        <div className="container-content max-w-3xl">
          {/* H1 + Doctor */}
          <div className="space-y-3 mb-16">
            <h1 className="font-display text-4xl md:text-5xl font-semibold text-foreground">
              {title}
            </h1>
            <p className="text-accent text-lg">
              Atendimento com {doctor} — {crm}
            </p>
          </div>

          {/* Para quem é */}
          <div className="mb-12 space-y-4">
            <h2 className="font-display text-2xl font-semibold text-foreground">
              Para quem é
            </h2>
            <ul className="space-y-3">
              {paraQuem.map((item, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 text-muted-foreground"
                >
                  <span className="w-1.5 h-1.5 bg-accent rounded-full mt-2 shrink-0" />
                  <span className="text-sm leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Para quem NÃO é */}
          <div className="mb-12 space-y-4">
            <h2 className="font-display text-2xl font-semibold text-foreground">
              Para quem não é
            </h2>
            <ul className="space-y-3">
              {paraNao.map((item, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 text-muted-foreground"
                >
                  <span className="w-1.5 h-1.5 bg-border rounded-full mt-2 shrink-0" />
                  <span className="text-sm leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* O que esperar */}
          <div className="mb-12 space-y-4">
            <h2 className="font-display text-2xl font-semibold text-foreground">
              O que esperar do processo
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {processo}
            </p>
          </div>

          {/* Sobre a abordagem */}
          <div className="mb-12 space-y-4">
            <h2 className="font-display text-2xl font-semibold text-foreground">
              Sobre a abordagem
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {abordagem}
            </p>
          </div>

          {/* FAQ */}
          <div className="mb-12 space-y-6">
            <h2 className="font-display text-2xl font-semibold text-foreground">
              Perguntas frequentes
            </h2>
            <div className="space-y-4">
              {faq.map((item, i) => (
                <div key={i} className="card-elegant">
                  <h3 className="font-medium text-foreground text-sm mb-2">
                    {item.question}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="mb-12">
            <WhatsAppCTA message={whatsappMessage} />
          </div>

          {/* Disclaimer */}
          <div className="border-t border-border pt-8">
            <p className="text-xs text-muted-foreground leading-relaxed">
              Resultados variam individualmente. Avaliação médica é obrigatória.
              Este conteúdo é informativo e não substitui consulta presencial.
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default AtendimentoTemplate;
