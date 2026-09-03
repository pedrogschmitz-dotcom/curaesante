import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import SEO from "@/components/SEO";
import { BlogPost, getPublishedPosts, formatDatePtBR } from "@/lib/blog";
import { ArrowLeft, ArrowRight, ArrowUpRight, Search } from "lucide-react";

const DEFAULT_BLOG_IMAGE = `${import.meta.env.BASE_URL}lovable-uploads/dff79888-e876-4e1e-927b-e281cb68964d.jpg`;

type AuthorKey = "pedro" | "julia";

const authorConfig: Record<AuthorKey, { name: string; role: string; description: string }> = {
  pedro: {
    name: "Dr. Pedro Schmitz",
    role: "Saúde da pele e estética",
    description: "Artigos sobre pele, cabelo, estética e cuidados baseados em evidências.",
  },
  julia: {
    name: "Dra. Júlia Longo Rodrigues Schmitz",
    role: "Nutrologia e saúde metabólica",
    description: "Artigos sobre emagrecimento, saúde hormonal, menopausa e metabolismo.",
  },
};

const authorFilters: Record<AuthorKey, string[]> = {
  pedro: ["Todos", "Pele", "Cabelo", "Estética"],
  julia: ["Todos", "Emagrecimento", "Saúde hormonal", "Menopausa"],
};

const categoryTags: Record<AuthorKey, Record<string, string[]>> = {
  pedro: {
    Pele: ["pele", "melasma", "acne", "rosácea", "skincare", "manchas na pele", "pele sensível", "protetor solar", "retinol", "vitamina C", "envelhecimento da pele", "longevity"],
    Cabelo: ["queda de cabelo", "couro cabeludo"],
    Estética: ["bioestimuladores", "colágeno", "botox", "harmonização facial", "procedimentos estéticos", "flacidez facial", "textura da pele"],
  },
  julia: {
    Emagrecimento: ["emagrecimento", "obesidade", "tirzepatida", "manutenção", "fome", "apetite", "massa muscular", "atividade física", "dieta restritiva"],
    "Saúde hormonal": ["saúde hormonal feminina", "saúde hormonal", "metabolismo", "resistência à insulina", "tireoide", "ferritina", "ferro"],
    Menopausa: ["menopausa", "perimenopausa", "saúde hormonal feminina", "gordura abdominal"],
  },
};

