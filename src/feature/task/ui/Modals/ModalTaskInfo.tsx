import ModalContent from "@/shared/custom-components/ui/ModalContent"
import TaskDetails from "../TaskDetails"

const ModalTaskDetails = ({ taskId, departmentId }: { taskId: string; departmentId: number }) => {
  return (
    <ModalContent className="max-h-[94vh] overflow-y-auto max-w-[90%] w-max" title="">
      <TaskDetails departmentId={departmentId} taskId={taskId} />
    </ModalContent>
  )
}

export default ModalTaskDetails
