import type { Product, ProductVariant } from "@/types/product"

const features500ml = [
  "Affichage température en temps réel sur le bouchon",
  "Acier inoxydable, finition mate",
  "Isolation thermique longue durée",
  "Capacité 500 ml",
  "Sans BPA",
]

const features200ml = [
  "Affichage température en temps réel sur le bouchon",
  "Acier inoxydable, finition mate",
  "Isolation thermique longue durée",
  "Capacité 200 ml",
  "Sans BPA",
]

const gourde: Product = {
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
      images: ["/images/gourde bleu.png"],
    },
    {
      id: "blanc",
      color: "Blanc",
      price: 19.99,
      images: ["/images/gourde bleu.png"],
    },
  ],
  features: features500ml,
  inStock: true,
  videoUrl: undefined,
}

/** Tasse connectée 200 ml — version compacte noir */
const tasse200ml: Product = {
  id: "tasse-connectee-thermosmart-200ml",
  name: "Tasse connectée Thermo Chrono 200 ml",
  slug: "tasse-connectee-thermosmart-200ml",
  description:
    "Tasse intelligente 200 ml en acier inoxydable avec affichage de température intégré sur le bouchon. Même technologie que la gourde Thermo Chrono dans un format compact : idéale pour le café ou les petites portions au bureau.",
  shortDescription:
    "Tasse 200 ml avec affichage de température en temps réel. Format compact, finition noire mate.",
  variants: [
    {
      id: "noir",
      color: "Noir",
      price: 12.99,
      images: ["/images/tasseNoir.png"],
    },
    {
      id: "bleu",
      color: "Bleu pastel",
      price: 12.99,
      images: ["/images/tasseBleu.png"],
    },
    {
      id: "violet",
      color: "Violet",
      price: 12.99,
      images: ["/images/tasseViolet.png"],
    },
    {
      id: "blanc",
      color: "Blanc",
      price: 12.99,
      images: ["/images/tasseBlanche.png"],
    },
  ],
  features: features200ml,
  inStock: true,
  videoUrl: undefined,
}

const products: Product[] = [gourde, tasse200ml]

/** Produit mis en avant sur la page d'accueil (gourde 500 ml) */
export const product = gourde

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug)
}

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id)
}

export function getVariant(product: Product, variantId: string): ProductVariant | undefined {
  return product.variants.find((v) => v.id === variantId)
}

/** Entrées catalogue pour la grille boutique : 1 par variante, tous produits */
export interface CatalogItem {
  product: Product
  variant: ProductVariant
}

export function getCatalogItems(): CatalogItem[] {
  const items: CatalogItem[] = []
  for (const p of products) {
    items.push(...p.variants.map((variant) => ({ product: p, variant })))
  }
  return items
}

export function getAllProducts(): Product[] {
  return products
}
