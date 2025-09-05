"use client";

import {
  ColumnDef,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { useEffect } from "react";

import { useRouter } from "next/navigation";

import { CalendarFold } from "lucide-react";

import { useCalendarContext } from "@/app/dashboard/calendar/context/calendar-context";
import useStoreUser from "@/entities/user/store/useStoreUser";
import { EventInputType } from "@/feature/calendar/types";
import EventsListTable from "@/feature/calendar/ui/EventsListTable";
import ButtonLink from "@/shared/custom-components/ui/Buttons/ButtonLink";

import { columnsDataCalendar } from "../model/column-data-calendar";
import { handleEventClickOnEventsList } from "../utils/eventHandlers";
import CalendarFormModal from "./CalendarFormModal";

type EventsListProps = {
  events: EventInputType[];
};

const EventsList = ({ events }: EventsListProps) => {
  const table = useReactTable({
    data: events,
    columns: columnsDataCalendar as ColumnDef<EventInputType, unknown>[],
    getCoreRowModel: getCoreRowModel(),
  });

  const { form, setEditingId, setOpenModal } = useCalendarContext();

  const onEventClick = (eventCalendar: EventInputType) => {
    handleEventClickOnEventsList(
      eventCalendar,
      form,
      setEditingId,
      setOpenModal
    );
  };

  const { authUser } = useStoreUser();
  const router = useRouter();

  useEffect(() => {
    if (!authUser) {
      router.replace("/login");
    }
  }, [authUser, router]);

  if (events?.length === 0) {
    return null;
  }

  if (!authUser) {
    return null;
  }

  return (
    <>
      <div className="grid gap-4">
        <ButtonLink
          pathName={`/dashboard/calendar/${authUser.id}`}
          label="Календарь"
          icon={<CalendarFold />}
        />

        <div className="rounded-lg overflow-hidden border w-full">
          <EventsListTable table={table} handleRowClick={onEventClick} />
        </div>
      </div>
      <CalendarFormModal events={events} />
    </>
  );
};

export default EventsList;
