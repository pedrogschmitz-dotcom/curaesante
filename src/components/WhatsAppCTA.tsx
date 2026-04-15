import { Phone } from "lucide-react";

interface WhatsAppCTAProps {
  message?: string;
  label?: string;
  className?: string;
}

const WHATSAPP_NUMBER = "5548988064337";

const WhatsAppCTA = ({
  message = "Olá, gostaria de agendar uma avaliação na Curae Santé.",
  label = "Agendar avaliação",
  className = "",
}: WhatsAppCTAProps) => {
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`btn-primary inline-flex items-center gap-2 ${className}`}
    >
      <Phone size={18} />
      {label}
    </a>
  );
};

export default WhatsAppCTA;
