import { DealType } from "@prisma/client"
import type { DealUnion } from "@/entities/deal/types"
import ModalContent from "@/shared/custom-components/ui/ModalContent"
import { useTableContext } from "@/shared/custom-components/ui/Table/context/TableContext"
import ProjectItemInfo from "../ProjectInfo"
import RetailItemInfo from "../RetailInfo"

const ModalDealInfo = () => {
  const { selectedDataItem } = useTableContext<DealUnion>()

  if (!selectedDataItem) return null

  return (
    <ModalContent
      className="max-h-[94vh] w-full overflow-y-auto overflow-x-hidden max-w-[94%] flex md:p-5"
      closeStyle="bg-background p-1 -right-1 -top-1 rounded"
      title="Редактировать проект"
    >
      {selectedDataItem.type === DealType.PROJECT && <ProjectItemInfo data={selectedDataItem} />}
      {selectedDataItem.type === DealType.RETAIL && <RetailItemInfo data={selectedDataItem} />}
    </ModalContent>
  )
}

export default ModalDealInfo
