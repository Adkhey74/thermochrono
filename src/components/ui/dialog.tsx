"use client"

import * as React from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

interface DialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
}

interface DialogContentProps {
  children: React.ReactNode
  className?: string
}

const Dialog = ({ open, onOpenChange, children }: DialogProps) => {
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 sm:flex sm:items-center sm:justify-center">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        style={{
          animation: "fadeIn 0.2s ease-in-out"
        }}
        onClick={() => onOpenChange(false)}
      />
      {children}
    </div>
  )
}

const DialogContent = React.forwardRef<HTMLDivElement, DialogContentProps>(
  ({ children, className, ...props }, ref) => {
    const [isMobile, setIsMobile] = React.useState(true)

    React.useEffect(() => {
      const checkMobile = () => {
        setIsMobile(window.innerWidth < 640)
      }
      if (typeof window !== 'undefined') {
        checkMobile()
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
      }
    }, [])

    return (
      <div
        ref={ref}
        className={cn(
          "fixed z-50 grid w-full gap-4 border bg-background shadow-lg overflow-hidden",
          className
        )}
        style={{
          ...(isMobile ? {
            inset: 0,
            height: '100%'
          } : {
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            width: '100%',
            maxWidth: '80rem', // lg:max-w-5xl
            maxHeight: 'calc(100vh - 2rem)',
            height: 'auto',
            borderRadius: '0.5rem'
          }),
          animation: "modalFadeIn 0.3s ease-out"
        }}
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
    className={cn("text-sm text-muted-foreground", className)}
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
      "absolute right-2 top-2 sm:right-4 sm:top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none p-1.5 sm:p-1",
      className
    )}
    onClick={onClose}
    {...props}
  >
    <X className="h-4 w-4 sm:h-4 sm:w-4" />
    <span className="sr-only">Close</span>
  </button>
)

export { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose }

