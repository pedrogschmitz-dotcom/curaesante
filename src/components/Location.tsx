import { MapPin, Navigation } from "lucide-react";

const Location = () => {
  return (
    <section className="section-padding bg-card">
      <div className="container-content px-4 md:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          <div className="space-y-6">
            <span className="inline-block px-4 py-2 bg-gold/10 rounded-full text-sm font-medium text-gold-dark">
              Onde estamos
            </span>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground">
              Atendimento no <span className="text-gold italic">Kobrasol</span>
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Nossa clínica fica em Kobrasol, São José SC, com fácil acesso para Florianópolis e região.
              Estacionamento facilitado e ambiente pensado para o seu conforto.
            </p>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gold mt-1 shrink-0" />
                <p className="text-foreground/90">
                  Kobrasol — São José, SC
                </p>
              </div>
            </div>

            <a
              href="https://share.google/HZaHtH75KBL1D5QhZ"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-flex items-center gap-2"
            >
              <Navigation size={18} />
              Ver rota no Google Maps
            </a>
          </div>

          <div className="relative aspect-[4/3] rounded-[2rem] overflow-hidden shadow-card">
            <iframe
              title="Mapa Curae Santé Kobrasol"
              src="https://www.google.com/maps?q=Kobrasol,+S%C3%A3o+Jos%C3%A9+-+SC&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Location;
