"use client";

import { UseMutateFunction } from "@tanstack/react-query";

import * as React from "react";
import { SetStateAction } from "react";
import { UseFormReturn } from "react-hook-form";

import { ru } from "date-fns/locale";

import { Calendar } from "@/components/ui/calendar";
import EventsListDayMobile from "@/feature/calendar/ui/EventsListDayMobile";
import DialogComponent from "@/shared/ui/DialogComponent";
import MotionDivY from "@/shared/ui/MotionComponents/MotionDivY";

import useCalendarMobile from "../hooks/useCalendarMobile";
import { EventCalendarSchema } from "../model/schema";
import { EventInputType } from "../types";
import {
  handleDateSelectOnEventsList,
  handleEventClickOnEventsList,
} from "../utils/eventHandlers";
import CalendarFormModal from "./CalendarFormModal";

type Props = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleSubmit: (values: EventCalendarSchema) => void;
  editingId: string | null;
  confirmDelModal: boolean;
  setConfirmDelModal: React.Dispatch<SetStateAction<boolean>>;
  isLoading: boolean;
  isPendingDelete: boolean;
  deleteEvent: UseMutateFunction<EventInputType, Error, string, unknown>;
  form: UseFormReturn<EventCalendarSchema>;
  setEditingId: (id: string | null) => void;
  setOpenModal: (open: boolean) => void;
};

const CalendarMobile = ({
  open,
  setOpen,
  handleSubmit,
  editingId,
  confirmDelModal,
  setConfirmDelModal,
  isLoading,
  isPendingDelete,
  deleteEvent,
  form,
  setEditingId,
  setOpenModal,
}: Props) => {
  const {
    events,
    openList,
    setOpenList,
    eventsDate,
    selectedDate,
    eventDates,
    handleSelect,
    // isPending
  } = useCalendarMobile();

  const handleDateSelect = (date: Date | undefined) => {
    const isExistEvents = handleSelect(date);
    if (!isExistEvents) {
      handleDateSelectOnEventsList(date, form, setOpen);
    }
  };

  return (
    <div className="calendar-mobile p-2 xs:p-5">
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={handleDateSelect}
        onDayClick={handleDateSelect}
        modifiers={{ highlighted: eventDates }}
        modifiersClassNames={{
          highlighted: "calendar-day-highlighted",
          today: "calendar-day-today",
        }}
        locale={ru}
        disabled={(date) => date < new Date(new Date().toDateString())}
        className="rounded-md border shadow"
      />
      <DialogComponent
        trigger={undefined}
        open={openList}
        onOpenChange={setOpenList}
        classNameContent="sm:max-w-[600px] p-2 w-full"
      >
        <MotionDivY className="max-h-[82vh] overflow-y-auto flex flex-col gap-2 overflow-x-hidden pt-10">
          <EventsListDayMobile
            events={eventsDate}
            handleEventClickOnEventsList={(eventCalendar: EventInputType) =>
              handleEventClickOnEventsList(
                eventCalendar,
                form,
                setEditingId,
                setOpenModal
              )
            }
            handleDateSelectOnEventsList={() =>
              handleDateSelectOnEventsList(selectedDate, form, setOpen)
            }
          />
        </MotionDivY>
      </DialogComponent>
      <CalendarFormModal
        handleSubmit={handleSubmit}
        confirmDelModal={confirmDelModal}
        setConfirmDelModal={setConfirmDelModal}
        editingId={editingId || ""}
        events={events}
        isPendingDelete={isPendingDelete}
        deleteEvent={deleteEvent}
        form={form}
        isLoading={isLoading}
        open={open}
        setOpen={setOpen}
      />
    </div>
  );
};

export default CalendarMobile;
