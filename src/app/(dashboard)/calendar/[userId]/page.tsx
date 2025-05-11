"use client";

import { zodResolver } from "@hookform/resolvers/zod";

import React, { useState } from "react";
import { useForm } from "react-hook-form";

import { usePathname } from "next/navigation";

import { ListTodo } from "lucide-react";

import { useSidebar } from "@/components/ui/sidebar";
import { useActionEvents } from "@/feature/calendar/hooks/useActionEvents";
import {
  EventCalendarFormSchema,
  EventCalendarSchema,
} from "@/feature/calendar/model/schema";
import CalendarFormModal from "@/feature/calendar/ui/CalendarFormModal";
import CalendarMobile from "@/feature/calendar/ui/CalendarMobile";
import FullCalendarComponent from "@/feature/calendar/ui/FullCalendarComponent";
import {
  handleDateSelect,
  handleEventClick,
} from "@/feature/calendar/utils/eventHandlers";
import ButtonLink from "@/shared/ui/Buttons/ButtonLink";

import Loading from "./loading";
import { EventInputType } from "@/feature/calendar/types";
import { TOAST } from "@/shared/ui/Toast";

const defaultValuesForm = {
  eventTitle: "",
  startDateEvent: undefined,
  startTimeEvent: "",
  endDateEvent: undefined,
  endTimeEvent: "",
  allDay: false,
};

const IsExistIntersectionEvents = (newEventStart: Date, newEventEnd: Date, events: EventInputType[] | undefined) => {
  const overlap = events?.some((event) => {
    // Преобразуем время начала и конца события в Date, чтобы избежать проблем с временем в разных часовых поясах
    const eventStart = new Date(event.start);
    const eventEnd = new Date(event.end);

    console.log(newEventStart, 'newEventStart')

    // Проверка, пересекается ли новое событие с существующим
    return (
      (newEventStart >= eventStart && newEventStart < eventEnd) || // Если начало нового события попадает в существующее
      (newEventEnd > eventStart && newEventEnd <= eventEnd) ||     // Если конец нового события попадает в существующее
      (newEventStart <= eventStart && newEventEnd >= eventEnd)      // Если новое событие полностью охватывает существующее
    );
  });

  if (overlap) {
    // Если события пересекаются, установим предупреждение
    TOAST.ERROR("У вас yже есть событие на выбранное время!Удалите или измените время одного из событий.")
    return true
  } 
  return false
};

const CalendarPage = () => {
  const [openModal, setOpenModal] = useState(false);
  const [confirmDelModal, setConfirmDelModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const pathName = usePathname();

  const { isMobile } = useSidebar();

  const form = useForm<EventCalendarSchema>({
    resolver: zodResolver(EventCalendarFormSchema),
    defaultValues: defaultValuesForm,
  });

  const handleResetAndClose = () => {
    setOpenModal(false);
    form.reset(defaultValuesForm);
  };

  const handleCloseModalAfterDeleteEvent = () => {
    setOpenModal(false);
    setConfirmDelModal(false);
    setEditingId(null);
    form.reset(defaultValuesForm);
  };

  const {
    isLoading,
    events,
    createEvent,
    updateEvent,
    deleteEvent,
    isPendingLoad,
    isPendingDelete,
  } = useActionEvents(handleResetAndClose, handleCloseModalAfterDeleteEvent);

  const closeModalForm = () => {
    if (openModal) {
      handleResetAndClose();
    } else {
      setOpenModal(true);
    }
  };

  const handleSubmit = (values: EventCalendarSchema) => {
    const {
      eventTitle,
      startDateEvent,
      endDateEvent,
      startTimeEvent,
      endTimeEvent,
      allDay,
    } = values;

    const startDate = new Date(startDateEvent);
    const endDate = new Date(endDateEvent);

    if (allDay) {
      const [startH, startM] = ["00", "00"];
      const [endH, endM] = ["23", "59"];

      startDate.setHours(parseInt(startH, 10), parseInt(startM, 10));
      endDate.setHours(parseInt(endH, 10), parseInt(endM, 10));
    } else {
      const [startH, startM] = startTimeEvent.split(":");
      const [endH, endM] = endTimeEvent.split(":");

      startDate.setHours(parseInt(startH, 10), parseInt(startM, 10));
      endDate.setHours(parseInt(endH, 10), parseInt(endM, 10));
    }

    const isIntersections = IsExistIntersectionEvents(startDate,  endDate, events)

    if(isIntersections) return;

    if (editingId) {
      updateEvent({
        id: editingId,
        title: eventTitle,
        start: startDate.toISOString(),
        end: endDate.toISOString(),
        allDay,
      });
    } else {
      createEvent({
        title: eventTitle,
        start: startDate.toISOString(),
        end: endDate.toISOString(),
        allDay,
      });
    }
  };

  if (isPendingLoad) {
    return <Loading />;
  }

  return (
    <>
      {isMobile ? (
        <CalendarMobile
          handleSubmit={handleSubmit}
          confirmDelModal={confirmDelModal}
          setConfirmDelModal={setConfirmDelModal}
          editingId={editingId || ""}
          isPendingDelete={isPendingDelete}
          deleteEvent={deleteEvent}
          form={form}
          isLoading={isLoading}
          open={openModal}
          setOpen={closeModalForm}
          setEditingId={setEditingId}
          setOpenModal={setOpenModal}
        />
      ) : (
        <div className="p-5 ">
          <ButtonLink
            pathName={`${pathName}/events-list`}
            label="Список событий"
            icon={<ListTodo />}
          />
          <FullCalendarComponent
            handleEventClick={(clickInfo) =>
              handleEventClick(clickInfo, form, setEditingId, setOpenModal)
            }
            events={events}
            handleDateSelect={(event) =>
              handleDateSelect(event, form, setOpenModal)
            }
          />
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
            open={openModal}
            setOpen={closeModalForm}
          />
        </div>
      )}
    </>
  );
};

export default CalendarPage;
