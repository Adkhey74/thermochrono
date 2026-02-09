"use client"

import { use, useState } from "react"
import { notFound } from "next/navigation"
import Link from "next/link"
import { getProductBySlug } from "@/data/products"
import { ProductGallery } from "@/components/ProductGallery"
import { ProductActions } from "./ProductActions"
import { ColorSelector } from "@/components/ColorSelector"
import { ProductReviews } from "@/components/ProductReviews"
import { FaqSection } from "@/components/FaqSection"
import { TrustBadges } from "@/components/TrustBadges"
import { ChevronRight } from "lucide-react"
import { useI18n } from "@/lib/i18n/context"
import { getProductDisplay } from "@/lib/i18n/product-display"

interface PageProps {
  params: Promise<{ slug: string }>
}

export default function ProductPage({ params }: PageProps) {
  const { slug } = use(params)
  const { t } = useI18n()
  const product = getProductBySlug(slug)
  const [selectedVariant, setSelectedVariant] = useState(product?.variants[0])

  if (!product) notFound()
  if (!selectedVariant) notFound()

  const display = getProductDisplay(product, t, selectedVariant)

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-10 max-w-6xl">
        {/* Fil d'Ariane */}
        <nav
          className="mb-6 sm:mb-8 flex items-center gap-2 text-sm text-muted-foreground flex-wrap"
          aria-label={t("common.breadcrumbAria") as string}
        >
          <Link href="/" className="min-h-[44px] inline-flex items-center py-2 hover:text-foreground transition-colors touch-manipulation">
            {t("product.breadcrumbHome") as string}
          </Link>
          <ChevronRight className="h-4 w-4 shrink-0 opacity-60" />
          <Link href="/boutique" className="min-h-[44px] inline-flex items-center py-2 hover:text-foreground transition-colors touch-manipulation">
            {t("home.boutiqueTitle") as string}
          </Link>
          <ChevronRight className="h-4 w-4 shrink-0 opacity-60" />
          <span className="text-foreground font-medium truncate max-w-[200px] sm:max-w-none">
            {display.name}
            {!product.slug.startsWith("stickers-") && display.color ? ` — ${display.color}` : ""}
          </span>
        </nav>

        {/* Bloc principal : galerie + infos (2 colonnes) */}
        <div className="rounded-2xl border border-border/80 bg-card shadow-sm overflow-hidden">
          <div className="grid gap-0 lg:grid-cols-2">
            {/* Colonne gauche : galerie (en premier sur mobile) */}
            <div className="p-4 sm:p-6 lg:p-8 lg:sticky lg:top-24 bg-zinc-50/80 order-1">
              <ProductGallery
                images={selectedVariant.images}
                productName={display.name}
                videoUrl={product.videoUrl}
              />
            </div>

            {/* Colonne droite : titre, prix, couleur, CTA, réassurance (après la galerie sur mobile) */}
            <div className="flex flex-col p-4 sm:p-6 lg:p-8 lg:pl-10 min-w-0 order-2">
              <section className="pb-6 lg:pb-8">
                <span className="text-xs font-semibold uppercase tracking-widest text-primary/80 mb-3 block">
                  {t("product.badgeBrand") as string}
                </span>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground leading-tight">
                  {display.name}
                </h1>
                {!product.slug.startsWith("stickers-") && display.color && (
                  <p className="mt-2 text-muted-foreground font-medium">{display.color}</p>
                )}
                <p className="mt-4 text-2xl sm:text-3xl font-bold text-foreground">
                  {selectedVariant.price.toFixed(2)} €
                </p>
              </section>

              {product.variants.length > 1 && (
                <section className="py-6 lg:py-8 border-y border-border/60">
                  <ColorSelector
                    product={product}
                    selectedVariant={selectedVariant}
                    onSelectVariant={setSelectedVariant}
                  />
                </section>
              )}

              <section className="py-6 lg:py-8">
                <ProductActions product={product} variant={selectedVariant} />
                <div className="mt-6 pt-6 border-t border-border/60">
                  <TrustBadges variant="row" />
                </div>
              </section>
            </div>
          </div>
        </div>

        {/* Contenu en pleine largeur : description, caractéristiques, avis, FAQ */}
        <div className="mt-8 rounded-2xl border border-border/80 bg-card shadow-sm overflow-hidden">
          <div className="grid gap-0 lg:grid-cols-2">
            {/* Colonne gauche : description + caractéristiques */}
            <div className="p-4 sm:p-6 lg:p-8 min-w-0">
              <section className="pb-6 lg:pb-8">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                  {t("product.description") as string}
                </h2>
                <p className="text-foreground leading-relaxed text-[15px]">
                  {display.description}
                </p>
              </section>
              <section className="pt-6 lg:pt-8 border-t border-border/60">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                  {t("product.features") as string}
                </h2>
                <ul className="space-y-2">
                  {display.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-foreground">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </section>
            </div>

            {/* Colonne droite : avis clients */}
            <div className="p-4 sm:p-6 lg:p-8 border-t lg:border-t-0 lg:border-l border-border/60 min-w-0">
              <ProductReviews limit={5} />
            </div>
          </div>

          {/* FAQ en pleine largeur */}
          <section className="p-4 sm:p-6 lg:p-8 border-t border-border/60">
            <FaqSection />
          </section>
        </div>
      </div>
    </div>
  )
}
