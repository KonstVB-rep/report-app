"use client";

import React from "react";

import dynamic from "next/dynamic";

import { useGetEventsCalendarUser } from "@/feature/calendar/hooks/query";
import { EventInputType } from "@/feature/calendar/types";

import Loading from "./loading";

const EventsList = dynamic(() => import("@/feature/calendar/ui/EventsList"), {
  ssr: false,
  loading: () => <Loading />,
});

const UserEventsPage = () => {
  const { data: events } = useGetEventsCalendarUser();

  return (
    <section className="p-5">
      <EventsList events={events as EventInputType[]} />
    </section>
  );
};

export default UserEventsPage;
