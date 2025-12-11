import { Instagram, Phone, MapPin, Clock, Heart } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { label: "Início", href: "#inicio" },
    { label: "Sobre", href: "#sobre" },
    { label: "Serviços", href: "#servicos" },
    { label: "Equipe", href: "#equipe" },
    { label: "Blog", href: "#blog" },
    { label: "Contato", href: "#contato" },
  ];

  const services = [
    "Medicina Estética",
    "Emagrecimento",
    "Performance",
    "Tecnologias",
  ];

  const socialLinks = [
    {
      label: "@CuraeSante",
      href: "https://instagram.com/CuraeSante",
      icon: Instagram,
    },
    {
      label: "@DrPedroSchmitz",
      href: "https://instagram.com/DrPedroSchmitz",
      icon: Instagram,
    },
    {
      label: "@DraJuliaLongo",
      href: "https://instagram.com/DraJuliaLongo",
      icon: Instagram,
    },
  ];

  return (
    <footer className="bg-foreground text-cream-light">
      {/* Main Footer */}
      <div className="section-padding py-16">
        <div className="container-content px-4 md:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Brand */}
            <div className="lg:col-span-1 space-y-4">
              <h3 className="font-display text-2xl font-semibold">
                Curae <span className="text-gold">Santé</span>
              </h3>
              <p className="text-cream-light/70 leading-relaxed">
                Clínica especializada em emagrecimento e estética médica.
                Cuidado personalizado para sua saúde e beleza.
              </p>
              <div className="flex gap-4 pt-2">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-cream-light/10 rounded-full flex items-center justify-center hover:bg-gold transition-colors group"
                    aria-label={social.label}
                  >
                    <social.icon
                      size={18}
                      className="text-cream-light group-hover:text-foreground"
                    />
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h4 className="font-display text-lg font-semibold text-gold">
                Links Rápidos
              </h4>
              <ul className="space-y-2">
                {quickLinks.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-cream-light/70 hover:text-gold transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div className="space-y-4">
              <h4 className="font-display text-lg font-semibold text-gold">
                Serviços
              </h4>
              <ul className="space-y-2">
                {services.map((service) => (
                  <li key={service}>
                    <a
                      href="#servicos"
                      className="text-cream-light/70 hover:text-gold transition-colors"
                    >
                      {service}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div className="space-y-4">
              <h4 className="font-display text-lg font-semibold text-gold">
                Contato
              </h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <MapPin size={18} className="text-gold shrink-0 mt-0.5" />
                  <span className="text-cream-light/70 text-sm">
                    Av. Delamar Jose da Silva 186, loja 03
                    <br />
                    Kobrasol, São José/SC
                    <br />
                    CEP: 88102-100
                  </span>
                </li>
                <li>
                  <a
                    href="https://wa.me/5548988064337"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-cream-light/70 hover:text-gold transition-colors"
                  >
                    <Phone size={18} className="text-gold" />
                    <span className="text-sm">+55 48 8806-4337</span>
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <Clock size={18} className="text-gold" />
                  <span className="text-cream-light/70 text-sm">
                    Seg - Sex: 9h às 18h
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-cream-light/10">
        <div className="container-content px-4 md:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-cream-light/50">
            <p>
              © {currentYear} Curae Santé Clínica Médica. Todos os direitos
              reservados.
            </p>
            <p className="flex items-center gap-1">
              Feito com <Heart size={14} className="text-gold" /> em
              Florianópolis
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
