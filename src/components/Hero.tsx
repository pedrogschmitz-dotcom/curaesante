import { useEffect, useState } from "react";
import { Phone, MessageCircle, ArrowRight, Sparkles, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import logoImage from "@/assets/curae-sante-logo-transparent.png";
import { trackEvent } from "@/lib/analytics";

const Hero = () => {
  const [parallaxY, setParallaxY] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      if (window.innerWidth < 1024) {
        setParallaxY(0);
        return;
      }
      const y = window.scrollY || 0;
      setParallaxY(Math.min(28, y * 0.07));
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <section
      id="inicio"
      className="relative min-h-screen flex items-center justify-center gradient-hero overflow-hidden"
    >
      {/* Background ambient */}
      <div className="absolute inset-0 opacity-30 z-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gold/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-brown-light/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold/5 rounded-full blur-3xl" />
      </div>

      <div className="absolute inset-0 pointer-events-none z-0 bg-[radial-gradient(ellipse_at_top_right,hsl(var(--cream-light)/0.3),transparent_55%),radial-gradient(ellipse_at_bottom_left,hsl(var(--accent)/0.08),transparent_60%)]" />
      <div className="absolute inset-y-0 left-1/2 w-[1px] bg-gradient-to-b from-transparent via-gold/25 to-transparent hidden xl:block z-0" />

      <div className="container-content relative z-10 pt-28 pb-20 px-4 md:px-8">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* Content */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-7 animate-fade-up">
            <img
              src={logoImage}
              alt="Logo da Curae Santé"
              className="w-full max-w-[420px] md:max-w-[500px] lg:max-w-[560px] h-auto mx-auto lg:mx-0 transform transition-transform duration-300 hover:scale-105"
              decoding="async"
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
                onClick={() => trackEvent("whatsapp_click", { location: "hero_primary" })}
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
                onClick={() => trackEvent("whatsapp_click", { location: "hero_secondary" })}
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
            <div className="relative aspect-[4/5] max-w-md mx-auto" style={{ transform: `translateY(${parallaxY}px)` }}>
              <div className="absolute inset-0 bg-gradient-to-br from-gold/20 to-brown-light/30 rounded-[3rem] transform rotate-3" />
              <div className="absolute inset-0 bg-card rounded-[3rem] shadow-card overflow-hidden transform -rotate-3 hover:rotate-0 transition-transform duration-500 hero-sheen">
                <img
                  alt="Ambiente acolhedor da Curae Santé em Kobrasol"
                  className="w-full h-full object-cover photo-grade"
                  src={`${import.meta.env.BASE_URL}lovable-uploads/80a1e96e-7b92-4882-8534-15aa7e6e60df.jpg`}
                  fetchPriority="high"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/20 to-transparent" />
              </div>

              <div className="absolute -top-3 -right-3 md:-top-4 md:-right-4 bg-card/95 backdrop-blur-sm rounded-2xl shadow-soft px-4 py-3 border border-border/50 animate-pulse">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-full bg-gold/15 text-gold-dark flex items-center justify-center">
                    <Sparkles size={14} />
                  </span>
                  <div className="leading-tight">
                    <p className="text-xs font-semibold text-foreground">Resultados</p>
                    <p className="text-xs text-foreground/70">Naturais</p>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-3 -left-3 md:-bottom-4 md:-left-4 bg-card/95 backdrop-blur-sm rounded-2xl shadow-soft px-4 py-3 border border-border/50 animate-pulse">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-full bg-gold/15 text-gold-dark flex items-center justify-center">
                    <Heart size={14} />
                  </span>
                  <div className="leading-tight">
                    <p className="text-xs font-semibold text-foreground">Cuidado</p>
                    <p className="text-xs text-foreground/70">Personalizado</p>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-16 right-4 md:right-6 bg-card/80 backdrop-blur-md rounded-2xl border border-cream-light/45 px-4 py-3 shadow-soft">
                <p className="text-[11px] uppercase tracking-[0.18em] text-gold-dark/65 mb-1">Manifesto clínico</p>
                <p className="text-xs text-foreground/80 leading-relaxed">
                  Tempo real de consulta.<br />
                  Investigação antes de conduta.
                </p>
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
