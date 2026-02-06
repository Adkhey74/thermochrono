import type { Product, ProductVariant } from "@/types/product"

const features = [
  "Affichage température en temps réel sur le bouchon",
  "Acier inoxydable, finition mate",
  "Isolation thermique longue durée",
  "Capacité 500 ml",
  "Sans BPA",
]

export const product: Product = {
  id: "gourde-connectee-thermosmart",
  name: "Gourde connectée Thermo Chrono",
  slug: "gourde-connectee-thermosmart",
  description:
    "Gourde intelligente en acier inoxydable avec affichage de température intégré sur le bouchon. Restez hydraté en toute connaissance : l'écran numérique affiche la température du liquide en temps réel. Design épuré, isolation performante, idéale au bureau ou en déplacement.",
  shortDescription:
    "Gourde intelligente avec affichage de température en temps réel. Plusieurs couleurs disponibles.",
  variants: [
    {
      id: "noir",
      color: "Noir",
      price: 19.99,
      images: ["/images/gourde_noir.jpg", "/images/gourdeNoir.png", "/images/gourde_noir_woman.jpg"],
    },
    {
      id: "bleu",
      color: "Bleu pastel",
      price: 19.99,
      images: [
        "/images/gourde bleu.png",
        "/images/gourde bleu.png",
        "/images/gourde bleu.png",
        "/images/gourde bleu.png",
        "/images/gourde bleu.png",
      ],
    },
    {
      id: "blanc",
      color: "Blanc",
      price: 19.99,
      images: ["/images/gourde bleu.png"],
    },
  ],
  features,
  inStock: true,
  videoUrl: undefined, // À remplir avec une URL de vidéo (produit en action) si besoin
}

export function getProductBySlug(slug: string): Product | undefined {
  return product.slug === slug ? product : undefined
}

export function getProductById(id: string): Product | undefined {
  return product.id === id ? product : undefined
}

export function getVariant(product: Product, variantId: string): ProductVariant | undefined {
  return product.variants.find((v) => v.id === variantId)
}

/** Entrées catalogue pour la grille boutique : 1 par variante (prêt pour plusieurs produits plus tard) */
export interface CatalogItem {
  product: Product
  variant: ProductVariant
}

export function getCatalogItems(): CatalogItem[] {
  const items: CatalogItem[] = []
  items.push(...product.variants.map((variant) => ({ product, variant })))
  return items
}
