import { Instagram, Award, GraduationCap } from "lucide-react";
import drPedroImage from "@/assets/dr-pedro.jpeg";
import draJuliaImage from "@/assets/dra-julia.jpeg";

const Team = () => {
  const doctors = [
    {
      name: "Dr. Pedro Germano Longo Schmitz",
      specialty: "Medicina Estética e Tecnologias",
      description:
        "Médico com atuação em procedimentos estéticos faciais e corporais, com foco em resultados naturais e harmoniosos. Dedicado a realçar a beleza única de cada paciente utilizando as mais avançadas tecnologias.",
      credentials: [
        "Medicina Estética Avançada",
        "Harmonização Facial",
        "Injetáveis e Bioestimuladores",
        "Tecnologias a Laser e Radiofrequência",
      ],
      instagram: "DrPedroSchmitz",
      image: drPedroImage,
    },
    {
      name: "Dra. Júlia Longo Rodrigues Schmitz",
      specialty: "Emagrecimento, Metabolismo e Performance",
      description:
        "Médica com atuação em emagrecimento saudável, otimização metabólica e performance. Ajuda pacientes a conquistarem seus objetivos de peso, energia e longevidade com tratamentos personalizados.",
      credentials: [
        "Metabolismo e Emagrecimento",
        "Medicina do Estilo de Vida",
        "Performance Física e Mental",
        "Reposição Hormonal e Longevidade",
      ],
      instagram: "DraJuliaLongo",
      image: draJuliaImage,
    },
  ];

  return (
    <section id="equipe" className="section-padding bg-beige">
      <div className="container-content px-4 md:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="inline-block px-4 py-2 bg-gold/10 rounded-full text-sm font-medium text-gold-dark">
            Nossa Equipe
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground">
            Nossa <span className="text-gold italic">equipe médica</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Conheça os profissionais dedicados a cuidar da sua saúde e beleza
            com excelência e humanização.
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto">
          {doctors.map((doctor, index) => (
            <div
              key={doctor.name}
              className="group"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="card-elegant p-0 overflow-hidden hover-lift">
                {/* Image Container */}
                <div className="relative aspect-[4/5] overflow-hidden">
                  <img
                    src={doctor.image}
                    alt={doctor.name}
                    className="w-full h-full object-cover object-[center_30%] transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />

                  {/* Info Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-cream-light">
                    <p className="text-gold font-medium mb-1">
                      {doctor.specialty}
                    </p>
                    <h3 className="font-display text-2xl font-semibold mb-3">
                      {doctor.name}
                    </h3>
                    <a
                      href={`https://instagram.com/${doctor.instagram}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-cream-light/90 hover:text-gold transition-colors"
                    >
                      <Instagram size={18} />@{doctor.instagram}
                    </a>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                  <p className="text-muted-foreground leading-relaxed">
                    {doctor.description}
                  </p>

                  {/* Credentials */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                      <GraduationCap size={16} className="text-gold" />
                      Áreas de atuação
                    </div>
                    <ul className="space-y-1.5">
                      {doctor.credentials.map((credential) => (
                        <li
                          key={credential}
                          className="flex items-center gap-2 text-sm text-muted-foreground"
                        >
                          <Award size={14} className="text-gold shrink-0" />
                          {credential}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Instagram CTA */}
                  <a
                    href={`https://instagram.com/${doctor.instagram}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-outline w-full flex items-center justify-center gap-2 mt-4"
                  >
                    <Instagram size={18} />
                    Seguir no Instagram
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Team;
