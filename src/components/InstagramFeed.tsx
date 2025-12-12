import { useEffect } from "react";
import { Instagram } from "lucide-react";

const InstagramFeed = () => {
  useEffect(() => {
    // Load Elfsight script dynamically
    const script = document.createElement("script");
    script.src = "https://static.elfsight.com/platform/platform.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Cleanup script on unmount
      const existingScript = document.querySelector(
        'script[src="https://static.elfsight.com/platform/platform.js"]'
      );
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, []);

  return (
    <section id="instagram" className="section-padding bg-card">
      <div className="container-content px-4 md:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <span className="inline-block px-4 py-2 bg-gold/10 rounded-full text-sm font-medium text-gold-dark">
            <Instagram className="inline-block w-4 h-4 mr-2" />
            @curaesante
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground">
            Acompanhe no{" "}
            <span className="text-gold italic">Instagram</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Confira nossos conteúdos, dicas e novidades sobre saúde e estética.
          </p>
        </div>

        {/* Elfsight Instagram Widget */}
        <div className="w-full max-w-6xl mx-auto">
          {/* 
            INSTRUÇÕES PARA ATIVAR:
            1. Crie uma conta em https://elfsight.com
            2. Crie um widget "Instagram Feed" 
            3. Conecte a conta @CURAESANTE
            4. Copie o ID do widget (ex: elfsight-app-xxxxxxxx)
            5. Substitua o ID abaixo pelo seu
          */}
          <div 
            className="elfsight-app-xxxxxxxx" 
            data-elfsight-app-lazy
          />
          
          {/* Placeholder enquanto widget não está configurado */}
          <div className="text-center py-16 bg-muted/30 rounded-2xl border border-border/50">
            <Instagram className="w-12 h-12 mx-auto text-gold mb-4" />
            <h3 className="font-display text-xl font-semibold text-foreground mb-2">
              Widget do Instagram
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto mb-4">
              Configure seu widget Elfsight para exibir os posts reais do @CURAESANTE aqui.
            </p>
            <a
              href="https://elfsight.com/instagram-feed-widget/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold hover:underline text-sm font-medium"
            >
              Criar widget no Elfsight →
            </a>
          </div>
        </div>

        {/* View All CTA */}
        <div className="text-center mt-12">
          <a
            href="https://www.instagram.com/curaesante"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline inline-flex items-center gap-2"
          >
            <Instagram size={18} />
            Ver mais conteúdos no Instagram
          </a>
        </div>
      </div>
    </section>
  );
};

export default InstagramFeed;
