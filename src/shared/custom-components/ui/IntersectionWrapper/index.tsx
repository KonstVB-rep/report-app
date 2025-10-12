import type { ReactNode } from "react"
import { X } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/shared/components/ui/button"
import { cn } from "@/shared/lib/utils"

export const MainWrapperRoute = ({
  children,
  className = "fixed inset-0 z-50 flex",
}: {
  children: ReactNode
  className?: string
}) => {
  return <div className={className}>{children}</div>
}

export const OverlayIntersectionRoute = ({
  className = "absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity",
}: {
  className?: string
}) => {
  const router = useRouter()

  const handleClose = () => {
    router.back()
  }
  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: overlay background handles click to close modal
    <div
      className={className}
      onClick={handleClose}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") handleClose()
      }}
    />
  )
}

export const ModalContentRoute = ({
  children,
  bgColorByTheme = "bg-white dark:bg-stone-900",
}: {
  children: ReactNode
  bgColorByTheme?: string
}) => {
  return (
    <div
      className={cn(
        "animate-fadeInScale modal-content-route relative w-full max-w-[96vw] m-auto rounded-xl shadow-xl border border-gray-200 dark:border-gray-700",
        bgColorByTheme,
      )}
    >
      <ButtonCloseRoute />
      <div className="overflow-hidden max-h-[calc(100svh-var(--header-height)-2px)]">
        {children}
      </div>
    </div>
  )
}

export const ButtonCloseRoute = () => {
  const router = useRouter()

  const handleClose = () => {
    router.back()
  }
  return (
    <Button
      className="animate-fadeInScale rounded-full w-9 h-9 absolute -right-2 -top-4 z-10 bg-zinc-200 dark:bg-zinc-800 border"
      onClick={handleClose}
      size="icon"
      variant="ghost"
    >
      <X />
    </Button>
  )
}
