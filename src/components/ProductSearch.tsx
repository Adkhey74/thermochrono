"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SearchModal } from "@/components/SearchModal"
import { useI18n } from "@/lib/i18n/context"

export function ProductSearch() {
  const [isOpen, setIsOpen] = useState(false)
  const { t } = useI18n()

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(true)}
        className="h-11 w-11 min-h-[44px] min-w-[44px] touch-manipulation"
        aria-label={t("header.searchButtonLabel") as string}
      >
        <Search className="h-5 w-5" />
      </Button>
      <SearchModal open={isOpen} onOpenChange={setIsOpen} />
    </>
  )
}

