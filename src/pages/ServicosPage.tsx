import Header from "@/components/Header";
import Services from "@/components/Services";
import Procedures from "@/components/Procedures";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import SEO from "@/components/SEO";
import SectionReveal from "@/components/SectionReveal";
import ServiceDetail from "@/components/ServiceDetail";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const ServicosPage = () => {
  const faqItems = [
    // Emagrecimento
    {
      question: "A tirzepatida está disponível na Curae Santé?",
      answer: "O uso de medicamentos para emagrecimento é avaliado caso a caso. A indicação depende de histórico clínico, exames e metas individuais, sempre com acompanhamento médico.",
      tag: "Emagrecimento",
    },
    {
      question: "Qual a diferença entre emagrecimento clínico e dieta?",
      answer: "O emagrecimento clínico investiga causas metabólicas e hormonais, define estratégia individualizada e acompanha evolução com segurança. Uma dieta genérica não faz essa investigação.",
      tag: "Emagrecimento",
    },
    {
      question: "Quais exames são pedidos antes de tratar emagrecimento?",
      answer: "Os exames variam conforme o perfil clínico, mas geralmente incluem avaliação metabólica, hormonal e de composição corporal, definidos na primeira consulta.",
      tag: "Emagrecimento",
    },
    // Saúde hormonal
    {
      question: "A clínica atende queixas de perimenopausa?",
      answer: "Sim. A Curae Santé avalia sintomas da transição menopausal com abordagem clínica integrada, respeitando histórico, exames e objetivos da paciente.",
      tag: "Hormonal",
    },
    {
      question: "Implante hormonal é indicado para todos os casos?",
      answer: "Não. A indicação é médica e individual, com avaliação de contraindicações, dosagem e acompanhamento periódico após a aplicação.",
      tag: "Hormonal",
    },
    // Pele e estética
    {
      question: "Botox preventivo funciona?",
      answer: "Aplicado com técnica e indicação corretas, pode ajudar a prevenir aprofundamento de marcas dinâmicas. A avaliação médica define o momento ideal e a dose.",
      tag: "Pele",
    },
    {
      question: "Harmonização facial com ácido hialurônico fica artificial?",
      answer: "O objetivo é resultado natural e proporcional ao rosto. O planejamento considera anatomia, equilíbrio facial e expectativas realistas da paciente.",
      tag: "Pele",
    },
    {
      question: "Bioestimulador de colágeno e preenchimento são a mesma coisa?",
      answer: "Não. O bioestimulador estimula produção gradual de colágeno da própria pele. O preenchimento adiciona volume imediato. São indicações diferentes, às vezes complementares.",
      tag: "Pele",
    },
    {
      question: "Como funciona a primeira consulta na Curae Santé?",
      answer: "É uma consulta extensa com escuta clínica, histórico de saúde, avaliação de objetivos e construção de um plano terapêutico individualizado.",
      tag: "Clínica",
    },
    {
      question: "Como agendar uma avaliação?",
      answer: "Pelo WhatsApp oficial da clínica: +55 48 8806-4337.",
      tag: "Clínica",
    },
  ];

  const tags = ["Todos", "Emagrecimento", "Hormonal", "Pele", "Clínica"];

  return (
    <main className="min-h-screen bg-background">
      <SEO
        title="Serviços — Emagrecimento, Saúde Hormonal e Procedimentos Estéticos em São José SC"
        description="Tirzepatida, implante hormonal, botox, harmonização facial com ácido hialurônico e bioestimulador de colágeno. Avaliação médica individualizada em Kobrasol, São José/SC."
        path="/servicos"
        faq={faqItems.map(({ question, answer }) => ({ question, answer }))}
      />
      <Header />
      <div className="pt-20">
        <SectionReveal><Services /></SectionReveal>
        <SectionReveal delayMs={60}><ServiceDetail /></SectionReveal>
        <SectionReveal delayMs={120}><Procedures /></SectionReveal>

        {/* FAQ segmentado por área */}
        <SectionReveal delayMs={160}>
          <section className="section-padding bg-card">
            <div className="container-content px-4 md:px-8 max-w-4xl mx-auto">
              <div className="text-center mb-10 space-y-3">
                <span className="inline-block px-4 py-2 bg-gold/10 rounded-full text-sm font-medium text-gold-dark">
                  Dúvidas frequentes
                </span>
                <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground">
                  Perguntas sobre <span className="text-gold italic">nossos serviços</span>
                </h2>
              </div>

              <div className="flex flex-wrap gap-2 justify-center mb-8">
                {tags.map((tag) => (
                  <span key={tag} className="px-4 py-1.5 rounded-full text-sm border border-border bg-muted/50 text-foreground/75">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="rounded-2xl border border-border bg-background p-5 md:p-8">
                <Accordion type="multiple">
                  {faqItems.map((item, i) => (
                    <AccordionItem key={item.question} value={`faq-${i}`}>
                      <AccordionTrigger className="text-left font-medium text-foreground">
                        <span className="mr-4 flex-1">{item.question}</span>
                        <span className="text-xs px-2 py-1 rounded-full bg-muted text-foreground/60 border border-border shrink-0 ml-auto mr-3 hidden sm:inline">
                          {item.tag}
                        </span>
                      </AccordionTrigger>
                      <AccordionContent className="text-foreground/75 leading-relaxed">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </div>
          </section>
        </SectionReveal>

        <CTASection />
      </div>
      <Footer />
      <WhatsAppButton />
    </main>
  );
};

export default ServicosPage;
