import prisma from "@/prisma/prisma-client";

import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ message: "userId обязателен" }, { status: 400 });
  }

//   const now = new Date();
//   const startOfDay = new Date(now);
//   startOfDay.setHours(0, 0, 0, 0);

//   const endOfDay = new Date(now);
//   endOfDay.setHours(23, 59, 59, 999);

const now = new Date();
const in30min = new Date(now.getTime() + 35 * 60 * 1000);

  try {
    const events = await prisma.eventCalendar.findMany({
    where: {
    start: {
      gte: now,
      lte: in30min,
    },
  },
  include: {
    user: true, // подтягиваем данные пользователя
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

