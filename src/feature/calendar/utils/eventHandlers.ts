import { DateSelectArg, EventClickArg } from "@fullcalendar/core";

import { UseFormReturn } from "react-hook-form";

// import { TOAST } from "@/shared/ui/Toast";

import { EventCalendarSchema } from "../model/schema";
import { EventInputType } from "../types";

export const handleDateSelect = (
  event: DateSelectArg,
  form: UseFormReturn<EventCalendarSchema>,
  setOpenModal: (open: boolean) => void
) => {
  setOpenModal(false);
  const startDate = event.start;
  let isAllDay = false;

  const isToday =
    new Date(event.start).toDateString() === new Date().toDateString();

  // Для режима "месяц" (когда нужно уменьшить на 1 день)
  let endDate;
  if (event.view.type === "dayGridMonth") {
    // Отнимаем 1 день, если это месяц
    endDate = new Date(event.end.getTime() - 86400000);
    const startTime = isToday
      ? new Date().toLocaleTimeString("ru-RU", {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "00:00";
    form.setValue("startTimeEvent", startTime);
    form.setValue("endTimeEvent", "23:59");
  } else {
    if (event.allDay) {
      const endDate = new Date(event.end.getTime() - 86400000);
      form.setValue("startTimeEvent", "00:00");
      form.setValue("endTimeEvent", "23:59");
      form.setValue("startDateEvent", startDate);
      form.setValue("endDateEvent", endDate);
      form.setValue("allDay", true);

      setOpenModal(true);
      return;
    }

    endDate = new Date(event.end);

    let startTime;
    let endTime;

    if (event.startStr.includes("T")) {
      startTime = event.startStr.split("T")[1].split("+")[0];
      form.setValue("startTimeEvent", startTime);
    }

    if (event.endStr.includes("T")) {
      endTime = event.endStr.split("T")[1].split("+")[0];
      form.setValue("endTimeEvent", endTime);
    }

    isAllDay = startTime === "00:00" && endTime === "23:59";
  }

  form.setValue("startDateEvent", startDate);
  form.setValue("endDateEvent", endDate);
  form.setValue("allDay", isAllDay ? true : false);

  setOpenModal(true);
};

export const handleEventClick = (
  clickInfo: EventClickArg,
  form: UseFormReturn<EventCalendarSchema>,
  setEditingId: (id: string) => void,
  setOpenModal: (open: boolean) => void
) => {
  const event = clickInfo.event;

  setOpenModal(true);

  form.setValue("eventTitle", event.title);

  if (event.start) {
    form.setValue("startDateEvent", new Date(event.start));
  }


  if (event.end) {
    form.setValue("endDateEvent", new Date(event.end));
  } else {
    form.setValue(
      "endDateEvent",
      event.start ? new Date(event.start) : new Date()
    );
  }

  if (event.allDay) {
    form.setValue("startTimeEvent", "00:00");
    form.setValue("endTimeEvent", "23:59");
    form.setValue("allDay", true);
    setEditingId(event.id);
    return;
  }

  form.setValue(
    "startTimeEvent",
    event.start?.toTimeString().slice(0, 5) || ""
  );

  form.setValue("endTimeEvent", event.end?.toTimeString().slice(0, 5) || "");

  setEditingId(event.id);
  const popover = document.querySelector(
    ".fc-popover.fc-more-popover.fc-day"
  ) as HTMLElement;
  if (popover) {
    popover.style.display = "none";
  }
};

export const handleEventClickOnEventsList = (
  event: EventInputType,
  form: UseFormReturn<EventCalendarSchema>,
  setEditingId: (id: string) => void,
  setOpenModal: (open: boolean) => void
) => {
  setOpenModal(true);

  form.setValue("eventTitle", event.title);

  if (event.start) {
    form.setValue("startDateEvent", new Date(event.start));
  }

  if (event.end) {
    form.setValue("endDateEvent", new Date(event.end));
  } else {
    form.setValue(
      "endDateEvent",
      event.start ? new Date(event.start) : new Date()
    );
  }

  if (event.allDay) {
    form.setValue("startTimeEvent", "00:00");
    form.setValue("endTimeEvent", "23:59");
    form.setValue("allDay", true);
    setEditingId(event.id!);
    return;
  }

  form.setValue("startTimeEvent", event.start.toTimeString().slice(0, 5) || "");

  form.setValue("endTimeEvent", event.end?.toTimeString().slice(0, 5) || "");

  setEditingId(event.id!);
};

export const handleDateSelectOnEventsList = (
  startDate: Date | undefined,
  form: UseFormReturn<EventCalendarSchema>,
  setEditingId: (value: string) => void,
  setOpenModal: (value: boolean) => void
) => {
  if (!startDate) return;

  setOpenModal(false);
  setEditingId("");

  const isToday =
    new Date(startDate).toDateString() === new Date().toDateString();

  // Для режима "месяц" (когда нужно уменьшить на 1 день)

  const startTime = isToday
    ? new Date().toLocaleTimeString("ru-RU", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "00:00";

  const endTime = "23:59";
  form.setValue("startTimeEvent", startTime);
  form.setValue("endTimeEvent", endTime);

  const endDate = new Date(startDate);

  const isAllDay = startTime === "00:00" && endTime === "23:59";
  form.setValue("startDateEvent", startDate);
  form.setValue("endDateEvent", endDate);
  form.setValue("allDay", isAllDay ? true : false);

  setOpenModal(true);
};
