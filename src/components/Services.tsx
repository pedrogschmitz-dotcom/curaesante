import { Stethoscope, Scale, Sparkles, ArrowRight } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

const services = [
  {
    icon: Stethoscope,
    title: "Saúde clínica",
    description:
      "Consulta médica ampla com investigação, raciocínio clínico e acompanhamento contínuo.",
    features: [
      "Avaliação clínica completa",
      "Investigação de sintomas persistentes",
      "Acompanhamento de condições comuns",
      "Cuidado preventivo e check-up",
    ],
  },
  {
    icon: Scale,
    title: "Emagrecimento e metabolismo",
    description:
      "Avaliação metabólica e plano individualizado para emagrecimento sustentável e mais energia.",
    features: [
      "Avaliação metabólica",
      "Plano de emagrecimento individualizado",
      "Suporte para energia e disposição",
      "Saúde hormonal feminina",
    ],
  },
  {
    icon: Sparkles,
    title: "Saúde da pele",
    description:
      "Cuidados com a pele com foco em naturalidade, qualidade de pele e contorno facial harmonioso.",
    features: [
      "Rugas e marcas de expressão",
      "Firmeza e flacidez",
      "Contorno facial",
      "Qualidade da pele",
    ],
  },
];

const Services = () => {
  return (
    <section id="servicos" className="section-padding bg-background">
      <div className="container-content px-4 md:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
          <span className="inline-block px-4 py-2 bg-gold/10 rounded-full text-sm font-medium text-gold-dark">
            Áreas de cuidado
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground">
            O que cuidamos com <span className="text-gold italic">você</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Três frentes de atendimento conectadas pelo mesmo princípio: tempo, escuta e plano individualizado.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {services.map((service, i) => (
            <div
              key={service.title}
              className="card-elegant hover-lift group flex flex-col"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="w-14 h-14 bg-gold/10 rounded-2xl flex items-center justify-center mb-5 group-hover:bg-gold/20 transition-colors">
                <service.icon className="w-7 h-7 text-gold" />
              </div>

              <h3 className="font-display text-2xl font-semibold text-foreground mb-3">
                {service.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-5">
                {service.description}
              </p>

              <ul className="space-y-2 mb-6">
                {service.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-start gap-2 text-sm text-foreground/80"
                  >
                    <div className="w-1.5 h-1.5 bg-gold rounded-full mt-2 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              <a
                href="https://wa.me/5548988064337?text=Ol%C3%A1%2C%20gostaria%20de%20saber%20mais%20sobre%20a%20Curae%20Sant%C3%A9."
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent("whatsapp_click", { location: `services_${service.title}` })}
                className="inline-flex items-center gap-2 text-gold font-medium mt-auto group/link"
              >
                Falar no WhatsApp
                <ArrowRight
                  size={16}
                  className="group-hover/link:translate-x-1 transition-transform"
                />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
