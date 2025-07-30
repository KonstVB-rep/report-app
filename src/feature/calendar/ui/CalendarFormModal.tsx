import { useCalendarContext } from "@/app/dashboard/calendar/context/calendar-context";
import { useEventActionContext } from "@/app/dashboard/calendar/context/events-action-provider";
import DialogComponent from "@/shared/ui/DialogComponent";
import MotionDivY from "@/shared/ui/MotionComponents/MotionDivY";
import Overlay from "@/shared/ui/Overlay";

import { EventInputType } from "../types";
import FormEvent from "./FormEvent";

type CalendarFormModalProps = {
  events?: EventInputType[];
};

const CalendarFormModal = ({ events }: CalendarFormModalProps) => {
  const { openModal, closeModalForm } = useCalendarContext();
  const { isLoading } = useEventActionContext();

  return (
    <DialogComponent
      trigger={undefined}
      open={openModal}
      onOpenChange={closeModalForm}
      classNameContent="sm:max-w-[400px] !pb-3"
    >
      <MotionDivY className="max-h-[82vh] overflow-y-auto flex gap-1 overflow-x-hidden">
        <Overlay isPending={isLoading} />

        <FormEvent events={events || []} />
      </MotionDivY>
    </DialogComponent>
  );
};

export default CalendarFormModal;
