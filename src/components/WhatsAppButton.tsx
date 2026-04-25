import { MessageCircle } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

const WhatsAppButton = () => {
  return (
    <a
      href="https://wa.me/5548988064337"
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackEvent("whatsapp_click", { location: "floating_button" })}
      className="fixed bottom-6 right-6 z-50 group"
      aria-label="Fale conosco no WhatsApp"
    >
      {/* Pulse Animation */}
      <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-20" />

      {/* Button */}
      <div className="relative w-14 h-14 bg-green-500 rounded-full flex items-center justify-center shadow-lg hover:bg-green-600 transition-all duration-300 hover:scale-110 group-hover:shadow-xl">
        <MessageCircle className="w-7 h-7 text-white" />
      </div>

      {/* Tooltip */}
      <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-foreground text-cream-light px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        Fale no WhatsApp
        <div className="absolute left-full top-1/2 -translate-y-1/2 border-8 border-transparent border-l-foreground" />
      </div>
    </a>
  );
};

export default WhatsAppButton;
