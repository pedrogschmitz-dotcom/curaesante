import { Instagram, ExternalLink } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const InstagramFeed = () => {
  // Posts representativos - em produção, conectar com Instagram API
  const posts = [
    {
      id: "1",
      image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=800&auto=format&fit=crop",
      caption: "Cuidar da sua pele é um ato de amor próprio. ✨ Agende sua avaliação e descubra o tratamento ideal para você!",
      date: "10 Dez 2024",
      postId: "curaesante",
    },
    {
      id: "2",
      image: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?q=80&w=800&auto=format&fit=crop",
      caption: "Alimentação saudável é a base de uma vida equilibrada. 🥗 Conheça nossos programas de emagrecimento personalizados.",
      date: "08 Dez 2024",
      postId: "curaesante",
    },
    {
      id: "3",
      image: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?q=80&w=800&auto=format&fit=crop",
      caption: "Harmonização facial com resultados naturais. 💎 Nossa equipe especializada cuida de cada detalhe.",
      date: "05 Dez 2024",
      postId: "curaesante",
    },
    {
      id: "4",
      image: "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?q=80&w=800&auto=format&fit=crop",
      caption: "Vitaminas e suplementos para sua saúde! 💊 Consulte nossos especialistas para uma prescrição personalizada.",
      date: "02 Dez 2024",
      postId: "curaesante",
    },
    {
      id: "5",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=800&auto=format&fit=crop",
      caption: "Bem-estar começa de dentro para fora. 🌿 Agende sua consulta e transforme sua qualidade de vida.",
      date: "28 Nov 2024",
      postId: "curaesante",
    },
    {
      id: "6",
      image: "https://images.unsplash.com/photo-1519415510236-718bdfcd89c8?q=80&w=800&auto=format&fit=crop",
      caption: "Tratamentos estéticos com tecnologia de ponta. ⚡ Resultados visíveis desde a primeira sessão.",
      date: "25 Nov 2024",
      postId: "curaesante",
    },
  ];

  const handlePostClick = () => {
    window.open("https://www.instagram.com/curaesante", "_blank", "noopener,noreferrer");
  };

  return (
    <section id="instagram" className="section-padding bg-card">
      <div className="container-content px-4 md:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
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

        {/* Instagram Carousel */}
        <div className="relative px-4 md:px-12">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {posts.map((post, index) => (
                <CarouselItem
                  key={post.id}
                  className="pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
                >
                  <article
                    onClick={handlePostClick}
                    className="group card-elegant p-0 overflow-hidden hover-lift cursor-pointer h-full"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    {/* Image */}
                    <div className="relative aspect-square overflow-hidden">
                      <img
                        src={post.image}
                        alt={`Post do Instagram - ${post.caption.substring(0, 50)}...`}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      {/* Instagram Icon Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="w-14 h-14 rounded-full bg-background/90 flex items-center justify-center shadow-lg">
                          <Instagram className="w-7 h-7 text-gold" />
                        </div>
                      </div>

                      {/* Instagram Badge */}
                      <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-background/90 backdrop-blur-sm flex items-center gap-1.5 shadow-sm">
                        <Instagram size={14} className="text-gold" />
                        <span className="text-xs font-medium text-foreground">Instagram</span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 space-y-3">
                      <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                        {post.caption}
                      </p>

                      <div className="flex items-center justify-between pt-2 border-t border-border/50">
                        <span className="text-xs text-muted-foreground">
                          {post.date}
                        </span>
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-gold group-hover:underline">
                          Ver post
                          <ExternalLink size={12} />
                        </span>
                      </div>
                    </div>
                  </article>
                </CarouselItem>
              ))}
            </CarouselContent>
            
            {/* Navigation Arrows */}
            <CarouselPrevious className="hidden md:flex -left-4 lg:-left-6 w-10 h-10 bg-background border-gold/20 text-gold hover:bg-gold hover:text-background hover:border-gold transition-all duration-300" />
            <CarouselNext className="hidden md:flex -right-4 lg:-right-6 w-10 h-10 bg-background border-gold/20 text-gold hover:bg-gold hover:text-background hover:border-gold transition-all duration-300" />
          </Carousel>

          {/* Mobile Navigation Dots Indicator */}
          <div className="flex justify-center gap-2 mt-6 md:hidden">
            <span className="text-xs text-muted-foreground">
              Deslize para ver mais →
            </span>
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
