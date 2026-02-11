"use client"

import { useI18n } from "@/lib/i18n/context"
import { Truck, Shield, RefreshCw } from "lucide-react"
import { cn } from "@/lib/utils"
import { PAYMENT_LOGOS } from "./PaymentMethods"
import Image from "next/image"

const BADGES = [
  { key: "trust.securePayment" as const, icon: Shield, iconClass: "text-emerald-600", bgClass: "bg-emerald-100" },
  { key: "trust.fastDelivery" as const, icon: Truck, iconClass: "text-sky-600", bgClass: "bg-sky-100" },
  { key: "trust.guaranteeShort" as const, icon: RefreshCw, iconClass: "text-violet-600", bgClass: "bg-violet-100" },
] as const

interface TrustBadgesProps {
  variant?: "row" | "compact" | "card"
  className?: string
}

export function TrustBadges({ variant = "row", className }: TrustBadgesProps) {
  const { t } = useI18n()

  if (variant === "compact") {
    return (
      <div className={cn("flex flex-wrap items-center justify-center gap-4 sm:gap-6", className)}>
        {BADGES.map(({ key, icon: Icon, iconClass, bgClass }) => (
          <span
            key={key}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-foreground/90"
          >
            <span className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-full", bgClass)}>
              <Icon className={cn("h-4 w-4", iconClass)} />
            </span>
            {t(key) as string}
          </span>
        ))}
      </div>
    )
  }

  if (variant === "card") {
    return (
      <div
        className={cn(
          "rounded-2xl border border-border/50 p-5 sm:p-6",
          className
        )}
        role="list"
        aria-label="Engagements"
      >
        <div className="flex flex-wrap items-center gap-x-6 gap-y-4 sm:gap-x-8">
          {BADGES.map(({ key, icon: Icon, iconClass, bgClass }) => (
            <div
              key={key}
              className="flex items-center gap-2.5 text-foreground/90"
              role="listitem"
            >
              <span className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-full", bgClass)}>
                <Icon className={cn("h-4 w-4", iconClass)} strokeWidth={2} />
              </span>
              <span className="text-sm font-medium">{t(key) as string}</span>
            </div>
          ))}
        </div>
        <div className="mt-5 pt-5 flex flex-wrap items-center gap-4 border-t border-border/40">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            {t("payment.title") as string}
          </span>
          <div className="flex items-center gap-4 opacity-90">
            {PAYMENT_LOGOS.map(({ src, alt }) => (
              <Image
                key={alt}
                src={src}
                alt={alt}
                width={36}
                height={24}
                className="object-contain h-6 w-auto"
                title={alt}
              />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn(
        "inline-flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-muted-foreground",
        className
      )}
      role="list"
      aria-label="Engagements"
    >
      {BADGES.map(({ key, icon: Icon, iconClass }, index) => (
        <span
          key={key}
          className="inline-flex items-center gap-x-6 gap-y-3 font-medium text-foreground/90"
          role="listitem"
        >
          <span className="inline-flex items-center gap-2">
            <Icon className={cn("h-4 w-4 shrink-0", iconClass)} />
            <span>{t(key) as string}</span>
          </span>
          {index < BADGES.length - 1 && (
            <span className="text-border hidden sm:inline" aria-hidden>·</span>
          )}
        </span>
      ))}
    </div>
  )
}
