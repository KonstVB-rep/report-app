import { CalendarProvider } from "../context/calendar-context";
import { EventsActionProvider } from "../context/events-action-provider";


export default function CalendarLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <CalendarProvider>
        <EventsActionProvider>{children}</EventsActionProvider>
      </CalendarProvider>
    </>
  );
}
