import { NextResponse } from "next/server";

import axios from "axios";

import { downloadFileFromYandexDisk } from "../yandexDisk";
import { getErrorMessageDownloadByCode } from "./getErrorMessageDownloadByCode";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url); // Создаем объект URL
    const filePath = url.searchParams.get("filePath");

    if (filePath === null) throw new Error("Не указан путь к файлу.");

    const fileBlob = await downloadFileFromYandexDisk(filePath);
    return new NextResponse(fileBlob, {
      status: 200,
      headers: {
        "Content-Type": "application/octet-stream",
        "Content-Disposition": `attachment; filename="${encodeURIComponent(
          filePath.split("/").pop() || "file"
        )}"`,
      },
    });
  } catch (error) {
    console.error("Ошибка скачивания файла:", error);

    if (axios.isAxiosError(error)) {
      const statusCode = error?.status ?? 500;
      return NextResponse.json(
        { error: getErrorMessageDownloadByCode(statusCode) },
        { status: statusCode }
      );
    }
    return new NextResponse(
      JSON.stringify({ error: (error as Error).message }),
      {
        status: 500,
      }
    );
  }
}
