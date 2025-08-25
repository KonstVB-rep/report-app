import { NextRequest, NextResponse } from "next/server";

import prisma from "@/prisma/prisma-client";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ message: "userId обязателен" }, { status: 400 });
  }

  const now = new Date();

  // 30 минут от текущего времени
  const thirtyMinutesLater = new Date(now.getTime() + 30 * 60000);
  thirtyMinutesLater.setSeconds(0, 0); // Округляем до начала минуты
  //(на 1 минуту больше)
  const thirtyOneMinutesLater = new Date(thirtyMinutesLater.getTime() + 60000);

  try {
    const events = await prisma.eventCalendar.findMany({
      where: {
        userId,
        start: {
          gte: thirtyMinutesLater, // События, которые начинаются через 30 минут
          lte: thirtyOneMinutesLater, // И до 31 минут
        },
        notified: false, // Только те, которые ещё не были уведомлены
      },
      orderBy: {
        start: "asc",
      },
    });
    return NextResponse.json(events);
  } catch (error) {
    console.error("❌ Ошибка при получении событий:", error);
    return NextResponse.json({ message: "Ошибка сервера" }, { status: 500 });
  }
}
