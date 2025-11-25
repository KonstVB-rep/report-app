import { NextResponse } from "next/server"
import { prisma } from "@/prisma/prisma-client"

export async function POST() {
  try {
    const chats = await prisma.userTelegramChat.findMany({
      where: {
        isActive: true,
        chatId: { not: undefined },
        userId: { not: undefined },
      },
      select: {
        chatId: true,
        userId: true,
        isActive: true,
      },
    })

    return NextResponse.json(chats)
  } catch (error) {
    console.error("❌ Ошибка при получении активных чатов:", error)
    return NextResponse.json({ message: "Ошибка сервера" }, { status: 500 })
  }
}
