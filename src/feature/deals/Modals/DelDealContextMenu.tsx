import type { Dispatch, SetStateAction } from "react"
import { type DealType, PermissionEnum } from "@prisma/client"
import dynamic from "next/dynamic"
import DelDealSkeleton from "@/entities/deal/ui/Skeletons/DelDealSkeleton"
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog"
import ProtectedByPermissions from "@/shared/custom-components/ui/Protect/ProtectedByPermissions"

const DelDealForm = dynamic(() => import("../ui/Forms/DelDealForm"), {
  ssr: false,
  loading: () => <DelDealSkeleton />,
})

const DelDealContextMenu = ({
  close,
  id,
  type,
}: {
  close: Dispatch<SetStateAction<void>>
  id: string
  type: DealType
}) => {
  return (
    <ProtectedByPermissions permission={PermissionEnum.DEAL_MANAGEMENT}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="sr-only">Удалить проект</DialogTitle>
          <DialogDescription className="sr-only" />
        </DialogHeader>

        <DelDealForm close={close} id={id} type={type} />
      </DialogContent>
    </ProtectedByPermissions>
  )
}

export default DelDealContextMenu
