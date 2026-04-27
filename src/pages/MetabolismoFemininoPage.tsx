import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import SEO from "@/components/SEO";
import SectionReveal from "@/components/SectionReveal";
import { ArrowRight, Check, Phone } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

const WA_LINK =
  "https://wa.me/5548988064337?text=Ol%C3%A1%2C%20vim%20pela%20p%C3%A1gina%20de%20metabolismo%20feminino%20e%20gostaria%20de%20agendar%20uma%20avalia%C3%A7%C3%A3o.";

const symptoms = [
  "Peso que não sai mesmo com dieta e exercício",
  "Cansaço constante sem causa aparente",
  "Inchaço e retenção que variam com o ciclo",
  "Dificuldade de dormir bem",
  "Queda de cabelo fora do normal",
  "Ansiedade ou irritabilidade aumentadas",
  "Libido reduzida",
  "Sensação de que seu corpo mudou depois dos 35 ou 40",
];

const steps = [
  {
    n: "01",
    title: "Consulta inicial completa",
    body: "Escuta clínica extensa, histórico de saúde, sintomas e objetivos. Sem pressa, sem protocolo genérico.",
  },
  {
    n: "02",
    title: "Investigação laboratorial",
    body: "Exames metabólicos e hormonais direcionados ao seu perfil. A conduta segue os dados — não o contrário.",
  },
  {
    n: "03",
    title: "Plano individualizado",
    body: "Estratégia personalizada: alimentar, de movimento, medicamentos se indicados e acompanhamento periódico.",
  },
];

const faq = [
  {
    q: "Preciso ter diagnóstico de doença para ser atendida?",
    a: "Não. Muitas pacientes chegam apenas com queixas vagas e sintomas que impactam qualidade de vida. A avaliação parte da sua história, não de rótulos.",
  },
  {
    q: "A clínica prescribe tirzepatida ou semaglutida?",
    a: "Medicamentos para emagrecimento são avaliados caso a caso. A indicação depende do perfil clínico, exames e objetivos. Não prescrevemos sem avaliação.",
  },
  {
    q: "Como funciona o acompanhamento?",
    a: "As consultas de retorno acompanham exames, evolução de peso e composição corporal, ajuste de conduta e suporte contínuo.",
  },
  {
    q: "O atendimento é presencial ou online?",
    a: "Presencial em São José (SC). Algumas consultas de retorno podem ser realizadas por telemedicina, conforme avaliação médica.",
  },
];

