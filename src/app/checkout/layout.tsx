/**
 * Layout dédié au checkout : le contenu prend tout l’écran par-dessus le reste du site.
 * Header et footer restent dans le DOM mais sont masqués par la page de paiement.
 */
export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="fixed inset-0 z-[60]" style={{ isolation: "isolate" }}>
      {children}
    </div>
  )
}
