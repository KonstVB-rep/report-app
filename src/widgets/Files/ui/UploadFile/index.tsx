// components/FileUploadForm.tsx
"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CloudUpload, Loader, Trash2, Upload } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useUploadFileYdxDisk } from "../../hooks/mutate";
import DialogComponent from "@/shared/ui/DialogComponent";
import { useGetInfoYandexDisk } from "../../hooks/query";
import { Progress } from "@/components/ui/progress";
import Overlay from "@/shared/ui/Overlay";

export default function FileUploadForm({
  userId,
  dealId,
  dealType,
}: {
  userId: string;
  dealId: string;
  dealType: string;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const { data: ydxDiskInfo } = useGetInfoYandexDisk();
  const diskOccupancy =
    ((ydxDiskInfo?.used_space / 1024 / 1024) * 100) /
    (ydxDiskInfo?.total_space / 1024 / 1024);

  const { mutate, isPending, isSuccess } = useUploadFileYdxDisk();

  const handleUpload = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!file) return alert("Выберите файл!");

    const extIndex = file.name.lastIndexOf(".");
    const formatFile = file.name.slice(extIndex);
    const fileNameWithoutFormat = file.name.slice(0, extIndex);
    const uniqueFileName = `${fileNameWithoutFormat}-${Date.now()}${formatFile}`;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("fileName", uniqueFileName);
    formData.append("folderPath", "/report_app_uploads/CP");
    formData.append("userId", userId);
    formData.append("dealId", dealId);
    formData.append("dealType", dealType);

    mutate(formData);
  };

  const handleClear = () => {
    setFile(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  useEffect(() => {
    if (isSuccess) {
      handleClear();
    }
  }, [isSuccess]);

  return (
    <DialogComponent
      contentTooltip="Загрузить файл на Яндекс Диск"
      trigger={
        <Button size="icon" variant={"outline"}>
          <Upload />
        </Button>
      }
      classNameContent="sm:max-w-72"
    >
      <div className="grid gap-4">
        <Overlay isPending={isPending} />
        <div className="grid w-full place-items-center gap-2 p-1">
          <p>Диск</p>
          <div className="grid gap-2">
            <Progress value={diskOccupancy} color="orange" />
            <span className="text-xs">
              {(ydxDiskInfo?.used_space / 1024 / 1024).toFixed(2)} MB/
              {(ydxDiskInfo?.total_space / 1024 / 1024).toFixed(2)} MB
            </span>
          </div>
        </div>
        <form action="" className="grid w-full gap-4" onSubmit={handleUpload}>
          {file ? (
            <div className="grid w-full justify-items-center gap-1 rounded-md border border-dashed p-4">
              <p>Имя: {file.name}</p>
              <p>Размер: {(file.size / 1024 / 1024).toFixed(3)} MB</p>
            </div>
          ) : (
            <div
              tabIndex={0}
              className="grid h-20 w-full cursor-pointer place-items-center rounded-md border border-dashed p-4 hover:bg-muted focus-visible:bg-muted"
              onClick={() => inputRef.current?.click()}
              role="button"
            >
              <Upload className="h-10 w-10 cursor-pointer" />
            </div>
          )}
          <div className="flex w-full items-center gap-2">
            <Input
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="hidden"
              ref={inputRef}
            />
            {file && (
              <div className="grid grid-cols-2 gap-2">
                <Button type="submit" className="p-2">
                  {isPending ? (
                    <Loader className="h-5 w-5 animate-spin" />
                  ) : (
                    <span className="flex items-center gap-2 text-xs">
                      <CloudUpload /> Загрузить
                    </span>
                  )}
                </Button>
                <Button
                  variant="destructive"
                  type="reset"
                  onClick={handleClear}
                  className="p-2"
                >
                  <span className="flex items-center gap-2 text-xs">
                    <Trash2 /> Удалить файл{" "}
                  </span>
                </Button>
              </div>
            )}
          </div>
        </form>
      </div>
    </DialogComponent>

  );
}
