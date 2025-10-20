import axios from "axios"
import { type NextRequest, NextResponse } from "next/server"
import { deleteFileOrFolderFromYandexDiskAnDB } from "../yandexDisk"
import { getErrorMessageDeleteByCode } from "./getErrorMessageDeleteByCode"

export const runtime = "nodejs"

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json() // Парсим JSON из тела запроса
    const { filePath } = body // Извлекаем filePath

    if (!filePath || typeof filePath !== "string") {
      return NextResponse.json({ error: "Неверный путь к файлу." }, { status: 400 })
    }

    const deletedFile = await deleteFileOrFolderFromYandexDiskAnDB(body)

    return NextResponse.json({ data: deletedFile, success: true })
  } catch (error) {
    console.error("Ошибка при удалении файла:", error)

    if (axios.isAxiosError(error)) {
      const statusCode = error.response?.status ?? 500
      return NextResponse.json(
        { error: getErrorMessageDeleteByCode(statusCode) },
        { status: statusCode },
      )
    }

    return NextResponse.json(
      { success: false, error: "Ошибка при удалении файла." },
      { status: 500 },
    )
  }
}
