import DialogComponent from "@/shared/ui/DialogComponent";
import MotionDivY from "@/shared/ui/MotionComponents/MotionDivY";
import Overlay from "@/shared/ui/Overlay";

import FormEvent from "./FormEvent";
import { useCalendarContext } from "@/app/(dashboard)/calendar/context/calendar-context";
import { useEventActionContext } from "@/app/(dashboard)/calendar/context/events-action-provider";
import { EventInputType } from "../types";

type CalendarFormModalProps = {
  events: EventInputType[] | undefined;
};

const CalendarFormModal = ({
  events,
}: CalendarFormModalProps) => {

  const {openModal, closeModalForm} = useCalendarContext();
  const {isLoading} = useEventActionContext()

  return(
    <DialogComponent
      trigger={undefined}
      open={openModal}
      onOpenChange={closeModalForm}
      classNameContent="sm:max-w-[400px] !pb-3"
  >
    <MotionDivY className="max-h-[82vh] overflow-y-auto flex gap-1 overflow-x-hidden">
      <Overlay isPending={isLoading} />
      
      <FormEvent
        events={events}
      />
    </MotionDivY>
  </DialogComponent>
  )
};

export default CalendarFormModal;
