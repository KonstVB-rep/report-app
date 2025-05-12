"use client";

import React from "react";

import { useGetEventsCalendarUser } from "@/feature/calendar/hooks/query";
import { EventInputType } from "@/feature/calendar/types";
import EventsList from "@/feature/calendar/ui/EventsList";

const UserEventsPage = () => {
  const { data: events, isPending } = useGetEventsCalendarUser();

  if (isPending) {
    return <div>Загрузка данных...</div>;
  }
  return (
    <section className="p-5">
      <EventsList events={events as EventInputType[]} />
    </section>
  );
};

export default UserEventsPage;
