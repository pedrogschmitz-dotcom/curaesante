import { Helmet } from "react-helmet-async";

interface SEOHeadProps {
  title: string;
  description: string;
  path?: string;
  type?: string;
}

const SEOHead = ({ title, description, path = "", type = "website" }: SEOHeadProps) => {
  const baseUrl = "https://curaesante.com.br";
  const fullUrl = `${baseUrl}${path}`;
  const fullTitle = `${title} — Curae Santé, Kobrasol São José SC`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={fullUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:locale" content="pt_BR" />
      <meta property="og:site_name" content="Curae Santé" />
    </Helmet>
  );
};

export default SEOHead;
