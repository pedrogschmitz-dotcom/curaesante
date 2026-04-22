import { Phone, MessageCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import logoImage from "@/assets/curae-sante-logo-transparent.png";

const Hero = () => {
  return (
    <section
      id="inicio"
      className="relative min-h-screen flex items-center justify-center gradient-hero overflow-hidden"
    >
      {/* Background ambient */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gold/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-brown-light/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold/5 rounded-full blur-3xl" />
      </div>

      <div className="container-content relative z-10 pt-28 pb-20 px-4 md:px-8">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* Content */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-7 animate-fade-up">
            <img
              src={logoImage}
              alt="Logo da Curae Santé"
              className="w-full max-w-[420px] md:max-w-[500px] lg:max-w-[560px] h-auto mx-auto lg:mx-0 transform transition-transform duration-300 hover:scale-105"
            />

            <span className="inline-block px-4 py-2 bg-gold/10 rounded-full text-sm font-medium text-gold-dark">
              Clínica médica · Kobrasol, São José SC
            </span>

            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground leading-[1.05]">
              Pare de tratar só o{" "}
              <span className="text-gold italic">sintoma</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Atendimento com tempo, investigação e estratégia para entender o que realmente está acontecendo.
            </p>

            <p className="text-base text-muted-foreground/80 max-w-xl mx-auto lg:mx-0">
              Clínica médica no Kobrasol com foco em saúde, emagrecimento e qualidade de vida.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-2">
              <a
                href="https://wa.me/5548988064337?text=Ol%C3%A1%2C%20gostaria%20de%20agendar%20uma%20consulta%20na%20Curae%20Sant%C3%A9."
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button className="btn-primary w-full sm:w-auto text-lg px-8 py-6 flex items-center justify-center gap-3 group">
                  <Phone size={20} />
                  Agendar consulta no WhatsApp
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Button>
              </a>
              <a
                href="https://wa.me/5548988064337?text=Ol%C3%A1%2C%20gostaria%20de%20falar%20com%20a%20equipe%20da%20Curae%20Sant%C3%A9."
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button className="btn-outline w-full sm:w-auto text-lg px-8 py-6 flex items-center justify-center gap-3">
                  <MessageCircle size={20} />
                  Falar com a equipe
                </Button>
              </a>
            </div>
          </div>

          {/* Image */}
          <div
            className="lg:col-span-5 relative animate-fade-in"
            style={{ animationDelay: "0.3s" }}
          >
            <div className="relative aspect-[4/5] max-w-md mx-auto">
              <div className="absolute inset-0 bg-gradient-to-br from-gold/20 to-brown-light/30 rounded-[3rem] transform rotate-3" />
              <div className="absolute inset-0 bg-card rounded-[3rem] shadow-card overflow-hidden transform -rotate-3 hover:rotate-0 transition-transform duration-500">
                <img
                  alt="Ambiente acolhedor da Curae Santé em Kobrasol"
                  className="w-full h-full object-cover"
                  src={`${import.meta.env.BASE_URL}lovable-uploads/80a1e96e-7b92-4882-8534-15aa7e6e60df.jpg`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/20 to-transparent" />
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
    </section>
  );
};

export default Hero;
