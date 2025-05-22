import { NextRequest, NextResponse } from "next/server";

import prisma from "@/prisma/prisma-client";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ message: "userId обязателен" }, { status: 400 });
  }

  const now = new Date();

// 35 минут от текущего времени
const thirtyFiveMinutesLater = new Date(now.getTime() + 30 * 60000); 
thirtyFiveMinutesLater.setSeconds(0, 0); // Округляем до начала минуты

console.log('35 минут позже:', thirtyFiveMinutesLater.toISOString()); // Логируем ISO строку

// 36 минут от текущего времени (на 1 минуту больше)
const thirtySixMinutesLater = new Date(thirtyFiveMinutesLater.getTime() + 60000);
console.log('36 минут позже:', thirtySixMinutesLater.toISOString()); // Логируем ISO строку

try {
  const events = await prisma.eventCalendar.findMany({
    where: {
      userId,
      start: {
        gte: thirtyFiveMinutesLater, // События, которые начинаются через 35 минут
        lte: thirtySixMinutesLater, // И до 36 минут
      },
      notified: false, // Только те, которые ещё не были уведомлены
    },
    orderBy: {
      start: "asc",
    },
  });
    console.log(events, 'events')
    return NextResponse.json(events);
  } catch (error) {
    console.error("❌ Ошибка при получении событий:", error);
    return NextResponse.json({ message: "Ошибка сервера" }, { status: 500 });
  }
}
