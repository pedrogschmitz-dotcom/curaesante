import { useParams, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import BlogSEO from "@/components/BlogSEO";
import { getPostBySlug, formatDatePtBR } from "@/lib/blog";
import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";
import NotFound from "./NotFound";

const BlogPostPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const post = slug ? getPostBySlug(slug) : null;

  if (!post) return <NotFound />;

  return (
    <main className="min-h-screen bg-background">
      <BlogSEO post={post} />
      <Header />

      <article className="pt-28 pb-20">
        <div className="container-content px-4 md:px-8 max-w-3xl mx-auto">
          <button
            onClick={() => navigate("/blog")}
            className="text-sm text-foreground/60 hover:text-foreground transition-colors mb-6 inline-block"
          >
            ← Voltar ao Blog
          </button>

          <h1 className="font-serif text-3xl md:text-4xl text-foreground mb-4">{post.title}</h1>

          <p className="text-foreground/60 mb-8">
            {post.autor} · {formatDatePtBR(post.data)}
          </p>

          {post.imagem && (
            <img
              src={post.imagem}
              alt={post.imagem_alt}
              loading="lazy"
              className="w-full rounded-xl mb-10 shadow-soft"
            />
          )}

          <div className="prose prose-stone dark:prose-invert max-w-none
            prose-headings:font-serif prose-headings:text-foreground
            prose-p:text-foreground/80 prose-a:text-primary
            prose-img:rounded-lg prose-img:shadow-soft
            [&_img]:loading-lazy">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.body}</ReactMarkdown>
          </div>

          {/* CTA */}
          <div className="mt-16 p-8 rounded-2xl bg-card border border-border text-center">
            <h2 className="font-serif text-2xl text-foreground mb-4">Agendar avaliação</h2>
            <a href="https://wa.me/5548988064337" target="_blank" rel="noopener noreferrer">
              <Button className="btn-primary flex items-center gap-2 mx-auto">
                <Phone size={18} />
                Fale conosco pelo WhatsApp
              </Button>
            </a>
          </div>

          {/* Disclaimer */}
          <p className="mt-8 text-xs text-foreground/50 text-center italic">
            Este conteúdo é informativo e não substitui consulta médica presencial.
          </p>
        </div>
      </article>

      <Footer />
      <WhatsAppButton />
    </main>
  );
};

export default BlogPostPage;
