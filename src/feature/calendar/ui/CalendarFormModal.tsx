

import React, { Dispatch, SetStateAction } from "react";
import DialogComponent from "@/shared/ui/DialogComponent";
import MotionDivY from "@/shared/ui/MotionComponents/MotionDivY";
import Overlay from "@/shared/ui/Overlay";
import { EventCalendarSchema } from "@/feature/calendar/model/schema";
import FormEvent from "./FormEvent";
import { UseMutateFunction } from "@tanstack/react-query";
import { UseFormReturn } from "react-hook-form";
import { EventInputType } from "../types";

type CalendarFormModalProps = {
  open: boolean;
  setOpen:React.Dispatch<React.SetStateAction<boolean>> | undefined;
  handleSubmit: (values: EventCalendarSchema) => void;
  editingId: string | null;
  confirmDelModal: boolean;
  setConfirmDelModal: Dispatch<SetStateAction<boolean>>;
  isLoading: boolean;
  isPendingDelete: boolean;
  events: EventInputType[] | undefined;
  deleteEvent: UseMutateFunction<
    EventInputType,
    Error,
    string,
    unknown
  >;
  form: UseFormReturn<EventCalendarSchema>;
};

const CalendarFormModal: React.FC<CalendarFormModalProps> = ({
  open,
  setOpen,
  handleSubmit,
  editingId,
  confirmDelModal,
  setConfirmDelModal,
  isLoading,
  isPendingDelete,
  events,
  deleteEvent,
  form,
}) => (
  <DialogComponent
    trigger={undefined}
    open={open}
    onOpenChange={setOpen}
    classNameContent="sm:max-w-[400px]"
  >
    <MotionDivY className="max-h-[82vh] overflow-y-auto flex gap-1 overflow-x-hidden">
      <Overlay isPending={isLoading} />
      <FormEvent
        handleSubmit={handleSubmit}
        confirmDelModal={confirmDelModal}
        setConfirmDelModal={setConfirmDelModal}
        editingId={editingId || ""}
        events={events}
        isPendingDelete={isPendingDelete}
        deleteEvent={deleteEvent}
        form={form}
        isLoading={isLoading}
      />
    </MotionDivY>
  </DialogComponent>
);

export default CalendarFormModal;
