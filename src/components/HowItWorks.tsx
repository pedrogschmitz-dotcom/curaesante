import { Clock, Ear, ClipboardList, Compass } from "lucide-react";

const steps = [
  {
    icon: Clock,
    title: "Tempo de consulta",
    description: "Consulta longa, sem pressa. Espaço real para escutar a sua história.",
  },
  {
    icon: Ear,
    title: "Escuta clínica",
    description: "Anamnese cuidadosa para entender o contexto, não apenas o sintoma.",
  },
  {
    icon: ClipboardList,
    title: "Investigação",
    description: "Exames e raciocínio clínico para chegar à raiz do que está acontecendo.",
  },
  {
    icon: Compass,
    title: "Plano individualizado",
    description: "Estratégia construída com você, com explicação clara de cada passo.",
  },
];

const HowItWorks = () => {
  return (
    <section className="section-padding bg-background">
      <div className="container-content px-4 md:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <span className="inline-block px-4 py-2 bg-gold/10 rounded-full text-sm font-medium text-gold-dark">
                Como funciona
              </span>
              <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground">
                Um atendimento <span className="text-gold italic">diferente do padrão</span>
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Consulta sem pressa, com escuta, explicação clara e plano construído para você.
                Cada passo é discutido, e você sai entendendo o que está acontecendo e o que vem a seguir.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {steps.map((step, i) => (
                <div
                  key={step.title}
                  className="space-y-2"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gold/10 rounded-lg flex items-center justify-center">
                      <step.icon className="w-5 h-5 text-gold" />
                    </div>
                    <h3 className="font-display text-xl font-semibold text-foreground">
                      {step.title}
                    </h3>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed pl-13">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Image */}
          <div className="relative">
            <div className="relative aspect-[4/5] max-w-md mx-auto">
              <div className="absolute inset-0 bg-gold/10 rounded-[2.5rem] transform rotate-3" />
              <div className="relative bg-card rounded-[2.5rem] shadow-card overflow-hidden h-full">
                <img
                  src={`${import.meta.env.BASE_URL}lovable-uploads/dff79888-e876-4e1e-927b-e281cb68964d.jpg`}
                  alt="Ambiente de consulta da Curae Santé em Kobrasol"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/30 to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
