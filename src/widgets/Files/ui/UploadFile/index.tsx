"use client";

import { DealType } from "@prisma/client";

import { useRef } from "react";

import dynamic from "next/dynamic";

import { Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import DialogComponent from "@/shared/ui/DialogComponent";
import Overlay from "@/shared/ui/Overlay";

import useUploadFile from "../../hooks/useUploadFIle";
import FormUploadFilesSkeleton from "./ui/FormUploadFilesSkeleton";
import YandexDiskInfoSkeleton from "./ui/YandexDiskInfoSkeleton";

const YandexDiskInfo = dynamic(() => import("./ui/YandexDiskInfo"), {
  ssr: false,
  loading: () => <YandexDiskInfoSkeleton />,
});

const FormUploadFiles = dynamic(() => import("./ui/FormUploadFiles"), {
  ssr: false,
  loading: () => <FormUploadFilesSkeleton />,
});

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
          <YandexDiskInfo
            diskOccupancy={diskOccupancy}
            used_space={ydxDiskInfo?.used_space}
            total_space={ydxDiskInfo?.total_space}
          />

          <FormUploadFiles
            inputRef={inputRef}
            getRootProps={getRootProps}
            isDragActive={isDragActive}
            getInputProps={getInputProps}
            files={files}
            handleUpload={handleUpload}
            handleClear={handleClear}
            handleSelectFile={handleSelectFile}
            isPending={isPending}
            setFiles={setFiles}
          />
        </div>
      </DialogComponent>
    </>
  );
}
