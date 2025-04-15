"use client";

import { DealType } from "@prisma/client";

import { useRef } from "react";

import { CloudUpload, Loader, Trash2, Upload, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import DialogComponent from "@/shared/ui/DialogComponent";
import Overlay from "@/shared/ui/Overlay";

import useUploadFile from "../../hooks/useUploadFIle";

export default function FileUploadForm({
  userId,
  dealId,
  dealType,
}: {
  userId: string;
  dealId: string;
  dealType: DealType;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const {
    getRootProps,
    isDragActive,
    getInputProps,
    files,
    handleUpload,
    handleClear,
    handleSelectFile,
    diskOccupancy,
    isPending,
    ydxDiskInfo,
    setFiles,
  } = useUploadFile(inputRef, userId, dealId, dealType);

  return (
    <>
      <Overlay isPending={isPending} />
      <DialogComponent
        contentTooltip="Загрузить файл на Яндекс Диск"
        trigger={
          <Button size="icon" variant={"outline"} className="btn_hover">
            <Upload />
          </Button>
        }
        classNameContent="sm:max-w-[400px]"
        showX={!isPending}
        disableClose={isPending}
      >
        <div className="grid gap-4">
          <div className="grid w-full place-items-center gap-2 p-1">
            <p>Диск</p>

            <div className="grid gap-2">
              <Progress value={diskOccupancy} color="orange" />

              <span className="text-xs">
                {(ydxDiskInfo?.used_space / 1024 / 1024).toFixed(2)} MB /
                {(ydxDiskInfo?.total_space / 1024 / 1024).toFixed(2)} MB
              </span>
            </div>
          </div>

          <form onSubmit={handleUpload} className="grid w-full gap-4">
            <div
              tabIndex={0}
              className={`grid h-20 w-full cursor-pointer place-items-center rounded-md border-2 border-dashed p-4 ${isDragActive ? "border-blue-600 bg-muted" : ""} hover:border-blue-600 hover:bg-muted focus-visible:bg-muted`}
              onClick={() => inputRef.current?.click()}
              role="button"
              {...getRootProps()}
            >
              <Upload className="h-10 w-10 cursor-pointer" />
            </div>

            {files && files.length > 0 ? (
              <ul className="grid max-h-48 gap-2 overflow-auto">
                {files.map((file, idx) => (
                  <li
                    key={idx}
                    className="relative grid w-full justify-items-center gap-1 rounded-md border border-dashed p-2 pr-[48px]"
                  >
                    <Button
                      type="button"
                      size="icon"
                      variant="destructive"
                      onClick={() => handleSelectFile(file.name)}
                      className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center justify-center rounded-md"
                      title="Удалить из списка"
                    >
                      <X />
                    </Button>

                    <p className="break-all text-sm">Имя: {file.name}</p>

                    <p className="text-xs text-muted-foreground">
                      Размер: {(file.size / 1024 / 1024).toFixed(3)} MB
                    </p>
                  </li>
                ))}
              </ul>
            ) : null}

            <div className="flex w-full items-center gap-2">
              <Input
                type="file"
                multiple
                className="hidden"
                ref={inputRef}
                {...getInputProps()}
                onChange={(e) => {
                  const selectedFiles = e.target.files;
                  if (selectedFiles) {
                    setFiles(Array.from(selectedFiles));
                  }
                }}
              />

              {files && files.length > 0 && (
                <div className="grid w-full grid-cols-2 gap-2">
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
                      <Trash2 /> Очистить
                    </span>
                  </Button>
                </div>
              )}
            </div>
          </form>
        </div>
      </DialogComponent>
    </>
  );
}
