import { DealType } from "@prisma/client"
import type { DealUnion } from "@/entities/deal/types"
import ModalContent from "@/shared/custom-components/ui/ModalContent"
import ProjectItemInfo from "../ProjectInfo"
import RetailItemInfo from "../RetailInfo"

const ModalDealInfo = ({ dealInfo }: { dealInfo: DealUnion }) => {
  return (
    <ModalContent
      className="max-h-[94vh] w-full overflow-y-auto overflow-x-hidden max-w-[94%] flex md:p-5"
      closeStyle="bg-background p-1 -right-1 -top-1 rounded"
      title="Редактировать проект"
    >
      {dealInfo.type === DealType.PROJECT && <ProjectItemInfo dealData={dealInfo} />}
      {dealInfo.type === DealType.RETAIL && <RetailItemInfo dealData={dealInfo} />}
    </ModalContent>
  )
}

export default ModalDealInfo
