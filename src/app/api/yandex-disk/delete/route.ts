import axios from "axios";
import { type NextRequest, NextResponse } from "next/server";
import {
  axiosInstanceYandexDisk,
  deleteFileOrFolderFromYandexDiskAnDB,
} from "../yandexDisk";
import { getErrorMessageDeleteByCode } from "./getErrorMessageDeleteByCode";
import { deleteFileFromDB } from "@/widgets/Files/api/actions_db";

// export async function DELETE(request: NextRequest) {
//   try {
//     const body = await request.json()
//     const { filePath } = body

//     if (!filePath || typeof filePath !== "string") {
//       return NextResponse.json({ error: "Неверный путь к файлу." }, { status: 400 })
//     }

//     const deletedFile = await deleteFileOrFolderFromYandexDiskAnDB(body)

//     return NextResponse.json({ data: deletedFile, success: true })
//   } catch (error) {
//     console.error("Ошибка при удалении файла:", error)

//     if (axios.isAxiosError(error)) {
//       const statusCode = error.response?.status ?? 500
//       return NextResponse.json(
//         { error: getErrorMessageDeleteByCode(statusCode) },
//         { status: statusCode },
//       )
//     }

//     return NextResponse.json(
//       { success: false, error: "Ошибка при удалении файла." },
//       { status: 500 },
//     )
//   }
// }

// @/app/api/yandex-disk/delete/route.ts

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();

    const files = Array.isArray(body) ? body : [body];

    if (!files.length)
      return NextResponse.json({ error: "Нет данных" }, { status: 400 });

    const results = [];

    for (const file of files) {
      try {
        const response = await axiosInstanceYandexDisk.delete(
          `/resources?path=${file.filePath}`,
        );

        if (
          response.status === 204 ||
          response.status === 200 ||
          response.status === 404
        ) {
          await deleteFileFromDB(file);
          results.push({ id: file.id, status: "deleted" });
        }
      } catch (err) {
        results.push({
          id: file.id,
          status: "error",
          error: (err as Error).message,
        });
      }
    }

    return NextResponse.json({ data: results, success: true });
  } catch (error) {
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
