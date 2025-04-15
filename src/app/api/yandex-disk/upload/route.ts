import { NextRequest, NextResponse } from "next/server";

import { AxiosError } from "axios";

import { uploadFilesToYandexDiskAndDB } from "../yandexDisk";
import { getErrorMessageUploadByCode } from "./getErrorMessageUploadByCode";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const files = formData.getAll("files") as File[];

    if (!files.length) {
      return NextResponse.json({ error: "Нет файлов" }, { status: 400 });
    }

    const uploadFileResponse = await uploadFilesToYandexDiskAndDB(formData);

    return NextResponse.json({
      message: "Файл успешно загружен!",
      success: true,
      data: uploadFileResponse,
    });
  } catch (error) {
    console.error("Ошибка загрузки файла:", error);

    if (error instanceof AxiosError) {
      const statusCode = error?.status ?? 500;
      return NextResponse.json(
        { error: getErrorMessageUploadByCode(statusCode) },
        { status: statusCode }
      );
    }

    return NextResponse.json(
      { error: "Ошибка загрузки файла" },
      { status: 500 }
    );
  }
}
