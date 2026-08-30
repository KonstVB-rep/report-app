import axios from "axios"
import { type NextRequest, NextResponse } from "next/server"
import { deleteFileFromDB } from "@/widgets/Files/api/actions_db"
import { axiosInstanceYandexDisk } from "../yandexDisk"
import { getErrorMessageDeleteByCode } from "./getErrorMessageDeleteByCode"

// @/app/api/yandex-disk/delete/route.ts

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()

    const files = Array.isArray(body) ? body : [body]

    if (!files.length) return NextResponse.json({ error: "Нет данных" }, { status: 400 })

    const results = []

    for (const file of files) {
      try {
        const response = await axiosInstanceYandexDisk.delete(`/resources?path=${file.filePath}`)

        if (response.status === 204 || response.status === 200 || response.status === 404) {
          await deleteFileFromDB(file)
          results.push({ id: file.id, status: "deleted" })
        }
      } catch (err) {
        if (axios.isAxiosError(err)) {
          const statusCode = err.response?.status ?? 500
          results.push({
            id: file.id,
            status: statusCode,
            error: getErrorMessageDeleteByCode(statusCode),
          })
        } else {
          results.push({
            id: file.id,
            status: "error",
            error: (err as Error).message,
          })
        }
      }
    }

    return NextResponse.json({ data: results, success: true })
  } catch (_error) {
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 })
  }
}
