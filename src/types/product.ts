export interface ProductVariant {
  id: string
  color: string
  images: string[]
  price: number
  /** Prix avant réduction (affiché barré si défini) */
  compareAtPrice?: number
}

export interface Product {
  id: string
  name: string
  slug: string
  description: string
  shortDescription: string
  variants: ProductVariant[]
  features: string[]
  inStock: boolean
  /** URL optionnelle d'une vidéo "produit en action" */
  videoUrl?: string | null
}

/** Pour l’affichage (panier, toast, etc.) : produit + variante résolue */
export interface CartItemDisplay {
  product: Product
  variant: ProductVariant
  quantity: number
}

export interface CartItem {
  productId: string
  variantId: string
  quantity: number
}
