"use client"

import { useI18n } from "@/lib/i18n/context"
import { Button } from "@/components/ui/button"
import { Package, Truck, Shield, ArrowRight, Sparkles, ChevronDown, ShoppingCart, Gift, Thermometer, Droplets, ShieldCheck } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ProductCard } from "@/components/ProductCard"
import { ReviewsCarousel } from "@/components/ReviewsCarousel"
import { FaqSection } from "@/components/FaqSection"
import { ScrollReveal } from "@/components/ScrollReveal"
import { product } from "@/data/products"

export default function Home() {
  const { t } = useI18n()

  return (
    <main>
      {/* Hero Section - mobile: image en hauteur naturelle, page scrollable ; desktop: header + hero = 1 page, image en pleine largeur */}
      <section className="relative w-full flex flex-col overflow-hidden sm:h-[calc(100dvh-var(--header-area-height,7.5rem))]">
        <div className="relative w-full min-h-[50vh] sm:min-h-0 z-[var(--z-base)] block sm:flex sm:flex-1 sm:items-center sm:justify-center">
          <motion.div
            className="absolute inset-0 w-full h-full"
            initial={{ opacity: 0.9, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          >
            <video
              src="/video/Accueil.mp4"
              className="w-full h-full object-cover object-center"
              autoPlay
              loop
              muted
              playsInline
              aria-label={t("common.heroImageAlt") as string}
            />
          </motion.div>
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-primary/30 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          />
        </div>
        <div className="absolute inset-0 bg-black/45 z-[var(--z-content)] sm:bg-black/50 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-transparent to-black/65 z-[var(--z-content)] sm:from-black/60 sm:to-black/70 pointer-events-none" />
        <div className="absolute inset-0 container mx-auto px-3 sm:px-6 lg:px-8 py-2 sm:py-20 lg:py-28 z-[var(--z-above-content)] flex flex-col min-h-0 overflow-hidden">
          <div className="flex-1 flex flex-col items-center justify-center min-h-0 py-1">
            <div className="max-w-3xl mx-auto text-center w-full flex flex-col items-center justify-center">
            <motion.span
              className="inline-flex items-center gap-1.5 rounded-full border border-white/40 bg-white/15 px-2.5 py-1 text-[10px] sm:text-sm font-semibold text-white backdrop-blur-md mb-1 sm:mb-8 shadow-lg shrink-0"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              whileHover={{ scale: 1.03 }}
            >
              <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 text-amber-200" />
              {t("home.badgeBrand") as string}
            </motion.span>
            <motion.h1
              className="text-lg sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight tracking-tight text-white mb-0.5 sm:mb-5 break-words [text-shadow:_0_2px_24px_rgb(0_0_0_/_60%)] line-clamp-3 sm:line-clamp-none"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
            >
              {t("home.title") as string}
            </motion.h1>
            <motion.p
              className="text-xs sm:text-2xl lg:text-3xl text-white/95 font-medium mb-0.5 sm:mb-1 [text-shadow:_0_1px_12px_rgb(0_0_0_/_50%)] line-clamp-2 sm:line-clamp-none"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {t("home.subtitle") as string}
            </motion.p>
            <motion.p
              className="text-[10px] sm:text-xl text-white/90 mb-1.5 sm:mb-10 [text-shadow:_0_1px_10px_rgb(0_0_0_/_50%)] line-clamp-1 sm:line-clamp-none"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <span className="bg-gradient-to-r from-white to-white/80 bg-clip-text font-semibold">
                {t("home.subtitle2") as string}
              </span>
            </motion.p>
            <motion.div
              className="flex flex-col items-center justify-center gap-1.5 sm:gap-4 shrink-0"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <div className="flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-white text-black hover:bg-white/95 min-h-[36px] h-9 px-3 text-[11px] sm:min-h-[48px] sm:h-12 sm:px-8 sm:text-base font-semibold rounded-lg sm:rounded-xl shadow-2xl shadow-black/30 gap-1 sm:gap-2 transition-all duration-300 hover:scale-105 hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.5)] touch-manipulation active:scale-[0.98]"
                >
                  <Link href={`/produit/${product.slug}`}>
                    {t("home.viewProduct") as string}
                    <ArrowRight className="h-3 w-3 sm:h-5 sm:w-5" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  className="min-h-[36px] h-9 px-3 text-[11px] sm:min-h-[48px] sm:h-12 sm:px-6 sm:text-base rounded-lg sm:rounded-xl border-2 border-white/90 bg-white/15 text-white hover:bg-white/25 hover:border-white hover:text-white backdrop-blur-md transition-all duration-300 font-semibold shadow-lg hover:scale-[1.02] gap-1 sm:gap-2 touch-manipulation active:scale-[0.98]"
                >
                  <Link href="/panier" className="inline-flex items-center gap-1 sm:gap-2">
                    <ShoppingCart className="h-3 w-3 sm:h-5 sm:w-5" />
                    {t("header.cart") as string}
                  </Link>
                </Button>
              </div>
            </motion.div>
            </div>
          </div>
          <div className="shrink-0 flex flex-col items-center pt-4 sm:pt-6 pb-2 sm:pb-4">
            <motion.div
              className="hidden sm:flex flex-wrap items-center justify-center gap-6 rounded-2xl border border-white/20 bg-white/5 px-6 py-4 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <span className="flex items-center gap-2 text-white/90 font-medium">
                <Truck className="h-5 w-5 text-white/90" />
                {t("home.fastDelivery") as string}
              </span>
              <span className="flex items-center gap-2 text-white/90 font-medium">
                <Gift className="h-5 w-5 text-white/90" />
                {t("home.badgeFreeDelivery") as string}
              </span>
              <span className="flex items-center gap-2 text-white/90 font-medium">
                <Shield className="h-5 w-5 text-white/90" />
                {t("home.securePayment") as string}
              </span>
            </motion.div>
          </div>
        </div>
        <motion.div
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[var(--z-above-content)] flex flex-col items-center gap-1 min-h-[44px] justify-center pb-[env(safe-area-inset-bottom,0)]"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <Link
            href="#featured"
            className="text-xs sm:text-sm font-semibold text-white/95 hover:text-white underline-offset-4 hover:underline transition-colors flex flex-col items-center gap-1 animate-pulse hover:animate-none min-h-[44px] justify-center touch-manipulation"
            aria-label={t("home.scrollDiscover") as string}
          >
            <span>{t("home.scrollDiscover") as string}</span>
            <ChevronDown className="h-6 w-6 sm:h-5 sm:w-5" />
          </Link>
        </motion.div>
      </section>

      {/* Produit à la une */}
      <section id="featured" className="py-14 sm:py-20 lg:py-24 bg-background scroll-mt-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal direction="up" delay={0.1}>
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight mb-2">{t("home.featured") as string}</h2>
              <div className="w-14 h-1 bg-primary rounded-full mx-auto mb-4" />
              <p className="text-muted-foreground max-w-xl mx-auto mb-2">{t("home.featuredIntro") as string}</p>
              <p className="text-sm text-primary font-medium">{t("home.featuredSubtitle") as string}</p>
            </div>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={0.2}>
            <div className="flex justify-center max-w-md mx-auto">
              <div className="w-full sm:w-[380px]">
                <ProductCard product={product} variant={product.variants[0]} />
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-8 max-w-2xl mx-auto">
              {[
                { Icon: Thermometer, label: t("home.featuredPoint1") as string, color: "bg-amber-100 text-amber-800 [&_svg]:text-amber-600" },
                { Icon: Droplets, label: t("home.featuredPoint2") as string, color: "bg-sky-100 text-sky-800 [&_svg]:text-sky-600" },
                { Icon: ShieldCheck, label: t("home.featuredPoint3") as string, color: "bg-emerald-100 text-emerald-800 [&_svg]:text-emerald-600" },
                { Icon: Truck, label: t("home.featuredPoint4") as string, color: "bg-violet-100 text-violet-800 [&_svg]:text-violet-600" },
              ].map(({ Icon, label, color }, i) => (
                <span
                  key={i}
                  className={`inline-flex items-center justify-center gap-2 rounded-full px-3 py-2.5 sm:px-4 text-sm font-medium text-center ${color}`}
                >
                  <Icon className="h-4 w-4 shrink-0" aria-hidden />
                  {label}
                </span>
              ))}
            </div>
          </ScrollReveal>
          <ScrollReveal direction="fade" delay={0.3}>
            <div className="mt-10 pt-8 border-t border-border text-center">
              <Link
                href="/boutique"
                className="inline-flex items-center gap-2 text-primary font-semibold hover:underline underline-offset-4 transition-colors duration-200 text-sm"
              >
                {t("home.viewShop") as string}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Description */}
      <section className="py-14 sm:py-20 lg:py-24 bg-muted">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal direction="up" delay={0.1}>
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight mb-2">{t("home.aboutTitle") as string}</h2>
              <div className="w-14 h-1 bg-primary rounded-full mx-auto mb-4" />
              <p className="text-muted-foreground text-lg max-w-xl mx-auto">{t("home.aboutLead") as string}</p>
            </div>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={0.2}>
            <div className="max-w-2xl mx-auto rounded-2xl border border-border bg-card p-8 lg:p-12 shadow-md">
              <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
                <p>{t("home.description1") as string}</p>
                <p>{t("home.description2") as string}</p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Avantages - 3 icônes avec style accent */}
      <section className="py-14 sm:py-20 lg:py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal direction="up" delay={0.1}>
            <div className="text-center mb-14">
              <h2 className="text-3xl font-bold tracking-tight mb-2">{t("home.whyUs") as string}</h2>
              <div className="w-14 h-1 bg-primary rounded-full mx-auto mb-4" />
              <p className="text-muted-foreground max-w-xl mx-auto">{t("home.whyUsLead") as string}</p>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10 max-w-5xl mx-auto">
            {[
              { icon: Package, titleKey: "home.whyUsCard1Title" as const, subtextKey: "trust.guaranteeShort" as const, iconBg: "bg-amber-100 border-amber-200", iconColor: "text-amber-600" },
              { icon: Truck, titleKey: "home.whyUsCard2Title" as const, subtextKey: "trust.fastDelivery" as const, iconBg: "bg-sky-100 border-sky-200", iconColor: "text-sky-600" },
              { icon: Shield, titleKey: "home.whyUsCard3Title" as const, subtextKey: "trust.securePayment" as const, iconBg: "bg-emerald-100 border-emerald-200", iconColor: "text-emerald-600" },
            ].map((item, index) => {
              const Icon = item.icon
              return (
                <ScrollReveal key={index} direction="up" delay={0.1 + index * 0.1}>
                  <motion.div
                    className="text-center rounded-2xl border border-border bg-card p-8 shadow-sm transition-all duration-300 hover:shadow-md hover:border-primary/20"
                    whileHover={{ y: -6 }}
                    aria-label={t(item.titleKey) as string}
                  >
                    <motion.div
                      className={`rounded-2xl w-16 h-16 flex items-center justify-center mx-auto mb-5 border ${item.iconBg}`}
                      whileHover={{ scale: 1.08 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Icon className={`h-8 w-8 ${item.iconColor}`} aria-hidden />
                    </motion.div>
                    <h3 className="font-bold text-lg text-foreground">{t(item.titleKey) as string}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{t(item.subtextKey) as string}</p>
                  </motion.div>
                </ScrollReveal>
              )
            })}
          </div>
        </div>
      </section>

      {/* Avis clients — carrousel qui défile */}
      <section id="avis" className="py-14 sm:py-20 lg:py-24 bg-muted scroll-mt-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <ReviewsCarousel />
        </div>
      </section>

      {/* FAQ */}
      <section className="py-14 sm:py-20 lg:py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl">
          <FaqSection />
        </div>
      </section>

      {/* Autres couleurs */}
      <section className="py-10 sm:py-20 lg:py-24 bg-muted">
        <div className="container mx-auto px-3 sm:px-6 lg:px-8">
          <ScrollReveal direction="up" delay={0.1}>
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">{t("home.similarProducts") as string}</h2>
              <div className="w-14 h-1 bg-primary rounded-full mx-auto mb-3 sm:mb-4" />
              <p className="text-sm text-muted-foreground max-w-md mx-auto mb-1.5 sm:mb-2">
                {product.variants.length} couleurs disponibles
              </p>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-1 sm:flex sm:flex-wrap sm:justify-center gap-4 sm:gap-6">
            {product.variants.map((v, index) => (
              <ScrollReveal key={v.id} direction="up" delay={0.15 + index * 0.05}>
                <div className="min-w-0 w-full sm:w-[280px] lg:w-[260px]">
                  <ProductCard product={product} variant={v} className="w-full" />
                </div>
              </ScrollReveal>
            ))}
          </div>
          <ScrollReveal direction="fade" delay={0.3}>
            <div className="text-center mt-8 sm:mt-12">
              <Link
                href="/boutique"
                className="inline-flex items-center justify-center gap-2 min-h-[44px] px-6 py-3 sm:min-h-0 sm:py-0 sm:px-0 text-primary font-semibold hover:underline underline-offset-4 transition-colors duration-200 rounded-lg border-2 border-primary/30 bg-primary/5 sm:border-0 sm:bg-transparent touch-manipulation"
              >
                {t("home.viewShop") as string}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </main>
  )
}
