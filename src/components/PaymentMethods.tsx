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
}

export function PaymentMethods({ className = "", light = false, height = 28 }: PaymentMethodsProps) {
  const { t } = useI18n()
  return (
    <div className={className}>
      <p className={cn("text-xs font-medium mb-2", light ? "text-primary-foreground/70" : "text-muted-foreground")}>
        {t("payment.title") as string}
      </p>
      <div className="flex flex-wrap items-center gap-3">
        {PAYMENT_LOGOS.map(({ src, alt }) => (
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
        ))}
      </div>
    </div>
  )
}
