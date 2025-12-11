import { Sparkles, Scale, Stethoscope, Apple, ArrowRight } from "lucide-react";

const Services = () => {
  const services = [
    {
      icon: Sparkles,
      title: "Medicina Estética",
      description:
        "Procedimentos faciais e corporais para realçar sua beleza natural. Harmonização facial, bioestimuladores, toxina botulínica e muito mais.",
      features: [
        "Harmonização Facial",
        "Bioestimuladores de Colágeno",
        "Toxina Botulínica",
        "Preenchimentos",
        "Rejuvenescimento Facial",
      ],
      image:
        "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=800&auto=format&fit=crop",
    },
    {
      icon: Scale,
      title: "Emagrecimento",
      description:
        "Programas personalizados de emagrecimento com acompanhamento médico completo. Conquiste seu peso ideal de forma saudável e sustentável.",
      features: [
        "Avaliação Metabólica",
        "Plano Alimentar Personalizado",
        "Medicamentos para Emagrecimento",
        "Acompanhamento Contínuo",
        "Performance e Energia",
      ],
      image:
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=800&auto=format&fit=crop",
    },
    {
      icon: Stethoscope,
      title: "Dermatologia",
      description:
        "Tratamentos especializados para a saúde e beleza da sua pele. Cuidados clínicos e estéticos com tecnologia de ponta.",
      features: [
        "Tratamento de Acne",
        "Manchas e Melasma",
        "Peeling e Microagulhamento",
        "Laser e Tecnologias",
        "Skincare Personalizado",
      ],
      image:
        "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?q=80&w=800&auto=format&fit=crop",
    },
    {
      icon: Apple,
      title: "Nutrologia",
      description:
        "Avaliação nutricional completa e suplementação inteligente. Otimize sua saúde através da nutrição adequada às suas necessidades.",
      features: [
        "Avaliação Nutricional",
        "Suplementação Inteligente",
        "Otimização Metabólica",
        "Saúde Intestinal",
        "Longevidade Saudável",
      ],
      image:
        "https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=800&auto=format&fit=crop",
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
                  <h3 className="font-display text-2xl font-semibold text-cream-light">
                    {service.title}
                  </h3>
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
