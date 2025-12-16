import type { ReactNode } from "react"
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog"

interface ModalContentProps {
  className: string
  children: ReactNode
  title?: string
  showX?: boolean
  closeStyle?: string
  disableClose?: boolean
}

const ModalContent = ({
  children,
  className,
  title,
  showX = true,
  closeStyle,
  disableClose = false,
}: ModalContentProps) => {
  return (
    <DialogContent
      className={className}
      closeStyle={closeStyle}
      onInteractOutside={(e) => {
        if (disableClose) e.preventDefault()
      }}
      showX={showX}
    >
      <DialogHeader className="sr-only">
        <DialogTitle className="sr-only">{title}</DialogTitle>
        <DialogDescription></DialogDescription>
      </DialogHeader>
      {children}
    </DialogContent>
  )
}

export default ModalContent
