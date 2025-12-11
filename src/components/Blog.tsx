import { Calendar, ArrowRight, Clock } from "lucide-react";

const Blog = () => {
  const posts = [
    {
      id: 1,
      title: "Os Benefícios do Jejum Intermitente para o Emagrecimento",
      excerpt:
        "Descubra como o jejum intermitente pode acelerar seu metabolismo e ajudar na perda de peso de forma saudável e sustentável.",
      category: "Emagrecimento",
      date: "10 Dez 2024",
      readTime: "5 min",
      image:
        "https://images.unsplash.com/photo-1498837167922-ddd27525d352?q=80&w=800&auto=format&fit=crop",
    },
    {
      id: 2,
      title: "Skincare: O Guia Completo para Pele Radiante",
      excerpt:
        "Aprenda os passos essenciais de uma rotina de skincare eficaz e descubra os melhores produtos para seu tipo de pele.",
      category: "Dermatologia",
      date: "08 Dez 2024",
      readTime: "7 min",
      image:
        "https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=800&auto=format&fit=crop",
    },
    {
      id: 3,
      title: "Harmonização Facial: Tudo que Você Precisa Saber",
      excerpt:
        "Conheça os procedimentos mais procurados em harmonização facial e entenda como funcionam para resultados naturais.",
      category: "Estética",
      date: "05 Dez 2024",
      readTime: "6 min",
      image:
        "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?q=80&w=800&auto=format&fit=crop",
    },
    {
      id: 4,
      title: "Suplementação Inteligente: Vitaminas Essenciais",
      excerpt:
        "Saiba quais vitaminas e minerais são fundamentais para sua saúde e como a suplementação adequada pode transformar sua vida.",
      category: "Nutrição",
      date: "02 Dez 2024",
      readTime: "4 min",
      image:
        "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?q=80&w=800&auto=format&fit=crop",
    },
  ];

  const categoryColors: Record<string, string> = {
    Emagrecimento: "bg-green-100 text-green-700",
    Dermatologia: "bg-pink-100 text-pink-700",
    Estética: "bg-purple-100 text-purple-700",
    Nutrição: "bg-orange-100 text-orange-700",
    "Bem-estar": "bg-blue-100 text-blue-700",
  };

  return (
    <section id="blog" className="section-padding bg-card">
      <div className="container-content px-4 md:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="inline-block px-4 py-2 bg-gold/10 rounded-full text-sm font-medium text-gold-dark">
            Blog & Artigos
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground">
            Conteúdo para sua{" "}
            <span className="text-gold italic">saúde</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Artigos e dicas dos nossos especialistas para você cuidar melhor da
            sua saúde e beleza.
          </p>
        </div>

        {/* Posts Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {posts.map((post, index) => (
            <article
              key={post.id}
              className="group card-elegant p-0 overflow-hidden hover-lift"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 to-transparent" />
                <span
                  className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-medium ${
                    categoryColors[post.category] || "bg-muted text-muted-foreground"
                  }`}
                >
                  {post.category}
                </span>
              </div>

              {/* Content */}
              <div className="p-5 space-y-3">
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar size={12} />
                    {post.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={12} />
                    {post.readTime}
                  </span>
                </div>

                <h3 className="font-display text-lg font-semibold text-foreground line-clamp-2 group-hover:text-gold transition-colors">
                  {post.title}
                </h3>

                <p className="text-sm text-muted-foreground line-clamp-3">
                  {post.excerpt}
                </p>

                <button className="inline-flex items-center gap-1.5 text-sm font-medium text-gold group/btn pt-2">
                  Leia mais
                  <ArrowRight
                    size={14}
                    className="group-hover/btn:translate-x-1 transition-transform"
                  />
                </button>
              </div>
            </article>
          ))}
        </div>

        {/* View All CTA */}
        <div className="text-center mt-12">
          <a
            href="https://instagram.com/CuraeSante"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline inline-flex items-center gap-2"
          >
            Ver mais conteúdos no Instagram
            <ArrowRight size={18} />
          </a>
        </div>
      </div>
    </section>
  );
};

export default Blog;
