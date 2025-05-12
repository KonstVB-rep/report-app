"use client";

import { UseMutateFunction } from "@tanstack/react-query";

import React, { Dispatch, SetStateAction } from "react";
import { Path, UseFormReturn } from "react-hook-form";

import { Checkbox } from "@/components/ui/checkbox";
import { Form } from "@/components/ui/form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { EventCalendarSchema } from "@/feature/calendar/model/schema";
import ModalDelEvents from "@/feature/calendar/ui/ModalDelEvents";
import { EventInputType } from "@/feature/calendar/ui/types";
import SubmitFormButton from "@/shared/ui/Buttons/SubmitFormButton";
import DatePickerFormField from "@/shared/ui/Inputs/DatePickerFormField";
// import InputTextForm from "@/shared/ui/Inputs/InputTextForm";
import InputTimeForm from "@/shared/ui/Inputs/InputTimeForm";
import TextareaForm from "@/shared/ui/TextareaForm";

type FormEventProps = {
  handleSubmit: (values: EventCalendarSchema) => void;
  editingId: string | null;
  confirmDelModal: boolean;
  setConfirmDelModal: Dispatch<SetStateAction<boolean>>;
  isLoading: boolean;
  isPendingDelete: boolean;
  events: EventInputType[] | undefined;
  deleteEvent: UseMutateFunction<EventInputType, Error, string, unknown>;
  form: UseFormReturn<EventCalendarSchema>;
};

const FormEvent = ({
  handleSubmit,
  editingId,
  confirmDelModal,
  setConfirmDelModal,
  isLoading,
  isPendingDelete,
  events,
  deleteEvent,
  form,
}: FormEventProps) => {
  const allDay = form.watch("allDay");

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="grid max-h-[82vh] min-w-full gap-5 overflow-y-auto"
        key={allDay}
      >
        <div className="text-center font-semibold uppercase">
          Форма добавления события
        </div>
        <div className="grid gap-2 p-1">
          <TextareaForm
            name={"eventTitle" as Path<EventCalendarSchema>}
            label="Наименование события"
            control={form.control}
            errorMessage={form.formState.errors.eventTitle?.message as string}
            placeholder="Название события..."
            required
          />

          <FormField
            control={form.control}
            name={"allDay" as Path<EventCalendarSchema>}
            render={({ field }) => (
              <FormItem className="flex gap-2 items-center justify-start my-2">
                <FormControl>
                  <Checkbox
                    {...field}
                    checked={field.value}
                    onCheckedChange={(checked) => {
                      field.onChange(checked);
                      form.trigger("allDay");
                    }}
                  />
                </FormControl>
                <FormLabel className="!m-0">Весь день</FormLabel>
                <FormMessage />
              </FormItem>
            )}
          />
          <DatePickerFormField<UseFormReturn<EventCalendarSchema>>
            name={"startDateEvent" as Path<EventCalendarSchema>}
            label="Начало события"
            control={form.control}
            errorMessage={
              form.formState.errors.startDateEvent?.message as string
            }
            required={!allDay}
          />

          <InputTimeForm
            name={"startTimeEvent" as Path<EventCalendarSchema>}
            label="Время"
            control={form.control}
            errorMessage={
              form.formState.errors.startTimeEvent?.message as string
            }
            min={!allDay ? new Date().toISOString().slice(0, 16) : undefined}
            disabled={allDay}
          />
          <DatePickerFormField<UseFormReturn<EventCalendarSchema>>
            name={"endDateEvent" as Path<EventCalendarSchema>}
            label="Конец события"
            control={form.control}
            errorMessage={form.formState.errors.endDateEvent?.message as string}
            required={!allDay}
          />

          <InputTimeForm
            name={"endTimeEvent" as Path<EventCalendarSchema>}
            label="Время"
            control={form.control}
            errorMessage={form.formState.errors.endTimeEvent?.message as string}
            min={!allDay ? new Date().toISOString().slice(0, 16) : undefined}
            disabled={allDay}
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
