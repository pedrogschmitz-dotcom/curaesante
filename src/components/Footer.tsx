const WHATSAPP = "https://wa.me/5548988064337?text=Ol%C3%A1%2C%20gostaria%20de%20falar%20com%20a%20equipe%20da%20Curae%20Sant%C3%A9.";
const INSTAGRAM = "https://www.instagram.com/CuraeSante";

const links = [
  { href: "#inicio", label: "INÍCIO" },
  { href: "#sobre", label: "SOBRE" },
  { href: "#servicos", label: "SERVIÇOS" },
  { href: "#equipe", label: "EQUIPE" },
  { href: "#blog", label: "BLOG" },
];

export default function Footer() {
  return (
    <footer className="border-t border-[rgba(212,188,128,0.15)] bg-[var(--ink-soft)]">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-6 py-16 md:grid-cols-3 md:px-8">
        <div>
          <p className="font-serif text-3xl tracking-wide text-[var(--gold)]">Curae Santé</p>
          <p className="mt-4 text-sm font-medium tracking-[0.08em] text-[rgba(246,241,232,0.7)]">
            Clínica médica · Kobrasol · São José SC
          </p>
        </div>

        <div>
          <p className="label-track">NAVEGACAO</p>
          <nav className="mt-4 flex flex-col gap-3">
            {links.map((item) => (
              <a key={item.href} href={item.href} className="text-xs font-semibold tracking-[0.2em] text-[var(--cream-dk)] transition-colors hover:text-[var(--gold)]" data-hover>
                {item.label}
              </a>
            ))}
          </nav>
        </div>

        <div>
          <p className="label-track">CONTATO PRIVADO</p>
          <a href={WHATSAPP} target="_blank" rel="noreferrer" className="mt-4 inline-flex text-xs font-semibold tracking-[0.2em] text-[var(--gold)] transition-colors hover:text-[var(--gold-lt)]" data-hover>
            FALE COM A EQUIPE
          </a>
          <a href={INSTAGRAM} target="_blank" rel="noreferrer" className="mt-3 block text-xs font-semibold tracking-[0.2em] text-[var(--cream-dk)] transition-colors hover:text-[var(--gold)]" data-hover>
            @CuraeSante
          </a>
        </div>
      </div>

      <div className="border-t border-[rgba(212,188,128,0.15)]">
        <div className="mx-auto w-full max-w-7xl px-6 py-6 text-[11px] font-semibold tracking-[0.16em] text-[rgba(246,241,232,0.6)] md:px-8">
          © 2026 Curae Santé. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
}
