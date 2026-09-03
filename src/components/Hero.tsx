import { ChevronDown } from "lucide-react";
import { useEffect, useRef } from "react";

const WHATSAPP = "https://wa.me/5548988064337?text=Ol%C3%A1%2C%20gostaria%20de%20agendar%20uma%20consulta%20na%20Curae%20Sant%C3%A9.";

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const opacityRef = useRef(0.82);       // opacidade atual do véu
  const targetOpacityRef = useRef(0.82); // opacidade alvo
  const rafRef = useRef<number>(0);
  const logoBoundsRef = useRef({ x: 0, y: 0, w: 0, h: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const draw = (veilOpacity: number) => {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = `rgba(8,8,8,${veilOpacity})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

    };

    const animate = () => {
      const cur = opacityRef.current;
      const tgt = targetOpacityRef.current;
      const diff = tgt - cur;
      if (Math.abs(diff) > 0.004) {
        opacityRef.current = cur + diff * 0.08;
        draw(opacityRef.current);
        rafRef.current = requestAnimationFrame(animate);
      } else {
        opacityRef.current = tgt;
        draw(tgt);
      }
    };

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      draw(opacityRef.current);
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    return () => {
      ro.disconnect();
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <section ref={sectionRef} id="inicio" className="relative flex min-h-screen flex-col overflow-hidden">
      {/* Foto de fundo */}
      <img
        src="./lovable-uploads/80a1e96e-7b92-4882-8534-15aa7e6e60df.jpg"
        alt="Ambiente acolhedor da Curae Santé em Kobrasol"
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Canvas: véu escuro com recorte no formato da logo + hover reveal */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full cursor-pointer"
        aria-hidden="true"
      />

      {/* Gradiente suave no rodapé para legibilidade do CTA */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-52 bg-gradient-to-t from-[rgba(8,8,8,0.90)] to-transparent" />

      {/* Conteúdo */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-between px-6 pt-32 pb-10 text-center">
        <p className="label-track animate-fade-in reveal revealed">
          CLÍNICA MÉDICA · KOBRASOL · SÃO JOSÉ SC
        </p>

        <div aria-hidden="true" />

        <div className="flex flex-col items-center gap-5">
          <a
            href={WHATSAPP}
            target="_blank"
            rel="noreferrer"
            data-hover
            className="btn-cta-primary animate-fade-in-up reveal revealed"
          >
            AGENDAR CONSULTA
          </a>
          <a href="#sobre" className="text-[var(--gold)] animate-bounce" aria-label="Rolar para baixo">
            <ChevronDown size={22} />
          </a>
        </div>
      </div>
    </section>
  );
}
