"use client"

import type { Path } from "react-hook-form"
import { useCalendarContext } from "@/app/dashboard/calendar/context/calendar-context"
import { useEventActionContext } from "@/app/dashboard/calendar/context/events-action-provider"
import type { EventCalendarSchema } from "@/feature/calendar/model/schema"
import ModalDelEvents from "@/feature/calendar/ui/ModalDelEvents"
import { Checkbox } from "@/shared/components/ui/checkbox"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form"
import SubmitFormButton from "@/shared/custom-components/ui/Buttons/SubmitFormButton"
import DatePickerFormField from "@/shared/custom-components/ui/Inputs/DatePickerFormField"
import InputTimeForm from "@/shared/custom-components/ui/Inputs/InputTimeForm"
import TextareaForm from "@/shared/custom-components/ui/TextareaForm"
import { TOAST } from "@/shared/custom-components/ui/Toast"
import type { EventInputType } from "../types"

type FormEventProps = {
  events: EventInputType[]
}

type HandleSubmitProps = {
  editingId?: string | null
  createEvent: (data: { title: string; start: string; end: string; allDay: boolean }) => void
  updateEvent: (data: {
    id: string
    title: string
    start: string
    end: string
    allDay: boolean
  }) => void
}

export const handleSubmit = (
  values: EventCalendarSchema,
  { editingId, createEvent, updateEvent }: HandleSubmitProps,
) => {
  const { eventTitle, startDateEvent, endDateEvent, startTimeEvent, endTimeEvent, allDay } = values

  const startDate = new Date(startDateEvent)
  const endDate = new Date(endDateEvent)

  if (allDay) {
    startDate.setHours(0, 0)
    endDate.setHours(23, 59)
  } else {
    const [startH, startM] = startTimeEvent.split(":")
    const [endH, endM] = endTimeEvent.split(":")

    startDate.setHours(parseInt(startH, 10), parseInt(startM, 10))
    endDate.setHours(parseInt(endH, 10), parseInt(endM, 10))

    if (endDate <= startDate) {
      return TOAST.ERROR("Время окончания события не должно быть меньше времени начала!")
    }
  }

  if (editingId) {
    updateEvent({
      id: editingId,
      title: eventTitle,
      start: startDate.toISOString(),
      end: endDate.toISOString(),
      allDay,
    })
  } else {
    createEvent({
      title: eventTitle,
      start: startDate.toISOString(),
      end: endDate.toISOString(),
      allDay,
    })
  }
}

const FormEvent = ({ events }: FormEventProps) => {
  const { editingId, form } = useCalendarContext()
  const { createEvent, updateEvent, isLoading } = useEventActionContext()
  const allDay = form.watch("allDay") ?? false

  return (
    <Form {...form}>
      <form
        className="grid max-h-[82vh] w-full gap-5 overflow-y-auto"
        key={String(allDay)}
        onSubmit={form.handleSubmit((values) =>
          handleSubmit(values, {
            editingId,
            createEvent,
            updateEvent,
          }),
        )}
      >
        <div className="text-center font-semibold uppercase">Форма события</div>
        <div className="grid gap-2 p-1">
          <TextareaForm
            control={form.control}
            errorMessage={form.formState.errors.eventTitle?.message as string}
            label="Наименование события"
            name={"eventTitle" as Path<EventCalendarSchema>}
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
                    checked={Boolean(field.value)}
                    onCheckedChange={(checked) => {
                      field.onChange(checked)
                      form.trigger("allDay")
                    }}
                  />
                </FormControl>
                <FormLabel className="m-0!">Весь день</FormLabel>
                <FormMessage />
              </FormItem>
            )}
          />
          <DatePickerFormField
            control={form.control}
            errorMessage={form.formState.errors.startDateEvent?.message as string}
            label="Начало события"
            name={"startDateEvent" as Path<EventCalendarSchema>}
            required={!allDay}
          />

          <InputTimeForm
            control={form.control}
            disabled={allDay}
            errorMessage={form.formState.errors.startTimeEvent?.message as string}
            label="Время"
            min={!allDay ? new Date().toISOString().slice(0, 16) : undefined}
            name={"startTimeEvent" as Path<EventCalendarSchema>}
          />
          <DatePickerFormField
            control={form.control}
            errorMessage={form.formState.errors.endDateEvent?.message as string}
            label="Конец события"
            name={"endDateEvent" as Path<EventCalendarSchema>}
            required={!allDay}
          />

          <InputTimeForm
            control={form.control}
            disabled={allDay}
            errorMessage={form.formState.errors.endTimeEvent?.message as string}
            label="Время"
            min={!allDay ? new Date().toISOString().slice(0, 16) : undefined}
            name={"endTimeEvent" as Path<EventCalendarSchema>}
          />
        </div>
        <div className={`grid ${editingId ? "grid-cols-2" : ""} gap-4`}>
          <ModalDelEvents events={events} />

          <SubmitFormButton
            className="w-full ml-auto"
            isPending={isLoading}
            title={editingId ? "Изменить" : "Сохранить"}
          />
        </div>
      </form>
    </Form>
  )
}

export default FormEvent
