"use client"

import Image from "next/image"
import { useI18n } from "@/lib/i18n/context"
import { cn } from "@/lib/utils"

export const PAYMENT_LOGOS = [
  { src: "/images/visa.png", alt: "Visa" },
  { src: "/images/mastercard.png", alt: "Mastercard" },
  { src: "/images/apple_pay.png", alt: "Apple Pay" },
  { src: "/images/google_pay.png", alt: "Google Pay" },
] as const

interface PaymentMethodsProps {
  className?: string
  /** Hauteur des logos en px (défaut: 28) */
  height?: number
  /** Pour le footer sur fond sombre : logos plus clairs */
  light?: boolean
  /** Afficher chaque logo dans une petite carte arrondie (style badge) */
  cardStyle?: boolean
}

export function PaymentMethods({ className = "", light = false, height = 28, cardStyle = false }: PaymentMethodsProps) {
  const { t } = useI18n()
  return (
    <div className={className}>
      <p className={cn("text-xs font-medium mb-2", light ? "text-primary-foreground/70" : "text-muted-foreground")}>
        {t("payment.title") as string}
      </p>
      <div className={cn("flex flex-wrap items-center justify-center", cardStyle ? "gap-2" : "gap-3")}>
        {PAYMENT_LOGOS.map(({ src, alt }) => {
          const img = (
            <Image
              key={alt}
              src={src}
              alt={alt}
              width={height * (alt === "Visa" || alt === "Mastercard" ? 1.8 : 1.4)}
              height={height}
              className={cn(
                "object-contain shrink-0",
                light && "brightness-0 invert opacity-90"
              )}
              title={alt}
            />
          )
          if (cardStyle) {
            return (
              <div
                key={alt}
                className="flex items-center justify-center rounded-lg bg-white border border-neutral-200/90 px-2.5 py-2 shadow-sm min-h-[40px] min-w-[56px]"
              >
                {img}
              </div>
            )
          }
          return img
        })}
      </div>
    </div>
  )
}
