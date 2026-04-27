import { useMemo, useRef, useState } from "react";

type RouletteImage = {
  src: string;
  alt: string;
};

const images: RouletteImage[] = [
  {
    src: `${import.meta.env.BASE_URL}images/experience/atendimento-fora-padrao-1.jpg`,
    alt: "Consultorio da Curae Sante com mesa de atendimento",
  },
  {
    src: `${import.meta.env.BASE_URL}lovable-uploads/dff79888-e876-4e1e-927b-e281cb68964d.jpg`,
    alt: "Recepcao da Curae Sante",
  },
  {
    src: `${import.meta.env.BASE_URL}lovable-uploads/80a1e96e-7b92-4882-8534-15aa7e6e60df.jpg`,
    alt: "Fachada da Curae Sante",
  },
];

const ConsultationPhotoRoulette = () => {
  const [frontIndex, setFrontIndex] = useState(0);
  const pointerStartX = useRef<number | null>(null);

  const orderedImages = useMemo(
    () => [
      images[frontIndex % images.length],
      images[(frontIndex + 1) % images.length],
      images[(frontIndex + 2) % images.length],
    ],
    [frontIndex]
  );

  const rotateNext = () => setFrontIndex((prev) => (prev + 1) % images.length);
  const rotatePrev = () => setFrontIndex((prev) => (prev - 1 + images.length) % images.length);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    pointerStartX.current = e.clientX;
  };

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (pointerStartX.current === null) return;
    const deltaX = e.clientX - pointerStartX.current;
    pointerStartX.current = null;

    if (Math.abs(deltaX) < 36) {
      rotateNext();
      return;
    }

    if (deltaX < 0) {
      rotateNext();
    } else {
      rotatePrev();
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      rotateNext();
    }
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      rotatePrev();
    }
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      rotateNext();
    }
  };

  return (
    <div className="relative aspect-[4/5] max-w-md mx-auto select-none" style={{ touchAction: "pan-y" }}>
      <div className="absolute inset-0 bg-gold/10 rounded-[2.5rem] rotate-3" />

      <div
        role="button"
        tabIndex={0}
        aria-label="Galeria rotativa de atendimento da Curae Sante"
        className="relative h-full cursor-pointer outline-none"
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onKeyDown={onKeyDown}
      >
        {orderedImages
          .slice()
          .reverse()
          .map((image, reverseIndex) => {
            const layer = 2 - reverseIndex;

            const layerClass =
              layer === 0
                ? "translate-x-0 translate-y-0 rotate-0 scale-100 z-30 opacity-100"
                : layer === 1
                ? "translate-x-5 translate-y-4 rotate-[4deg] scale-[0.95] z-20 opacity-95"
                : "-translate-x-5 translate-y-7 -rotate-[5deg] scale-[0.9] z-10 opacity-85";

            return (
              <div
                key={`${image.src}-${layer}`}
                className={`absolute inset-0 rounded-[2.5rem] overflow-hidden shadow-card border border-white/30 transition-all duration-500 ease-out ${layerClass}`}
              >
                <img src={image.src} alt={image.alt} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/35 via-transparent to-transparent" />
              </div>
            );
          })}
      </div>

      <div className="absolute -bottom-12 inset-x-0 flex items-center justify-center gap-2">
        {images.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Ir para foto ${i + 1}`}
            onClick={() => setFrontIndex(i)}
            className={`h-2.5 rounded-full transition-all ${
              i === frontIndex ? "w-7 bg-gold" : "w-2.5 bg-gold/35 hover:bg-gold/60"
            }`}
          />
        ))}
      </div>

      <p className="absolute -bottom-24 inset-x-0 text-center text-xs text-muted-foreground">
        Toque, clique ou arraste para girar as fotos
      </p>
    </div>
  );
};

export default ConsultationPhotoRoulette;
