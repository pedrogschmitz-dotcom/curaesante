import SEOHead from "@/components/SEOHead";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ServiceCard from "@/components/ServiceCard";
import WhatsAppCTA from "@/components/WhatsAppCTA";
import { Link } from "react-router-dom";
import { ArrowRight, MapPin, Phone, Clock } from "lucide-react";
import drPedroImage from "@/assets/dr-pedro.jpeg";
import draJuliaImage from "@/assets/dra-julia.jpeg";

const services = [
  {
    title: "Saúde da pele",
    subtitle: "com Dr. Pedro Schmitz",
    description:
      "Atendimento clínico para quadros persistentes de pele — acne adulta, rosácea, queda capilar, melasma, dermatites.",
    to: "/atendimento/saude-da-pele",
  },
  {
    title: "Emagrecimento e saúde metabólica",
    subtitle: "com Dra. Júlia Longo Rodrigues Schmitz",
    description:
      "Atendimento clínico para dificuldade de emagrecer, resistência insulínica, síndrome metabólica, fadiga e alterações de energia.",
    to: "/atendimento/emagrecimento-metabolico",
  },
  {
    title: "Saúde hormonal feminina",
    subtitle: "com Dra. Júlia Longo Rodrigues Schmitz",
    description:
      "Atendimento clínico para sintomas da perimenopausa e menopausa — sono, humor, energia, peso, ciclo.",
    to: "/atendimento/saude-hormonal-feminina",
  },
];

const qualificationCards = [
  "Sintomas de pele que voltam — acne adulta, rosácea, queda de cabelo, melasma — e nenhuma abordagem duradoura",
  "Dificuldade persistente de emagrecer, mesmo tentando tudo o que já indicaram",
  "Sintomas da menopausa ou da perimenopausa afetando sono, humor, energia e peso",
  "Fadiga, alterações de humor, sintomas metabólicos — e exames que vêm 'dentro do normal'",
];

const processSteps = [
  {
    number: "01",
    title: "Avaliação clínica extensa",
    description:
      "Anamnese detalhada, histórico de vida, linha do tempo dos sintomas.",
  },
  {
    number: "02",
    title: "Investigação direcionada",
    description:
      "Exames e avaliações conforme o quadro justificar, sem pacote padrão.",
  },
  {
    number: "03",
    title: "Plano terapêutico individual",
    description:
      "Nutrição, mudanças de rotina, medicação quando indicada, acompanhamento próximo.",
  },
  {
    number: "04",
    title: "Retornos estruturados",
    description: "Ajustes conforme a resposta do corpo ao plano.",
  },
];

