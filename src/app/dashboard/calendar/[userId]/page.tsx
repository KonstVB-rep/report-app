"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";

import { ListTodo } from "lucide-react";

import { useEventActionContext } from "@/app/dashboard/calendar/context/events-action-provider";
import CalendarBotLink from "@/feature/calendar/ui/CalendarBotLink";
import { useSidebar } from "@/shared/components/ui/sidebar";
import ButtonLink from "@/shared/custom-components/ui/Buttons/ButtonLink";

import Loading from "./loading";

const FullCalendarComponent = dynamic(
  () => import("@/feature/calendar/ui/FullCalendarComponent"),
  {
    loading: () => <Loading />,
  }
);

const CalendarFormModal = dynamic(
  () => import("@/feature/calendar/ui/CalendarFormModal")
  // {
  //   loading: () => <Loading />,
  // }
);

const CalendarMobile = dynamic(
  () => import("@/feature/calendar/ui/CalendarMobile"),
  {
    loading: () => <Loading />,
  }
);

const CalendarPage = () => {
  const pathName = usePathname();

  const { isMobile } = useSidebar();

  const { events } = useEventActionContext();

  return (
    <div className="p-5">
      <div className="flex gap-2 justify-between flex-wrap pb-4">
        <ButtonLink
          pathName={`${pathName}/events-list`}
          label="Список событий"
          icon={<ListTodo />}
        />

        <CalendarBotLink botName="ertel_report_app_bot" />
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
