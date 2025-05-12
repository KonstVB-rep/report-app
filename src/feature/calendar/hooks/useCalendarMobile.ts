import React, { useState } from "react";
import { Matcher } from "react-day-picker";

import { EventInputType } from "../types";
import { useGetEventsCalendarUser } from "./query";

const useCalendarMobile = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [openList, setOpenList] = useState(false);
  const [eventsDate, setEventsDate] = useState<EventInputType[]>([]);

  const { data: events, isPending } = useGetEventsCalendarUser();

  const futureEvents = events?.filter(
    (event) => new Date(event.start) >= new Date(new Date().toDateString())
  );

  const eventDates = futureEvents?.map((event) => new Date(event.start)) as
    | Matcher
    | Matcher[];

  const handleSelect = (date: Date | undefined) => {
    if (!date) return;

    setSelectedDate(date);
    return showEventsOnDate(date);
  };

  const showEventsOnDate = (date: Date) => {
    const eventsOnDate =
      futureEvents?.filter(
        (event) => new Date(event.start).toDateString() === date.toDateString()
      ) || [];

    if (eventsOnDate.length > 0) {
      setOpenList(true);
      setEventsDate(eventsOnDate);
      return true;
    }
    return false;
  };

  React.useEffect(() => {
    const isExistEventInDate = futureEvents?.filter(
      (event) =>
        new Date(event.start).toDateString() === selectedDate?.toDateString(),
      "eventsDate"
    ).length;

    if (!isExistEventInDate) {
      setOpenList(false);
    }
    if (selectedDate) {
      showEventsOnDate(selectedDate);
    }
  }, [events]);

  return {
    events,
    openList,
    setOpenList,
    eventsDate,
    selectedDate,
    eventDates,
    handleSelect,
    isPending,
  };
};

export default useCalendarMobile;
