import {
  useCreateEventCalendar,
  useDeleteEventCalendar,
  useUpdateEventCalendar,
} from "./mutate";
import { useGetEventsCalendarUser } from "./query";

export const useActionEvents = (
  handleResetAndClose: () => void,
  handleCloseModalAfterDeleteEvent: () => void
) => {
  const { data: events, isPending: isPendingLoad } = useGetEventsCalendarUser();
  const { mutate: createEvent, isPending } =
    useCreateEventCalendar(handleResetAndClose);

  const { mutate: updateEvent, isPending: isPendingUpdate } =
    useUpdateEventCalendar(handleResetAndClose);

  const { mutate: deleteEvent, isPending: isPendingDelete } =
    useDeleteEventCalendar(handleCloseModalAfterDeleteEvent);

  const isLoading = isPendingUpdate || isPending || isPendingDelete;

  return {
    isLoading,
    events,
    createEvent,
    updateEvent,
    deleteEvent,
    isPendingLoad,
    isPendingDelete,
  };
};
