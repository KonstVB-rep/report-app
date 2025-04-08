import { NextResponse, NextRequest } from "next/server";
import { uploadFileToYandexDiskAndDB } from "../yandexDisk";
import { AxiosError } from "axios";
import { getErrorMessageUploadByCode } from "./getErrorMessageUploadByCode";



export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File; 
    
    if (!file) throw new Error("Файл не найден в запросе.");

    const uploadFileResponse = await uploadFileToYandexDiskAndDB(formData);

    return NextResponse.json({ message: "Файл успешно загружен!", success: true, data: uploadFileResponse });
  } catch (error) {
    console.error("Ошибка загрузки файла:", error);
    
    if (error instanceof AxiosError) {
      const statusCode = error?.status ?? 500;
      return NextResponse.json(
        { error: getErrorMessageUploadByCode(statusCode) }, 
        { status: statusCode }
      );
    }
    
    return NextResponse.json({ error: "Ошибка загрузки файла" }, { status: 500 });
  }
}
