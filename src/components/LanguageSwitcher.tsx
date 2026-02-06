"use client"

import { useI18n } from "@/lib/i18n/context"
import { useState, useRef, useEffect } from "react"
import { ChevronDown } from "lucide-react"
import "flag-icons/css/flag-icons.min.css"

export function LanguageSwitcher() {
  const { locale, setLocale } = useI18n()
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const languages = [
    { 
      code: "fr" as const, 
      label: "Français", 
      codeLabel: "FR", 
      flagCode: "fr"
    },
    { 
      code: "en" as const, 
      label: "English", 
      codeLabel: "EN", 
      flagCode: "gb"
    },
  ]

  const currentLanguage = languages.find(l => l.code === locale)

  // Fermer le menu si on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="min-h-[44px] h-11 px-3 sm:px-4 inline-flex items-center justify-center rounded-md bg-background border border-input hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none transition-colors touch-manipulation"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label="Changer la langue"
      >
        <span className={`fi fi-${currentLanguage?.flagCode} mr-1 sm:mr-2`}></span>
        <span className="hidden sm:inline font-semibold">
          {currentLanguage?.codeLabel}
        </span>
        <ChevronDown className={`ml-1 h-3 w-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1.5 w-44 bg-card border border-border rounded-md shadow-lg z-[var(--z-dropdown)] overflow-hidden">
          <div className="p-2">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  setLocale(lang.code)
                  setIsOpen(false)
                }}
                className={`w-full text-left min-h-[44px] px-4 py-3 rounded-lg transition-colors touch-manipulation ${
                  locale === lang.code
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-accent hover:text-accent-foreground active:bg-accent"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`fi fi-${lang.flagCode}`}></span>
                  <div className="flex flex-col">
                    <span className="font-semibold text-sm">{lang.label}</span>
                    <span className="text-xs opacity-80">{lang.codeLabel}</span>
                  </div>
                  {locale === lang.code && (
                    <span className="ml-auto text-sm">✓</span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

