import { Phone, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trackEvent } from "@/lib/analytics";

const CTASection = () => {
  return (
    <section className="section-padding bg-background">
      <div className="container-content px-4 md:px-8">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-primary to-gold-dark p-10 md:p-16 text-center shadow-card">
          {/* Decorative blobs */}
          <div className="absolute -top-20 -right-20 w-72 h-72 bg-gold/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-rose/20 rounded-full blur-3xl" />

          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
            <span className="inline-block px-4 py-2 bg-cream-light/10 rounded-full text-sm font-medium text-cream-light backdrop-blur">
              Próximo passo
            </span>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold text-cream-light leading-tight">
              Se você quer um atendimento mais{" "}
              <span className="italic text-gold-light">completo</span>,<br className="hidden md:block" />
              o próximo passo é simples
            </h2>
            <p className="text-lg text-cream-light/80 max-w-xl mx-auto">
              Mande uma mensagem e nossa equipe te ajuda a agendar a primeira consulta.
            </p>
            <div className="flex justify-center pt-2">
              <a
                href="https://wa.me/5548988064337?text=Ol%C3%A1%2C%20gostaria%20de%20agendar%20uma%20consulta%20na%20Curae%20Sant%C3%A9."
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent("whatsapp_click", { location: "cta_section" })}
              >
                <Button className="bg-cream-light text-foreground hover:bg-cream-light/90 text-lg px-8 py-6 rounded-full flex items-center gap-3 group shadow-lg">
                  <Phone size={20} />
                  Agendar consulta no WhatsApp
                  <ArrowRight
                    size={18}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
