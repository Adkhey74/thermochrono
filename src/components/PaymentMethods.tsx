"use client"

import { useI18n } from "@/lib/i18n/context"

interface PaymentMethodsProps {
  className?: string
  /** Hauteur des logos (défaut: 24) - conservé pour compatibilité, non utilisé sans images */
  height?: number
  /** Pour le footer sur fond sombre : texte en clair */
  light?: boolean
}

export function PaymentMethods({ className = "", light = false }: PaymentMethodsProps) {
  const { t } = useI18n()
  return (
    <div className={className}>
      <p className={`text-xs font-medium mb-2 ${light ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
        {t("payment.title") as string}
      </p>
      <p className={`text-sm ${light ? "text-primary-foreground/90" : "text-muted-foreground"}`}>
        {t("payment.methods") as string}
      </p>
    </div>
  )
}
