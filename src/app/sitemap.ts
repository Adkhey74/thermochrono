import { MetadataRoute } from "next"
import { product } from "@/data/products"

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.example.com"
  const now = new Date()

  const productUrls = [
    {
      url: `${baseUrl}/produit/${product.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
  ]

  return [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/boutique`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.95,
    },
    {
      url: `${baseUrl}/a-propos`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    ...productUrls,
    {
      url: `${baseUrl}/panier`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/mentions-legales`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/confidentialite`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ]
}
