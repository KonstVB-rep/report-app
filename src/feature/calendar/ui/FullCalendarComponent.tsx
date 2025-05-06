"use client";

import { DateSelectArg, EventClickArg } from "@fullcalendar/core";
import ruLocale from "@fullcalendar/core/locales/ru";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";

import React from "react";
import { EventInputType } from "../types";


type FullCalendarComponentProps = {
  handleEventClick: (clickInfo: EventClickArg) => void;
  events: EventInputType[] | undefined;
  handleDateSelect: (clickInfo: DateSelectArg) => void;
};
const FullCalendarComponent = ({
  handleEventClick,
  events,
  handleDateSelect,
}: FullCalendarComponentProps) => {
  const capitalizeTitle = () => {
    const titleEl = document.querySelector(".fc-toolbar-title");
    titleEl?.classList.add("title-calendar");
  };

  return (
    <FullCalendar
      plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
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
  );
};

export default FullCalendarComponent;
