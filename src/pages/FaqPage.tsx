import { useMemo, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import SEO from "@/components/SEO";
import { FAQ_ITEMS } from "@/lib/faq";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trackEvent } from "@/lib/analytics";

const FaqPage = () => {
  const [search, setSearch] = useState("");
  const filteredFaq = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return FAQ_ITEMS;
    return FAQ_ITEMS.filter((item) => {
      const fullText = `${item.question} ${item.answer}`.toLowerCase();
      return fullText.includes(query);
    });
  }, [search]);

  return (
    <main className="min-h-screen bg-background">
      <SEO
        title="FAQ e Dúvidas Frequentes"
        description="Perguntas frequentes sobre metabolismo após os 40, perimenopausa, emagrecimento médico, resistência à insulina e agendamento em São José/SC."
        path="/faq"
        faq={FAQ_ITEMS}
      />

      <Header />

      <section className="pt-28 pb-20">
        <div className="container-content px-4 md:px-8 max-w-4xl mx-auto">
          <h1 className="font-serif text-3xl md:text-4xl text-foreground mb-4 text-center">
            FAQ: dúvidas comuns sobre metabolismo e saúde hormonal feminina
          </h1>
          <p className="text-foreground/70 text-center mb-10">
            Respostas diretas para perguntas que pacientes fazem no Google, Instagram e atendimentos da clínica.
          </p>

          <div className="mb-6">
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar dúvida (ex.: tirzepatida, botox, implante hormonal)"
              className="h-12 rounded-xl bg-card"
              aria-label="Buscar dúvida no FAQ"
            />
            <p className="mt-2 text-sm text-foreground/60">
              {filteredFaq.length} {filteredFaq.length === 1 ? "resultado" : "resultados"} encontrado(s)
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 md:p-8 shadow-soft">
            <Accordion type="single" collapsible className="w-full">
              {filteredFaq.map((item, index) => (
                <AccordionItem key={item.question} value={`item-${index}`}>
                  <AccordionTrigger className="text-left font-medium text-foreground">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-foreground/75 leading-relaxed">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            {filteredFaq.length === 0 && (
              <p className="text-center text-foreground/60 py-6">
                Nenhuma dúvida encontrada para essa busca. Tente termos como "emagrecimento", "botox" ou "hormonal".
              </p>
            )}
          </div>

          <div className="mt-10 rounded-2xl border border-border bg-muted/30 p-6 md:p-8 text-center">
            <h2 className="font-serif text-2xl text-foreground mb-3">Quer uma avaliação do seu caso?</h2>
            <p className="text-foreground/70 mb-5">
              Se você se identificou com as dúvidas acima, agende sua consulta para investigação clínica individualizada.
            </p>
            <a
              href="https://wa.me/5548988064337"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent("whatsapp_click", { location: "faq_page" })}
            >
              <Button className="btn-primary">Agendar Consulta pelo WhatsApp</Button>
            </a>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </main>
  );
};

export default FaqPage;
