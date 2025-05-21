"use client";

import { Path, UseFormReturn } from "react-hook-form";

import { useCalendarContext } from "@/app/(dashboard)/calendar/context/calendar-context";
import { useEventActionContext } from "@/app/(dashboard)/calendar/context/events-action-provider";
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
import InputTimeForm from "@/shared/ui/Inputs/InputTimeForm";
import TextareaForm from "@/shared/ui/TextareaForm";
import { TOAST } from "@/shared/ui/Toast";

import { IsExistIntersectionEvents } from "../utils/eventHandlers";

type FormEventProps = {
  events: EventInputType[] | undefined;
};

type HandleSubmitProps = {
  editingId?: string | null;
  events: EventInputType[] | undefined;
  createEvent: (data: {
    title: string;
    start: string;
    end: string;
    allDay: boolean;
  }) => void;
  updateEvent: (data: {
    id: string;
    title: string;
    start: string;
    end: string;
    allDay: boolean;
  }) => void;
};

export const handleSubmit = (
  values: EventCalendarSchema,
  { editingId, events, createEvent, updateEvent }: HandleSubmitProps
) => {
  const {
    eventTitle,
    startDateEvent,
    endDateEvent,
    startTimeEvent,
    endTimeEvent,
    allDay,
  } = values;

  const startDate = new Date(startDateEvent);
  const endDate = new Date(endDateEvent);

  if (allDay) {
    startDate.setHours(0, 0);
    endDate.setHours(23, 59);
  } else {
    const [startH, startM] = startTimeEvent.split(":");
    const [endH, endM] = endTimeEvent.split(":");

    if (
      parseInt(startH, 10) === parseInt(endH, 10) &&
      parseInt(startM, 10) === parseInt(endM, 10)
    ) {
      return TOAST.ERROR(
        "Время окнчания события должно быть больше времени началаю!"
      );
    }

    startDate.setHours(parseInt(startH, 10), parseInt(startM, 10));
    endDate.setHours(parseInt(endH, 10), parseInt(endM, 10));
  }

  const isIntersections = IsExistIntersectionEvents(
    startDate,
    endDate,
    events,
    editingId
  );

  if (isIntersections) return;

  if (editingId) {
    updateEvent({
      id: editingId,
      title: eventTitle,
      start: startDate.toISOString(),
      end: endDate.toISOString(),
      allDay,
    });
  } else {
    createEvent({
      title: eventTitle,
      start: startDate.toISOString(),
      end: endDate.toISOString(),
      allDay,
    });
  }
};

const FormEvent = ({ events }: FormEventProps) => {
  const { editingId, form } = useCalendarContext();
  const { createEvent, updateEvent, isLoading } = useEventActionContext();
  const allDay = form.watch("allDay");

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((values) =>
            handleSubmit(values, {
              editingId,
              events,
              createEvent,
              updateEvent,
            })
          )}
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
              errorMessage={
                form.formState.errors.endDateEvent?.message as string
              }
              required={!allDay}
            />

            <InputTimeForm
              name={"endTimeEvent" as Path<EventCalendarSchema>}
              label="Время"
              control={form.control}
              errorMessage={
                form.formState.errors.endTimeEvent?.message as string
              }
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
            <ModalDelEvents events={events} />

            <SubmitFormButton
              title={editingId ? "Изменить" : "Сохранить"}
              isPending={isLoading}
              className="w-full ml-auto"
            />
          </div>
        </form>
      </Form>
    </>
  );
};

export default FormEvent;
