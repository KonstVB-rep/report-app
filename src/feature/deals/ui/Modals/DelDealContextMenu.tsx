import type { Dispatch, SetStateAction } from "react"
import { type DealType, PermissionEnum } from "@prisma/client"
import dynamic from "next/dynamic"
import DelDealSkeleton from "@/entities/deal/ui/Skeletons/DelDealSkeleton"
import ModalContent from "@/shared/custom-components/ui/ModalContent"
import ProtectedByPermissions from "@/shared/custom-components/ui/Protect/ProtectedByPermissions"

const DelDealForm = dynamic(() => import("../Forms/DelDealForm"), {
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
      <ModalContent className="sm:max-w-[400px]" title="Удалить проект">
        <DelDealForm close={close} id={id} type={type} />
      </ModalContent>
    </ProtectedByPermissions>
  )
}

export default DelDealContextMenu
