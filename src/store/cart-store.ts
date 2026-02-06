import { create } from "zustand"
import { persist } from "zustand/middleware"
import { toast } from "sonner"
import React from "react"
import { CartToastContent } from "@/components/CartToast"
import type { Product, ProductVariant, CartItem } from "@/types/product"
import { getProductById } from "@/data/products"

interface CartStore {
  items: CartItem[]
  addItem: (product: Product, variant: ProductVariant, quantity?: number) => void
  removeItem: (productId: string, variantId: string) => void
  updateQuantity: (productId: string, variantId: string, quantity: number) => void
  clearCart: () => void
  totalItems: () => number
  totalPrice: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, variant, quantity = 1) => {
        set((state) => {
          const existing = state.items.find(
            (i) => i.productId === product.id && i.variantId === variant.id
          )
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.productId === product.id && i.variantId === variant.id
                  ? { ...i, quantity: i.quantity + quantity }
                  : i
              ),
            }
          }
          return {
            items: [...state.items, { productId: product.id, variantId: variant.id, quantity }],
          }
        })
        toast.custom(
          () =>
            React.createElement(CartToastContent, {
              product,
              variant,
              quantity,
            }),
          { duration: 4500 }
        )
      },
      removeItem: (productId, variantId) =>
        set((state) => ({
          items: state.items.filter(
            (i) => !(i.productId === productId && i.variantId === variantId)
          ),
        })),
      updateQuantity: (productId, variantId, quantity) => {
        if (quantity <= 0) return get().removeItem(productId, variantId)
        set((state) => ({
          items: state.items.map((i) =>
            i.productId === productId && i.variantId === variantId ? { ...i, quantity } : i
          ),
        }))
      },
      clearCart: () => set({ items: [] }),
      totalItems: () => get().items.reduce((acc, item) => acc + item.quantity, 0),
      totalPrice: () => {
        return get().items.reduce((acc, item) => {
          const p = getProductById(item.productId)
          const v = p?.variants.find((x) => x.id === item.variantId)
          return acc + (v ? v.price * item.quantity : 0)
        }, 0)
      },
    }),
    {
      name: "cart-storage",
      version: 2,
      migrate: (persisted: unknown) => {
        const raw = persisted as { items?: unknown[] }
        const items = raw?.items ?? []
        const migrated: CartItem[] = items
          .map((item: unknown) => {
            const i = item as Record<string, unknown>
            if (i.productId && i.variantId && typeof i.quantity === "number") return i as unknown as CartItem
            const old = item as { product?: { id: string }; quantity?: number }
            if (!old.product?.id || old.quantity == null) return null
            const map: Record<string, { productId: string; variantId: string }> = {
              "gourde-connectee-bleu": { productId: "gourde-connectee-thermosmart", variantId: "bleu" },
              "gourde-noir": { productId: "gourde-connectee-thermosmart", variantId: "noir" },
              "gourde-blanc": { productId: "gourde-connectee-thermosmart", variantId: "blanc" },
            }
            const mapped = map[old.product.id]
            if (!mapped) return null
            return { productId: mapped.productId, variantId: mapped.variantId, quantity: old.quantity }
          })
          .filter((x): x is CartItem => x !== null)
        return { items: migrated }
      },
    }
  )
)
