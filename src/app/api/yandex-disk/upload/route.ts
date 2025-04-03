import { NextResponse } from "next/server";
import { uploadFileToYandexDisk } from "../../utils/yandexDisk";


export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const fileName = formData.get("fileName") as string;
    const folderPath = formData.get("folderPath") as string || "/report_app_uploads"; 
    
    if (!file) throw new Error("Файл не найден в запросе.");

    const uploadFileResponse = await uploadFileToYandexDisk(folderPath, fileName, file);

    return NextResponse.json({ message: "Файл успешно загружен!", success: true, data: uploadFileResponse });
  } catch (error) {
    console.error("Ошибка загрузки файла:", error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
