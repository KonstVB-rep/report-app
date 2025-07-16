"use client";

import { zodResolver } from "@hookform/resolvers/zod";

import React, {
  createContext,
  ReactNode,
  SetStateAction,
  useCallback,
  useContext,
  useState,
} from "react";
import { useForm, UseFormReturn } from "react-hook-form";

import {
  EventCalendarFormSchema,
  EventCalendarSchema,
} from "@/feature/calendar/model/schema";

const defaultValuesForm = {
  eventTitle: "",
  startDateEvent: undefined,
  startTimeEvent: "",
  endDateEvent: undefined,
  endTimeEvent: "",
  allDay: false,
};

interface CalendareContextType {
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  confirmDelModal: boolean;
  setConfirmDelModal: React.Dispatch<SetStateAction<boolean>>;
  editingId: string | null;
  setEditingId: (id: string) => void;
  form: UseFormReturn<EventCalendarSchema>;
  handleResetAndClose: () => void;
  handleCloseModalAfterDeleteEvent: () => void;
  closeModalForm: () => void;
}

const CalendarContext = createContext<CalendareContextType | undefined>(
  undefined
);

export const useCalendarContext = (): CalendareContextType => {
  const context = useContext(CalendarContext);

  if (!context) {
    throw new Error(
      "useCalendarContext must be used within a CalendarProvider"
    );
  }
  return context;
};

export const CalendarProvider = ({ children }: { children: ReactNode }) => {
  const [openModal, setOpenModal] = useState(false);
  const [confirmDelModal, setConfirmDelModal] = useState(false);
  const [editingId, setEditingId] = useState<string>("");

  const form = useForm<EventCalendarSchema>({
    resolver: zodResolver(EventCalendarFormSchema),
    defaultValues: defaultValuesForm,
  });

  const { reset } = form;

  const handleResetAndClose = useCallback(() => {
    setOpenModal(false);
    setEditingId("");
    reset();
  }, [reset]);

  const handleCloseModalAfterDeleteEvent = useCallback(() => {
    setConfirmDelModal(false);

    handleResetAndClose();
  }, [handleResetAndClose]);

  const closeModalForm = useCallback(() => {
    if (openModal) {
      handleResetAndClose();
    } else {
      setOpenModal(true);
    }
  }, [handleResetAndClose, openModal]);

  return (
    <CalendarContext.Provider
      value={{
        handleResetAndClose,
        handleCloseModalAfterDeleteEvent,
        openModal,
        setOpenModal,
        confirmDelModal,
        setConfirmDelModal,
        editingId,
        setEditingId,
        form,
        closeModalForm,
      }}
    >
      {children}
    </CalendarContext.Provider>
  );
};
