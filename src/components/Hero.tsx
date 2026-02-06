"use client"

import { Button } from "@/components/ui/button"
import { Phone, Clock, Star, Shield, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useI18n } from "@/lib/i18n/context"

export function Hero() {
  const { t } = useI18n()
  
  return (
    <section className="relative min-h-[90vh] flex items-center bg-gradient-to-br from-background via-background to-primary/5 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
        backgroundSize: '24px 24px'
      }} />
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8 animate-in fade-in slide-in-from-bottom-4">
            <Star className="h-4 w-4 text-primary fill-primary" />
            <span className="text-sm font-semibold text-primary">{t("hero.badge")}</span>
          </div>
          
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight tracking-tight">
            {t("hero.title")}
            <span className="block mt-2 bg-gradient-to-r from-primary via-primary/90 to-primary/80 bg-clip-text text-transparent">
              {t("hero.titleHighlight")}
            </span>
          </h1>
          
          <p className="text-xl sm:text-2xl mb-10 text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {t("hero.description")} <span className="font-semibold text-foreground">{t("hero.available24h")}</span>.
          </p>
          
          {/* Numéros de téléphone */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-10">
            <a 
              href="tel:0952473625" 
              className="group flex items-center gap-2 px-6 py-3 rounded-xl bg-primary/10 hover:bg-primary/20 border border-primary/20 hover:border-primary/30 transition-all duration-300 text-foreground font-semibold shadow-sm hover:shadow-md"
            >
              <Phone className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
              <span className="text-lg">09 52 47 36 25</span>
            </a>
            <a 
              href="tel:0658686548" 
              className="group flex items-center gap-2 px-6 py-3 rounded-xl bg-background/50 hover:bg-background/70 border border-border/50 hover:border-primary/30 transition-all duration-300 text-foreground font-semibold shadow-sm hover:shadow-md backdrop-blur-sm"
            >
              <Phone className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
              <span className="text-lg">06 58 68 65 48</span>
            </a>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button size="lg" asChild className="group bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-8 py-7 text-lg shadow-lg hover:shadow-xl transition-all duration-300 h-auto">
              <Link href="/reservation" className="flex items-center">
                <Phone className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                {t("hero.bookNow")}
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-2 border-primary/20 hover:border-primary/40 hover:bg-primary/5 px-8 py-7 text-lg font-semibold transition-all duration-300 h-auto backdrop-blur-sm">
              {t("hero.viewPrices")}
            </Button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="text-center group">
              <div className="bg-primary/10 backdrop-blur-sm rounded-2xl w-20 h-20 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300 border border-primary/10 group-hover:border-primary/30 shadow-sm">
                <Clock className="h-10 w-10 text-primary" />
              </div>
              <h3 className="font-bold text-lg mb-1 text-foreground">{t("hero.features.24h")}</h3>
              <p className="text-sm text-muted-foreground">{t("hero.features.24hDesc")}</p>
            </div>
            <div className="text-center group">
              <div className="bg-primary/10 backdrop-blur-sm rounded-2xl w-20 h-20 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300 border border-primary/10 group-hover:border-primary/30 shadow-sm">
                <Star className="h-10 w-10 text-primary fill-primary/20" />
              </div>
              <h3 className="font-bold text-lg mb-1 text-foreground">{t("hero.features.quality")}</h3>
              <p className="text-sm text-muted-foreground">{t("hero.features.qualityDesc")}</p>
            </div>
            <div className="text-center group">
              <div className="bg-primary/10 backdrop-blur-sm rounded-2xl w-20 h-20 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300 border border-primary/10 group-hover:border-primary/30 shadow-sm">
                <Shield className="h-10 w-10 text-primary" />
              </div>
              <h3 className="font-bold text-lg mb-1 text-foreground">{t("hero.features.secure")}</h3>
              <p className="text-sm text-muted-foreground">{t("hero.features.secureDesc")}</p>
            </div>
            <div className="text-center group">
              <div className="bg-primary/10 backdrop-blur-sm rounded-2xl w-20 h-20 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300 border border-primary/10 group-hover:border-primary/30 shadow-sm">
                <Phone className="h-10 w-10 text-primary" />
              </div>
              <h3 className="font-bold text-lg mb-1 text-foreground">{t("hero.features.fast")}</h3>
              <p className="text-sm text-muted-foreground">{t("hero.features.fastDesc")}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
