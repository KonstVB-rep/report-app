import type { TaskWithUserInfo } from "@/entities/task/types"
import ModalContent from "@/shared/custom-components/ui/ModalContent"
import { useTableContext } from "@/shared/custom-components/ui/Table/context/TableContext"
import TaskDetails from "../TaskDetails"

const ModalTaskDetails = () => {
  const { selectedDataItem } = useTableContext<TaskWithUserInfo>()
  if (!selectedDataItem) return null
  return (
    <ModalContent className="max-h-[94vh] overflow-y-auto max-w-[90%] w-max" title="">
      <TaskDetails departmentId={selectedDataItem.departmentId} />
    </ModalContent>
  )
}

export default ModalTaskDetails
