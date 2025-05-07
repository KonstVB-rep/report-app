import { DateSelectArg, EventClickArg } from "@fullcalendar/core";

import { UseFormReturn } from "react-hook-form";

import { EventCalendarSchema } from "../model/schema";

// Типизация формы

export const handleDateSelect = (
  event: DateSelectArg,
  form: UseFormReturn<EventCalendarSchema>,
  setOpenModal: (open: boolean) => void
) => {
  setOpenModal(false);
  const startDate = event.start;

  if (event.allDay) {
    const endDate = new Date(event.end.getTime() - 86400000);
    form.setValue("startTimeEvent", "00:00");
    form.setValue("endTimeEvent", "23:59");
    form.setValue("startDateEvent", startDate);
    form.setValue("endDateEvent", endDate);

    setOpenModal(true);
    return;
  }

  // Для режима "месяц" (когда нужно уменьшить на 1 день)
  let endDate;
  if (event.view.type === "dayGridMonth") {
    // Отнимаем 1 день, если это месяц
    endDate = new Date(event.end.getTime() - 86400000);
  } else {
    // В других случаях (например, день или неделя) оставляем как есть

    endDate = new Date(event.end);

    if (event.startStr.includes("T")) {
      const startTime = event.startStr.split("T")[1].split("+")[0];
      form.setValue("startTimeEvent", startTime);
    }

    if (event.endStr.includes("T")) {
      const endTime = event.endStr.split("T")[1].split("+")[0];
      form.setValue("endTimeEvent", endTime);
    }
  }

  form.setValue("startDateEvent", startDate);
  form.setValue("endDateEvent", endDate);

  setOpenModal(true);
};

export const handleEventClick = (
  clickInfo: EventClickArg,
  form: UseFormReturn<EventCalendarSchema>,
  setEditingId: (id: string | null) => void,
  setOpenModal: (open: boolean) => void
) => {
  const event = clickInfo.event;

  setOpenModal(true);

  form.setValue("eventTitle", event.title);

  if (event.start) {
    form.setValue("startDateEvent", new Date(event.start));
  }

  // Проверяем, есть ли `end`, если нет — подставляем дату начала
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
};
