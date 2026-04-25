import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Paciente de São José",
    text: "Atendimento humano e sem pressa. Saí entendendo meu caso e com plano claro.",
  },
  {
    name: "Paciente de Kobrasol",
    text: "Finalmente um acompanhamento que olha o todo, não só o sintoma isolado.",
  },
  {
    name: "Paciente da Grande Florianópolis",
    text: "Equipe atenciosa, explicação objetiva e condutas com naturalidade.",
  },
];

const Testimonials = () => {
  return (
    <section className="section-padding bg-card" aria-labelledby="depoimentos-titulo">
      <div className="container-content px-4 md:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <span className="inline-block px-4 py-2 bg-gold/10 rounded-full text-sm font-medium text-gold-dark">
            Experiência de pacientes
          </span>
          <h2 id="depoimentos-titulo" className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground">
            O que nossos <span className="text-gold italic">pacientes relatam</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Relatos sobre escuta clínica, clareza no plano e cuidado contínuo.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {testimonials.map((item) => (
            <article key={item.name} className="card-elegant space-y-4">
              <div className="flex items-center gap-1 text-gold">
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
              </div>
              <p className="text-muted-foreground leading-relaxed">“{item.text}”</p>
              <p className="text-sm font-medium text-foreground">{item.name}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
