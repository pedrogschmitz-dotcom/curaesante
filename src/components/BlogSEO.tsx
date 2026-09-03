import { Helmet } from "react-helmet-async";
import type { BlogPost } from "@/lib/blog";

const BASE_URL = "https://curaesante.com.br";

interface BlogSEOProps {
  post: BlogPost;
}

const BlogSEO = ({ post }: BlogSEOProps) => {
  const url = `${BASE_URL}/blog/${post.slug}`;
  const imageUrl = post.imagem.startsWith("http") ? post.imagem : `${BASE_URL}${post.imagem}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.resumo,
    image: imageUrl,
    datePublished: post.data,
    dateModified: post.data,
    author: { "@type": "Person", name: post.autor },
    publisher: {
      "@type": "Organization",
      name: "Curae Santé",
      logo: {
        "@type": "ImageObject",
        url: `${BASE_URL}/logo-curae.png`,
      },
    },
    mainEntityOfPage: url,
  };

  return (
    <Helmet>
      <title>{post.title} — Curae Santé</title>
      <meta name="description" content={post.resumo} />
      <link rel="canonical" href={url} />

      <meta property="og:type" content="article" />
      <meta property="og:title" content={post.title} />
      <meta property="og:description" content={post.resumo} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:url" content={url} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={post.title} />
      <meta name="twitter:description" content={post.resumo} />
      <meta name="twitter:image" content={imageUrl} />

      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
    </Helmet>
  );
};

export default BlogSEO;
