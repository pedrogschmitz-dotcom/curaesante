import { useEffect, useMemo, useState } from "react";
import { Phone } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { trackEvent } from "@/lib/analytics";

const WA_LINK =
  "https://wa.me/5548988064337?text=Ol%C3%A1%2C%20gostaria%20de%20agendar%20uma%20consulta%20na%20Curae%20Sant%C3%A9.";

const STORAGE_KEY = "mobile_cta_variant";

const variants = [
  { id: "a", label: "Agendar avaliação" },
  { id: "b", label: "Falar com a equipe agora" },
] as const;

const MobileStickyCTA = () => {
  const isMobile = useIsMobile();
  const [show, setShow] = useState(false);
  const [variant, setVariant] = useState<(typeof variants)[number]>(variants[0]);

  useEffect(() => {
    if (!isMobile) return;

    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "a" || saved === "b") {
      const found = variants.find((v) => v.id === saved);
      if (found) setVariant(found);
      return;
    }

    const picked = Math.random() < 0.5 ? variants[0] : variants[1];
    setVariant(picked);
    localStorage.setItem(STORAGE_KEY, picked.id);
  }, [isMobile]);

  useEffect(() => {
    if (!isMobile) return;

    const onScroll = () => {
      const y = window.scrollY || 0;
      const nearBottom = window.innerHeight + y > document.body.scrollHeight - 280;
      setShow(y > 520 && !nearBottom);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isMobile]);

  const locationLabel = useMemo(
    () => `mobile_sticky_home_${variant.id}`,
    [variant.id]
  );

  if (!isMobile || !show) return null;

  return (
    <div className="fixed z-50 left-3 right-3 bottom-3 pb-[env(safe-area-inset-bottom)] md:hidden">
      <a
        href={WA_LINK}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackEvent("whatsapp_click", { location: locationLabel, variant: variant.id })}
        className="flex items-center justify-center gap-2 rounded-2xl px-4 py-3.5 bg-foreground text-cream-light shadow-card border border-gold/30"
      >
        <Phone size={16} />
        <span className="text-sm font-semibold tracking-wide">{variant.label}</span>
      </a>
    </div>
  );
};

export default MobileStickyCTA;
