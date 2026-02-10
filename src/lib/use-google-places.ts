"use client"

import { useState, useEffect } from "react"

declare global {
  interface Window {
    __googleMapsCallback?: () => void
    google?: {
      maps: {
        places: {
          Autocomplete: new (
            input: HTMLInputElement,
            opts?: { types?: string[]; componentRestrictions?: { country: string | string[] } }
          ) => {
            addListener: (event: string, fn: () => void) => void
            getPlace: () => GooglePlaceResult
          }
        }
      }
    }
  }
}

export interface GooglePlaceResult {
  address_components?: Array<{ long_name: string; short_name: string; types: string[] }>
  formatted_address?: string
}

const SCRIPT_URL = "https://maps.googleapis.com/maps/api/js"
const COUNTRIES = ["fr", "be", "ch", "lu"]

const SCRIPT_ID = "google-maps-places-api"

/** Charge le script Google Maps (Places) une seule fois et indique quand il est prêt. */
export function useGooglePlacesScript(): boolean {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY?.trim()
  const [isReady, setIsReady] = useState(() => typeof window !== "undefined" && Boolean(window.google?.maps?.places))

  useEffect(() => {
    if (!apiKey || typeof window === "undefined") return
    if (window.google?.maps?.places) {
      setIsReady(true)
      return
    }
    const existing = document.getElementById(SCRIPT_ID) ?? document.querySelector(`script[src*="maps.googleapis.com"]`)
    if (existing) {
      const id = setInterval(() => {
        if (window.google?.maps?.places) {
          clearInterval(id)
          setIsReady(true)
        }
      }, 50)
      return () => clearInterval(id)
    }
    const win = window as Window & { __googleMapsCallback?: () => void }
    win.__googleMapsCallback = () => setIsReady(true)
    const script = document.createElement("script")
    script.id = SCRIPT_ID
    script.src = `${SCRIPT_URL}?key=${apiKey}&libraries=places&callback=__googleMapsCallback`
    script.async = true
    script.defer = true
    document.head.appendChild(script)
    return () => {
      delete win.__googleMapsCallback
      // Ne pas retirer le script : évite double chargement au remontage / Strict Mode
    }
  }, [apiKey])

  return isReady
}

/** Extrait rue + numéro, code postal, ville, pays depuis address_components. */
export function parsePlaceAddress(place: GooglePlaceResult): {
  streetAndNumber: string
  postalCode: string
  city: string
  country: string
} {
  const components = place.address_components ?? []
  const get = (type: string) => components.find((c) => c.types.includes(type))?.long_name ?? ""
  const getShort = (type: string) => components.find((c) => c.types.includes(type))?.short_name ?? ""

  const streetNumber = get("street_number")
  const route = get("route")
  const streetAndNumber = ([streetNumber, route].filter(Boolean).join(" ") || get("subpremise") || place.formatted_address) ?? ""

  const postalCode = get("postal_code")
  const city = get("locality") || get("administrative_area_level_2") || get("administrative_area_level_1")
  const countryShort = getShort("country").toUpperCase()
  const country = COUNTRIES.includes(countryShort.toLowerCase()) ? countryShort : "FR"

  return { streetAndNumber, postalCode, city, country }
}

/** Attache l’autocomplétion Google Places à un input. Retourne une fonction pour détacher. */
export function attachPlacesAutocomplete(
  input: HTMLInputElement,
  onPlaceSelect: (place: GooglePlaceResult) => void
): () => void {
  if (!window.google?.maps?.places) return () => {}

  const autocomplete = new window.google.maps.places.Autocomplete(input, {
    types: ["address"],
    componentRestrictions: { country: COUNTRIES },
  })

  const listener = autocomplete.addListener("place_changed", () => {
    const place = autocomplete.getPlace()
    if (place?.address_components?.length) onPlaceSelect(place)
  })

  return () => {
    const l = listener as { remove?: () => void } | undefined
    if (l?.remove) l.remove()
  }
}
