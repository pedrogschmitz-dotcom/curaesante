import SEOHead from "@/components/SEOHead";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ServiceCard from "@/components/ServiceCard";

const services = [
  {
    title: "Saúde da pele",
    subtitle: "com Dr. Pedro Schmitz",
    description:
      "Atendimento clínico para quadros persistentes de pele — acne adulta, rosácea, queda capilar, melasma, dermatites.",
    to: "/atendimento/saude-da-pele",
  },
  {
    title: "Emagrecimento e saúde metabólica",
    subtitle: "com Dra. Júlia Longo Rodrigues Schmitz",
    description:
      "Atendimento clínico para dificuldade de emagrecer, resistência insulínica, síndrome metabólica, fadiga e alterações de energia.",
    to: "/atendimento/emagrecimento-metabolico",
  },
  {
    title: "Saúde hormonal feminina",
    subtitle: "com Dra. Júlia Longo Rodrigues Schmitz",
    description:
      "Atendimento clínico para sintomas da perimenopausa e menopausa — sono, humor, energia, peso, ciclo.",
    to: "/atendimento/saude-hormonal-feminina",
  },
];

const Atendimento = () => {
  return (
    <main className="min-h-screen bg-background">
      <SEOHead
        title="Atendimento"
        description="Três frentes clínicas unificadas pela mesma postura: investigar antes de prescrever. Saúde da pele, emagrecimento e saúde hormonal feminina."
        path="/atendimento"
      />
      <Header />

      <section className="section-padding pt-32">
        <div className="container-content">
          <div className="max-w-3xl mx-auto text-center mb-12 space-y-4">
            <h1 className="font-display text-4xl md:text-5xl font-semibold text-foreground">
              Atendimento
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              A Curae Santé atua em três frentes clínicas, unificadas pela mesma
              postura: investigar antes de prescrever.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {services.map((service) => (
              <ServiceCard key={service.to} {...service} />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default Atendimento;
