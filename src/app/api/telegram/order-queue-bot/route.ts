import { NextRequest, NextResponse } from "next/server";

import { notifyOrder } from "@/entities/order/api/telegram";

export async function POST(request: NextRequest) {
  try {
    const { botName, userId, message } = await request.json();

    if (!userId || !message) {
      return NextResponse.json(
        { error: "userId и message обязательны" },
        { status: 400 }
      );
    }

    await notifyOrder(botName, userId, message);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: (error as Error).message || "Ошибка сервера" },
      { status: 500 }
    );
  }
}
