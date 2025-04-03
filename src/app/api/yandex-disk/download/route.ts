import { NextResponse } from "next/server";
import { downloadFileFromYandexDisk } from "../../utils/yandexDisk";


export async function POST(request: Request) {
  try {
    const { filePath } = await request.json();
    if (!filePath) throw new Error("Не указан путь к файлу.");

    const fileBlob = await downloadFileFromYandexDisk(filePath);
    return new NextResponse(fileBlob, {
      status: 200,
      headers: {
        "Content-Type": "application/octet-stream",
        "Content-Disposition": `attachment; filename="${filePath.split("/").pop()}"`,
      },
    });
  } catch (error) {
    console.error("Ошибка скачивания файла:", error);
    return new NextResponse(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}