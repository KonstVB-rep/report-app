import { NextResponse } from "next/server";

import axios from "axios";
import mime from "mime-types";

import { downloadFileFromYandexDisk } from "../yandexDisk";
import { getErrorMessageDownloadByCode } from "./getErrorMessageDownloadByCode";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const filePath = url.searchParams.get("filePath");

    if (!filePath) throw new Error("Не указан путь к файлу.");

    const fileBuffer = await downloadFileFromYandexDisk(filePath); // Uint8Array
    const fileName = filePath.split("/").pop() || "file";
    const contentType = mime.lookup(fileName) || "application/octet-stream";

    return new NextResponse(Buffer.from(fileBuffer), {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${encodeURIComponent(fileName)}"`,
        "Content-Length": fileBuffer.byteLength.toString(), // Uint8Array has byteLength
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

    return new NextResponse(
      JSON.stringify({ error: (error as Error).message }),
      { status: 500 }
    );
  }
}
