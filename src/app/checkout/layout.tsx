/**
 * Layout checkout : style type Stripe (dégradé + carte blanche).
 * Header/footer du site masqués par ce layout.
 */
export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div
      className="fixed inset-0 z-[60] overflow-y-auto min-h-screen"
      style={{
        isolation: "isolate",
        background: "linear-gradient(135deg, #f5f3ff 0%, #e0e7ff 50%, #dbeafe 100%)",
      }}
    >
      {children}
    </div>
  )
}
