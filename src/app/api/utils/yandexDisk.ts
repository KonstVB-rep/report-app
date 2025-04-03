// utils/yandexDisk.ts
// 'use server'

import axios, { AxiosError } from "axios";


export const axiosInstanceYandexDisk = axios.create({
  baseURL: "https://cloud-api.yandex.net/v1/disk",
  headers: {
    "Content-Type": "application/json",
    Authorization: `OAuth ${process.env.NEXT_PUBLIC_YANDEX_OAUTH_TOKEN}`,
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
 */
const getInfoDisk = async () => {
  try {
    const response = await axiosInstanceYandexDisk.get('');
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
async function uploadFileToYandexDisk(folderPath: string, fileName: string, file: Blob) {
  try {
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

    console.log("Файл:", file);
    console.log("Имя файла:", fileName);
    console.log("Полный путь:", fullPath);
    console.log("Папка:", folderPath);
    console.log("Тип файла:", file.type);
    console.log("Размер файла:", file.size);

    // Получаем ссылку для загрузки
    const uploadResponse = await axiosInstanceYandexDisk.get(`/resources/upload?path=${encodeURIComponent(fullPath)}`);
    const uploadUrl = uploadResponse.data.href;

    // Загружаем файл
    await axios.put(uploadUrl, file, {
      headers: {
        "Content-Type": file.type, // устанавливаем правильный MIME-тип
      },
    });

    return { message: "Файл успешно загружен!", success: true };
  } catch (error) {
    console.error("Ошибка в uploadFileToYandexDisk:", error);
    throw error;
  }
}

/**
 *  Получаем URL для скачивания
 */

/**
 * Скачивание файла с Яндекс.Диска
 */
async function downloadFileFromYandexDisk(filePath: string): Promise<Blob> {
  try {
    // Получаем URL для скачивания
    const response = await axiosInstanceYandexDisk.get(`/resources/download?path=${encodeURIComponent(filePath)}`);
    const { href: downloadUrl } = response.data;

    // Загружаем файл
    const downloadResponse = await axios.get(downloadUrl, { responseType: "blob" });

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
    await axiosInstanceYandexDisk.put(`/resources?path=${encodeURIComponent(folderPath)}`);
    return { message: "Папка успешно создана!", success: true };
  } catch (error) {
    console.error("Ошибка при создании папки:", error);
    throw error;
  }
};

/**
 * Проверка свободного места на диске
 */
const checkDiskSpace = async () => {
  const diskInfo = await getInfoDisk();
  console.log("Всего места:", diskInfo.total_space);
  console.log("Использовано:", diskInfo.used_space);
  console.log("Свободно:", diskInfo.total_space - diskInfo.used_space);
};

export { getFiles,getInfoDisk,getResourceInfo, uploadFileToYandexDisk, downloadFileFromYandexDisk, createFolderOnYandexDisk, checkDiskSpace };




//Если файл текстовый, можно сразу вывести его содержимое.

export function readBlobText(blob: Blob) {
  const reader = new FileReader();
  reader.onload = () => console.log("Содержимое файла:", reader.result);
  reader.readAsText(blob);
}


export async function saveBlobToFile(blob: Blob, fileName: string) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName; // Устанавливаем имя файла
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url); // Очищаем ссылку
  }