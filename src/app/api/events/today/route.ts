import { NextRequest, NextResponse } from "next/server";

import prisma from "@/prisma/prisma-client";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ message: "userId обязателен" }, { status: 400 });
  }

  const now = new Date();

  const thirtyFiveMinutesLater = new Date(now.getTime() + 35 * 60000); // 35 минут = 35 * 60 * 1000 миллисекунд
  thirtyFiveMinutesLater.setSeconds(0, 0); // Округляем до минут

  try {
    const events = await prisma.eventCalendar.findMany({
      where: {
        userId,
        start: {
          gte: thirtyFiveMinutesLater, // События, которые начинаются через 35 минут
          lte: new Date(thirtyFiveMinutesLater.getTime() + 60000), // Плюс 1 минута для захвата окна
        },
        notified: false, // Только те, которые ещё не были уведомлены
      },
      include: {
        user: true,
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
