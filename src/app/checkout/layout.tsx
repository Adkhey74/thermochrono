/**
 * Layout checkout : fond blanc, carte de contenu.
 * Header/footer du site masqués par ce layout.
 */
export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div
      className="fixed inset-0 z-[60] h-screen overflow-y-auto bg-white"
      style={{ isolation: "isolate" }}
    >
      {children}
    </div>
  )
}
