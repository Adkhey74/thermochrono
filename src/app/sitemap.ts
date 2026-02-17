import { MetadataRoute } from "next"
import { getAllProducts } from "@/data/products"

const getBaseUrl = (): string => {
  const url = process.env.NEXT_PUBLIC_APP_URL?.trim()
  if (url) {
    try {
      new URL(url)
      return url.replace(/\/$/, "")
    } catch {
      // invalid URL, use fallback
    }
  }
  return "https://www.example.com"
}

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getBaseUrl()
  const now = new Date()
  const products = getAllProducts()

  const productUrls = products.map((product) => ({
    url: `${baseUrl}/produit/${product.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }))

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/boutique`, lastModified: now, changeFrequency: "weekly", priority: 0.95 },
    { url: `${baseUrl}/a-propos`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/panier`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/mentions-legales`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/confidentialite`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/cgv`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ]

  return [...staticPages, ...productUrls]
}
