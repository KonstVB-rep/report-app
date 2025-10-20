import { DialogClose } from "@radix-ui/react-dialog"
import { Loader } from "lucide-react"
import { useCalendarContext } from "@/app/dashboard/calendar/context/calendar-context"
import { useEventActionContext } from "@/app/dashboard/calendar/context/events-action-provider"
import { Button } from "@/shared/components/ui/button"
import DialogComponent from "@/shared/custom-components/ui/DialogComponent"
import type { EventInputType } from "../types"

type ModalDelEventsProps = {
  events: EventInputType[]
}

const ModalDelEvents = ({ events }: ModalDelEventsProps) => {
  const { deleteEvent, isPendingDelete } = useEventActionContext()
  const { confirmDelModal, setConfirmDelModal, editingId } = useCalendarContext()

  const eventTitle = events.find((e) => e.id === editingId)?.title ?? "Неизвестное событие"

  const handleDelete = () => {
    if (editingId) {
      deleteEvent(editingId)
    }
  }

  if (!editingId) return null
  return (
    <DialogComponent
      classNameContent="sm:max-w-[400px] z-51"
      onOpenChange={setConfirmDelModal}
      open={confirmDelModal}
      trigger={
        <Button className="w-full" variant="outline">
          Удалить
        </Button>
      }
    >
      <div className="w-full h-full grid gap-4">
        <div className="text-center grid gap-4">
          <p>Вы уверены что хотите удалить событие?</p>
          <p className="p-2 border border-solid rounded-md break-all">{eventTitle}</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Отмена
            </Button>
          </DialogClose>
          <Button disabled={isPendingDelete} onClick={handleDelete}>
            {isPendingDelete ? (
              <span className="flex gap-2 items-center">
                <Loader className="animate-spin w-5 h-5" /> Удаление...
              </span>
            ) : (
              "Удалить"
            )}
          </Button>
        </div>
      </div>
    </DialogComponent>
  )
}

export default ModalDelEvents
