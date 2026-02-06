export function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://www.example.com/#organization",
    name: "Boutique",
    description: "Boutique en ligne. Découvrez nos produits, livraison rapide.",
    url: "https://www.example.com",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://www.example.com/#website",
        url: "https://www.example.com",
        name: "Boutique",
        description: "Boutique en ligne.",
      },
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}
