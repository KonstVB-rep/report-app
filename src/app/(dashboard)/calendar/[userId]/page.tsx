"use client";

import ruLocale from "@fullcalendar/core/locales/ru";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import { zodResolver } from "@hookform/resolvers/zod";

import React from "react";
import { useState } from "react";
import { Path, useForm, UseFormReturn } from "react-hook-form";

import { Loader } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import {
  useCreateEventCalendar,
  useDeleteEventCalendar,
  useUpdateEventCalendar,
} from "@/feature/calendar/hooks/mutate";
import { useGetEventsCalendarUser } from "@/feature/calendar/hooks/query";
import {
  EventCalendarFormSchema,
  EventCalendarSchema,
} from "@/feature/calendar/model/schema";
import SubmitFormButton from "@/shared/ui/Buttons/SubmitFormButton";
import DialogComponent from "@/shared/ui/DialogComponent";
import DatePickerFormField from "@/shared/ui/Inputs/DatePickerFormField";
import InputTextForm from "@/shared/ui/Inputs/InputTextForm";
import InputTimeForm from "@/shared/ui/Inputs/InputTimeForm";
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
  startDateEvent: "",
  startTimeEvent: "",
  endDateEvent: "",
  endTimeEvent: "",
};

const CalendarPage = () => {
  const [openModal, setOpenModal] = useState(false);
  const [confirmDelModal, setConfirmDelModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const capitalizeTitle = () => {
    const titleEl = document.querySelector(".fc-toolbar-title");
    titleEl?.classList.add("title-calendar");
  };

  const form = useForm<EventCalendarSchema>({
    resolver: zodResolver(EventCalendarFormSchema),
    defaultValues: defaultValuesForm,
  });

  const { data: events, isPending: isPendingLoad } = useGetEventsCalendarUser();

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

  const { mutate, isPending } = useCreateEventCalendar(handleResetAndClose);

  const { mutate: updateEvent, isPending: isPendingUpdate } =
    useUpdateEventCalendar(handleResetAndClose);

  const { mutate: deleteEvent, isPending: isPendingDelete } =
    useDeleteEventCalendar(handleCloseModalAfterDeleteEvent);

  const isLoading = isPendingUpdate || isPending || isPendingDelete;

  const handleDateSelect =  () => {
    setOpenModal(true);
  };

  const handleEventClick = (clickInfo: EventClickArg) => {
    const event = clickInfo.event;

    setOpenModal(true);

    form.setValue("eventTitle", event.title);
    form.setValue(
      "startDateEvent",
      event.start?.toISOString().split("T")[0] || ""
    );
    form.setValue(
      "startTimeEvent",
      event.start?.toTimeString().slice(0, 5) || ""
    );
    form.setValue("endDateEvent", event.end?.toISOString().split("T")[0] || "");
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
        start: startDate,
        end: endDate,
      }); // реализуй мутацию обновления
    } else {
      mutate({
        title: eventTitle,
        start: startDate,
        end: endDate,
      });
    }
  };

  if (isPendingLoad) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-5 ">
        <FullCalendar
          plugins={[
            dayGridPlugin,
            timeGridPlugin,
            listPlugin,
            interactionPlugin,
          ]}
          initialView={"dayGridMonth"}
          eventClick={handleEventClick}
          selectable={true}
          dayMaxEvents={2}
          events={events ?? []}
          select={handleDateSelect}
          height="auto"
          locales={[ruLocale]}
          locale={ruLocale}
          slotLabelFormat={{
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }}
          slotDuration="00:30:00"
          slotLabelInterval="00:30:00"
          slotMinTime="00:00:00"
          slotMaxTime="24:00:00"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}

          titleFormat={{
            day: "numeric",
            month: "long",
            year: "numeric",
          }}
          eventTimeFormat={{
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }}
          selectAllow={(selectInfo) => {
            const now = new Date();
            now.setHours(0, 0, 0, 0);
            return selectInfo.start >= now;
          }}
          dayCellClassNames={(arg) => {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const date = arg.date;
            if (date < today) return ["fc-day-disabled"];
            return [];
          }}
          datesSet={capitalizeTitle}
          contentHeight="auto"
          handleWindowResize={false}
        />
        <DialogComponent
          trigger={undefined}
          open={openModal}
          onOpenChange={setOpenModal}
          classNameContent="sm:max-w-[400px]"
        >
          <MotionDivY className="max-h-[82vh] overflow-y-auto flex gap-1 overflow-x-hidden">
            <Overlay isPending={isLoading} />
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="grid max-h-[82vh] min-w-full gap-5 overflow-y-auto"
              >
                <div className="text-center font-semibold uppercase">
                  Форма добавления события
                </div>
                <div className="grid gap-2 p-1">
                  <InputTextForm
                    name={"eventTitle" as Path<EventCalendarSchema>}
                    label="Наименование события"
                    control={form.control}
                    errorMessage={
                      form.formState.errors.eventTitle?.message as string
                    }
                    placeholder="Название события..."
                    required
                  />
                  <DatePickerFormField<UseFormReturn<EventCalendarSchema>>
                    name={"startDateEvent" as Path<EventCalendarSchema>}
                    label="Начало события"
                    control={form.control}
                    errorMessage={
                      form.formState.errors.startDateEvent?.message as string
                    }
                    required
                  />

                  <InputTimeForm
                    name={"startTimeEvent" as Path<EventCalendarSchema>}
                    label="Время"
                    control={form.control}
                    errorMessage={
                      form.formState.errors.startTimeEvent?.message as string
                    }
                  />
                  <DatePickerFormField<UseFormReturn<EventCalendarSchema>>
                    name={"endDateEvent" as Path<EventCalendarSchema>}
                    label="Конец события"
                    control={form.control}
                    errorMessage={
                      form.formState.errors.endDateEvent?.message as string
                    }
                    required
                  />

                  <InputTimeForm
                    name={"endTimeEvent" as Path<EventCalendarSchema>}
                    label="Время"
                    control={form.control}
                    errorMessage={
                      form.formState.errors.endTimeEvent?.message as string
                    }
                  />
                </div>
                {form.formState.errors.dateError && (
                  <p className="text-sm text-red-500 text-center">
                    {form.formState.errors.dateError.message}
                  </p>
                )}
                <div className={`grid ${editingId ? "grid-cols-2" : ""} gap-4`}>
                  {editingId && (
                    <DialogComponent
                      trigger={
                        <Button variant="outline" className="w-full">
                          Удалить
                        </Button>
                      }
                      open={confirmDelModal}
                      onOpenChange={setConfirmDelModal}
                      classNameContent="sm:max-w-[400px] z-[51]"
                    >
                      <div className="w-full h-full grid gap-4">
                        <div className="text-center grid gap-4">
                          <p>Вы уверены что хотите удалить событие?</p>
                          <p className="p-2 border border-solid rounded-md">
                          {events.find((item) => item.id === editingId)?.title ?? "Неизвестное событие"}
                          </p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <DialogClose asChild>
                            <Button type="button" variant="outline">
                              Отмена
                            </Button>
                          </DialogClose>
                          <Button onClick={() => deleteEvent(editingId)}>
                            {isPendingDelete ? (
                              <span className="flex gap-2">
                                <Loader className="animate-spin w-5 h-5" />{" "}
                                Удаление...
                              </span>
                            ) : (
                              "Удалить"
                            )}
                          </Button>
                        </div>
                      </div>
                    </DialogComponent>
                  )}

                  <SubmitFormButton
                    title={editingId ? "Изменить" : "Сохранить"}
                    isPending={isLoading}
                    className="w-full ml-auto"
                  />
                </div>
              </form>
            </Form>
          </MotionDivY>
        </DialogComponent>
    </div>
  );
};

export default CalendarPage;
