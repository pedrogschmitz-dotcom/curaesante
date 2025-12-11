import { Sparkles, Scale, Zap, Rocket, ArrowRight } from "lucide-react";

const Services = () => {
  const services = [
    {
      icon: Sparkles,
      title: "Medicina Estética",
      subtitle: "Dr. Pedro Schmitz",
      description:
        "Procedimentos estéticos faciais e corporais para realçar sua beleza natural com resultados harmoniosos e naturais.",
      features: [
        "Injetáveis (Toxina Botulínica, Preenchedores)",
        "Bioestimuladores de Colágeno",
        "Harmonização Facial",
        "Procedimentos Estéticos Faciais",
        "Procedimentos Corporais",
      ],
      image:
        "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=800&auto=format&fit=crop",
    },
    {
      icon: Zap,
      title: "Tecnologias",
      subtitle: "Dr. Pedro Schmitz",
      description:
        "Tratamentos com equipamentos de última geração para resultados excepcionais em rejuvenescimento e remodelamento corporal.",
      features: [
        "Laser de Alta Tecnologia",
        "Radiofrequência",
        "Ultrassom Microfocado",
        "Criolipólise",
        "Equipamentos de Ponta",
      ],
      image:
        "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=800&auto=format&fit=crop",
    },
    {
      icon: Scale,
      title: "Emagrecimento e Metabolismo",
      subtitle: "Dra. Júlia Longo",
      description:
        "Programas personalizados de emagrecimento com acompanhamento médico completo para conquistar seu peso ideal de forma saudável.",
      features: [
        "Programas Personalizados de Emagrecimento",
        "Avaliação Metabólica Completa",
        "Nutrição Estratégica",
        "Acompanhamento Individualizado",
        "Resultados Sustentáveis",
      ],
      image:
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=800&auto=format&fit=crop",
    },
    {
      icon: Rocket,
      title: "Performance",
      subtitle: "Dra. Júlia Longo",
      description:
        "Otimização de performance física e mental para você alcançar seu máximo potencial com qualidade de vida e longevidade.",
      features: [
        "Otimização de Performance Física",
        "Performance Mental e Cognitiva",
        "Reposição Hormonal",
        "Suplementação Personalizada",
        "Longevidade e Qualidade de Vida",
      ],
      image:
        "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=800&auto=format&fit=crop",
    },
  ];

  return (
    <section id="servicos" className="section-padding bg-background">
      <div className="container-content px-4 md:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="inline-block px-4 py-2 bg-gold/10 rounded-full text-sm font-medium text-gold-dark">
            Nossos Serviços
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground">
            Especialidades para sua{" "}
            <span className="text-gold italic">transformação</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Conheça nossas áreas de atuação e descubra como podemos ajudar você
            a alcançar seus objetivos de saúde e beleza.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <div
              key={service.title}
              className="group card-elegant overflow-hidden hover-lift"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Image */}
              <div className="relative h-56 -mx-6 -mt-6 mb-6 overflow-hidden">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-foreground/20 to-transparent" />
                <div className="absolute bottom-4 left-4 flex items-center gap-3">
                  <div className="w-12 h-12 bg-gold rounded-xl flex items-center justify-center">
                    <service.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-display text-2xl font-semibold text-cream-light">
                      {service.title}
                    </h3>
                    <p className="text-cream-light/80 text-sm">{service.subtitle}</p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  {service.description}
                </p>

                {/* Features */}
                <ul className="space-y-2">
                  {service.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center gap-2 text-sm text-foreground/80"
                    >
                      <div className="w-1.5 h-1.5 bg-gold rounded-full" />
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <a
                  href="https://wa.me/5548988064337"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-gold font-medium pt-2 group/link"
                >
                  Saiba mais
                  <ArrowRight
                    size={18}
                    className="group-hover/link:translate-x-1 transition-transform"
                  />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
