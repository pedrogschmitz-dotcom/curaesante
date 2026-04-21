import { Search, BatteryLow, Scale, HeartHandshake, Sparkles } from "lucide-react";

const items = [
  {
    icon: Search,
    text: "Já passou por vários atendimentos e não resolveu",
  },
  {
    icon: BatteryLow,
    text: "Cansaço constante ou baixa energia",
  },
  {
    icon: Scale,
    text: "Dificuldade para emagrecer",
  },
  {
    icon: HeartHandshake,
    text: "Quer um acompanhamento mais próximo",
  },
  {
    icon: Sparkles,
    text: "Quer melhorar a aparência com naturalidade",
  },
];

const Identification = () => {
  return (
    <section className="section-padding bg-card">
      <div className="container-content px-4 md:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <span className="inline-block px-4 py-2 bg-gold/10 rounded-full text-sm font-medium text-gold-dark">
            Talvez você esteja aqui porque
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground">
            Se você se <span className="text-gold italic">identifica</span> com isso
          </h2>
          <p className="text-lg text-muted-foreground">
            Atendimento pensado para quem quer entender o que está acontecendo, não apenas silenciar o sintoma.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 max-w-4xl mx-auto">
          {items.map((item, i) => (
            <div
              key={item.text}
              className="card-elegant flex items-start gap-4 hover-lift"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <div className="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center shrink-0">
                <item.icon className="w-6 h-6 text-gold" />
              </div>
              <p className="text-foreground/90 leading-relaxed pt-2.5">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Identification;
