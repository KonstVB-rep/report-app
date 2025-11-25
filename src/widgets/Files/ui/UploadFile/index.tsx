"use client"

import { useRef } from "react"
import type { DealType } from "@prisma/client"
import { Upload } from "lucide-react"
import dynamic from "next/dynamic"
import { Button } from "@/shared/components/ui/button"
import DialogComponent from "@/shared/custom-components/ui/DialogComponent"
import Overlay from "@/shared/custom-components/ui/Overlay"
import useUploadFile from "../../hooks/useUploadFIle"
import FormUploadFilesSkeleton from "./ui/FormUploadFilesSkeleton"
import YandexDiskInfoSkeleton from "./ui/YandexDiskInfoSkeleton"

const YandexDiskInfo = dynamic(() => import("./ui/YandexDiskInfo"), {
  ssr: false,
  loading: () => <YandexDiskInfoSkeleton />,
})

const FormUploadFiles = dynamic(() => import("./ui/FormUploadFiles"), {
  ssr: false,
  loading: () => <FormUploadFilesSkeleton />,
})

export default function FileUploadForm({
  userId,
  dealId,
  dealType,
}: {
  userId: string
  dealId: string
  dealType: DealType
}) {
  const inputRef = useRef<HTMLInputElement | null>(null)

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
  } = useUploadFile(inputRef, userId, dealId, dealType)

  return (
    <>
      <Overlay isPending={isPending} />
      <DialogComponent
        classNameContent="sm:max-w-[400px]"
        contentTooltip="Загрузить файл на Яндекс Диск"
        disableClose={isPending}
        showX={!isPending}
        trigger={
          <Button className="btn_hover" size="icon" variant={"outline"}>
            <Upload />
          </Button>
        }
      >
        <div className="grid gap-4">
          <YandexDiskInfo
            diskOccupancy={diskOccupancy}
            total_space={ydxDiskInfo?.total_space}
            used_space={ydxDiskInfo?.used_space}
          />

          <FormUploadFiles
            files={files}
            getInputProps={getInputProps}
            getRootProps={getRootProps}
            handleClear={handleClear}
            handleSelectFile={handleSelectFile}
            handleUpload={handleUpload}
            inputRef={inputRef}
            isDragActive={isDragActive}
            isPending={isPending}
            setFiles={setFiles}
          />
        </div>
      </DialogComponent>
    </>
  )
}
