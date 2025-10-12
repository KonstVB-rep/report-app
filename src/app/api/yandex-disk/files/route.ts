import { NextResponse } from "next/server"
import { getFiles } from "../yandexDisk"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const folderPath = searchParams.get("folderPath") || "/"

    const files = await getFiles(folderPath)
    return NextResponse.json({ files })
  } catch (error) {
    console.error("Ошибка получения файлов:", error)
    return NextResponse.json({ error: "Ошибка получения файлов" }, { status: 500 })
  }
}
