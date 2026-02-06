import type { Product, ProductVariant } from "@/types/product"

type TFunction = (key: string) => string | string[]

function isTranslated(value: unknown): value is string {
  return typeof value === "string" && !value.startsWith("products.")
}

function isTranslatedArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.length > 0 && value.every((v) => typeof v === "string")
}

export interface ProductDisplay {
  name: string
  shortDescription: string
  description: string
  color: string
  features: string[]
}

export function getProductDisplay(
  product: Product,
  t: TFunction,
  variant?: ProductVariant
): ProductDisplay {
  const name = t(`products.${product.slug}.name`)
  const shortDescription = t(`products.${product.slug}.shortDescription`)
  const description = t(`products.${product.slug}.description`)
  const colorKey = variant
    ? `products.${product.slug}.variants.${variant.id}.color`
    : `products.${product.slug}.color`
  const color = t(colorKey)
  const features = t(`products.${product.slug}.features`)

  return {
    name: isTranslated(name) ? name : product.name,
    shortDescription: isTranslated(shortDescription) ? shortDescription : product.shortDescription,
    description: isTranslated(description) ? description : product.description,
    color: isTranslated(color) ? color : variant?.color ?? "",
    features: isTranslatedArray(features) ? features : product.features,
  }
}
