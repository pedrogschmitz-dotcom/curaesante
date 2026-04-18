import { Helmet } from "react-helmet-async";

const BASE_URL = "https://curaesante.com.br";
const DEFAULT_TITLE = "Curae Santé — Clínica médica em Kobrasol, São José SC";
const DEFAULT_DESCRIPTION =
  "Clínica médica em Kobrasol com foco em saúde da pele, emagrecimento, saúde metabólica e saúde hormonal feminina. Consulta clínica extensa para quem já tentou outros caminhos.";
const DEFAULT_IMAGE = `${BASE_URL}/og-image.jpg`;

interface SEOProps {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  type?: "website" | "article";
}

const SEO = ({
  title,
  description,
  path = "/",
  image,
  type = "website",
}: SEOProps) => {
  const fullTitle = title ? `${title} — Curae Santé` : DEFAULT_TITLE;
  const desc = description ?? DEFAULT_DESCRIPTION;
  const url = `${BASE_URL}${path}`;
  const img = image ?? DEFAULT_IMAGE;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <link rel="canonical" href={url} />

      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={img} />
      <meta property="og:site_name" content="Curae Santé" />
      <meta property="og:locale" content="pt_BR" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
      <meta name="twitter:image" content={img} />
    </Helmet>
  );
};

export default SEO;
