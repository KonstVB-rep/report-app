import React, { useState } from "react";
import { Matcher } from "react-day-picker";

// import { EventInputType } from "../types";
import { useGetEventsCalendarUserToday } from "./query";

const useCalendarMobile = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [openList, setOpenList] = useState(false);

  const { data: events } = useGetEventsCalendarUserToday();

  const futureEvents = events?.filter(
    (event) => new Date(event.start) >= new Date(new Date().toDateString())
  );

  const eventDates = futureEvents?.map((event) => new Date(event.start)) as
    | Matcher
    | Matcher[];

  const eventsDate =
    futureEvents?.filter(
      (event) =>
        new Date(event.start).toDateString() === selectedDate?.toDateString()
    ) || [];

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
      return true;
    }
    return false;
  };

  React.useEffect(() => {
    if (!selectedDate) return;

    const isExistEventInDate = futureEvents?.some(
      (event) =>
        new Date(event.start).toDateString() === selectedDate.toDateString()
    );

    if (!isExistEventInDate && openList) {
      setOpenList(false);
    }
  }, [futureEvents, openList, selectedDate]);

  return {
    events,
    openList,
    setOpenList,
    eventsDate,
    selectedDate,
    eventDates,
    handleSelect,
  };
};

export default useCalendarMobile;
