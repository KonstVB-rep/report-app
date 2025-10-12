// Операции
export const DateUtils = {
  // Конец дня (23:59:59.999)
  endOfDay(date: Date) {
    const d = new Date(date)
    d.setHours(23, 59, 59, 999)
    return d
  },

  // Начало дня (00:00:00.000)
  startOfDay(date: Date) {
    const d = new Date(date)
    d.setHours(0, 0, 0, 0)
    return d
  },

  // Конец месяца (последний день, 23:59:59.999)
  endOfMonth(date: Date) {
    const d = new Date(date)
    d.setMonth(d.getMonth() + 1, 0)
    d.setHours(23, 59, 59, 999)
    return d
  },

  // Начало месяца (первый день, 00:00:00.000)
  startOfMonth(date: Date) {
    const d = new Date(date)
    d.setDate(1)
    d.setHours(0, 0, 0, 0)
    return d
  },

  // Конец недели (воскресенье 23:59:59.999)
  endOfWeek(date: Date, startDay = 1) {
    const d = new Date(date)
    const day = d.getDay()
    const diff = (day < startDay ? -7 : 0) + 6 - (day - startDay)
    d.setDate(d.getDate() + diff)
    d.setHours(23, 59, 59, 999)
    return d
  },

  // Начало недели (понедельник 00:00:00.000)
  startOfWeek(date: Date, startDay = 1) {
    const d = new Date(date)
    const day = d.getDay()
    const diff = (day < startDay ? -7 : 0) + startDay - day
    d.setDate(d.getDate() + diff)
    d.setHours(0, 0, 0, 0)
    return d
  },

  // Конец года (31 декабря 23:59:59.999)
  endOfYear(date: Date) {
    const d = new Date(date)
    d.setMonth(11, 31)
    d.setHours(23, 59, 59, 999)
    return d
  },

  // Начало года (1 января 00:00:00.000)
  startOfYear(date: Date) {
    const d = new Date(date)
    d.setMonth(0, 1)
    d.setHours(0, 0, 0, 0)
    return d
  },

  formatterLocaleRu(date: Date) {
    return new Intl.DateTimeFormat("ru-RU").format(date)
  },
}
