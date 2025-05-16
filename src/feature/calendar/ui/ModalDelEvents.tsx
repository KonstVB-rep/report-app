import { DialogClose } from "@radix-ui/react-dialog";

import { Loader } from "lucide-react";

import { useCalendarContext } from "@/app/(dashboard)/calendar/context/calendar-context";
import { useEventActionContext } from "@/app/(dashboard)/calendar/context/events-action-provider";
import { Button } from "@/components/ui/button";
import DialogComponent from "@/shared/ui/DialogComponent";

import { EventInputType } from "../types";

type ModalDelEventsType = {
  events: EventInputType[];
};

const ModalDelEvents = ({
  events,
}: ModalDelEventsType) => {
  const { deleteEvent, isPendingDelete } = useEventActionContext();
  const { confirmDelModal, setConfirmDelModal, editingId } =
    useCalendarContext();

  if (!editingId) return null;
  return (
    <DialogComponent
      trigger={
        <Button variant="outline" className="w-full">
          Удалить
        </Button>
      }
      open={confirmDelModal}
      onOpenChange={setConfirmDelModal}
      classNameContent="sm:max-w-[400px] z-[51]"
    >
      <div className="w-full h-full grid gap-4">
        <div className="text-center grid gap-4">
          <p>Вы уверены что хотите удалить событие?</p>
          <p className="p-2 border border-solid rounded-md break-all">
            {events.find((item) => item.id === editingId)?.title ??
              "Неизвестное событие"}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Отмена
            </Button>
          </DialogClose>
          <Button onClick={() => deleteEvent(editingId)}>
            {isPendingDelete ? (
              <span className="flex gap-2">
                <Loader className="animate-spin w-5 h-5" /> Удаление...
              </span>
            ) : (
              "Удалить"
            )}
          </Button>
        </div>
      </div>
    </DialogComponent>
  );
};

export default ModalDelEvents;
