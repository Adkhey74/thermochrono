"use client"

import { useState, useEffect } from "react"
import { ChevronDown, Palette, Euro, Package, RotateCcw } from "lucide-react"
import { useI18n } from "@/lib/i18n/context"
import { cn } from "@/lib/utils"

export interface ShopFiltersState {
  colors: string[]
  priceMin: number | null
  priceMax: number | null
  inStockOnly: boolean
}

interface BoutiqueFiltersProps {
  availableColors: { id: string; label: string }[]
  /** Bornes de prix du catalogue (min, max) pour limiter les champs */
  priceBounds: { min: number; max: number }
  filters: ShopFiltersState
  onFiltersChange: (f: ShopFiltersState) => void
}

function FilterSection({
  open,
  onToggle,
  icon: Icon,
  title,
  children,
  isLast,
}: {
  open: boolean
  onToggle: () => void
  icon: React.ElementType
  title: string
  children: React.ReactNode
  isLast?: boolean
}) {
  return (
    <div className={cn(!isLast && "border-b border-border/60")}>
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center gap-3 py-3.5 text-left text-sm font-semibold text-foreground hover:text-primary transition-colors rounded-lg -mx-1 px-1 min-h-[44px] touch-manipulation"
        aria-expanded={open}
      >
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted/80 text-muted-foreground">
          <Icon className="h-4 w-4" />
        </span>
        <span className="flex-1">{title}</span>
        <ChevronDown
          className={cn("h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200", open && "rotate-180")}
        />
      </button>
      {open && <div className="pb-4 pl-11">{children}</div>}
    </div>
  )
}

