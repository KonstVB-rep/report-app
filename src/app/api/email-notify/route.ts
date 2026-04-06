"use server"
import { NextResponse } from "next/server"
import { prisma } from "@/prisma/prisma-client"
import { transporter } from "@/shared/lib/mailer"

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization")

  console.log("Полученный заголовок:", authHeader)
  console.log("Ожидаемый заголовок:", `Bearer ${process.env.CRON_SECRET}`)

  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse("Unauthorized", { status: 401 })
  }
  const now = new Date()
  const startOfDay = new Date(now.setHours(0, 0, 0, 0))
  const endOfDay = new Date(now.setHours(23, 59, 59, 999))

  try {
    const [projects, retails] = await Promise.all([
      prisma.project.findMany({
        where: {
          plannedDateConnection: {
            gte: startOfDay,
            lte: endOfDay,
          },
        },
        include: { user: true },
      }),
      prisma.retail.findMany({
        where: {
          plannedDateConnection: {
            gte: startOfDay,
            lte: endOfDay,
          },
        },
        include: { user: true },
      }),
    ])

    const tasks = [...projects, ...retails]

    for (const task of tasks) {
      if (!task.user?.email) continue

      await transporter.sendMail({
        from: `"CRM Уведомлениenpm" <${process.env.YANDEX_EMAIL}>`,
        to: task.user.email,
        subject: `📅 Напоминание: Созвон с ${task.contact || "Клиентом"}`,
        html: `
        <div style="background-image: linear-gradient(360deg, #d5d5d5, transparent);font-family: sans-serif;line-height: 1.5;padding: 2rem;border: 1px solid gray;border-radius: 20px;">
          <h2 style="color: #333;">Доброе утро, ${task.user.username}!</h2>
          <p>Напоминаем, что на сегодня запланирована задача:</p>
          <hr />
          <p><b>Сделка:</b> ${task.nameDeal || "Не указана"}</p>
          <p><b>Объект:</b> ${task.nameObject || "Не указана"}</p>
          <p><b>Контакт:</b> ${task.contact || "Не указан"}</p>
          <p><b>Последний комментарий:</b> ${task.commentsLastConnection || "-"}</p>
          <hr />
          <p style="font-size: 12px; color: #666;">Это автоматическое уведомление, отвечать на него не нужно.</p>
        </div>
      `,
      })
      console.log(`Письмо успешно отправлено на: ${task.user.email}`)
    }

    return NextResponse.json({ success: true, count: tasks.length })
  } catch (error) {
    console.error("ПОЛНАЯ ОШИБКА:", error)
    return NextResponse.json({ error: "Ошибка рассылки" }, { status: 500 })
  }
}