const MetabolismoFemininoPage = () => (
  <main className="min-h-screen bg-background">
    <SEO
      title="Avaliação de Metabolismo Feminino — São José SC | Curae Santé"
      description="Emagrecimento que não acontece, cansaço, alterações hormonais. A Curae Santé investiga a causa com avaliação metabólica completa em São José, SC. Agende sua consulta."
      path="/metabolismo-feminino"
      faq={faq.map(({ q, a }) => ({ question: q, answer: a }))}
    />
    <Header />

    {/* Hero */}
    <section className="section-padding pt-32 md:pt-40 bg-background relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gold/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-rose/5 rounded-full blur-3xl" />
      </div>
      <div className="container-content px-4 md:px-8 max-w-4xl mx-auto relative z-10">
        <div className="text-center space-y-6">
          <span className="inline-block px-4 py-2 bg-gold/10 rounded-full text-sm font-medium text-gold-dark">
            Metabolismo feminino · São José SC
          </span>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground leading-tight">
            Seu corpo mudou.<br />
            <span className="text-gold italic">A causa tem nome.</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Peso que não sai, cansaço constante, alterações do ciclo, queda de cabelo — podem ser sinais de desequilíbrio metabólico ou hormonal. A Curae Santé investiga, com avaliação clínica e laboratorial, antes de qualquer conduta.
          </p>
          <div className="flex justify-center pt-2">
            <a
              href={WA_LINK}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent("whatsapp_click", { location: "hero_metabolismo" })}
              className="inline-flex items-center gap-3 bg-gold hover:bg-gold-dark text-foreground font-semibold text-lg px-8 py-4 rounded-full transition-colors shadow-lg"
            >
              <Phone size={20} />
              Quero agendar minha avaliação
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
          <p className="text-sm text-muted-foreground/70">
            Atendimento presencial em Kobrasol, São José/SC · Consulta médica individual
          </p>
        </div>
      </div>
    </section>

    {/* Sintomas */}
    <SectionReveal delayMs={40}>
      <section className="section-padding bg-card">
        <div className="container-content px-4 md:px-8 max-w-4xl mx-auto">
          <div className="text-center mb-10 space-y-3">
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground">
              Você se identifica com{" "}
              <span className="text-gold italic">algum desses sintomas?</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Isolados ou combinados, esses sinais merecem investigação — não suposições.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-3 max-w-3xl mx-auto">
            {symptoms.map((s) => (
              <div
                key={s}
                className="flex items-start gap-3 bg-background rounded-xl px-5 py-4 border border-border"
              >
                <div className="w-6 h-6 rounded-full bg-gold/10 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5 text-gold" strokeWidth={3} />
                </div>
                <p className="text-sm text-foreground/80 leading-relaxed">{s}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <a
              href={WA_LINK}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent("whatsapp_click", { location: "sintomas_metabolismo" })}
              className="inline-flex items-center gap-2 bg-gold hover:bg-gold-dark text-foreground font-semibold px-7 py-3.5 rounded-full transition-colors"
            >
              Agendar avaliação
              <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </section>
    </SectionReveal>

    {/* Como funciona */}
    <SectionReveal delayMs={80}>
      <section className="section-padding bg-background">
        <div className="container-content px-4 md:px-8 max-w-4xl mx-auto">
          <div className="text-center mb-12 space-y-3">
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground">
              Como é o{" "}
              <span className="text-gold italic">atendimento</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {steps.map((step) => (
              <div
                key={step.n}
                className="card-elegant space-y-4"
              >
                <span className="font-display text-4xl font-semibold text-gold/40">
                  {step.n}
                </span>
                <h3 className="font-display text-xl font-semibold text-foreground">
                  {step.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </SectionReveal>

    {/* CTA intermediário */}
    <SectionReveal delayMs={100}>
      <section className="section-padding bg-card">
        <div className="container-content px-4 md:px-8 max-w-3xl mx-auto text-center space-y-5">
          <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground">
            A investigação começa <span className="text-gold italic">na primeira consulta</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Nenhuma conduta antes de entender o que está acontecendo. Avaliação clínica e laboratorial completa, plano feito para você.
          </p>
          <a
            href={WA_LINK}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent("whatsapp_click", { location: "mid_cta_metabolismo" })}
            className="inline-flex items-center gap-3 bg-gold hover:bg-gold-dark text-foreground font-semibold text-lg px-8 py-4 rounded-full transition-colors shadow-lg"
          >
            <Phone size={20} />
            Quero investigar meu metabolismo
          </a>
          <p className="text-sm text-muted-foreground/70">
            Curae Santé · Kobrasol, São José SC · +55 48 8806-4337
          </p>
        </div>
      </section>
    </SectionReveal>

    {/* FAQ */}
    <SectionReveal delayMs={120}>
      <section className="section-padding bg-background">
        <div className="container-content px-4 md:px-8 max-w-3xl mx-auto">
          <div className="text-center mb-10 space-y-3">
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground">
              Perguntas <span className="text-gold italic">frequentes</span>
            </h2>
          </div>

          <div className="space-y-3">
            {faq.map((item) => (
              <details
                key={item.q}
                className="group rounded-2xl border border-border bg-card overflow-hidden"
              >
                <summary className="flex justify-between items-center px-6 py-5 cursor-pointer font-medium text-foreground list-none select-none gap-4">
                  <span>{item.q}</span>
                  <span className="text-gold text-xl shrink-0 transition-transform group-open:rotate-45">+</span>
                </summary>
                <div className="px-6 pb-5 text-muted-foreground leading-relaxed text-sm">
                  {item.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>
    </SectionReveal>

    {/* CTA final */}
    <SectionReveal delayMs={140}>
      <section className="section-padding bg-card">
        <div className="container-content px-4 md:px-8 max-w-2xl mx-auto text-center space-y-6">
          <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground leading-snug">
            O próximo passo é simples
          </h2>
          <p className="text-lg text-muted-foreground">
            Mande uma mensagem. Nossa equipe responde e ajuda a agendar a consulta de avaliação.
          </p>
          <a
            href={WA_LINK}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent("whatsapp_click", { location: "bottom_cta_metabolismo" })}
            className="inline-flex items-center gap-3 bg-gold hover:bg-gold-dark text-foreground font-semibold text-lg px-8 py-4 rounded-full transition-colors shadow-lg"
          >
            <Phone size={20} />
            Agendar no WhatsApp
            <ArrowRight size={18} />
          </a>
        </div>
      </section>
    </SectionReveal>

    <Footer />
    <WhatsAppButton />
  </main>
);

export default MetabolismoFemininoPage;
