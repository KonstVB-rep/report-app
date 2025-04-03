// components/FileUploadForm.tsx
"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CloudUpload, Trash2, Upload } from "lucide-react";
import { useRef, useState } from "react";
import { useUploadFileYdxDisk } from "../../hooks/mutate";

export default function FileUploadForm({ userId, dealId, dealType }: { userId: string, dealId: string, dealType: string }) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [file, setFile] = useState<File | null>(null);


  const {mutate} = useUploadFileYdxDisk({userId,dealId,dealType})

  const handleUpload = () => {
    if (!file) return alert("Выберите файл!");

    const extIndex = file.name.lastIndexOf(".");
    const formatFile = file.name.slice(extIndex);
    const fileNameWithoutFormat = file.name.slice(0, extIndex);
    const uniqueFileName = `${fileNameWithoutFormat}-${dealId}${formatFile}`;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("fileName", uniqueFileName);
    formData.append("folderPath", "/report_app_uploads/CP");

    mutate(formData); // Вызываем мутацию
  };

  // const handleUpload = async () => {
  //   if (!file) return alert("Выберите файл!");

  //   const pointFromlast = file.name.lastIndexOf(".");

  //   const formatFile = file.name.slice(pointFromlast);

  //   const fileNameWithoutFormat = file.name.slice(0, pointFromlast);

  //   const uniqueFileName = `${fileNameWithoutFormat}-${dealId}${formatFile}`;

  //   const formData = new FormData();
  //   formData.append("file", file);
  //   formData.append("fileName", uniqueFileName);
  //   formData.append("folderPath", "/report_app_uploads/CP"); // можно изменить путь

  //   try {
  //     const response = await axiosInstance.post(
  //       "/yandex-disk/upload",
  //       formData,
  //       {
  //         headers: {
  //           "Content-Type": "multipart/form-data",
  //         },
  //       }
  //     );

  //     const data = response.data;
  //     setMessage(data.message || data.error);
  //   } catch (error) {
  //     console.error("Ошибка загрузки файла:", error);
  //     setMessage("Ошибка загрузки файла.");
  //   }
  // };

  const handleClear = () => {
    setFile(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="grid w-fit gap-2 rounded-md border p-2">
      {file && (
        <div className="grid gap-1">
          <p>Имя: {file.name}</p>
          <p>Размер: {(file.size / 1024 / 1024).toFixed(3)} MB</p>
        </div>
      )}
      <div className="flex w-full items-center gap-2">
        <Input
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="hidden"
          ref={inputRef}
        />
        <Button size={"icon"} onClick={() => inputRef.current?.click()}>
          <Upload />
        </Button>
        {file && (
          <Button size={"icon"} onClick={handleUpload}>
            <CloudUpload />
          </Button>
        )}
        {file && (
          <Button size={"icon"} variant="destructive" onClick={handleClear}>
            <Trash2 />
          </Button>
        )}
      </div>
    </div>
  );
}
