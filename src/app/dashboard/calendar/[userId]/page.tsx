"use client"

import { Suspense } from "react" // 1. Импортируем Suspense
import { ListTodo } from "lucide-react"
import dynamic from "next/dynamic"
import { usePathname } from "next/navigation"
import { useEventActionContext } from "@/app/dashboard/calendar/context/events-action-provider"
import CalendarBotLink from "@/feature/calendar/ui/CalendarBotLink"
import { useSidebar } from "@/shared/components/ui/sidebar"
import ButtonLink from "@/shared/custom-components/ui/Buttons/ButtonLink"
import Loading from "./loading"

const FullCalendarComponent = dynamic(() => import("@/feature/calendar/ui/FullCalendarComponent"), {
  loading: () => <Loading />,
  ssr: false,
})

const CalendarMobile = dynamic(() => import("@/feature/calendar/ui/CalendarMobile"), {
  loading: () => <Loading />,
  ssr: false,
})
const CalendarFormModal = dynamic(() => import("@/feature/calendar/ui/CalendarFormModal"), {
  ssr: false,
})

const CalendarContent = () => {
  const pathName = usePathname()
  const { isMobile } = useSidebar()
  const { events } = useEventActionContext()

  return (
    <section className="flex h-full flex-col p-5">
      <header className="flex flex-wrap items-center justify-between gap-2 pb-4">
        <ButtonLink
          icon={<ListTodo className="h-4 w-4" />}
          label="Список событий"
          pathName={`${pathName}/events-list`}
        />
        <CalendarBotLink botName="ertel_report_app_bot" />
      </header>

      <main className="flex-1">
        {isMobile ? (
          <CalendarMobile />
        ) : (
          <>
            <FullCalendarComponent />
            <CalendarFormModal events={events} />
          </>
        )}
      </main>
    </section>
  )
}

const CalendarPage = () => {
  return (
    <Suspense fallback={<Loading />}>
      <CalendarContent />
    </Suspense>
  )
}

export default CalendarPage
