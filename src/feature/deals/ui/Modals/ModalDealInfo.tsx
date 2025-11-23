import { DealType } from "@prisma/client"
import ModalContent from "@/shared/custom-components/ui/ModalContent"
import ProjectItemInfo from "../ProjectInfo"
import RetailItemInfo from "../RetailInfo"

const ModalDealInfo = ({ id, type }: { id: string; type: DealType }) => {
  return (
    <ModalContent className="max-h-[94vh] overflow-y-auto max-w-[90%]" title="Редактировать проект">
      {type === DealType.PROJECT && <ProjectItemInfo dealId={id} />}
      {type === DealType.RETAIL && <RetailItemInfo dealId={id} />}
    </ModalContent>
  )
}

export default ModalDealInfo