export function BoutiqueFilters({
  availableColors,
  priceBounds,
  filters,
  onFiltersChange,
}: BoutiqueFiltersProps) {
  const { t } = useI18n()
  const [openColor, setOpenColor] = useState(false)
  const [openPrice, setOpenPrice] = useState(false)
  const [openAvailability, setOpenAvailability] = useState(false)
  const [priceMinInput, setPriceMinInput] = useState<string>("")
  const [priceMaxInput, setPriceMaxInput] = useState<string>("")

  useEffect(() => {
    setPriceMinInput(filters.priceMin !== null ? String(filters.priceMin) : "")
  }, [filters.priceMin])
  useEffect(() => {
    setPriceMaxInput(filters.priceMax !== null ? String(filters.priceMax) : "")
  }, [filters.priceMax])

  const applyPriceFilter = () => {
    const minStr = priceMinInput.trim()
    const maxStr = priceMaxInput.trim()
    const newMin = minStr === "" ? null : (() => { const n = parseFloat(minStr); return !Number.isNaN(n) && n >= 0 ? n : filters.priceMin })()
    const newMax = maxStr === "" ? null : (() => { const n = parseFloat(maxStr); return !Number.isNaN(n) && n >= 0 ? n : filters.priceMax })()
    if (newMin !== filters.priceMin || newMax !== filters.priceMax) {
      onFiltersChange({ ...filters, priceMin: newMin, priceMax: newMax })
    }
    if (minStr !== "" && (Number.isNaN(parseFloat(minStr)) || parseFloat(minStr) < 0)) {
      setPriceMinInput(filters.priceMin !== null ? String(filters.priceMin) : "")
    }
    if (maxStr !== "" && (Number.isNaN(parseFloat(maxStr)) || parseFloat(maxStr) < 0)) {
      setPriceMaxInput(filters.priceMax !== null ? String(filters.priceMax) : "")
    }
  }

  const hasActiveFilters =
    filters.colors.length > 0 ||
    filters.inStockOnly ||
    filters.priceMin !== null ||
    filters.priceMax !== null

  const resetFilters = () => {
    onFiltersChange({
      colors: [],
      priceMin: null,
      priceMax: null,
      inStockOnly: false,
    })
  }

  const toggleColor = (id: string) => {
    let next: string[]
    if (filters.colors.length === 0) {
      next = availableColors.map((c) => c.id).filter((x) => x !== id)
    } else if (filters.colors.includes(id)) {
      next = filters.colors.filter((c) => c !== id)
    } else {
      next = [...filters.colors, id]
    }
    onFiltersChange({ ...filters, colors: next })
  }

  const toggleAvailability = () => {
    onFiltersChange({ ...filters, inStockOnly: !filters.inStockOnly })
  }

  return (
    <aside className="w-full lg:w-60 shrink-0">
      <div className="flex items-center justify-between gap-3 mb-3">
        <h2 className="text-sm font-bold text-foreground">
          {t("shop.filters") as string}
        </h2>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={resetFilters}
            className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-primary transition-colors touch-manipulation min-h-[44px]"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Réinitialiser</span>
          </button>
        )}
      </div>
      <nav
        className="rounded-xl border border-border/80 bg-card p-4 shadow-sm"
        aria-label="Filtres boutique"
      >
        {/* Couleur — liste générique (tous produits) */}
        <FilterSection
          open={openColor}
          onToggle={() => setOpenColor(!openColor)}
          icon={Palette}
          title={t("shop.color") as string}
        >
          <ul className="space-y-1" role="list">
            {availableColors.map(({ id, label }) => {
              const checked = filters.colors.length === 0 || filters.colors.includes(id)
              return (
                <li key={id}>
                  <label
                    className={cn(
                      "flex items-center gap-3 cursor-pointer rounded-lg py-2.5 px-2 -mx-2 text-sm transition-colors min-h-[44px] touch-manipulation",
                      "hover:bg-muted/50 text-foreground"
                    )}
                  >
                    <span
                      className={cn(
                        "h-5 w-5 shrink-0 rounded border-2 flex items-center justify-center transition-colors",
                        checked
                          ? "bg-primary border-primary text-primary-foreground"
                          : "border-border bg-card"
                      )}
                    >
                      {checked && (
                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </span>
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleColor(id)}
                      className="sr-only"
                    />
                    <span>{label}</span>
                  </label>
                </li>
              )
            })}
          </ul>
        </FilterSection>

        {/* Prix */}
        <FilterSection
          open={openPrice}
          onToggle={() => setOpenPrice(!openPrice)}
          icon={Euro}
          title={t("shop.price") as string}
        >
          <div className="space-y-3">
            <div>
              <label htmlFor="filter-price-min" className="block text-xs font-medium text-muted-foreground mb-1">
                {t("shop.priceMin") as string}
              </label>
              <input
                id="filter-price-min"
                type="number"
                min={0}
                step={0.01}
                value={priceMinInput}
                onChange={(e) => setPriceMinInput(e.target.value)}
                onBlur={applyPriceFilter}
                placeholder={String(priceBounds.min)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
            </div>
            <div>
              <label htmlFor="filter-price-max" className="block text-xs font-medium text-muted-foreground mb-1">
                {t("shop.priceMax") as string}
              </label>
              <input
                id="filter-price-max"
                type="number"
                min={0}
                step={0.01}
                value={priceMaxInput}
                onChange={(e) => setPriceMaxInput(e.target.value)}
                onBlur={applyPriceFilter}
                placeholder={String(priceBounds.max)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              {priceBounds.min.toFixed(2)} € – {priceBounds.max.toFixed(2)} €
            </p>
          </div>
        </FilterSection>

        {/* Disponibilité */}
        <FilterSection
          open={openAvailability}
          onToggle={() => setOpenAvailability(!openAvailability)}
          icon={Package}
          title={t("shop.availability") as string}
          isLast
        >
          <label
            className={cn(
              "flex items-center gap-3 cursor-pointer rounded-lg py-2 px-2 -mx-2 transition-colors min-h-[44px] touch-manipulation",
              "hover:bg-muted/50 text-sm text-foreground"
            )}
          >
            <span
              className={cn(
                "h-5 w-5 shrink-0 rounded border-2 flex items-center justify-center transition-colors",
                filters.inStockOnly
                  ? "bg-primary border-primary text-primary-foreground"
                  : "border-border bg-card"
              )}
            >
              {filters.inStockOnly && (
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </span>
            <input
              type="checkbox"
              checked={filters.inStockOnly}
              onChange={toggleAvailability}
              className="sr-only"
            />
            <span>{t("shop.inStock") as string}</span>
          </label>
        </FilterSection>
      </nav>
    </aside>
  )
}
