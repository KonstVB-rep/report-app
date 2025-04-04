import { NextResponse, NextRequest } from "next/server";

import axios from "axios";
import { getErrorMessageDeleteByCode } from "./getErrorMessageDeleteByCode";
import { deleteFileOrFolderFromYandexDiskAnDB } from "../yandexDisk";


export async function DELETE (request:NextRequest) {
    try {
        const body = await request.json(); // Парсим JSON из тела запроса
        const { filePath } = body; // Извлекаем filePath
    
        if (!filePath) {
          throw new Error("Не указан путь к файлу.");
        }

        const deletedFile = await deleteFileOrFolderFromYandexDiskAnDB(body)

        return NextResponse.json({data: deletedFile, success: true} );
    } catch (error) {
        console.error("Ошибка при удалении файла:", error);

        if (axios.isAxiosError(error)) {
            const statusCode = error?.status ?? 500;
            return NextResponse.json(
              { error: getErrorMessageDeleteByCode(statusCode) }, 
              { status: statusCode }
            );
        }


        return NextResponse.json(
          { success: false, error: "Ошибка при удалении файла." },
          { status: 500 }
        );
      }
    }