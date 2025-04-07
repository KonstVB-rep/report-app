'use server'

import { deleteFileFromDB, writeHrefDownloadFileInDB } from "@/widgets/Files/api/actions_db";
import { DealType } from "@prisma/client";
import axios, { AxiosError } from "axios";


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
    const response = await axiosInstanceYandexDisk.get(`/resources?path=${encodeURIComponent(folderPath)}`);
    return response.data;
  } catch (error) {
    console.error("Ошибка в getFiles:", error);
    throw error;
  }
}

/**
 * Получение информации о диске
//  */
const getInfoDisk = async () => {
  try {
    const response = await axiosInstanceYandexDisk.get('/');
    return response.data;
  } catch (error) {
    console.error("Ошибка при получении информации о диске:", error);
    throw error;
  }
};

/**
 * Получить метаинформацию о ресурсе
 * 
 */

async function getResourceInfo(resourcePath: string) {
    try {
      const response = await axiosInstanceYandexDisk.get(`/resources?path=${encodeURIComponent(resourcePath)}`);
      return response.data;
    } catch (error) {
      console.error("Ошибка в getResourceInfo:", error);
      throw error;
    }
}

/**
 * Загрузка файла на Яндекс.Диск
 */
async function uploadFileToYandexDiskAndDB(formData: FormData) {
  try {

    const file = formData.get("file") as File;
    const fileName = formData.get("fileName") as string;
    const folderPath = formData.get("folderPath") as string || "/report_app_uploads";
    const fullPath = `${folderPath}/${fileName}`;

    // Проверяем существование папки
    try {
      await axiosInstanceYandexDisk.get(`/resources?path=${encodeURIComponent(folderPath)}`);
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 404) {
        await createFolderOnYandexDisk(folderPath);
      } else {
        throw error;
      }
    }

    // Получаем ссылку для загрузки
    const uploadResponse = await axiosInstanceYandexDisk.get(`/resources/upload?path=${encodeURIComponent(fullPath)}`);
    const uploadUrl = uploadResponse.data.href;


    // Загружаем файл
    await axios.put(uploadUrl, file, {
      headers: {
        "Content-Type": file.type, // устанавливаем правильный MIME-тип
      },
    });

    // Получаем ссылку для скачивания
    const downResponse = await axiosInstanceYandexDisk.get(`/resources/download?path=${encodeURIComponent(fullPath)}`);

    const { href: downloadUrl } = downResponse.data;

    const formDatatForDb = {
      name: fileName,
      href: downloadUrl,
      localPath: fullPath,
      dealId: formData.get("dealId") as string,
      dealType: formData.get("dealType") as DealType,
      userId: formData.get("userId") as string
    }
   
    const fileInfo = await writeHrefDownloadFileInDB(formDatatForDb);

    if (!fileInfo) {
      throw new Error("Ошибка при записи данных о файле в базу данных");
    }

    return fileInfo;
  } catch (error) {
    console.error("Ошибка в uploadFileToYandexDisk:", error);
    throw error;
  }
}

/**
 * Скачивание файла с Яндекс.Диска
 */
async function downloadFileFromYandexDisk(filePath: string): Promise<Blob> {
  try {
    // Получаем URL для скачивания
  
    const response = await axiosInstanceYandexDisk.get(`/resources/download?path=${encodeURIComponent(filePath)}`);
    const { href: downloadUrl } = response.data;

    // Загружаем файл
    const downloadResponse = await axiosDownLoaderFromYD.get(downloadUrl, { responseType: "blob" });

    return downloadResponse.data;
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
    return await axiosInstanceYandexDisk.put(`/resources?path=${encodeURIComponent(folderPath)}`);
  } catch (error) {
    console.error("Ошибка при создании папки:", error);
    throw error;
  }
};

/**
 * Удаление файла/папки с Яндекс.Диска
 */
const deleteFileOrFolderFromYandexDiskAnDB = async (file: { filePath: string, id: string, dealType: DealType, userId: string }) => {
  try {
    const { filePath, id, dealType, userId } = file;

    const response = await axiosInstanceYandexDisk.delete(`/resources?path=${filePath}`); 

    if (response.status !== 204 && response.status !== 200) {
       throw new Error("Не удалось удалить файл.");
    }

    return await deleteFileFromDB({ id, dealType, userId })
  } catch (error) {
    console.error("Ошибка при удалении файла/папки:", error);
    throw error;
  }
};

export { getFiles,getInfoDisk,getResourceInfo, uploadFileToYandexDiskAndDB, downloadFileFromYandexDisk, createFolderOnYandexDisk,deleteFileOrFolderFromYandexDiskAnDB };




//Если файл текстовый, можно сразу вывести его содержимое.

// export function readBlobText(blob: Blob) {
//   const reader = new FileReader();
//   reader.onload = () => console.log("Содержимое файла:", reader.result);
//   reader.readAsText(blob);
// }
