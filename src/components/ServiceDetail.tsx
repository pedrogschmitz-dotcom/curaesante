import { ArrowRight, Check } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

const WA_BASE = "https://wa.me/5548988064337";

type ServiceGroup = {
  id: string;
  badge: string;
  heading: string;
  headingAccent: string;
  description: string;
  bullets: string[];
  ctaLabel: string;
  ctaMessage: string;
  reverse?: boolean;
  accentColor: "gold" | "rose" | "teal";
};

const groups: ServiceGroup[] = [
  {
    id: "emagrecimento",
    badge: "Emagrecimento & Metabolismo",
    heading: "Emagrecimento com",
    headingAccent: "investigação clínica",
    description:
      "Não existe protocolo genérico aqui. A abordagem começa pela investigação das causas: resistência insulínica, disfunções hormonais, padrão alimentar e ritmo de vida. Medicamentos como tirzepatida ou semaglutida podem compor o plano, sempre com indicação e acompanhamento médico contínuo.",
    bullets: [
      "Avaliação metabólica completa na primeira consulta",
      "Plano individualizado com ou sem medicamentos",
      "Acompanhamento periódico de composição corporal",
      "Suporte para mulheres na perimenopausa",
    ],
    ctaLabel: "Quero avaliar meu metabolismo",
    ctaMessage:
      "Olá, gostaria de agendar uma avaliação de emagrecimento e metabolismo na Curae Santé.",
    accentColor: "gold",
  },
  {
    id: "hormonal",
    badge: "Saúde Hormonal Feminina",
    heading: "Equilíbrio hormonal com",
    headingAccent: "base clínica",
    description:
      "Irritabilidade, insônia, queda de libido, ganho de peso sem explicação — sintomas frequentemente negligenciados. A Curae Santé investiga o perfil hormonal de cada paciente e, quando indicado, propõe reposição com implantes hormonais ou outras estratégias, sempre com acompanhamento rigoroso.",
    bullets: [
      "Avaliação de perimenopausa e menopausa",
      "Implante hormonal (testosterona, estradiol) com indicação médica",
      "Dosagem laboratorial antes e após a conduta",
      "Plano ajustado a cada fase da vida",
    ],
    ctaLabel: "Quero investigar minha saúde hormonal",
    ctaMessage:
      "Olá, gostaria de agendar uma consulta para avaliação de saúde hormonal na Curae Santé.",
    reverse: true,
    accentColor: "rose",
  },
  {
    id: "estetica",
    badge: "Saúde da Pele & Estética Avançada",
    heading: "Procedimentos com",
    headingAccent: "naturalidade e técnica",
    description:
      "Botox, ácido hialurônico, bioestimuladores de colágeno — aplicados com planejamento anatômico e objetivo de manter proporção e frescor, não artificialidade. Cada procedimento é precedido por avaliação médica, indicação clara e expectativas alinhadas.",
    bullets: [
      "Toxina botulínica para expressão e prevenção",
      "Preenchimento facial com ácido hialurônico",
      "Bioestimuladores de colágeno (Sculptra, Radiesse)",
      "Peelings e tratamentos de renovação celular",
    ],
    ctaLabel: "Quero avaliar procedimentos estéticos",
    ctaMessage:
      "Olá, gostaria de agendar uma avaliação para procedimentos estéticos na Curae Santé.",
    accentColor: "teal",
  },
];

const accentMap = {
  gold: {
    badge: "bg-gold/10 text-gold-dark",
    heading: "text-gold",
    check: "text-gold",
    checkBg: "bg-gold/10",
    cta: "bg-gold hover:bg-gold-dark text-foreground",
    panel: "from-gold/5 to-gold/10",
    border: "border-gold/20",
  },
  rose: {
    badge: "bg-rose/10 text-rose",
    heading: "text-rose",
    check: "text-rose",
    checkBg: "bg-rose/10",
    cta: "bg-rose hover:bg-rose/90 text-white",
    panel: "from-rose/5 to-rose/10",
    border: "border-rose/20",
  },
  teal: {
    badge: "bg-teal-500/10 text-teal-600",
    heading: "text-teal-600",
    check: "text-teal-600",
    checkBg: "bg-teal-500/10",
    cta: "bg-teal-600 hover:bg-teal-700 text-white",
    panel: "from-teal-500/5 to-teal-500/10",
    border: "border-teal-500/20",
  },
};

const ServiceDetail = () => (
  <section className="section-padding bg-background">
    <div className="container-content px-4 md:px-8 space-y-20 md:space-y-28">
      {groups.map((group) => {
        const acc = accentMap[group.accentColor];
        const isReverse = group.reverse;

        return (
          <div
            key={group.id}
            id={group.id}
            className={`grid md:grid-cols-2 gap-10 md:gap-16 items-center ${
              isReverse ? "md:[direction:rtl]" : ""
            }`}
          >
            {/* Painel visual */}
            <div
              className={`rounded-3xl border ${acc.border} bg-gradient-to-br ${acc.panel} p-8 md:p-10 flex flex-col gap-6 ${
                isReverse ? "[direction:ltr]" : ""
              }`}
            >
              <span
                className={`inline-block self-start px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider ${acc.badge}`}
              >
                {group.badge}
              </span>
              <div className="space-y-2">
                {group.bullets.map((b) => (
                  <div key={b} className="flex items-start gap-3">
                    <div
                      className={`w-6 h-6 rounded-full ${acc.checkBg} flex items-center justify-center shrink-0 mt-0.5`}
                    >
                      <Check className={`w-3.5 h-3.5 ${acc.check}`} strokeWidth={3} />
                    </div>
                    <p className="text-sm text-foreground/80 leading-relaxed">{b}</p>
                  </div>
                ))}
              </div>

              <a
                href={`${WA_BASE}?text=${encodeURIComponent(group.ctaMessage)}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  trackEvent("whatsapp_click", { location: `service_detail_${group.id}` })
                }
                className={`mt-2 inline-flex items-center gap-2 self-start px-5 py-2.5 rounded-full text-sm font-semibold transition-colors ${acc.cta}`}
              >
                {group.ctaLabel}
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            {/* Texto editorial */}
            <div
              className={`space-y-5 ${isReverse ? "[direction:ltr]" : ""}`}
            >
              <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground leading-snug">
                {group.heading}{" "}
                <span className={`italic ${acc.heading}`}>{group.headingAccent}</span>
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {group.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  </section>
);

export default ServiceDetail;
