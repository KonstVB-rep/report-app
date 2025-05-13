// context/NotificationContext.tsx
'use client';

import { useGetEventsCalendarUserToday } from '@/feature/calendar/hooks/query';
import { EventInputType } from '@/feature/calendar/types';

import React, { useContext, ReactNode, createContext } from 'react';

interface NotificationContextType {
  events: EventInputType[] | undefined;
}

interface NotificationContextType {
    events: EventInputType[] | undefined;
    isLoading: boolean;
    isError: boolean;
  }
  
  const NotificationContext = createContext<NotificationContextType | undefined>(undefined);
  
  export const useNotification = (): NotificationContextType => {
    const context = useContext(NotificationContext);
    if (!context) {
      throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
  };
  
  export const NotificationProvider = ({ children }: { children: ReactNode }) => {

    const { data: events, isLoading, isError } = useGetEventsCalendarUserToday();

  
    return (
      <NotificationContext.Provider value={{ events, isLoading, isError }}>
        {children}
      </NotificationContext.Provider>
    );
  };
