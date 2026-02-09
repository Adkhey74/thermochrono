"use client"

import { useMemo, useState, useRef, useEffect } from "react"
import Link from "next/link"
import { useI18n } from "@/lib/i18n/context"
import { getCatalogItems } from "@/data/products"
import { ChevronRight, ChevronDown } from "lucide-react"
import { TrustBadges } from "@/components/TrustBadges"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { ProductCard } from "@/components/ProductCard"
import { BoutiqueFilters, type ShopFiltersState } from "@/components/BoutiqueFilters"

type SortOption = "featured" | "price_asc" | "price_desc"

const defaultFilters: ShopFiltersState = {
  colors: [],
  priceMin: null,
  priceMax: null,
  inStockOnly: false,
}

export default function BoutiquePage() {
  const { t } = useI18n()
  const [filters, setFilters] = useState<ShopFiltersState>(defaultFilters)
  const [sort, setSort] = useState<SortOption>("featured")
  const [sortOpen, setSortOpen] = useState(false)
  const sortRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) setSortOpen(false)
    }
    if (sortOpen) document.addEventListener("click", close)
    return () => document.removeEventListener("click", close)
  }, [sortOpen])

  const catalogItems = useMemo(() => getCatalogItems(), [])

  /** Couleurs disponibles : dédupliquées sur tout le catalogue (hors produits stickers) */
  const availableColors = useMemo(() => {
    const byId = new Map<string, string>()
    for (const { product, variant } of catalogItems) {
      if (product.slug.startsWith("stickers-")) continue
      if (!byId.has(variant.id)) byId.set(variant.id, variant.color)
    }
    return Array.from(byId.entries(), ([id, label]) => ({ id, label }))
  }, [catalogItems])

  const priceBounds = useMemo(() => {
    if (catalogItems.length === 0) return { min: 0, max: 100 }
    const prices = catalogItems.map((item) => item.variant.price)
    return { min: Math.min(...prices), max: Math.max(...prices) }
  }, [catalogItems])

  const filteredAndSorted = useMemo(() => {
    let list = catalogItems.filter((item) => {
      if (filters.colors.length > 0 && !filters.colors.includes(item.variant.id)) return false
      if (filters.inStockOnly && !item.product.inStock) return false
      if (filters.priceMin !== null && item.variant.price < filters.priceMin) return false
      if (filters.priceMax !== null && item.variant.price > filters.priceMax) return false
      return true
    })
    if (sort === "price_asc") list = [...list].sort((a, b) => a.variant.price - b.variant.price)
    if (sort === "price_desc") list = [...list].sort((a, b) => b.variant.price - a.variant.price)
    return list
  }, [catalogItems, filters, sort])

  const sortLabel =
    sort === "featured"
      ? (t("shop.sortFeatured") as string)
      : sort === "price_asc"
        ? (t("shop.sortPriceAsc") as string)
        : (t("shop.sortPriceDesc") as string)

  const productCountLabel =
    filteredAndSorted.length <= 1
      ? (t("shop.productCount") as string).replace("{count}", String(filteredAndSorted.length))
      : (t("shop.productCountPlural") as string).replace("{count}", String(filteredAndSorted.length))

  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-6 sm:pb-10 max-w-7xl">
        {/* En-tête compact : breadcrumb + titre */}
        <header className="mb-6 sm:mb-8">
          <nav
            className="mb-2 flex items-center gap-1.5 text-sm text-muted-foreground flex-wrap"
            aria-label={t("common.breadcrumbAria") as string}
          >
            <Link
              href="/"
              className="min-h-[44px] inline-flex items-center py-2 hover:text-foreground transition-colors touch-manipulation"
            >
              {t("header.home") as string}
            </Link>
            <ChevronRight className="h-4 w-4 shrink-0" />
            <span className="text-foreground font-medium">{t("home.boutiqueTitle") as string}</span>
          </nav>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            {t("home.boutiqueTitle") as string}
          </h1>
        </header>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Sidebar filtres */}
          <BoutiqueFilters
            availableColors={availableColors}
            priceBounds={priceBounds}
            filters={filters}
            onFiltersChange={setFilters}
          />

          {/* Contenu principal */}
          <div className="flex-1 min-w-0">
            {/* Barre: nombre de produits + tri */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6 pb-4 border-b border-border/80">
              <p className="text-sm text-muted-foreground font-medium">{productCountLabel}</p>
              <div className="relative" ref={sortRef}>
                <span className="text-sm text-muted-foreground mr-2">{t("shop.sortBy") as string}&nbsp;:</span>
                <button
                  type="button"
                  onClick={() => setSortOpen(!sortOpen)}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-foreground hover:text-primary transition-colors rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20"
                  aria-expanded={sortOpen}
                  aria-haspopup="listbox"
                >
                  {sortLabel}
                  <ChevronDown
                    className={cn("h-4 w-4 shrink-0 transition-transform", sortOpen && "rotate-180")}
                  />
                </button>
                <AnimatePresence>
                  {sortOpen && (
                    <motion.ul
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-1.5 py-1 min-w-[200px] rounded-xl border border-border bg-card shadow-lg z-[var(--z-above-content)]"
                      role="listbox"
                    >
                      {(
                        [
                          { value: "featured" as const, label: t("shop.sortFeatured") as string },
                          { value: "price_asc" as const, label: t("shop.sortPriceAsc") as string },
                          { value: "price_desc" as const, label: t("shop.sortPriceDesc") as string },
                        ] as const
                      ).map((opt) => (
                        <li key={opt.value} role="option" aria-selected={sort === opt.value}>
                          <button
                            type="button"
                            onClick={() => {
                              setSort(opt.value)
                              setSortOpen(false)
                            }}
                            className={cn(
                              "w-full text-left px-4 py-2.5 text-sm transition-colors rounded-lg mx-1",
                              sort === opt.value
                                ? "bg-primary/10 text-primary font-semibold"
                                : "text-foreground hover:bg-muted/80"
                            )}
                          >
                            {opt.label}
                          </button>
                        </li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Grille produits — centrée quand peu d'items, espacement cohérent */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6">
              {filteredAndSorted.map((item, index) => (
                <motion.div
                  key={`${item.product.id}-${item.variant.id}`}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <ProductCard product={item.product} variant={item.variant} className="h-full" />
                </motion.div>
              ))}
            </div>

            {filteredAndSorted.length === 0 && (
              <div className="rounded-2xl border border-border bg-card py-16 text-center">
                <p className="text-muted-foreground font-medium">
                  {t("shop.noResults") as string}
                </p>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Bande réassurance : Paiement / Livraison / Satisfait — centrée H + V */}
      <section
        className="w-full mt-6 sm:mt-10 min-h-[4.5rem] flex flex-col items-center justify-center border-t border-border/80 bg-muted/30 py-6 sm:py-8"
        aria-label="Engagements"
      >
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex justify-center">
          <TrustBadges variant="compact" />
        </div>
      </section>
    </div>
  )
}
