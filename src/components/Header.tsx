import { X } from "lucide-react";
import { useEffect, useState } from "react";

const WHATSAPP = "https://wa.me/5548988064337?text=Ol%C3%A1%2C%20gostaria%20de%20agendar%20uma%20consulta%20na%20Curae%20Sant%C3%A9.";
const INSTAGRAM = "https://www.instagram.com/CuraeSante";

const links = [
  { href: "#inicio", label: "INÍCIO" },
  { href: "#sobre", label: "SOBRE" },
  { href: "#servicos", label: "SERVIÇOS" },
  { href: "#equipe", label: "EQUIPE" },
  { href: "#blog", label: "BLOG" },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [iconHovered, setIconHovered] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Fecha menu ao pressionar Esc
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setMenuOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 border-b transition-all duration-300 ${
          isScrolled
            ? "bg-[rgba(10,10,10,0.95)] border-[rgba(212,188,128,0.2)] backdrop-blur"
            : "bg-transparent border-transparent"
        }`}
      >
        <div className="mx-auto flex h-20 w-full max-w-7xl items-center px-5 md:px-8">
          {/* Logo */}
          <a href="#inicio" className="hidden md:block font-serif text-2xl tracking-wide text-[var(--gold)]">
            Curae Santé
          </a>
          <a href="#inicio" className="md:hidden font-serif text-xl tracking-wide text-[var(--gold)]">
            Curae Santé
          </a>

          {/* Direita: CTA + Botão Menu */}
          <div className="ml-auto flex items-center gap-4">
            <a className="btn-cta-primary hidden md:inline-flex" href={WHATSAPP} target="_blank" rel="noreferrer" data-hover>
              CHAME NO PRIVADO
            </a>

            {/* Botão menu — hamburger por padrão, ícone torre no hover */}
            <button
              onClick={() => setMenuOpen((v) => !v)}
              onMouseEnter={() => setIconHovered(true)}
              onMouseLeave={() => setIconHovered(false)}
              aria-label="Abrir menu"
              className="relative flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-[rgba(212,188,128,0.35)] bg-[rgba(10,10,10,0.55)] transition-all duration-200 hover:border-[var(--gold)] hover:bg-[rgba(212,188,128,0.08)]"
            >
              {/* Hamburger lines — visível por padrão, some no hover */}
              <span
                className={`absolute flex flex-col gap-[5px] transition-opacity duration-200 ${iconHovered ? "opacity-0" : "opacity-100"}`}
                aria-hidden="true"
              >
                <span className="block h-[1.5px] w-5 bg-[var(--gold)]" />
                <span className="block h-[1.5px] w-5 bg-[var(--gold)]" />
                <span className="block h-[1.5px] w-3 bg-[var(--gold)]" />
              </span>

              {/* Ícone torre — visível só no hover */}
              <img
                src="./favicon.svg"
                alt=""
                aria-hidden="true"
                className={`absolute h-6 w-6 object-contain transition-opacity duration-200 ${iconHovered ? "opacity-100" : "opacity-0"}`}
              />
            </button>
          </div>
        </div>
      </header>

      {/* Overlay fullscreen do menu */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-[60] flex flex-col bg-[rgba(8,8,8,0.97)] backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) setMenuOpen(false); }}
        >
          {/* Topo: logo centralizada + botão fechar */}
          <div className="flex w-full items-center justify-center px-6 pt-8">
            <img
              src="./favicon.svg"
              alt="Curae Santé"
              className="h-20 w-20 object-contain"
            />
          </div>
          <button
            onClick={() => setMenuOpen(false)}
            className="absolute right-6 top-7 text-[var(--gold)] transition-opacity hover:opacity-70"
            aria-label="Fechar menu"
          >
            <X size={26} />
          </button>

          <nav className="m-auto flex flex-col items-center gap-9 text-center">
            {links.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="text-[11px] font-semibold tracking-[0.35em] text-[var(--cream-dk)] transition-colors hover:text-[var(--gold)]"
              >
                {item.label}
              </a>
            ))}

            <div className="mt-4 flex flex-col items-center gap-5">
              <a
                href={WHATSAPP}
                target="_blank"
                rel="noreferrer"
                onClick={() => setMenuOpen(false)}
                className="btn-cta-primary"
                data-hover
              >
                AGENDAR CONSULTA
              </a>
              <a
                href={INSTAGRAM}
                target="_blank"
                rel="noreferrer"
                className="text-[var(--gold)] transition-colors hover:text-[var(--gold-lt)]"
                aria-label="Instagram"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <rect x="3.25" y="3.25" width="17.5" height="17.5" rx="5" stroke="currentColor" strokeWidth="1.5" />
                  <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="1.5" />
                  <circle cx="17.5" cy="6.5" r="1.1" fill="currentColor" />
                </svg>
              </a>
            </div>
          </nav>

          {/* Logo centralizada no rodapé do overlay */}
          <div className="mb-10 flex justify-center opacity-30">
            <img src="./favicon.svg" alt="" aria-hidden="true" className="h-12 w-12 object-contain" />
          </div>
        </div>
      )}
    </>
  );
}
