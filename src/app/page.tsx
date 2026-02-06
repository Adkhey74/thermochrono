"use client"

import { useI18n } from "@/lib/i18n/context"
import { Button } from "@/components/ui/button"
import { Package, Truck, Shield, ArrowRight, Sparkles, ChevronDown, ShoppingCart } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { ProductCard } from "@/components/ProductCard"
import { product } from "@/data/products"

export default function Home() {
  const { t } = useI18n()

  return (
    <main>
      {/* Hero Section - mobile: ratio 3/4, contenu allégé pour éviter le chevauchement */}
      <section className="relative aspect-[3/4] min-h-0 sm:aspect-auto sm:min-h-[90vh] flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/Acceuil.jpeg"
            alt={t("common.heroImageAlt") as string}
            fill
            className="object-cover object-center scale-100 sm:scale-105 sm:animate-[scale_20s_ease-in-out_infinite_alternate]"
            sizes="100vw"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-black/50 z-[1]" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/70 z-[1]" />
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-20 lg:py-28 z-20 flex-1 flex items-center min-h-0">
          <div className="max-w-3xl mx-auto text-center w-full">
            <motion.span
              className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/15 px-3 py-1.5 text-xs sm:text-sm font-semibold text-white backdrop-blur-md mb-2 sm:mb-8 shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              whileHover={{ scale: 1.03 }}
            >
              <Sparkles className="h-4 w-4 text-amber-200" />
              {t("home.badgeBrand") as string}
            </motion.span>
            <motion.h1
              className="text-2xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight tracking-tight text-white mb-1.5 sm:mb-5 break-words [text-shadow:_0_2px_24px_rgb(0_0_0_/_60%)]"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
            >
              {t("home.title") as string}
            </motion.h1>
            <motion.p
              className="text-sm sm:text-2xl lg:text-3xl text-white/95 font-medium mb-1 sm:mb-1 [text-shadow:_0_1px_12px_rgb(0_0_0_/_50%)]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {t("home.subtitle") as string}
            </motion.p>
            <motion.p
              className="text-xs sm:text-xl text-white/90 mb-3 sm:mb-10 [text-shadow:_0_1px_10px_rgb(0_0_0_/_50%)]"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <span className="bg-gradient-to-r from-white to-white/80 bg-clip-text font-semibold">
                {t("home.subtitle2") as string}
              </span>
            </motion.p>
            <motion.div
              className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Button
                asChild
                size="lg"
                className="bg-white text-black hover:bg-white/95 min-h-[44px] h-11 px-5 sm:min-h-[48px] sm:h-12 sm:px-8 text-sm sm:text-base font-semibold rounded-xl shadow-2xl shadow-black/30 gap-2 transition-all duration-300 hover:scale-105 hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.5)] touch-manipulation active:scale-[0.98]"
              >
                <Link href={`/produit/${product.slug}`}>
                  {t("home.viewProduct") as string}
                  <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                className="min-h-[44px] h-11 px-5 sm:min-h-[48px] sm:h-12 sm:px-6 rounded-xl border-2 border-white/90 bg-white/15 text-white hover:bg-white/25 hover:border-white hover:text-white backdrop-blur-md transition-all duration-300 font-semibold shadow-lg hover:scale-[1.02] gap-2 touch-manipulation active:scale-[0.98] text-sm sm:text-base"
              >
                <Link href="/panier" className="inline-flex items-center gap-2">
                  <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
                  {t("header.cart") as string}
                </Link>
              </Button>
            </motion.div>
            <motion.p
              className="hidden sm:block mt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Link
                href="#featured"
                className="text-sm font-medium text-white/80 hover:text-white underline-offset-4 hover:underline transition-colors"
              >
                {t("home.viewShop") as string}
              </Link>
            </motion.p>
            <motion.div
              className="hidden sm:flex mt-10 flex-wrap items-center justify-center gap-6 rounded-2xl border border-white/20 bg-white/5 px-6 py-4 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              <span className="flex items-center gap-2 text-white/90 font-medium">
                <Truck className="h-5 w-5 text-white/90" />
                {t("home.fastDelivery") as string}
              </span>
              <span className="flex items-center gap-2 text-white/90 font-medium">
                <Shield className="h-5 w-5 text-white/90" />
                {t("home.securePayment") as string}
              </span>
            </motion.div>
          </div>
        </div>
        {/* Indicateur de scroll */}
        <motion.a
          href="#featured"
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1 text-white/80 hover:text-white transition-colors min-h-[44px] justify-center pb-[env(safe-area-inset-bottom,0)]"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          aria-label={t("home.scrollDiscover") as string}
        >
          <span className="text-xs font-medium">{t("home.scrollDiscover") as string}</span>
          <motion.span
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown className="h-6 w-6" />
          </motion.span>
        </motion.a>
      </section>

      {/* Produit à la une */}
      <section id="featured" className="py-14 sm:py-20 lg:py-24 bg-background scroll-mt-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-14"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold tracking-tight mb-2">{t("home.featured") as string}</h2>
            <div className="w-14 h-1 bg-primary rounded-full mx-auto mb-4" />
            <p className="text-muted-foreground max-w-xl mx-auto">{t("home.featuredIntro") as string}</p>
          </motion.div>
          <motion.div
            className="flex justify-center max-w-md mx-auto"
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-full sm:w-[380px]">
              <ProductCard product={product} variant={product.variants[0]} />
            </div>
          </motion.div>
          <motion.p
            className="text-center mt-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <Link
              href="/boutique"
              className="inline-flex items-center gap-2 text-primary font-semibold hover:underline underline-offset-4 transition-colors duration-200"
            >
              {t("home.viewShop") as string}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.p>
        </div>
      </section>

      {/* Description */}
      <section className="py-14 sm:py-20 lg:py-24 bg-muted">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="max-w-3xl mx-auto text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold tracking-tight mb-2">{t("home.aboutTitle") as string}</h2>
            <div className="w-14 h-1 bg-primary rounded-full mx-auto" />
          </motion.div>
          <motion.div
            className="max-w-4xl mx-auto rounded-2xl border border-border bg-card p-8 lg:p-12 shadow-sm"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
          >
            <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
              <p>{t("home.description1") as string}</p>
              <p>{t("home.description2") as string}</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Avantages - 3 icônes avec style accent */}
      <section className="py-14 sm:py-20 lg:py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-14"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold tracking-tight mb-2">{t("home.whyUs") as string}</h2>
            <div className="w-14 h-1 bg-primary rounded-full mx-auto" />
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10 max-w-5xl mx-auto">
            {[
              { icon: Package, text: t("home.carefulProducts") as string },
              { icon: Truck, text: t("home.fastDelivery") as string },
              { icon: Shield, text: t("home.securePayment") as string },
            ].map((item, index) => {
              const Icon = item.icon
              return (
                <motion.div
                  key={index}
                  className="text-center rounded-2xl border border-border bg-card p-8 shadow-sm transition-all duration-300 hover:shadow-md hover:border-primary/20"
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -6 }}
                >
                  <motion.div
                    className="bg-primary/10 rounded-2xl w-16 h-16 flex items-center justify-center mx-auto mb-5 border border-primary/20"
                    whileHover={{ scale: 1.08 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Icon className="h-8 w-8 text-primary" />
                  </motion.div>
                  <h3 className="font-bold text-lg text-foreground">{item.text}</h3>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Autres couleurs */}
      <section className="py-14 sm:py-20 lg:py-24 bg-muted">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold tracking-tight mb-2">{t("home.similarProducts") as string}</h2>
            <div className="w-14 h-1 bg-primary rounded-full mx-auto mb-4" />
            <p className="text-muted-foreground max-w-md mx-auto">
              {product.variants.length} couleurs disponibles
            </p>
          </motion.div>
          <motion.div
            className="flex flex-wrap justify-center gap-6"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5 }}
          >
            {product.variants.map((v) => (
              <div key={v.id} className="w-full sm:w-[280px] lg:w-[260px]">
                <ProductCard product={product} variant={v} />
              </div>
            ))}
          </motion.div>
          <motion.p
            className="text-center mt-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <Link
              href="/boutique"
              className="inline-flex items-center gap-2 text-primary font-semibold hover:underline underline-offset-4 transition-colors duration-200"
            >
              {t("home.viewShop") as string}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.p>
        </div>
      </section>
    </main>
  )
}
