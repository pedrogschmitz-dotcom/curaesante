import SEOHead from "@/components/SEOHead";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppCTA from "@/components/WhatsAppCTA";
import { MapPin, Phone, Clock } from "lucide-react";

const Contato = () => {
  return (
    <main className="min-h-screen bg-background">
      <SEOHead
        title="Contato"
        description="Entre em contato com a Curae Santé. Av. Delamar José da Silva, 186, Kobrasol, São José SC. WhatsApp para agendamento."
        path="/contato"
      />
      <Header />

      <section className="section-padding pt-32">
        <div className="container-content max-w-4xl">
          <h1 className="font-display text-4xl md:text-5xl font-semibold text-foreground text-center mb-16">
            Contato
          </h1>

          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="space-y-5 text-sm text-muted-foreground">
                <div className="flex items-start gap-3">
                  <MapPin size={18} className="text-accent shrink-0 mt-0.5" />
                  <span>
                    Av. Delamar José da Silva, 186, loja 03
                    <br />Kobrasol, São José/SC — CEP 88102-100
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone size={18} className="text-accent shrink-0" />
                  <a
                    href="https://wa.me/5548988064337"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-foreground transition-colors"
                  >
                    +55 48 98806-4337
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Clock size={18} className="text-accent shrink-0" />
                  <span>Segunda a sexta, 9h às 18h</span>
                </div>
              </div>

              <WhatsAppCTA />
            </div>

            <div className="rounded-xl overflow-hidden border border-border h-[400px]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d883.9!2d-48.6195!3d-27.5935!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95274090e0c2c3c9%3A0x0!2sAv.+Delamar+Jos%C3%A9+da+Silva%2C+186+-+Kobrasol%2C+S%C3%A3o+Jos%C3%A9+-+SC%2C+88102-100!5e0!3m2!1spt-BR!2sbr!4v1702300000000"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Localização Curae Santé — Kobrasol, São José SC"
              />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default Contato;
