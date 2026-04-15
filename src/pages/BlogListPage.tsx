import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { getPublishedPosts, formatDatePtBR } from "@/lib/blog";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const POSTS_PER_PAGE = 10;

const BlogListPage = () => {
  const posts = getPublishedPosts();
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  const totalPages = Math.max(1, Math.ceil(posts.length / POSTS_PER_PAGE));
  const paginatedPosts = posts.slice((page - 1) * POSTS_PER_PAGE, page * POSTS_PER_PAGE);

  return (
    <main className="min-h-screen bg-background">
      <Helmet>
        <title>Blog — Curae Santé</title>
        <meta name="description" content="Artigos clínicos sobre saúde da pele, emagrecimento, saúde metabólica e saúde hormonal feminina." />
        <link rel="canonical" href="https://curaesante.com.br/blog" />
      </Helmet>

      <Header />

      <section className="pt-28 pb-20">
        <div className="container-content px-4 md:px-8">
          <h1 className="font-serif text-3xl md:text-4xl text-foreground mb-4 text-center">Blog</h1>
          <p className="text-foreground/70 text-center max-w-2xl mx-auto mb-12">
            Artigos clínicos sobre saúde da pele, emagrecimento, saúde metabólica e saúde hormonal feminina.
          </p>

          {posts.length === 0 ? (
            <p className="text-center text-foreground/60 py-16">Nenhum artigo publicado ainda.</p>
          ) : (
            <>
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {paginatedPosts.map((post) => (
                  <Card
                    key={post.slug}
                    className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-300 bg-card border-border"
                    onClick={() => navigate(`/blog/${post.slug}`)}
                  >
                    {post.imagem && (
                      <img
                        src={post.imagem}
                        alt={post.imagem_alt}
                        loading="lazy"
                        className="w-full h-48 object-cover"
                      />
                    )}
                    <CardContent className="p-5">
                      <h2 className="font-serif text-lg text-foreground mb-2 line-clamp-2">{post.title}</h2>
                      <p className="text-sm text-foreground/60 mb-3">
                        {post.autor} · {formatDatePtBR(post.data)}
                      </p>
                      <p className="text-foreground/70 text-sm line-clamp-3">{post.resumo}</p>
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
