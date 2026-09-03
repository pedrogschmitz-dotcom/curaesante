import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import SEO from "@/components/SEO";
import { BlogPost, getPublishedPosts, formatDatePtBR } from "@/lib/blog";
import { ArrowLeft, ArrowRight, ArrowUpRight, Search } from "lucide-react";

const DEFAULT_BLOG_IMAGE = `${import.meta.env.BASE_URL}lovable-uploads/dff79888-e876-4e1e-927b-e281cb68964d.jpg`;

function estimateReadTimeMinutes(body: string): number {
  const words = body.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

function getWrappedIndex(index: number, length: number): number {
  return (index + length) % length;
}

const BlogListPage = () => {
  const posts = getPublishedPosts();
  const [search, setSearch] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartX = useRef<number | null>(null);
  const navigate = useNavigate();

  const filteredPosts = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return posts;
    return posts.filter((post) => {
      const content = `${post.title} ${post.resumo} ${(post.tags ?? []).join(" ")}`.toLowerCase();
      return content.includes(query);
    });
  }, [posts, search]);

  useEffect(() => setActiveIndex(0), [search]);

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
    setIsDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (dragStartX.current !== null) {
      const distance = event.clientX - dragStartX.current;
      if (Math.abs(distance) > 45) moveCarousel(distance < 0 ? 1 : -1);
    }
    dragStartX.current = null;
    setIsDragging(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowLeft") moveCarousel(-1);
    if (event.key === "ArrowRight") moveCarousel(1);
  };

  return (
    <main className="min-h-screen bg-background">
      <SEO title="Blog" description="Artigos clínicos sobre saúde da pele, emagrecimento, saúde metabólica e saúde hormonal feminina." path="/blog" />
      <Header />
      <section className="pt-28 pb-20">
        <div className="container-content px-4 md:px-8">
          <h1 className="font-serif text-3xl md:text-4xl text-foreground mb-4 text-center">Blog</h1>
          <p className="text-foreground/70 text-center max-w-4xl mx-auto mb-12">
            Artigos clínicos sobre saúde da pele, emagrecimento, saúde metabólica e saúde hormonal feminina.
          </p>

          <div className="max-w-3xl mx-auto mb-12">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/45" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Buscar por tema, sintoma ou procedimento"
                className="h-12 w-full rounded-xl border border-border bg-card pl-10 pr-4 text-foreground outline-none transition-shadow placeholder:text-foreground/45 focus:ring-2 focus:ring-primary/30"
                aria-label="Buscar artigos no blog"
              />
            </div>
          </div>

          {filteredPosts.length === 0 ? (
            <p className="py-16 text-center text-foreground/60">Nenhum artigo encontrado para essa busca.</p>
          ) : (
            <>
              <div
                className="relative mx-auto max-w-7xl outline-none"
                tabIndex={0}
                role="region"
                aria-label="Carrossel de artigos do blog"
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
                        if (offset === 0 && !isDragging) navigate(`/blog/${post.slug}`);
                        if (offset !== 0 && !isDragging) setActiveIndex(getWrappedIndex(activeIndex + offset, filteredPosts.length));
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
    <article
      className={`blog-carousel-card ${isFeatured ? "is-featured" : "is-side"}`}
      aria-hidden={!isFeatured}
      onClick={onClick}
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
        <span className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-gold-dark">
          {isFeatured ? "Ler artigo completo" : "Ver artigo"}<ArrowUpRight size={15} />
        </span>
      </div>
    </article>
  );
}

export default BlogListPage;
