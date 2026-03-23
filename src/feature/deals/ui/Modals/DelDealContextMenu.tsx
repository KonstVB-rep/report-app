import type { Dispatch, SetStateAction } from "react"
import { PermissionEnum } from "@prisma/client"
import type { DealUnion } from "@/entities/deal/types"
import ModalContent from "@/shared/custom-components/ui/ModalContent"
import ProtectedByPermissions from "@/shared/custom-components/ui/Protect/ProtectedByPermissions"
import { useTableContext } from "@/shared/custom-components/ui/Table/context/TableContext"
import DelDealForm from "../Forms/DelDealForm"

const DelDealContextMenu = ({ close }: { close: Dispatch<SetStateAction<void>> }) => {
  const { selectedDataItem } = useTableContext<DealUnion>()
  if (!selectedDataItem) return null

  return (
    <div className="hidden">
      <ProtectedByPermissions permission={PermissionEnum.DEAL_DELETE}>
        <ModalContent className="sm:max-w-[400px]" title="Удалить проект">
          <DelDealForm close={close} id={selectedDataItem.id} type={selectedDataItem.type} />
        </ModalContent>
      </ProtectedByPermissions>
    </div>
  )
}

export default DelDealContextMenu
