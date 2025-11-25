import axios from "axios"
import { type NextRequest, NextResponse } from "next/server"
import { uploadFilesToYandexDiskAndDB } from "../yandexDisk"
import { getErrorMessageUploadByCode } from "./getErrorMessageUploadByCode"

export const runtime = "nodejs"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const files = formData.getAll("files") as File[]

    if (!files.length) {
      return NextResponse.json({ error: "Нет файлов для загрузки" }, { status: 400 })
    }

    const uploadFileResponse = await uploadFilesToYandexDiskAndDB(formData)

    return NextResponse.json({
      message: "Файл(ы) успешно загружены!",
      success: true,
      data: uploadFileResponse,
    })
  } catch (error) {
    console.error("Ошибка загрузки файла:", error)

    if (axios.isAxiosError(error)) {
      const statusCode = error.response?.status ?? 500
      return NextResponse.json(
        { error: getErrorMessageUploadByCode(statusCode) },
        { status: statusCode },
      )
    }

    const message = error instanceof Error ? error.message : "Неизвестная ошибка"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
