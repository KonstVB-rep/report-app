"use client"

import { type ReactNode, useRef } from "react"
import { X } from "lucide-react"
import { createPortal } from "react-dom"
import { Button } from "@/shared/components/ui/button"
import useKeyDown from "@/shared/hooks/useKeyDown"

type Props = {
  text: ReactNode
  isActive: boolean
  closeFn: () => void
  isTargetCell?: boolean
  children?: ReactNode
}

const RowInfoDialog = ({ text, isActive, closeFn, isTargetCell, children }: Props) => {
  const ref = useRef<HTMLDivElement>(null)

  useKeyDown(isActive, closeFn, "Escape")

  return (
    <>
      {isActive &&
        createPortal(
          <div className="absolute inset-0 w-full h-full bg-black/40 z-50">
            <div
              className="absolute grid gap-2 left-1/2 w-full max-h-[80vh] w-[max(96vw, 280px)] sm:max-w-[600px] top-1/2 -translate-x-1/2 -translate-y-1/2 h-auto p-5 bg-primary-foreground border-2 shadow-lg rounded-md z-10 text-primary"
              ref={ref}
            >
              <span className="block text-base text-center md:text-lg p-2 bg-background rounded-md">
                {text}
              </span>
              {isTargetCell && children}
              <Button
                className="absolute -top-4 -right-4 text-sm text-gray-500 rounded-md bg-primary border border-primary p-[2px]"
                onClick={closeFn}
                size="icon"
                type="button"
              >
                <X />
              </Button>
            </div>
          </div>,
          document.body,
        )}
    </>
  )
}

export default RowInfoDialog
