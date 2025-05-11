"use client";

import { getCoreRowModel, useReactTable } from "@tanstack/react-table";

import React from "react";

import { useRouter } from "next/navigation";

import { CalendarFold } from "lucide-react";

import useStoreUser from "@/entities/user/store/useStoreUser";
import { EventInputType } from "@/feature/calendar/types";
import EventsListTable from "@/feature/calendar/ui/EventsListTable";
import ButtonLink from "@/shared/ui/Buttons/ButtonLink";

import { columnsDataCalendar } from "../../../app/(dashboard)/calendar/[userId]/events-list/model/column-data-calendar";

type EventsListProps = {
  events: EventInputType[];
  showLinkCalendar?: boolean;
  handleEventClickOnEventsList?: (evenetCalendar: EventInputType) => void;
};

const EventsList = ({
  events,
}: EventsListProps) => {
  const table = useReactTable({
    data: events,
    columns: columnsDataCalendar,
    getCoreRowModel: getCoreRowModel(),
  });

  const { authUser } = useStoreUser();
  const router = useRouter();

  if (!authUser) {
    router.replace("/login");
    return null;
  }

  return (
    <>
        <ButtonLink
          pathName={`/calendar/${authUser.id}`}
          label="Календарь"
          icon={<CalendarFold />}
        />

      <div className="rounded-lg overflow-hidden border w-full">
        <EventsListTable<EventInputType>
          table={table}
        />
      </div>
    </>
  );
};

export default EventsList;
