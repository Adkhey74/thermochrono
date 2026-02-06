"use client"

import { cn } from "@/lib/utils"

type SkeletonProps = React.HTMLAttributes<HTMLDivElement>

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  )
}

export function ProductCardSkeleton() {
  return (
    <div className="rounded-2xl border border-border/80 bg-card shadow-sm overflow-hidden">
      <Skeleton className="aspect-[3/4] w-full" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-6 w-1/4" />
        <Skeleton className="h-12 w-full rounded-lg" />
      </div>
    </div>
  )
}

