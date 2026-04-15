import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import SEOHead from "@/components/SEOHead";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppCTA from "@/components/WhatsAppCTA";
import drPedroImage from "@/assets/dr-pedro.jpeg";
import draJuliaImage from "@/assets/dra-julia.jpeg";

const Equipe = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const el = document.querySelector(location.hash);
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: "smooth" }), 100);
      }
    }
  }, [location.hash]);

  return (
    <main className="min-h-screen bg-background">
      <SEOHead
        title="Equipe"
        description="Conheça os médicos da Curae Santé. Dr. Pedro Schmitz e Dra. Júlia Longo Rodrigues Schmitz. Clínica médica em Kobrasol, São José SC."
        path="/equipe"
      />
      <Header />

      <section className="section-padding pt-32">
        <div className="container-content max-w-4xl">
          <h1 className="font-display text-4xl md:text-5xl font-semibold text-foreground text-center mb-16">
            Equipe médica
          </h1>

          {/* Dr. Pedro */}
          <div id="pedro" className="grid md:grid-cols-2 gap-8 items-start mb-20 scroll-mt-28">
            <div className="aspect-[3/4] rounded-xl overflow-hidden border border-border">
              <img
                src={drPedroImage}
                alt="Dr. Pedro Schmitz — Médico"
                className="w-full h-full object-cover object-[center_30%]"
              />
            </div>
            <div className="space-y-4">
              <div>
                <h2 className="font-display text-3xl font-semibold text-foreground">
                  Dr. Pedro Schmitz
                </h2>
                <p className="text-accent mt-1">Médico — CRM/SC 38229</p>
              </div>
              <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
                <p>
                  <strong className="text-foreground">Linha de atuação:</strong>{" "}
                  Atendimento clínico com foco em saúde da pele e clínica médica geral.
                </p>
                <div>
                  <strong className="text-foreground">Formação:</strong>
                  <p className="mt-1 text-muted-foreground italic">
                    [Placeholder — preencher com graduação em medicina, universidade, cursos e pós-graduações relevantes]
                  </p>
                </div>
              </div>
              <WhatsAppCTA
                message="Olá, gostaria de agendar uma avaliação com Dr. Pedro."
                label="Agendar com Dr. Pedro"
              />
            </div>
          </div>

          {/* Dra. Júlia */}
          <div id="julia" className="grid md:grid-cols-2 gap-8 items-start scroll-mt-28">
            <div className="aspect-[3/4] rounded-xl overflow-hidden border border-border">
              <img
                src={draJuliaImage}
                alt="Dra. Júlia Longo Rodrigues Schmitz — Médica"
                className="w-full h-full object-cover object-[center_30%]"
              />
            </div>
            <div className="space-y-4">
              <div>
                <h2 className="font-display text-3xl font-semibold text-foreground">
                  Dra. Júlia Longo Rodrigues Schmitz
                </h2>
                <p className="text-accent mt-1">Médica — CRM/SC 34242</p>
              </div>
              <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
                <p>
                  <strong className="text-foreground">Linha de atuação:</strong>{" "}
                  Atendimento clínico com foco em emagrecimento, saúde metabólica e
                  transição hormonal feminina. Abordagem baseada em princípios da
                  medicina funcional.
                </p>
                <div>
                  <strong className="text-foreground">Formação:</strong>
                  <p className="mt-1 text-muted-foreground italic">
                    [Placeholder — preencher com graduação em medicina, universidade, cursos e pós-graduações relevantes]
                  </p>
                </div>
              </div>
              <WhatsAppCTA
                message="Olá, gostaria de agendar uma avaliação com Dra. Júlia."
                label="Agendar com Dra. Júlia"
              />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default Equipe;
