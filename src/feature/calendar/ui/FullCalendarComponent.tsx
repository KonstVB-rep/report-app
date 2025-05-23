"use client";

import { DateSelectArg, EventClickArg } from "@fullcalendar/core";
import ruLocale from "@fullcalendar/core/locales/ru";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";

import { useState } from "react";

import { useRouter, useSearchParams } from "next/navigation";

import { useCalendarContext } from "@/app/(dashboard)/calendar/context/calendar-context";
import { useEventActionContext } from "@/app/(dashboard)/calendar/context/events-action-provider";
import {
  handleDateSelect,
  handleEventClick,
} from "@/feature/calendar/utils/eventHandlers";

const FullCalendarComponent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { events } = useEventActionContext();
  const { form, setEditingId, setOpenModal } = useCalendarContext();

  const defaultView = "dayGridMonth";
  const viewFromUrl = searchParams.get("view");
  const [currentView, setCurrentView] = useState(viewFromUrl || defaultView);

  const capitalizeTitle = () => {
    const titleEl = document.querySelector(".fc-toolbar-title");
    titleEl?.classList.add("title-calendar");
  };

  const handleDatesSet = (arg: { view: { type: string } }) => {
    capitalizeTitle();
    const newView = arg.view.type;
    setCurrentView(newView);

    const params = new URLSearchParams(window.location.search);
    params.set("view", newView);
    const newUrl = `${window.location.pathname}?${params.toString()}`;

    if (window.location.search !== `?${params.toString()}`) {
      router.replace(newUrl, { scroll: false });
    }
  };

  const handleEventClickFn = (clickInfo: EventClickArg) =>
    handleEventClick(clickInfo, form, setEditingId, setOpenModal);

  const handleDateSelectFn = (event: DateSelectArg) => {
    setEditingId("");
    handleDateSelect(event, form, setOpenModal);
  };

  return (
    <div className="full-calendar">
      <FullCalendar
        selectMirror={false}
        unselectAuto={true}
        plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
        initialView={currentView}
        eventClick={handleEventClickFn}
        selectable={true}
        dayMaxEvents={2}
        events={events ?? []}
        select={handleDateSelectFn}
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
          left: "prev,next",
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
          if (arg.date < today) return ["fc-day-disabled"];
          return [];
        }}
        datesSet={handleDatesSet}
        contentHeight="auto"
        handleWindowResize={false}
        slotEventOverlap={false}
      />
    </div>
  );
};

export default FullCalendarComponent;