function estimateReadTimeMinutes(body: string): number {
  const words = body.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

function getWrappedIndex(index: number, length: number): number {
  return (index + length) % length;
}

function getAuthorKey(post: BlogPost): AuthorKey {
  return /júlia|julia/i.test(post.autor) ? "julia" : "pedro";
}

const BlogListPage = () => {
  const posts = getPublishedPosts();
  const [author, setAuthor] = useState<AuthorKey>("pedro");
  const [activeFilter, setActiveFilter] = useState("Todos");
  const [search, setSearch] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartX = useRef<number | null>(null);
  const didDrag = useRef(false);
  const navigate = useNavigate();

  const authorPosts = useMemo(() => posts.filter((post) => getAuthorKey(post) === author), [posts, author]);

  const filteredPosts = useMemo(() => {
    const query = search.trim().toLowerCase();
    const selectedTags = categoryTags[author][activeFilter] ?? [];

    return authorPosts.filter((post) => {
      const tags = (post.tags ?? []).map((tag) => tag.toLowerCase());
      const matchesFilter = activeFilter === "Todos" || selectedTags.some((tag) => tags.includes(tag));
      if (!matchesFilter) return false;
      if (!query) return true;
      const content = `${post.title} ${post.resumo} ${tags.join(" ")}`.toLowerCase();
      return content.includes(query);
    });
  }, [activeFilter, author, authorPosts, search]);

  useEffect(() => {
    setActiveFilter("Todos");
    setActiveIndex(0);
  }, [author]);

  useEffect(() => setActiveIndex(0), [activeFilter, search]);

  const moveCarousel = (direction: 1 | -1) => {
    if (filteredPosts.length < 2) return;
    setActiveIndex((current) => getWrappedIndex(current + direction, filteredPosts.length));
  };

  const visiblePosts = useMemo(() => {
    if (filteredPosts.length === 0) return [];
    return [-1, 0, 1].map((offset) => ({
      post: filteredPosts[getWrappedIndex(activeIndex + offset, filteredPosts.length)],
      offset,
    }));
  }, [activeIndex, filteredPosts]);

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    dragStartX.current = event.clientX;
    didDrag.current = false;
    setIsDragging(true);
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (dragStartX.current !== null) {
      const distance = event.clientX - dragStartX.current;
      if (Math.abs(distance) > 45) {
        didDrag.current = true;
        moveCarousel(distance < 0 ? 1 : -1);
      }
    }
    dragStartX.current = null;
    setIsDragging(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowLeft") moveCarousel(-1);
    if (event.key === "ArrowRight") moveCarousel(1);
  };

  const selectAuthor = (nextAuthor: AuthorKey) => {
    setAuthor(nextAuthor);
    setSearch("");
  };

  return (
    <main className="min-h-screen bg-background">
      <SEO title="Blog" description="Artigos clínicos sobre saúde da pele, emagrecimento, saúde metabólica e saúde hormonal feminina." path="/blog" />
      <Header />
      <section className="pt-28 pb-20">
        <div className="container-content px-4 md:px-8">
          <h1 className="font-serif text-3xl md:text-4xl text-foreground mb-4 text-center">Blog</h1>
          <p className="text-foreground/70 text-center max-w-4xl mx-auto mb-10">
            Escolha o profissional e encontre uma leitura clínica para o que você quer entender.
          </p>

          <div className="blog-author-switcher mx-auto mb-8 max-w-4xl" role="tablist" aria-label="Escolha os artigos por profissional">
            {(Object.keys(authorConfig) as AuthorKey[]).map((key) => {
              const config = authorConfig[key];
              const isActive = author === key;
              return (
                <button
                  key={key}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => selectAuthor(key)}
                  className={`blog-author-option ${isActive ? "is-active" : ""}`}
                >
                  <span className="text-xs uppercase tracking-[0.16em]">{key === "pedro" ? "Dr. Pedro" : "Dra. Júlia"}</span>
                  <strong>{config.role}</strong>
                  <span>{config.description}</span>
                </button>
              );
            })}
          </div>

          <div className="max-w-3xl mx-auto mb-6">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/45" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder={`Buscar nos artigos de ${author === "pedro" ? "Dr. Pedro" : "Dra. Júlia"}`}
                className="h-12 w-full rounded-xl border border-border bg-card pl-10 pr-4 text-foreground outline-none transition-shadow placeholder:text-foreground/45 focus:ring-2 focus:ring-primary/30"
                aria-label="Buscar artigos no blog"
              />
            </div>
          </div>

          <div className="blog-topic-filters mx-auto mb-12 max-w-3xl" role="group" aria-label={`Filtrar artigos de ${authorConfig[author].name}`}>
            {authorFilters[author].map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                className={`blog-topic-filter ${activeFilter === filter ? "is-active" : ""}`}
              >
                {filter}
              </button>
            ))}
          </div>

          {filteredPosts.length === 0 ? (
            <p className="py-16 text-center text-foreground/60">Nenhum artigo encontrado para essa busca.</p>
          ) : (
            <>
              <div
                className="relative mx-auto max-w-7xl outline-none"
                tabIndex={0}
                role="region"
                aria-label={`Carrossel de artigos de ${authorConfig[author].name}`}
                onKeyDown={handleKeyDown}
                onPointerDown={handlePointerDown}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
              >
                <button type="button" onPointerDown={(event) => event.stopPropagation()} onClick={() => moveCarousel(-1)} className="blog-carousel-arrow left-0 md:left-4" aria-label="Artigo anterior">
                  <ArrowLeft size={19} />
                </button>
                <div className={`blog-carousel-track ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}>
                  {visiblePosts.map(({ post, offset }) => (
                    <BlogCarouselCard
                      key={`${post.slug}-${offset}`}
                      post={post}
                      position={offset}
                      onClick={() => {
                        if (didDrag.current) {
                          didDrag.current = false;
                          return;
                        }
                        if (offset === 0) navigate(`/blog/${post.slug}`);
                        if (offset !== 0) setActiveIndex(getWrappedIndex(activeIndex + offset, filteredPosts.length));
                      }}
                    />
                  ))}
                </div>
                <button type="button" onPointerDown={(event) => event.stopPropagation()} onClick={() => moveCarousel(1)} className="blog-carousel-arrow right-0 md:right-4" aria-label="Próximo artigo">
                  <ArrowRight size={19} />
                </button>
              </div>
              <div className="mt-8 flex items-center justify-center gap-4">
                <span className="text-sm text-foreground/60">{activeIndex + 1} de {filteredPosts.length}</span>
                <span className="text-xs text-foreground/45">Arraste ou use as setas para explorar</span>
              </div>
            </>
          )}
        </div>
      </section>
      <Footer />
      <WhatsAppButton />
    </main>
  );
};

interface BlogCarouselCardProps {
  post: BlogPost;
  position: number;
  onClick: () => void;
}

function BlogCarouselCard({ post, position, onClick }: BlogCarouselCardProps) {
  const isFeatured = position === 0;
  return (
    <a
      href={`/blog/${post.slug}`}
      className={`blog-carousel-card ${isFeatured ? "is-featured" : "is-side"}`}
      aria-hidden={!isFeatured}
      onClick={(event) => {
        if (!isFeatured) {
          event.preventDefault();
          onClick();
        }
      }}
    >
      <div className="relative overflow-hidden">
        <img
          src={post.imagem || DEFAULT_BLOG_IMAGE}
          alt={post.imagem_alt || post.title}
          loading={isFeatured ? "eager" : "lazy"}
          onError={(event) => {
            const image = event.currentTarget;
            if (image.src !== DEFAULT_BLOG_IMAGE) image.src = DEFAULT_BLOG_IMAGE;
          }}
          className="h-56 w-full object-cover photo-grade transition-transform duration-500 md:h-72"
        />
      </div>
      <div className="p-6 md:p-8">
        <p className="mb-3 text-xs uppercase tracking-[0.18em] text-foreground/55">{isFeatured ? "Artigo em destaque" : "Próximo artigo"}</p>
        <h2 className="font-serif text-2xl leading-tight text-foreground md:text-3xl">{post.title}</h2>
        <p className="mt-3 text-sm text-foreground/60">{post.autor} · {formatDatePtBR(post.data)} · {estimateReadTimeMinutes(post.body)} min</p>
        <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-foreground/75">{post.resumo}</p>
        <span className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-gold-dark">{isFeatured ? "Ler artigo completo" : "Ver artigo"}<ArrowUpRight size={15} /></span>
      </div>
    </a>
  );
}

export default BlogListPage;
