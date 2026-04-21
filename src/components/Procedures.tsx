import { useState } from "react";
import {
  Syringe,
  Droplets,
  Sparkles,
  Layers,
  HeartPulse,
  Waves,
  Flame,
  Zap,
  Activity,
  ChevronDown,
} from "lucide-react";

type Procedure = {
  icon: typeof Syringe;
  title: string;
  forWho: string;
  improves: string;
  expect: string;
};

const procedures: Procedure[] = [
  {
    icon: Syringe,
    title: "Toxina botulínica",
    forWho: "Quem deseja suavizar marcas de expressão dinâmicas no rosto.",
    improves: "Linhas da testa, ao redor dos olhos e entre as sobrancelhas.",
    expect: "Aplicação rápida em consultório, com efeito gradual nas semanas seguintes. Avaliação médica define indicação e dose.",
  },
  {
    icon: Droplets,
    title: "Preenchimento facial",
    forWho: "Quem busca recuperar volume ou contorno em áreas específicas do rosto.",
    improves: "Sulcos, contorno facial, lábios e regiões com perda de volume.",
    expect: "Procedimento em consultório com anestésico tópico. Resultado avaliado em conjunto, sempre com naturalidade.",
  },
  {
    icon: Sparkles,
    title: "Bioestimuladores",
    forWho: "Quem quer estimular a produção de colágeno da própria pele.",
    improves: "Firmeza, qualidade da pele e suporte estrutural do rosto e corpo.",
    expect: "Resultados graduais ao longo de meses. Plano de sessões definido na avaliação.",
  },
  {
    icon: Layers,
    title: "Peelings",
    forWho: "Quem busca melhora de textura, viço e uniformidade da pele.",
    improves: "Textura, manchas superficiais e renovação celular.",
    expect: "Diferentes profundidades disponíveis. Escolha conforme avaliação da pele e rotina.",
  },
  {
    icon: HeartPulse,
    title: "Saúde hormonal feminina",
    forWho: "Mulheres com sintomas associados a alterações hormonais.",
    improves: "Energia, sono, libido e bem-estar geral, conforme avaliação clínica.",
    expect: "Investigação clínica e laboratorial antes de qualquer conduta. Plano individualizado.",
  },
  {
    icon: Waves,
    title: "Mesoterapia",
    forWho: "Quem busca tratamento localizado para pele ou tecidos específicos.",
    improves: "Hidratação profunda, viço e tratamento de áreas específicas.",
    expect: "Sessões definidas conforme objetivo. Avaliação médica antes de iniciar.",
  },
  {
    icon: Flame,
    title: "Gordura localizada e celulite",
    forWho: "Quem quer abordar áreas específicas de gordura localizada ou celulite.",
    improves: "Contorno corporal e qualidade da pele em regiões específicas.",
    expect: "Plano combinado conforme avaliação. Sem promessa de resultado padronizado.",
  },
  {
    icon: Zap,
    title: "Laser CO2",
    forWho: "Quem busca renovação profunda de pele e melhora de marcas.",
    improves: "Textura, marcas e qualidade da pele.",
    expect: "Procedimento com período de recuperação. Indicação e cuidados pós discutidos em consulta.",
  },
  {
    icon: Activity,
    title: "HIFU",
    forWho: "Quem busca firmeza e lifting sem cirurgia.",
    improves: "Firmeza e contorno em áreas específicas do rosto e corpo.",
    expect: "Sessão única ou poucas sessões, conforme avaliação. Resultado evolui ao longo dos meses.",
  },
];

const Procedures = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="section-padding bg-card">
      <div className="container-content px-4 md:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <span className="inline-block px-4 py-2 bg-gold/10 rounded-full text-sm font-medium text-gold-dark">
            Procedimentos
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground">
            Conheça <span className="text-gold italic">cada procedimento</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Toque em cada card para saber para quem é, o que melhora e o que esperar. Indicação sempre definida em consulta médica.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
          {procedures.map((p, i) => {
            const isOpen = openIndex === i;
            return (
              <button
                key={p.title}
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className={`text-left card-elegant hover-lift transition-all duration-300 ${
                  isOpen ? "ring-2 ring-gold/40 shadow-card" : ""
                }`}
                aria-expanded={isOpen}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 bg-gold/10 rounded-xl flex items-center justify-center shrink-0">
                      <p.icon className="w-5 h-5 text-gold" />
                    </div>
                    <h3 className="font-display text-xl font-semibold text-foreground">
                      {p.title}
                    </h3>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-gold shrink-0 transition-transform duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </div>

                <div
                  className={`grid transition-all duration-300 ${
                    isOpen ? "grid-rows-[1fr] opacity-100 mt-2" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden space-y-3">
                    <div>
                      <p className="text-xs uppercase tracking-wider text-gold-dark/70 font-medium mb-1">
                        Para quem é
                      </p>
                      <p className="text-sm text-muted-foreground leading-relaxed">{p.forWho}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-gold-dark/70 font-medium mb-1">
                        O que melhora
                      </p>
                      <p className="text-sm text-muted-foreground leading-relaxed">{p.improves}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-gold-dark/70 font-medium mb-1">
                        O que esperar
                      </p>
                      <p className="text-sm text-muted-foreground leading-relaxed">{p.expect}</p>
                    </div>
                    {/* Slot reservado para vídeo curto explicativo futuro */}
                    {/* <div className="aspect-video bg-muted rounded-lg" /> */}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <p className="text-center text-sm text-muted-foreground/80 mt-10 max-w-2xl mx-auto">
          Conteúdo informativo. Indicação, técnica e expectativa de resultado dependem de avaliação médica individual.
        </p>
      </div>
    </section>
  );
};

export default Procedures;
