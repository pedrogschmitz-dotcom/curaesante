import { Heart, Shield, Award, Users } from "lucide-react";
const About = () => {
  const values = [{
    icon: Heart,
    title: "Acolhimento",
    description: "Cada paciente é único. Oferecemos um ambiente acolhedor onde você se sente cuidado e respeitado."
  }, {
    icon: Shield,
    title: "Segurança",
    description: "Procedimentos realizados com os mais altos padrões de segurança e qualidade médica."
  }, {
    icon: Award,
    title: "Excelência",
    description: "Equipe altamente qualificada, em constante atualização com as melhores técnicas."
  }, {
    icon: Users,
    title: "Humanização",
    description: "Tratamento personalizado, respeitando suas necessidades e objetivos individuais."
  }];
  return <section id="sobre" className="section-padding bg-card">
      <div className="container-content px-4 md:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image */}
          <div className="relative order-2 lg:order-1">
            <div className="relative aspect-square max-w-lg mx-auto">
              <div className="absolute inset-0 bg-gold/10 rounded-[2rem] transform -rotate-6" />
              <div className="absolute inset-4 bg-beige rounded-[2rem] transform rotate-3" />
              <div className="relative bg-card rounded-[2rem] shadow-card overflow-hidden">
                <img alt="Ambiente interno da clínica Curae Santé" className="w-full h-full object-cover aspect-square" src="/lovable-uploads/dff79888-e876-4e1e-927b-e281cb68964d.jpg" />
              </div>

              {/* Experience Badge */}
              <div className="absolute -bottom-6 -right-6 bg-gold text-primary-foreground p-6 rounded-2xl shadow-gold">
                
                <p className="text-sm font-medium">Cuidado</p>
                <p className="text-sm font-medium">Continuado</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="order-1 lg:order-2 space-y-8">
            <div className="space-y-4">
              <span className="inline-block px-4 py-2 bg-gold/10 rounded-full text-sm font-medium text-gold-dark">
                Sobre a Clínica
              </span>
              <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground">
                Cuidado que{" "}
                <span className="text-gold italic">transforma</span>
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                A Curae Santé nasceu do sonho de entregar medicina de excelência
                com o cuidado humano que todo paciente merece. Nossa clínica reúne o
                melhor da medicina estética, dos cuidados com a pele, do emagrecimento,
                da performance e da metabologia, sempre em um ambiente pensado para
                seu conforto e bem-estar.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Acreditamos que beleza e saúde caminham juntas, e cada
                tratamento é desenvolvido de forma personalizada, respeitando
                sua individualidade e objetivos.
              </p>
            </div>

            {/* Values Grid */}
            <div className="grid sm:grid-cols-2 gap-4">
              {values.map((value, index) => <div key={value.title} className="card-elegant group" style={{
              animationDelay: `${index * 0.1}s`
            }}>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-gold/20 transition-colors">
                      <value.icon className="w-6 h-6 text-gold" />
                    </div>
                    <div>
                      <h3 className="font-display text-lg font-semibold text-foreground mb-1">
                        {value.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {value.description}
                      </p>
                    </div>
                  </div>
                </div>)}
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default About;