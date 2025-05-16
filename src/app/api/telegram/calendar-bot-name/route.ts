import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const authToken = req.headers.get("authorization");

  if (!authToken || authToken !== process.env.API_SECRET_TOKEN) {
    return NextResponse.json(
      { message: "Доступ запрещён" },
      { status: 403 }
    );
  }

  return NextResponse.json({
    botName: process.env.TELEGRAM_CALENDAR_BOT_NAME,
  });
}
