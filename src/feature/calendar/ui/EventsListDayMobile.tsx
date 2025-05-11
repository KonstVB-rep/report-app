"use client";

import { getCoreRowModel, useReactTable } from "@tanstack/react-table";

import React from "react";

import { useRouter } from "next/navigation";

import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import useStoreUser from "@/entities/user/store/useStoreUser";
import { EventInputType } from "@/feature/calendar/types";
import EventsListTable from "@/feature/calendar/ui/EventsListTable";

import { columnsDataCalendar } from "../../../app/(dashboard)/calendar/[userId]/events-list/model/column-data-calendar";

type EventsListProps = {
  events: EventInputType[];
  showLinkCalendar?: boolean;
  handleEventClickOnEventsList?: (evenetCalendar: EventInputType) => void;
  handleDateSelectOnEventsList: () => void

};

const EventsListDayMobile = ({
  events,
  handleEventClickOnEventsList,
  handleDateSelectOnEventsList
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
      <Button
        variant="outline"
        aria-label="Добавить событие"
        className="flex items-center justify-start gap-2 w-fit"
        onClick={handleDateSelectOnEventsList}
      >
        <Plus size={50} /> <span>Добавить событие</span>
      </Button>

      <div className="rounded-lg overflow-hidden border w-full">
        <EventsListTable<EventInputType>
          table={table}
          handleRowClick={handleEventClickOnEventsList}
        />
      </div>
    </>
  );
};

export default EventsListDayMobile;
