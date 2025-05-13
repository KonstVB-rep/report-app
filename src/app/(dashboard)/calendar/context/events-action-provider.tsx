'use client'

import { useCreateEventCalendar, useUpdateEventCalendar, useDeleteEventCalendar } from "@/feature/calendar/hooks/mutate";
import { useGetEventsCalendarUser } from "@/feature/calendar/hooks/query";
import { EventInputType } from "@/feature/calendar/types";
import React, {
  createContext,
  ReactNode,
  useContext,
} from "react";

import { useCalendarContext } from "./calendar-context";

interface EventActionType {
    id: string,
    title: string,
    start: string,
    end: string,
    allDay?: boolean | undefined
}


interface EventsActionContextType {
    isLoading: boolean,
    events: EventInputType[] | undefined,
    createEvent:(event: Omit<EventActionType, 'id'>)=> void,
    updateEvent: (event: EventActionType ) => void,
    deleteEvent: (id: string ) => void,
    isPendingLoad: boolean,
    isPendingDelete: boolean,
}

const EventActionContext = createContext<EventsActionContextType | undefined>(
  undefined
);

export const useEventActionContext = (): EventsActionContextType => {
  const context = useContext(EventActionContext);
  if (!context) {
    throw new Error(
      "EventActionContext must be used within a NotificationProvider"
    );
  }
  return context;
};


export const EventsActionProvider = ({ children }: { children: ReactNode }) => {

    const {handleResetAndClose,handleCloseModalAfterDeleteEvent} = useCalendarContext()

     const { data: events, isPending: isPendingLoad } = useGetEventsCalendarUser();
      const { mutate: createEvent, isPending } =
        useCreateEventCalendar(handleResetAndClose);
    
      const { mutate: updateEvent, isPending: isPendingUpdate } =
        useUpdateEventCalendar(handleResetAndClose);
    
      const { mutate: deleteEvent, isPending: isPendingDelete } =
        useDeleteEventCalendar(handleCloseModalAfterDeleteEvent);
    
      const isLoading = isPendingUpdate || isPending || isPendingDelete;
    

    return (
        <EventActionContext.Provider value={{isLoading,
            events,
            createEvent,
            updateEvent,
            deleteEvent,
            isPendingLoad,
            isPendingDelete}
            }>
        {children}
    </EventActionContext.Provider>
    )
}