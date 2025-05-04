"use client";

import { DateSelectArg, EventClickArg } from "@fullcalendar/core";
import { zodResolver } from "@hookform/resolvers/zod";

import React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { useActionEvents } from "@/feature/calendar/hooks/useActionEvents";
import {
  EventCalendarFormSchema,
  EventCalendarSchema,
} from "@/feature/calendar/model/schema";
import FormEvent from "@/feature/calendar/ui/FormEvent";
import FullCalendarComponent from "@/feature/calendar/ui/FullCalendarComponent";
import DialogComponent from "@/shared/ui/DialogComponent";
import MotionDivY from "@/shared/ui/MotionComponents/MotionDivY";
import Overlay from "@/shared/ui/Overlay";

export type EventInputType = {
  id?: string;
  title: string;
  start: string | Date;
  end?: string | Date;
};

const defaultValuesForm = {
  eventTitle: "",
  startDateEvent: undefined,
  startTimeEvent: "",
  endDateEvent: undefined,
  endTimeEvent: "",
};

const CalendarPage = () => {
  const [openModal, setOpenModal] = useState(false);
  const [confirmDelModal, setConfirmDelModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

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

  const handleDateSelect = (event: DateSelectArg) => {
    const startDate = event.start;
    const endDate =  new Date(event.end.getTime() - 86400000)

    form.setValue("startDateEvent", startDate);
    form.setValue("endDateEvent", endDate);

    setOpenModal(true);
  };

  const handleEventClick = (clickInfo: EventClickArg) => {
    const event = clickInfo.event;

    setOpenModal(true);

    form.setValue("eventTitle", event.title);
    if (event.start) {
      form.setValue("startDateEvent", new Date(event.start));
    }
    form.setValue(
      "startTimeEvent",
      event.start?.toTimeString().slice(0, 5) || ""
    );
    if (event.end) {
      form.setValue("endDateEvent", new Date(event.end));
    }
    form.setValue("endTimeEvent", event.end?.toTimeString().slice(0, 5) || "");

    setEditingId(event.id);
  };

  const handleSubmit = (values: EventCalendarSchema) => {
    const {
      eventTitle,
      startDateEvent,
      endDateEvent,
      startTimeEvent,
      endTimeEvent,
    } = values;

    const startDate = new Date(startDateEvent);
    const endDate = new Date(endDateEvent);

    const [startH, startM] = startTimeEvent.split(":");
    const [endH, endM] = endTimeEvent.split(":");

    startDate.setHours(parseInt(startH, 10), parseInt(startM, 10));
    endDate.setHours(parseInt(endH, 10), parseInt(endM, 10));

    if (editingId) {
      updateEvent({
        id: editingId,
        title: eventTitle,
        start: startDate.toISOString(),
        end: endDate.toISOString(),
      });
    } else {
      createEvent({
        title: eventTitle,
        start: startDate.toISOString(),
        end: endDate.toISOString(),
      });
    }
  };

  if (isPendingLoad) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-5 ">
      <FullCalendarComponent
        handleEventClick={handleEventClick}
        events={events}
        handleDateSelect={handleDateSelect}
      />
      <DialogComponent
        trigger={undefined}
        open={openModal}
        onOpenChange={closeModalForm}
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
    </div>
  );
};

export default CalendarPage;
