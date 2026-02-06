"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from "@/components/ui/navigation-menu"
import { Menu, X, ShoppingBag } from "lucide-react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { LanguageSwitcher } from "@/components/LanguageSwitcher"
import { ProductSearch } from "@/components/ProductSearch"
import { useI18n } from "@/lib/i18n/context"
import { useCartStore } from "@/store/cart-store"
import { cn } from "@/lib/utils"

const linkVariants = {
  closed: { opacity: 0, x: -12 },
  open: { opacity: 1, x: 0 },
}

export function Header() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { t } = useI18n()
  const totalItems = useCartStore((s) => s.totalItems())

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/"
    if (href === "/boutique") return pathname === "/boutique" || pathname.startsWith("/produit")
    if (href === "/a-propos") return pathname === "/a-propos"
    return pathname.startsWith(href)
  }

  // Évite le mismatch d'hydratation : le panier (persist) n'est disponible qu'après le montage client
  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <header className="sticky top-0 z-[var(--z-header)] w-full border-b border-border bg-background backdrop-blur-md supports-[backdrop-filter]:bg-background/95 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 sm:h-20 items-center justify-between">
          <div>
            <Link href="/" className="flex items-center gap-2 sm:gap-3 group">
              <div className="relative h-14 sm:h-16 w-auto min-w-[140px] sm:min-w-[180px]">
                <Image
                  src="/images/logo.png"
                  alt={t("common.brandName") as string}
                  width={200}
                  height={72}
                  className="h-14 sm:h-16 w-auto object-contain object-left"
                  priority
                />
              </div>
            </Link>
          </div>

          <nav className="hidden lg:flex flex-1 justify-center">
            <NavigationMenu viewport={false}>
              <NavigationMenuList className="space-x-1">
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link
                      href="/"
                      className={cn(
                        "nav-link group relative inline-flex h-11 w-max items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold text-foreground",
                        "transition-all duration-200 ease-out hover:bg-muted/80 hover:text-foreground",
                        "focus:bg-muted focus:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                        "after:absolute after:bottom-1.5 after:left-4 after:right-4 after:h-0.5 after:rounded-full after:bg-primary after:transition-transform after:duration-300 after:ease-out",
                        isActive("/") ? "bg-muted after:scale-x-100" : "after:scale-x-0 hover:after:scale-x-100"
                      )}
                      aria-current={isActive("/") ? "page" : undefined}
                    >
                      {t("header.home") as string}
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link
                      href="/boutique"
                      className={cn(
                        "nav-link group relative inline-flex h-11 w-max items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold text-foreground",
                        "transition-all duration-200 ease-out hover:bg-muted/80 hover:text-foreground",
                        "focus:bg-muted focus:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                        "after:absolute after:bottom-1.5 after:left-4 after:right-4 after:h-0.5 after:rounded-full after:bg-primary after:transition-transform after:duration-300 after:ease-out",
                        isActive("/boutique") ? "bg-muted after:scale-x-100" : "after:scale-x-0 hover:after:scale-x-100"
                      )}
                      aria-current={isActive("/boutique") ? "page" : undefined}
                    >
                      {t("header.shop") as string}
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link
                      href="/a-propos"
                      className={cn(
                        "nav-link group relative inline-flex h-11 w-max items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold text-foreground",
                        "transition-all duration-200 ease-out hover:bg-muted/80 hover:text-foreground",
                        "focus:bg-muted focus:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                        "after:absolute after:bottom-1.5 after:left-4 after:right-4 after:h-0.5 after:rounded-full after:bg-primary after:transition-transform after:duration-300 after:ease-out",
                        isActive("/a-propos") ? "bg-muted after:scale-x-100" : "after:scale-x-0 hover:after:scale-x-100"
                      )}
                      aria-current={isActive("/a-propos") ? "page" : undefined}
                    >
                      {t("header.about") as string}
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link
                      href="/panier"
                      className={cn(
                        "nav-link group relative inline-flex h-11 w-max items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold text-foreground",
                        "transition-all duration-200 ease-out hover:bg-muted/80 hover:text-foreground",
                        "focus:bg-muted focus:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                        "after:absolute after:bottom-1.5 after:left-4 after:right-4 after:h-0.5 after:rounded-full after:bg-primary after:transition-transform after:duration-300 after:ease-out",
                        isActive("/panier") ? "bg-muted after:scale-x-100" : "after:scale-x-0 hover:after:scale-x-100"
                      )}
                      aria-current={isActive("/panier") ? "page" : undefined}
                    >
                      {t("header.cart") as string}
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <ProductSearch />
            <Link href="/panier" className="relative flex items-center justify-center min-h-[44px] min-w-[44px]">
              <Button variant="ghost" size="icon" className="relative h-11 w-11 touch-manipulation">
                <ShoppingBag className="h-5 w-5" />
                {mounted && totalItems > 0 && (
                  <span
                    className={cn(
                      "absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground"
                    )}
                  >
                    {totalItems > 99 ? "99+" : totalItems}
                  </span>
                )}
              </Button>
            </Link>
            <LanguageSwitcher />
          </div>

          <div className="lg:hidden flex items-center gap-1">
            <ProductSearch />
            <Link href="/panier" className="relative flex items-center justify-center min-h-[44px] min-w-[44px]">
              <Button variant="ghost" size="icon" className="relative h-11 w-11 touch-manipulation">
                <ShoppingBag className="h-5 w-5" />
                {mounted && totalItems > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                    {totalItems > 99 ? "99+" : totalItems}
                  </span>
                )}
              </Button>
            </Link>
            <LanguageSwitcher />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="h-11 w-11 min-h-[44px] min-w-[44px] touch-manipulation"
              aria-expanded={isMobileMenuOpen}
              aria-label={isMobileMenuOpen ? (t("header.closeMenu") as string) : (t("header.openMenu") as string)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        <AnimatePresence initial={false}>
          {isMobileMenuOpen && (
            <motion.div
              key="mobile-menu"
              className="lg:hidden overflow-hidden border-t border-border/40 bg-background/98 backdrop-blur-md"
              initial="closed"
              animate="open"
              exit="closed"
              variants={{
                closed: {
                  opacity: 0,
                  maxHeight: 0,
                  transition: { duration: 0.22, ease: [0.4, 0, 0.2, 1] },
                },
                open: {
                  opacity: 1,
                  maxHeight: 280,
                  transition: {
                    duration: 0.32,
                    ease: [0.32, 0.72, 0, 1],
                    staggerChildren: 0.06,
                    delayChildren: 0.04,
                  },
                },
              }}
            >
              <div className="px-4 py-4 space-y-1">
                <motion.div variants={linkVariants}>
                  <Link
                    href="/"
                    className={cn(
                      "flex items-center min-h-[48px] px-4 py-3 rounded-lg text-foreground hover:bg-muted/80 active:bg-muted transition-all duration-200 ease-out touch-manipulation",
                      isActive("/") ? "bg-muted font-semibold" : "font-medium"
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                    aria-current={isActive("/") ? "page" : undefined}
                  >
                    {t("header.home") as string}
                  </Link>
                </motion.div>
                <motion.div variants={linkVariants}>
                  <Link
                    href="/boutique"
                    className={cn(
                      "flex items-center min-h-[48px] px-4 py-3 rounded-lg text-foreground hover:bg-muted/80 active:bg-muted transition-all duration-200 ease-out touch-manipulation",
                      isActive("/boutique") ? "bg-muted font-semibold" : "font-medium"
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                    aria-current={isActive("/boutique") ? "page" : undefined}
                  >
                    {t("header.shop") as string}
                  </Link>
                </motion.div>
                <motion.div variants={linkVariants}>
                  <Link
                    href="/a-propos"
                    className={cn(
                      "flex items-center min-h-[48px] px-4 py-3 rounded-lg text-foreground hover:bg-muted/80 active:bg-muted transition-all duration-200 ease-out touch-manipulation",
                      isActive("/a-propos") ? "bg-muted font-semibold" : "font-medium"
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                    aria-current={isActive("/a-propos") ? "page" : undefined}
                  >
                    {t("header.about") as string}
                  </Link>
                </motion.div>
                <motion.div variants={linkVariants}>
                  <Link
                    href="/panier"
                    className={cn(
                      "flex items-center min-h-[48px] px-4 py-3 rounded-lg text-foreground hover:bg-muted/80 active:bg-muted transition-all duration-200 ease-out touch-manipulation",
                      isActive("/panier") ? "bg-muted font-semibold" : "font-medium"
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                    aria-current={isActive("/panier") ? "page" : undefined}
                  >
                    {t("header.cart") as string}
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}
