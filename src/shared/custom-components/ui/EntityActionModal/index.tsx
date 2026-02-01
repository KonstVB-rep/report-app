import type React from "react"
import { Dialog } from "@/shared/components/ui/dialog"
import type { ModalType } from "@/shared/types"

interface EntityActionModalProps {
  openedModal: ModalType
  setOpenedModal: (type: ModalType) => void
  renderMap: {
    edit?: (close: () => void) => React.ReactNode
    delete?: (close: () => void) => React.ReactNode
    more?: () => React.ReactNode
  }
}

export const EntityActionModal = ({
  openedModal,
  setOpenedModal,
  renderMap,
}: EntityActionModalProps) => {
  const close = () => setOpenedModal(null)

  return (
    <Dialog onOpenChange={(open) => !open && close()} open={!!openedModal}>
      {openedModal === "edit" && renderMap.edit?.(close)}
      {openedModal === "more" && renderMap.more?.()}
      {openedModal === "delete" && renderMap.delete?.(close)}
    </Dialog>
  )
}
