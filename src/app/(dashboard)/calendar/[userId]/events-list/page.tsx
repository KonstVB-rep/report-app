import { getEventsCalendarUser } from '@/feature/calendar/api'
import React from 'react'
import EventsTable from './EventsTable'

const EventsList =async () => {

  const events =  await getEventsCalendarUser()
  return (
    <section className='p-5'>
      <EventsTable events={events}/>
    </section>
  )
}

export default EventsList