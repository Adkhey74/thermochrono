"use client"

import * as React from "react"
import * as ReactDOM from "react-dom"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

const FOCUSABLE =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'

function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
    (el) => !el.hasAttribute("disabled") && el.getAttribute("aria-hidden") !== "true"
  )
}

interface DialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
}

const Dialog = ({ open, onOpenChange, children }: DialogProps) => {
  const [mounted, setMounted] = React.useState(false)
  const contentWrapperRef = React.useRef<HTMLDivElement>(null)
  const previousActiveRef = React.useRef<HTMLElement | null>(null)
  const wasOpenRef = React.useRef(false)

  React.useEffect(() => setMounted(true), [])

  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden"
      wasOpenRef.current = true
      previousActiveRef.current = document.activeElement as HTMLElement | null
    } else {
      document.body.style.overflow = ""
      const prev = previousActiveRef.current
      previousActiveRef.current = null
      if (wasOpenRef.current && prev?.focus && document.contains(prev)) {
        prev.focus()
      }
      wasOpenRef.current = false
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [open])

  React.useEffect(() => {
    if (!open) return
    const wrapper = contentWrapperRef.current
    if (!wrapper) return
    const focusable = getFocusableElements(wrapper)
    const first = focusable[0]
    if (first) {
      const id = requestAnimationFrame(() => {
        requestAnimationFrame(() => first.focus())
      })
      return () => cancelAnimationFrame(id)
    }
  }, [open])

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key !== "Tab" && e.key !== "Escape") return
      if (e.key === "Escape") {
        onOpenChange(false)
        return
      }
      const wrapper = contentWrapperRef.current
      if (!wrapper) return
      const focusable = getFocusableElements(wrapper)
      if (focusable.length === 0) return
      const current = document.activeElement as HTMLElement
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (e.shiftKey) {
        if (current === first) {
          e.preventDefault()
          last.focus()
        }
      } else {
        if (current === last) {
          e.preventDefault()
          first.focus()
        }
      }
    },
    [onOpenChange]
  )

  if (!open) return null

  const overlay = (
    <div
      className="fixed inset-0 z-[var(--z-modal-backdrop)] flex items-center justify-center p-4 sm:p-6 min-h-screen overflow-y-auto"
      aria-hidden={!open}
    >
      {/* Fond flou : devant toute la page (portail), derrière la modale */}
      <div
        className="fixed inset-0 z-[var(--z-modal-backdrop)] bg-black/50 backdrop-blur-sm"
        style={{ animation: "fadeIn 0.2s ease-in-out" }}
        onClick={() => onOpenChange(false)}
        aria-hidden
      />
      <div
        ref={contentWrapperRef}
        onKeyDown={handleKeyDown}
        className="relative z-[var(--z-modal)] w-full my-auto max-w-2xl max-h-[calc(100vh-3rem)] flex items-center justify-center min-h-0"
      >
        {children}
      </div>
    </div>
  )

  if (!mounted) return null

  return ReactDOM.createPortal(overlay, document.body)
}

interface DialogContentProps {
  children: React.ReactNode
  className?: string
  id?: string
  "aria-labelledby"?: string
  "aria-describedby"?: string
}

const DialogContent = React.forwardRef<HTMLDivElement, DialogContentProps>(
  ({ children, className, id, "aria-labelledby": ariaLabelledby, "aria-describedby": ariaDescribedby, ...props }, ref) => {
    const contentRef = React.useRef<HTMLDivElement>(null)
    const mergedRef = (node: HTMLDivElement | null) => {
      (contentRef as React.MutableRefObject<HTMLDivElement | null>).current = node
      if (typeof ref === "function") ref(node)
      else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node
    }

    return (
      <div
        ref={mergedRef}
        role="dialog"
        aria-modal="true"
        id={id}
        aria-labelledby={ariaLabelledby}
        aria-describedby={ariaDescribedby}
        className={cn(
          "relative z-[var(--z-modal)] w-full max-h-[calc(100vh-3rem)] grid gap-4 border bg-background shadow-lg overflow-hidden rounded-xl sm:rounded-2xl",
          className
        )}
        style={{ animation: "modalFadeIn 0.3s ease-out" }}
        onClick={(e) => e.stopPropagation()}
        {...props}
      >
        {children}
      </div>
    )
  }
)
DialogContent.displayName = "DialogContent"

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-1.5 text-center sm:text-left",
      className
    )}
    {...props}
  />
)
DialogHeader.displayName = "DialogHeader"

const DialogTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h2
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
DialogTitle.displayName = "DialogTitle"

const DialogDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(
      "text-sm text-muted-foreground",
      className
    )}
    {...props}
  />
))
DialogDescription.displayName = "DialogDescription"

const DialogClose = ({
  onClose,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { onClose: () => void }) => (
  <button
    type="button"
    className={cn(
      "rounded-md opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none p-2 inline-flex items-center justify-center",
      className
    )}
    onClick={onClose}
    {...props}
  >
    <X className="h-4 w-4" aria-hidden />
    <span className="sr-only">Close</span>
  </button>
)

export { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose }
