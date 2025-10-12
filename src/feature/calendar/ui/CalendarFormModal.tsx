import { useCalendarContext } from "@/app/dashboard/calendar/context/calendar-context"
import { useEventActionContext } from "@/app/dashboard/calendar/context/events-action-provider"
import DialogComponent from "@/shared/custom-components/ui/DialogComponent"
import MotionDivY from "@/shared/custom-components/ui/MotionComponents/MotionDivY"
import Overlay from "@/shared/custom-components/ui/Overlay"
import type { EventInputType } from "../types"
import FormEvent from "./FormEvent"

type CalendarFormModalProps = {
  events?: EventInputType[]
}

const CalendarFormModal = ({ events }: CalendarFormModalProps) => {
  const { openModal, closeModalForm } = useCalendarContext()
  const { isLoading } = useEventActionContext()

  return (
    <DialogComponent
      classNameContent="sm:max-w-[400px] pb-3!"
      onOpenChange={closeModalForm}
      open={openModal}
      trigger={undefined}
    >
      <MotionDivY className="max-h-[82vh] overflow-y-auto flex gap-1 overflow-x-hidden">
        <Overlay isPending={isLoading} />

        <FormEvent events={events || []} />
      </MotionDivY>
    </DialogComponent>
  )
}

export default CalendarFormModal
