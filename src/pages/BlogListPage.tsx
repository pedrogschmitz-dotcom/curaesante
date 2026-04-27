import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import SEO from "@/components/SEO";
import { getPublishedPosts, formatDatePtBR } from "@/lib/blog";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowUpRight, Search } from "lucide-react";

const POSTS_PER_PAGE = 10;
const DEFAULT_BLOG_IMAGE = `${import.meta.env.BASE_URL}lovable-uploads/dff79888-e876-4e1e-927b-e281cb68964d.jpg`;
const METABOLISMO_POST_SLUG = "metabolismo-depois-dos-40-investigacao-clinica";

function estimateReadTimeMinutes(body: string): number {
  const words = body.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

const BlogListPage = () => {
  const posts = getPublishedPosts();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState("Todos");
  const navigate = useNavigate();

  const tags = useMemo(() => {
    const allTags = posts.flatMap((post) => post.tags ?? []);
    return ["Todos", ...Array.from(new Set(allTags))];
  }, [posts]);

  const filteredPosts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return posts.filter((post) => {
      const matchTag = activeTag === "Todos" || (post.tags ?? []).includes(activeTag);
      if (!matchTag) return false;
      if (!query) return true;

      const content = `${post.title} ${post.resumo} ${(post.tags ?? []).join(" ")}`.toLowerCase();
      return content.includes(query);
    });
  }, [posts, search, activeTag]);

  useEffect(() => {
    setPage(1);
  }, [search, activeTag]);

  const featuredPost =
    page === 1 && search.trim() === "" && activeTag === "Todos" && filteredPosts.length > 0
      ? filteredPosts[0]
      : null;

  const listPosts = featuredPost ? filteredPosts.slice(1) : filteredPosts;
  const totalPages = Math.max(1, Math.ceil(listPosts.length / POSTS_PER_PAGE));
  const paginatedPosts = listPosts.slice((page - 1) * POSTS_PER_PAGE, page * POSTS_PER_PAGE);

  return (
    <main className="min-h-screen bg-background">
      <SEO
        title="Blog"
        description="Artigos clínicos sobre saúde da pele, emagrecimento, saúde metabólica e saúde hormonal feminina."
        path="/blog"
      />

      <Header />

      <section className="pt-28 pb-20">
        <div className="container-content px-4 md:px-8">
          <h1 className="font-serif text-3xl md:text-4xl text-foreground mb-4 text-center">Blog</h1>
          <p className="text-foreground/70 text-center max-w-4xl mx-auto mb-12">
            Artigos clínicos sobre saúde da pele, emagrecimento, saúde metabólica e saúde hormonal feminina.
          </p>

          <div className="max-w-3xl mx-auto mb-8">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/45" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar por tema, sintoma ou procedimento"
                className="h-12 rounded-xl pl-10 bg-card"
                aria-label="Buscar artigos no blog"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
            {tags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setActiveTag(tag)}
                className={`px-4 py-2 rounded-full text-sm transition-colors border ${
                  activeTag === tag
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card text-foreground/75 border-border hover:bg-muted"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>

          {filteredPosts.length === 0 ? (
            <p className="text-center text-foreground/60 py-16">Nenhum artigo encontrado para esse filtro.</p>
          ) : (
            <>
              {featuredPost && (
                <article
                  className="mb-10 grid lg:grid-cols-2 overflow-hidden rounded-3xl border border-border bg-card/95 shadow-soft cursor-pointer"
                  onClick={() => navigate(`/blog/${featuredPost.slug}`)}
                >
                  {featuredPost.imagem && (
                    <img
                      src={featuredPost.imagem}
                      alt={featuredPost.imagem_alt}
                      loading="eager"
                      onError={(e) => {
                        const img = e.currentTarget;
                        if (img.src !== DEFAULT_BLOG_IMAGE) img.src = DEFAULT_BLOG_IMAGE;
                      }}
                      className="w-full h-72 lg:h-full object-cover photo-grade"
                      style={featuredPost.slug === METABOLISMO_POST_SLUG ? { objectPosition: "center 16%" } : undefined}
                    />
                  )}
                  <div className="p-7 md:p-9">
                    <p className="text-xs uppercase tracking-[0.2em] text-foreground/55 mb-4">Artigo em destaque</p>
                    <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-3">{featuredPost.title}</h2>
                    <p className="text-sm text-foreground/60 mb-4">
                      {featuredPost.autor} · {formatDatePtBR(featuredPost.data)} · {estimateReadTimeMinutes(featuredPost.body)} min de leitura
                    </p>
                    <p className="text-foreground/75 leading-relaxed mb-6">{featuredPost.resumo}</p>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {(featuredPost.tags ?? []).slice(0, 3).map((tag) => (
                        <span key={tag} className="px-3 py-1 rounded-full text-xs bg-muted text-foreground/75 border border-border">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <p className="inline-flex items-center gap-1 font-medium text-gold-dark">
                      Ler artigo completo
                      <ArrowUpRight size={16} />
                    </p>
                  </div>
                </article>
              )}

              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {paginatedPosts.map((post) => (
                  <Card
                    key={post.slug}
                    className="group overflow-hidden cursor-pointer border-border bg-card/95 transition-all duration-300 hover:-translate-y-1 hover:shadow-card"
                    onClick={() => navigate(`/blog/${post.slug}`)}
                  >
                    {post.imagem && (
                      <div className="relative overflow-hidden">
                        <img
                          src={post.imagem}
                          alt={post.imagem_alt}
                          loading="lazy"
                          onError={(e) => {
                            const img = e.currentTarget;
                            if (img.src !== DEFAULT_BLOG_IMAGE) img.src = DEFAULT_BLOG_IMAGE;
                          }}
                          className="w-full h-48 object-cover photo-grade transition-transform duration-500 group-hover:scale-105"
                          style={post.slug === METABOLISMO_POST_SLUG ? { objectPosition: "center 18%" } : undefined}
                        />
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-foreground/20 to-transparent opacity-55" />
                      </div>
                    )}
                    <CardContent className="p-5">
                      <h2 className="font-serif text-lg text-foreground mb-2 line-clamp-2">{post.title}</h2>
                      <p className="text-sm text-foreground/60 mb-3">{post.autor} · {formatDatePtBR(post.data)}</p>
                      <p className="text-foreground/70 text-sm line-clamp-3">{post.resumo}</p>
                      <div className="mt-4 flex items-center justify-between">
                        <span className="px-2.5 py-1 rounded-full text-xs bg-muted border border-border text-foreground/70">
                          {(post.tags ?? ["artigo"])[0]}
                        </span>
                        <span className="text-xs text-foreground/60">{estimateReadTimeMinutes(post.body)} min</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-12">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page <= 1}
                    onClick={() => setPage(p => p - 1)}
                  >
                    Anterior
                  </Button>
                  <span className="text-sm text-foreground/60 px-4">
                    {page} de {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page >= totalPages}
                    onClick={() => setPage(p => p + 1)}
                  >
                    Próxima
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </main>
  );
};

export default BlogListPage;
