import { useState, useEffect } from "react";
import { Menu, X, Instagram, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import logoImage from "@/assets/logo-curae.png";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "#inicio", label: "Início" },
    { href: "#sobre", label: "Sobre" },
    { href: "#servicos", label: "Serviços" },
    { href: "#equipe", label: "Equipe" },
    { href: "#blog", label: "Blog" },
    { href: "#contato", label: "Contato" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-card/95 backdrop-blur-md shadow-soft"
          : "bg-transparent"
      }`}
    >
      <div className="container-content">
        <div className="flex items-center justify-between h-20 px-4 md:px-8">
          {/* Logo */}
          <a href="#inicio" className="flex items-center gap-2">
            <img 
              src={logoImage} 
              alt="Curae Santé Clínica Médica" 
              className="h-12 md:h-14 w-auto"
            />
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="font-medium text-foreground/80 hover:text-gold-dark transition-colors duration-200"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-4">
            <a
              href="https://instagram.com/CuraeSante"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-foreground/70 hover:text-rose transition-colors"
            >
              <Instagram size={20} />
            </a>
            <a
              href="https://wa.me/5548988064337"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button className="btn-primary flex items-center gap-2">
                <Phone size={18} />
                Agendar Consulta
              </Button>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-foreground"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-card/98 backdrop-blur-md border-t border-border animate-fade-in">
            <nav className="flex flex-col py-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="px-6 py-3 font-medium text-foreground/80 hover:text-gold-dark hover:bg-muted/50 transition-all"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <div className="px-6 py-4 border-t border-border mt-2 flex flex-col gap-3">
                <a
                  href="https://wa.me/5548988064337"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary text-center flex items-center justify-center gap-2"
                >
                  <Phone size={18} />
                  Agendar Consulta
                </a>
                <a
                  href="https://instagram.com/CuraeSante"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline text-center flex items-center justify-center gap-2"
                >
                  <Instagram size={18} />
                  @CuraeSante
                </a>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
