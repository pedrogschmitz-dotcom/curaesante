import { useState, useEffect } from "react";
import { Menu, X, Instagram, Phone, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import logoImage from "@/assets/logo-curae.png";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== "undefined") {
      return document.documentElement.classList.contains("dark");
    }
    return false;
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleTheme = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    document.documentElement.classList.toggle("dark", newDark);
    localStorage.setItem("theme", newDark ? "dark" : "light");
  };

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const navLinks = [
    { href: "#inicio", label: "Início" },
    { href: "#sobre", label: "Sobre" },
    { href: "#servicos", label: "Serviços" },
    { href: "#equipe", label: "Equipe" },
    { href: "#blog", label: "Blog" },
    { href: "#contato", label: "Contato" },
  ];

  const FacebookIcon = () => (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );

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
              href="https://share.google/HZaHtH75KBL1D5QhZ"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-foreground/70 hover:text-rose transition-colors"
              aria-label="Perfil Google"
            >
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
            </a>
            <a
              href="https://www.facebook.com/profile.php?id=61574513032901&locale=pt_BR"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-foreground/70 hover:text-rose transition-colors"
              aria-label="Facebook"
            >
              <FacebookIcon />
            </a>
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
            <button
              onClick={toggleTheme}
              className="p-2 text-foreground/70 hover:text-gold-dark transition-colors rounded-full hover:bg-muted/50"
              aria-label={isDark ? "Modo dia" : "Modo noite"}
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 text-foreground/70 hover:text-gold-dark transition-colors rounded-full"
              aria-label={isDark ? "Modo dia" : "Modo noite"}
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button
              className="p-2 text-foreground"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
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
                <a
                  href="https://www.facebook.com/profile.php?id=61574513032901&locale=pt_BR"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline text-center flex items-center justify-center gap-2"
                >
                  <FacebookIcon />
                  Facebook
                </a>
                <a
                  href="https://share.google/HZaHtH75KBL1D5QhZ"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline text-center flex items-center justify-center gap-2"
                >
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Google
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
