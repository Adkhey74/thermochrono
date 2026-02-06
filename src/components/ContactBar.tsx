"use client"

import { Phone, X } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useI18n } from "@/lib/i18n/context"

export function ContactBar() {
  const [isVisible, setIsVisible] = useState(true)
  const { t } = useI18n()

  if (!isVisible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-t border-border/50 shadow-lg animate-in slide-in-from-bottom-2">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-1">
            <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">{t("contactBar.callUs")}:</span>
            </div>
            <a 
              href="tel:0952473625" 
              className="group flex items-center gap-2 px-4 py-2 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-sm shadow-md hover:shadow-lg transition-all duration-200"
            >
              <Phone className="h-4 w-4 group-hover:scale-110 transition-transform" />
              <span>09 52 47 36 25</span>
            </a>
            <a 
              href="tel:0658686548" 
              className="group flex items-center gap-2 px-4 py-2 rounded-lg bg-background border-2 border-primary/20 hover:border-primary/40 hover:bg-primary/5 text-foreground font-semibold text-sm transition-all duration-200"
            >
              <Phone className="h-4 w-4 text-primary group-hover:scale-110 transition-transform" />
              <span>06 58 68 65 48</span>
            </a>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsVisible(false)}
            className="h-8 w-8 shrink-0"
            aria-label={t("contactBar.close") as string}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

