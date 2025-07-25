"use server";

import { DealType } from "@prisma/client";

import axios, { AxiosError } from "axios";

import {
  deleteFileFromDB,
  writeHrefDownloadFileInDB,
} from "@/widgets/Files/api/actions_db";

export const axiosDownLoaderFromYD = axios.create({
  headers: {
    "Content-Type": "application/json",
    Authorization: `OAuth ${process.env.YANDEX_OAUTH_TOKEN}`,
  },
});

export const axiosInstanceYandexDisk = axios.create({
  baseURL: "https://cloud-api.yandex.net/v1/disk",
  headers: {
    "Content-Type": "application/json",
    Authorization: `OAuth ${process.env.YANDEX_OAUTH_TOKEN}`,
  },
});

/**
 * Получение списка файлов в папке
 */
async function getFiles(folderPath: string = "/") {
  try {
    const response = await axiosInstanceYandexDisk.get(
      `/resources?path=${encodeURIComponent(folderPath)}`
    );
    return response.data;
  } catch (error) {
    console.error("Ошибка в getFiles:", error);
    throw error;
  }
}

/**
 * Получение информации о диске
 */
const getInfoDisk = async () => {
  try {
    const response = await axiosInstanceYandexDisk.get("/");
    return response.data;
  } catch (error) {
    console.error("Ошибка при получении информации о диске:", error);
    throw error;
  }
};

/**
 * Получить метаинформацию о ресурсе
 */
async function getResourceInfo(resourcePath: string) {
  try {
    const response = await axiosInstanceYandexDisk.get(
      `/resources?path=${encodeURIComponent(resourcePath)}`
    );
    return response.data;
  } catch (error) {
    console.error("Ошибка в getResourceInfo:", error);
    throw error;
  }
}

/**
 * Загрузка файла на Яндекс.Диск
 */
async function uploadFilesToYandexDiskAndDB(formData: FormData) {
  try {
    const files = formData.getAll("files") as File[];
    const folderPath =
      (formData.get("folderPath") as string) || "/report_app_uploads";
    const dealId = formData.get("dealId") as string;
    const dealType = formData.get("dealType") as DealType;
    const userId = formData.get("userId") as string;

    // Проверка папки (один раз)
    try {
      await axiosInstanceYandexDisk.get(
        `/resources?path=${encodeURIComponent(folderPath)}`
      );
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 404) {
        await createFolderOnYandexDisk(folderPath);
      } else {
        throw error;
      }
    }

    const uploadedFiles = await Promise.all(
      files.map(async (file) => {
        const fullPath = `${folderPath}/${file.name}`;

        // Получение ссылки на загрузку
        const uploadResponse = await axiosInstanceYandexDisk.get(
          `/resources/upload?path=${encodeURIComponent(fullPath)}`
        );
        const uploadUrl = uploadResponse.data.href;

        // Загрузка файла
        await axios.put(uploadUrl, file, {
          headers: {
            "Content-Type": file.type,
          },
        });

        // Запись в базу данных
        const fileInfo = await writeHrefDownloadFileInDB({
          name: file.name,
          localPath: fullPath,
          dealId,
          dealType,
          userId,
        });

        if (!fileInfo) {
          throw new Error(
            `Ошибка при записи данных о файле "${file.name}" в базу`
          );
        }

        return fileInfo;
      })
    );

    return uploadedFiles;
  } catch (error) {
    console.error("Ошибка в uploadFilesToYandexDiskAndDB:", error);
    throw error;
  }
}

/**
 * Скачивание файла с Яндекс.Диска
//  */

async function downloadFileFromYandexDisk(
  filePath: string
): Promise<Uint8Array> {
  try {
    const response = await axiosInstanceYandexDisk.get(
      `/resources/download?path=${encodeURIComponent(filePath)}`
    );
    const { href: downloadUrl } = response.data;

    const downloadResponse = await axiosDownLoaderFromYD.get(downloadUrl, {
      responseType: "arraybuffer", // <-- ВАЖНО
    });

    return new Uint8Array(downloadResponse.data); // <-- Возвращаем корректный тип
  } catch (error) {
    console.error("Ошибка в downloadFileFromYandexDisk:", error);
    throw error;
  }
}
/**
 * Создание папки на Яндекс.Диске
 */
const createFolderOnYandexDisk = async (folderPath: string) => {
  try {
    return await axiosInstanceYandexDisk.put(
      `/resources?path=${encodeURIComponent(folderPath)}`
    );
  } catch (error) {
    console.error("Ошибка при создании папки:", error);
    throw error;
  }
};

/**
 * Удаление файла/папки с Яндекс.Диска
 */
const deleteFileOrFolderFromYandexDiskAnDB = async (file: {
  filePath: string;
  id: string;
  dealType: DealType;
  userId: string;
  dealId: string;
}) => {
  try {
    const { filePath, id, dealType, userId, dealId } = file;

    const response = await axiosInstanceYandexDisk.delete(
      `/resources?path=${filePath}`
    );

    if (response.status !== 204 && response.status !== 200) {
      throw new Error("Не удалось удалить файл.");
    }

    return await deleteFileFromDB({ id, dealType, userId, dealId });
  } catch (error) {
    console.error("Ошибка при удалении файла/папки:", error);
    throw error;
  }
};

export {
  getFiles,
  getInfoDisk,
  getResourceInfo,
  uploadFilesToYandexDiskAndDB,
  downloadFileFromYandexDisk,
  createFolderOnYandexDisk,
  deleteFileOrFolderFromYandexDiskAnDB,
};
