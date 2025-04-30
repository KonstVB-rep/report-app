"use client";

import { zodResolver } from "@hookform/resolvers/zod";

import React, { Dispatch, SetStateAction } from "react";
import { Path, useForm, UseFormReturn } from "react-hook-form";

import { Form } from "@/components/ui/form";
import {
  EventCalendarFormSchema,
  EventCalendarSchema,
} from "@/feature/calendar/model/schema";
import ModalDelEvents from "@/feature/calendar/ui/ModalDelEvents";
import SubmitFormButton from "@/shared/ui/Buttons/SubmitFormButton";
import DatePickerFormField from "@/shared/ui/Inputs/DatePickerFormField";
import InputTextForm from "@/shared/ui/Inputs/InputTextForm";
import InputTimeForm from "@/shared/ui/Inputs/InputTimeForm";
import { UseMutateFunction } from "@tanstack/react-query";

const defaultValuesForm = {
  eventTitle: "",
  startDateEvent: "",
  startTimeEvent: "",
  endDateEvent: "",
  endTimeEvent: "",
};

type FormEventType = {
  handleSubmit: (values: EventCalendarSchema) => void;
  editingId: string;
  confirmDelModal: boolean;
  setConfirmDelModal: Dispatch<SetStateAction<boolean>>;
  isLoading: boolean;
  isPendingDelete: boolean;
  events: EventInputType[] | undefined;
  deleteEvent: UseMutateFunction<{
    id: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    title: string;
    start: Date;
    end: Date | null;
}, Error, string, unknown>
};

const FormEvent = ({
  handleSubmit,
  editingId,
  confirmDelModal,
  setConfirmDelModal,
  isLoading,
  isPendingDelete,
  events,
  deleteEvent
}: FormEventType) => {
  const form = useForm<EventCalendarSchema>({
    resolver: zodResolver(EventCalendarFormSchema),
    defaultValues: defaultValuesForm,
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="grid max-h-[82vh] min-w-full gap-5 overflow-y-auto"
      >
        <div className="text-center font-semibold uppercase">
          Форма добавления события
        </div>
        <div className="grid gap-2 p-1">
          <InputTextForm
            name={"eventTitle" as Path<EventCalendarSchema>}
            label="Наименование события"
            control={form.control}
            errorMessage={form.formState.errors.eventTitle?.message as string}
            placeholder="Название события..."
            required
          />
          <DatePickerFormField<UseFormReturn<EventCalendarSchema>>
            name={"startDateEvent" as Path<EventCalendarSchema>}
            label="Начало события"
            control={form.control}
            errorMessage={
              form.formState.errors.startDateEvent?.message as string
            }
            required
          />

          <InputTimeForm
            name={"startTimeEvent" as Path<EventCalendarSchema>}
            label="Время"
            control={form.control}
            errorMessage={
              form.formState.errors.startTimeEvent?.message as string
            }
          />
          <DatePickerFormField<UseFormReturn<EventCalendarSchema>>
            name={"endDateEvent" as Path<EventCalendarSchema>}
            label="Конец события"
            control={form.control}
            errorMessage={form.formState.errors.endDateEvent?.message as string}
            required
          />

          <InputTimeForm
            name={"endTimeEvent" as Path<EventCalendarSchema>}
            label="Время"
            control={form.control}
            errorMessage={form.formState.errors.endTimeEvent?.message as string}
          />
        </div>
        {form.formState.errors.dateError && (
          <p className="text-sm text-red-500 text-center">
            {form.formState.errors.dateError.message}
          </p>
        )}
        <div className={`grid ${editingId ? "grid-cols-2" : ""} gap-4`}>
          <ModalDelEvents
            confirmDelModal={confirmDelModal}
            setConfirmDelModal={setConfirmDelModal}
            editingId={editingId}
            events={events}
            isPendingDelete={isPendingDelete}
            deleteEvent={deleteEvent}
          />

          <SubmitFormButton
            title={editingId ? "Изменить" : "Сохранить"}
            isPending={isLoading}
            className="w-full ml-auto"
          />
        </div>
      </form>
    </Form>
  );
};

export default FormEvent;
