"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { translations, Locale } from "./translations"

type I18nContextType = {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: string) => string | string[]
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

export function I18nProvider({ children, defaultLocale = "fr" }: { children: React.ReactNode; defaultLocale?: Locale }) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale)

  useEffect(() => {
    // Récupérer la langue sauvegardée
    const savedLocale = localStorage.getItem("locale") as Locale | null
    if (savedLocale && (savedLocale === "fr" || savedLocale === "en")) {
      setLocaleState(savedLocale)
    }
  }, [])

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale)
    localStorage.setItem("locale", newLocale)
  }

  const t = (key: string): string | string[] => {
    const keys = key.split(".")
    let value: unknown = translations[locale]

    for (const k of keys) {
      if (value && typeof value === "object" && k in value) {
        value = value[k as keyof typeof value]
      } else {
        // Fallback sur le français si la clé n'existe pas
        value = translations.fr
        for (const k2 of keys) {
          if (value && typeof value === "object" && k2 in value) {
            value = value[k2 as keyof typeof value]
          } else {
            return key
          }
        }
        break
      }
    }

    if (typeof value === "string" || Array.isArray(value)) {
      return value
    }
    return key
  }

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (context === undefined) {
    throw new Error("useI18n must be used within an I18nProvider")
  }
  return context
}

