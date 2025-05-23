"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";

import { ListTodo } from "lucide-react";

import { useEventActionContext } from "@/app/(dashboard)/calendar/context/events-action-provider";
import { useSidebar } from "@/components/ui/sidebar";
import CalendarBotLink from "@/feature/calendar/ui/CalendarBotLink";
import ButtonLink from "@/shared/ui/Buttons/ButtonLink";

import Loading from "./loading";

const FullCalendarComponent = dynamic(
  () => import("@/feature/calendar/ui/FullCalendarComponent")
);

const CalendarFormModal = dynamic(
  () => import("@/feature/calendar/ui/CalendarFormModal")
);

const CalendarMobile = dynamic(
  () => import("@/feature/calendar/ui/CalendarMobile")
);


const CalendarPage = () => {
  const pathName = usePathname();

  const { isMobile } = useSidebar();

  const { events, isPendingLoad } = useEventActionContext();

  if (isPendingLoad) {
    return <Loading />;
  }

  return (
    <div className="p-5">
      <div className="flex gap-2 justify-between flex-wrap pb-4">
        <ButtonLink
          pathName={`${pathName}/events-list`}
          label="Список событий"
          icon={<ListTodo />}
        />

        <CalendarBotLink chatName="calendarChat"/>
      </div>
      {isMobile ? (
        <CalendarMobile />
      ) : (
        <div>
          <FullCalendarComponent />

          <CalendarFormModal events={events} />
        </div>
      )}
    </div>
  );
};

export default CalendarPage;
