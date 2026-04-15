import { Link } from "react-router-dom";
import { Phone, MapPin, Clock } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const navLinks = [
    { to: "/", label: "Início" },
    { to: "/atendimento", label: "Atendimento" },
    { to: "/equipe", label: "Equipe" },
    { to: "/contato", label: "Contato" },
  ];

  const frentes = [
    { to: "/atendimento/saude-da-pele", label: "Saúde da pele" },
    { to: "/atendimento/emagrecimento-metabolico", label: "Emagrecimento e saúde metabólica" },
    { to: "/atendimento/saude-hormonal-feminina", label: "Saúde hormonal feminina" },
  ];

  return (
    <footer className="bg-card border-t border-border">
      <div className="container-content py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="lg:col-span-1 space-y-4">
            <h3 className="font-display text-xl font-semibold text-foreground">
              Curae <span className="text-accent">Santé</span>
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Clínica médica com atendimento clínico em saúde da pele,
              emagrecimento e saúde hormonal feminina. Kobrasol, São José — SC.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider">
              Navegação
            </h4>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider">
              Atendimento
            </h4>
            <ul className="space-y-2">
              {frentes.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider">
              Contato
            </h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <MapPin size={16} className="text-accent shrink-0 mt-0.5" />
                <span>
                  Av. Delamar José da Silva, 186, loja 03
                  <br />Kobrasol, São José/SC — 88102-100
                </span>
              </li>
              <li>
                <a
                  href="https://wa.me/5548988064337"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-foreground transition-colors"
                >
                  <Phone size={16} className="text-accent" />
                  +55 48 98806-4337
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Clock size={16} className="text-accent" />
                Seg–Sex: 9h às 18h
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="container-content py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
            <p>© {currentYear} Curae Santé Clínica Médica. Todos os direitos reservados.</p>
            <p>Resultados variam individualmente. Avaliação médica é obrigatória.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
