import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Boutique",
  description: "Découvrez nos gourdes Thermo Chrono. Tous les modèles et couleurs.",
}

export default function BoutiqueLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