const Index = () => {
  return (
    <main className="min-h-screen bg-background">
      <SEOHead
        title="Clínica Médica"
        description="Consulta clínica extensa para quem busca respostas reais. Saúde da pele, emagrecimento e saúde hormonal feminina. Kobrasol, São José — SC."
        path="/"
      />
      <Header />

      {/* === HERO === */}
      <section className="relative min-h-screen flex items-center pt-20">
        <div className="container-content">
          <div className="max-w-3xl space-y-8">
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground leading-[1.15]">
              Consulta clínica extensa — o tempo que uma investigação real exige
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed">
              Para quem já tentou outros caminhos e ainda não tem respostas.
              <br />
              Clínica médica em Kobrasol, São José — SC.
            </p>
            <div className="flex flex-col sm:flex-row items-start gap-4 pt-2">
              <WhatsAppCTA />
              <a
                href="#como-funciona"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-2 py-3"
              >
                Como funciona
                <ArrowRight size={14} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* === QUALIFICAÇÃO === */}
      <section className="section-padding">
        <div className="container-content">
          <div className="max-w-3xl mx-auto text-center mb-12 space-y-3">
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground">
              Quando a rotina médica não dá respostas
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {qualificationCards.map((text, i) => (
              <div
                key={i}
                className="card-elegant p-5"
              >
                <p className="text-sm text-foreground/90 leading-relaxed">
                  {text}
                </p>
              </div>
            ))}
          </div>
          <p className="text-center text-muted-foreground text-sm mt-8 max-w-2xl mx-auto leading-relaxed">
            Se alguma dessas situações bate com a sua, a investigação clínica
            começa por entender o quadro inteiro, não sintoma a sintoma.
          </p>
        </div>
      </section>

      {/* === COMO FUNCIONA === */}
      <section id="como-funciona" className="section-padding bg-card">
        <div className="container-content">
          <div className="max-w-3xl mx-auto text-center mb-12 space-y-3">
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground">
              Um processo clínico, não um atendimento rápido
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {processSteps.map((step) => (
              <div key={step.number} className="space-y-3">
                <span className="font-display text-3xl font-semibold text-accent">
                  {step.number}
                </span>
                <h3 className="font-display text-lg font-semibold text-foreground">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* === FRENTES DE ATENDIMENTO === */}
      <section className="section-padding">
        <div className="container-content">
          <div className="max-w-3xl mx-auto text-center mb-12 space-y-3">
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground">
              Duas frentes clínicas complementares
            </h2>
            <p className="text-muted-foreground">
              Mesma postura, objetos diferentes.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {services.map((service) => (
              <ServiceCard key={service.to} {...service} />
            ))}
          </div>
        </div>
      </section>

      {/* === EQUIPE === */}
      <section className="section-padding bg-card">
        <div className="container-content">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground">
              Quem atende
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Dr. Pedro */}
            <div className="card-elegant p-0 overflow-hidden">
              <div className="aspect-[4/5] overflow-hidden">
                <img
                  src={drPedroImage}
                  alt="Dr. Pedro Schmitz — Médico"
                  className="w-full h-full object-cover object-[center_30%]"
                />
              </div>
              <div className="p-6 space-y-3">
                <div>
                  <h3 className="font-display text-xl font-semibold text-foreground">
                    Dr. Pedro Schmitz
                  </h3>
                  <p className="text-sm text-accent">Médico — CRM/SC 38229</p>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Atendimento clínico com foco em saúde da pele e clínica médica geral.
                </p>
                <Link
                  to="/equipe#pedro"
                  className="inline-flex items-center gap-2 text-sm font-medium text-accent hover:gap-3 transition-all"
                >
                  Ver perfil <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            {/* Dra. Júlia */}
            <div className="card-elegant p-0 overflow-hidden">
              <div className="aspect-[4/5] overflow-hidden">
                <img
                  src={draJuliaImage}
                  alt="Dra. Júlia Longo Rodrigues Schmitz — Médica"
                  className="w-full h-full object-cover object-[center_30%]"
                />
              </div>
              <div className="p-6 space-y-3">
                <div>
                  <h3 className="font-display text-xl font-semibold text-foreground">
                    Dra. Júlia Longo Rodrigues Schmitz
                  </h3>
                  <p className="text-sm text-accent">Médica — CRM/SC 34242</p>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Atendimento clínico com foco em emagrecimento, saúde metabólica e
                  transição hormonal feminina. Abordagem baseada em princípios da
                  medicina funcional.
                </p>
                <Link
                  to="/equipe#julia"
                  className="inline-flex items-center gap-2 text-sm font-medium text-accent hover:gap-3 transition-all"
                >
                  Ver perfil <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* === LOCALIZAÇÃO E CTA FINAL === */}
      <section className="section-padding">
        <div className="container-content">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div className="space-y-6">
              <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground">
                Localização e contato
              </h2>
              <div className="space-y-4 text-sm text-muted-foreground">
                <div className="flex items-start gap-3">
                  <MapPin size={18} className="text-accent shrink-0 mt-0.5" />
                  <span>
                    Av. Delamar José da Silva, 186, loja 03
                    <br />Kobrasol, São José/SC — CEP 88102-100
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock size={18} className="text-accent shrink-0" />
                  <span>Segunda a sexta, 9h às 18h</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone size={18} className="text-accent shrink-0" />
                  <a
                    href="https://wa.me/5548988064337"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-foreground transition-colors"
                  >
                    +55 48 98806-4337
                  </a>
                </div>
              </div>
              <WhatsAppCTA />
            </div>

            <div className="rounded-xl overflow-hidden border border-border h-[350px]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d883.9!2d-48.6195!3d-27.5935!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95274090e0c2c3c9%3A0x0!2sAv.+Delamar+Jos%C3%A9+da+Silva%2C+186+-+Kobrasol%2C+S%C3%A3o+Jos%C3%A9+-+SC%2C+88102-100!5e0!3m2!1spt-BR!2sbr!4v1702300000000"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Localização Curae Santé — Kobrasol, São José SC"
              />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default Index;
