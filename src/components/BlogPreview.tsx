import { useNavigate } from "react-router-dom";
import { getPublishedPosts, formatDatePtBR } from "@/lib/blog";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const BlogPreview = () => {
  const navigate = useNavigate();
  const posts = getPublishedPosts().slice(0, 3);

  if (posts.length === 0) return null;

  return (
    <section id="blog" className="section-padding bg-background">
      <div className="container-content px-4 md:px-8">
        <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-4 text-center">
          Blog
        </h2>
        <p className="text-foreground/70 text-center max-w-4xl mx-auto mb-12">
          Artigos clínicos sobre saúde da pele, emagrecimento, saúde metabólica e saúde hormonal feminina.
        </p>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
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
                <h3 className="font-serif text-lg text-foreground mb-2 line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-sm text-foreground/60 mb-3">
                  {post.autor} · {formatDatePtBR(post.data)}
                </p>
                <p className="text-foreground/70 text-sm line-clamp-3">
                  {post.resumo}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex justify-center mt-10">
          <Button
            variant="outline"
            className="btn-outline flex items-center gap-2"
            onClick={() => navigate("/blog")}
          >
            Ver todos os artigos
            <ArrowRight size={16} />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default BlogPreview;
