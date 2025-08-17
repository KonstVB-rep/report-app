import { format, formatDistanceToNow } from "date-fns";
import { ru } from "date-fns/locale";

export const formatDate = (date: Date) =>
  format(date, "yyyy-MM-dd'T'HH:mm:00.000", { locale: ru });

export const addCorrectTimeInDates = (
  startTime: string,
  endTime: string,
  startDate: Date,
  endDate: Date
) => {
  const [startH, startM] = startTime.split(":");
  const [endH, endM] = endTime.split(":");

  const start = new Date(startDate);
  const end = new Date(endDate);
  start.setHours(+startH);
  start.setMinutes(+startM);
  end.setHours(+endH);
  end.setMinutes(+endM);
  return [start, end];
};

export const cleanDistance = (date: Date) => {
  const raw = formatDistanceToNow(date, {
    addSuffix: true,
    locale: ru,
  });

  // Убираем "приблизительно" и "около"
  return raw.replace(/(приблизительно |около )/gi, "");
};
