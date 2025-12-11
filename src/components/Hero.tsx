import { Phone, Instagram, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import curaeSanteLogo from "@/assets/curae-sante-logo-transparent.png";

const Hero = () => {
  return <section id="inicio" className="relative min-h-screen flex items-center justify-center gradient-hero overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gold/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-brown-light/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold/5 rounded-full blur-3xl" />
      </div>

      <div className="container-content relative z-10 pt-24 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center px-4 md:px-8">
          {/* Content */}
          <div className="text-center lg:text-left space-y-6 animate-fade-up">
            <div className="inline-block">
              <img 
                src={curaeSanteLogo} 
                alt="Curae Santé - Clínica Médica" 
                className="h-24 md:h-32 lg:h-40 w-auto object-contain"
              />
            </div>

            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground leading-tight">
              Sua{" "}
              <span className="text-gradient-gold italic">transformação</span>
              <br />
              começa com{" "}
              <span className="text-gold">cuidado</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Tratamentos personalizados em medicina estética, tecnologias avançadas, 
              emagrecimento e performance. Cuide da sua saúde e beleza com uma equipe especializada
              e humanizada.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
              <a href="https://wa.me/5548988064337" target="_blank" rel="noopener noreferrer">
                <Button className="btn-primary w-full sm:w-auto text-lg px-8 py-6 flex items-center justify-center gap-3 group">
                  <Phone size={20} />
                  Fale no WhatsApp
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Button>
              </a>
              <a href="https://instagram.com/CuraeSante" target="_blank" rel="noopener noreferrer">
                <Button className="btn-outline w-full sm:w-auto text-lg px-8 py-6 flex items-center justify-center gap-3">
                  <Instagram size={20} />
                  Siga no Instagram
                </Button>
              </a>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-8 pt-8 border-t border-border/50 mt-8">
              <div className="text-center">
                <p className="font-display text-3xl font-semibold text-gold">
                  +500
                </p>
                <p className="text-sm text-muted-foreground">
                  Pacientes Satisfeitos
                </p>
              </div>
              <div className="text-center">
                <p className="font-display text-3xl font-semibold text-gold">
                  2
                </p>
                <p className="text-sm text-muted-foreground">
                  Médicos Especialistas
                </p>
              </div>
              <div className="text-center">
                <p className="font-display text-3xl font-semibold text-gold">
                  100%
                </p>
                <p className="text-sm text-muted-foreground">
                  Atendimento Humanizado
                </p>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative animate-fade-in" style={{
          animationDelay: "0.3s"
        }}>
            <div className="relative aspect-[4/5] max-w-md mx-auto">
              <div className="absolute inset-0 bg-gradient-to-br from-gold/20 to-brown-light/30 rounded-[3rem] transform rotate-3" />
              <div className="absolute inset-0 bg-card rounded-[3rem] shadow-card overflow-hidden transform -rotate-3 hover:rotate-0 transition-transform duration-500">
                <img alt="Ambiente acolhedor da Curae Santé - Clínica de estética e emagrecimento" className="w-full h-full object-cover" src="/lovable-uploads/80a1e96e-7b92-4882-8534-15aa7e6e60df.jpg" />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/20 to-transparent" />
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 bg-card p-4 rounded-2xl shadow-card animate-float">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gold/20 rounded-full flex items-center justify-center">
                    <span className="text-gold text-lg">✨</span>
                  </div>
                  <div>
                    <p className="font-medium text-foreground text-sm">
                      Resultados
                    </p>
                    <p className="text-xs text-muted-foreground">Naturais</p>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-4 -left-4 bg-card p-4 rounded-2xl shadow-card animate-float" style={{
              animationDelay: "1.5s"
            }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gold/20 rounded-full flex items-center justify-center">
                    <span className="text-gold text-lg">💛</span>
                  </div>
                  <div>
                    <p className="font-medium text-foreground text-sm">
                      Cuidado
                    </p>
                    <p className="text-xs text-muted-foreground">Personalizado</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-gold/50 rounded-full flex justify-center pt-2">
          <div className="w-1 h-3 bg-gold rounded-full animate-pulse" />
        </div>
      </div>
    </section>;
};
export default Hero;