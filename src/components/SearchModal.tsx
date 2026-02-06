"use client"

import { useState, useMemo, useEffect, useRef } from "react"
import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { getCatalogItems } from "@/data/products"
import { getProductDisplay } from "@/lib/i18n/product-display"
import { useI18n } from "@/lib/i18n/context"
import Link from "next/link"
import { Dialog, DialogContent, DialogClose, DialogTitle } from "@/components/ui/dialog"
import Image from "next/image"

interface SearchModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SearchModal({ open, onOpenChange }: SearchModalProps) {
  const [query, setQuery] = useState("")
  const { t } = useI18n()
  const catalogItems = useMemo(() => getCatalogItems(), [])
  const inputRef = useRef<HTMLInputElement>(null)
  const titleId = "search-modal-title"
  const resultsCountId = "search-results-count"

  useEffect(() => {
    if (open && inputRef.current) {
      const id = setTimeout(() => inputRef.current?.focus(), 100)
      return () => clearTimeout(id)
    }
  }, [open])

  const filteredProducts = useMemo(() => {
    if (!query.trim()) return []
    const lowerQuery = query.toLowerCase()
    return catalogItems.filter((item) => {
      const display = getProductDisplay(item.product, t, item.variant)
      const searchText = `${display.name} ${display.description || ""}`.toLowerCase()
      return searchText.includes(lowerQuery)
    })
  }, [query, catalogItems, t])

  const handleClose = () => {
    setQuery("")
    onOpenChange(false)
  }

  const resultsLabel =
    filteredProducts.length <= 1
      ? (t("header.searchResultsCount") as string).replace("{count}", String(filteredProducts.length))
      : (t("header.searchResultsCountPlural") as string).replace("{count}", String(filteredProducts.length))

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        id="search-dialog"
        aria-labelledby={titleId}
        aria-describedby={query ? resultsCountId : undefined}
        className="max-w-2xl w-full p-0 gap-0 h-[min(520px,calc(100vh-3rem))] flex flex-col overflow-hidden relative"
      >
        <DialogTitle id={titleId} className="sr-only">
          {t("header.searchTitle") as string}
        </DialogTitle>
        <DialogClose
          onClose={handleClose}
          className="absolute right-3 top-3 sm:right-4 sm:top-4 z-10 rounded-md bg-background/80 hover:bg-muted focus:ring-2 focus:ring-ring focus:ring-offset-2"
          aria-label={t("header.searchClose") as string}
        />
        <header className="flex-shrink-0 border-b border-border p-4 sm:p-5 pt-12 sm:pt-14">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none"
              aria-hidden
            />
            <Input
              ref={inputRef}
              type="search"
              autoComplete="off"
              placeholder={t("header.searchPlaceholder") as string}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10 pr-10 h-12 text-base"
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  if (query) setQuery("")
                  else handleClose()
                }
              }}
              aria-label={t("header.searchPlaceholder") as string}
              aria-controls={resultsCountId}
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 hover:bg-muted rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                aria-label={t("header.searchClear") as string}
              >
                <X className="h-4 w-4 text-muted-foreground" aria-hidden />
              </button>
            )}
          </div>
        </header>

        <div
          id={resultsCountId}
          role="status"
          aria-live="polite"
          aria-atomic="true"
          className="flex-1 min-h-0 flex flex-col overflow-hidden"
        >
          {query ? (
            <>
              {filteredProducts.length > 0 ? (
                <>
                  <p className="text-sm text-muted-foreground px-4 sm:px-6 pt-2 pb-2 flex-shrink-0">
                    {resultsLabel}
                  </p>
                  <div
                    className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-4 sm:px-6 pb-4 sm:pb-6"
                    role="list"
                  >
                    <div className="grid gap-2 pr-1">
                    {filteredProducts.map((item) => {
                      const display = getProductDisplay(item.product, t, item.variant)
                      const imageSrc = item.variant?.images?.[0]
                      return (
                        <Link
                          key={`${item.product.id}-${item.variant.id}`}
                          href={`/produit/${item.product.slug}`}
                          onClick={handleClose}
                          className="flex items-center gap-4 p-3 rounded-xl border border-border hover:border-primary/50 hover:bg-muted/50 transition-all group"
                          role="listitem"
                        >
                          {imageSrc && (
                            <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 rounded-lg overflow-hidden bg-muted">
                              <Image
                                src={imageSrc}
                                alt={display.name}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                                sizes="96px"
                              />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-base group-hover:text-primary transition-colors">
                              {display.name}
                            </p>
                            <p className="text-lg font-bold text-primary mt-1">
                              {item.variant.price.toFixed(2)} €
                            </p>
                          </div>
                        </Link>
                      )
                    })}
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 min-h-0 flex flex-col items-center justify-center py-8 text-center overflow-y-auto">
                  <Search className="h-12 w-12 text-muted-foreground/50 mb-4" aria-hidden />
                  <p className="text-lg font-semibold text-foreground mb-2">
                    {t("header.searchNoResults") as string}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {t("header.searchNoResultsHint") as string}
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="flex-1 min-h-0 flex flex-col items-center justify-center py-8 text-center overflow-y-auto">
              <Search className="h-12 w-12 text-muted-foreground/50 mb-4" aria-hidden />
              <p className="text-lg font-semibold text-foreground mb-2">
                {t("header.searchPrompt") as string}
              </p>
              <p className="text-sm text-muted-foreground">
                {t("header.searchPromptHint") as string}
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
