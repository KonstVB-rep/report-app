"use client";

import { ru } from "date-fns/locale";

import { useCalendarContext } from "@/app/dashboard/calendar/context/calendar-context";
import { Calendar } from "@/components/ui/calendar";
import EventsListDayMobile from "@/feature/calendar/ui/EventsListDayMobile";
import DialogComponent from "@/shared/ui/DialogComponent";
import MotionDivY from "@/shared/ui/MotionComponents/MotionDivY";

import useCalendarMobile from "../hooks/useCalendarMobile";
import { EventInputType } from "../types";
import {
  handleDateSelectOnEventsList,
  handleEventClickOnEventsList,
} from "../utils/eventHandlers";
import CalendarFormModal from "./CalendarFormModal";

const CalendarMobile = () => {
  const {
    events,
    openList,
    setOpenList,
    eventsDate,
    selectedDate,
    eventDates,
    handleSelect,
  } = useCalendarMobile();

  const { form, closeModalForm, setEditingId, setOpenModal } =
    useCalendarContext();

  const handleDateSelect = (date: Date | undefined) => {
    const isExistEvents = handleSelect(date);
    if (!isExistEvents) {
      handleDateSelectOnEventsList(date, form, setEditingId, closeModalForm);
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
              handleDateSelectOnEventsList(
                selectedDate,
                form,
                setEditingId,
                closeModalForm
              )
            }
          />
        </MotionDivY>
      </DialogComponent>

      <CalendarFormModal events={events} />
    </div>
  );
};

export default CalendarMobile;
