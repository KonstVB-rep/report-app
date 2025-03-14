"use client";

import axiosInstance from "@/shared/api/axiosInstance";
import { useState } from "react";
import * as XLSX from "xlsx";

export default function UploadExcel() {
  const [loading, setLoading] = useState(false);

//   const handleFileUpload = async (
//     event: React.ChangeEvent<HTMLInputElement>
//   ) => {
//     const file = event.target.files?.[0];
//     if (!file) return;

//     const formData = new FormData();
//     formData.append("file", file);

//     console.log("Отправляемые данные:", formData.get("file")); // Должно показать File

//     setLoading(true);
//     const reader = new FileReader();

//     reader.onload = async (e) => {
//       try {
//         const arrayBuffer = e.target?.result as ArrayBuffer;
//         const data = new Uint8Array(arrayBuffer);
//         const workbook = XLSX.read(data, { type: "array" });
//         const sheetName = workbook.SheetNames[0]; // Берем первый лист
//         const sheet = workbook.Sheets[sheetName];
//         const jsonData = XLSX.utils.sheet_to_json(sheet); // Преобразуем в JSON

//         const allowedTypes = [
//           "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//           "application/vnd.ms-excel",
//         ];
//         if (!allowedTypes.includes(file.type)) {
//           alert("Загрузите файл в формате .xlsx или .xls");
//           return;
//         }

//         // Отправляем на сервер
//         const response = await axiosInstance.post("/upload-excel", jsonData);
//         console.log("Ответ сервера:", response.data);
//         alert("Данные успешно загружены!");
//       } catch (error) {
//         console.error(error);
//         alert("Ошибка обработки файла");
//       } finally {
//         setLoading(false);
//       }
//     };

//     reader.readAsArrayBuffer(file); // Используем новый метод
//   };


const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);

    console.log("Отправляемый файл:", file.name);

    try {
      const response = await axiosInstance.post("/upload-excel", formData,{
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      console.log("Ответ сервера:", response.data);
    } catch (error) {
      console.error("Ошибка загрузки файла:", error);
    }finally{
      setLoading(false);
    }
  };

  return (
    <div>
      <input
        type="file"
        accept=".xlsx, .xls"
        onChange={handleFileUpload}
        disabled={loading}
      />
      {loading && <p>Загрузка...</p>}
    </div>
  );
}
