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
  faq?: Array<{ question: string; answer: string }>;
}

const SEO = ({
  title,
  description,
  path = "/",
  image,
  type = "website",
  faq = [],
}: SEOProps) => {
  const fullTitle = title ? `${title} — Curae Santé` : DEFAULT_TITLE;
  const desc = description ?? DEFAULT_DESCRIPTION;
  const url = `${BASE_URL}${path}`;
  const img = image ?? DEFAULT_IMAGE;

  const localBusinessJsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalClinic",
    name: "Curae Santé Clínica Médica",
    image: img,
    url: BASE_URL,
    telephone: "+55 48 8806-4337",
    email: "curaesante@gmail.com",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Av. Delamar Jose da Silva, 186, loja 03",
      addressLocality: "São José",
      addressRegion: "SC",
      postalCode: "88102-100",
      addressCountry: "BR",
    },
    areaServed: "São José, Florianópolis e região",
    openingHoursSpecification: [{
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "18:00",
    }],
    sameAs: [
      "https://instagram.com/CuraeSante",
      "https://www.facebook.com/profile.php?id=61574513032901&locale=pt_BR",
      "https://share.google/HZaHtH75KBL1D5QhZ",
    ],
  };

  const faqJsonLd = faq.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faq.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
        })),
      }
    : null;

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

      <script type="application/ld+json">{JSON.stringify(localBusinessJsonLd)}</script>
      {faqJsonLd && <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>}
    </Helmet>
  );
};

export default SEO;
