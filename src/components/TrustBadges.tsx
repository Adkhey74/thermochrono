"use client"

import { useI18n } from "@/lib/i18n/context"
import { Truck, Shield, RefreshCw, CreditCard } from "lucide-react"
import { cn } from "@/lib/utils"

const BADGES = [
  { key: "trust.securePayment" as const, icon: Shield },
  { key: "trust.fastDelivery" as const, icon: Truck },
  { key: "trust.guaranteeShort" as const, icon: RefreshCw },
] as const

interface TrustBadgesProps {
  variant?: "row" | "compact"
  className?: string
}

export function TrustBadges({ variant = "row", className }: TrustBadgesProps) {
  const { t } = useI18n()

  if (variant === "compact") {
    return (
      <div className={cn("flex flex-wrap items-center gap-4 sm:gap-6", className)}>
        {BADGES.map(({ key, icon: Icon }) => (
          <span
            key={key}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-muted-foreground"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Icon className="h-4 w-4" />
            </span>
            {t(key) as string}
          </span>
        ))}
      </div>
    )
  }

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-muted-foreground",
        className
      )}
      role="list"
      aria-label="Engagements"
    >
      {BADGES.map(({ key, icon: Icon }, index) => (
        <span
          key={key}
          className="inline-flex items-center gap-x-6 gap-y-3 font-medium"
          role="listitem"
        >
          <span className="inline-flex items-center gap-2">
            <Icon className="h-4 w-4 shrink-0 text-primary/70" />
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
