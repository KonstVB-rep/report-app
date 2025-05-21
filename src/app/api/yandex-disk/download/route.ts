import { NextResponse } from "next/server";

import axios from "axios";
import mime from "mime-types";

import { downloadFileFromYandexDisk } from "../yandexDisk";
import { getErrorMessageDownloadByCode } from "./getErrorMessageDownloadByCode";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const filePath = url.searchParams.get("filePath");

    if (!filePath || typeof filePath !== "string") {
      return NextResponse.json(
        { error: "Не указан путь к файлу." },
        { status: 400 }
      );
    }

    const fileBuffer = await downloadFileFromYandexDisk(filePath); // Uint8Array
    const fileName = filePath.split("/").pop() || "file";
    const contentType = mime.lookup(fileName) || "application/octet-stream";

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${encodeURIComponent(fileName)}"`,
        "Content-Length": fileBuffer.byteLength.toString(),
      },
    });
  } catch (error) {
    console.error("Ошибка скачивания файла:", error);

    if (axios.isAxiosError(error)) {
      const statusCode = error.response?.status ?? 500;
      return NextResponse.json(
        { error: getErrorMessageDownloadByCode(statusCode) },
        { status: statusCode }
      );
    }

    const message =
      error instanceof Error
        ? error.message
        : "Неизвестная ошибка при скачивании файла";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
