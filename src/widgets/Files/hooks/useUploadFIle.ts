import { DealType } from "@prisma/client";

import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";

import { useUploadFileYdxDisk } from "./mutate";
import { useGetInfoYandexDisk } from "./query";

const formingDataFiles = (
  files: File[] | FileList,
  userId: string,
  dealId: string,
  dealType: string
) => {
  const formData = new FormData();

  Array.from(files).forEach((file) => {
    const extIndex = file.name.lastIndexOf(".");
    const formatFile = file.name.slice(extIndex);
    const fileNameWithoutFormat = file.name.slice(0, extIndex);
    const uniqueFileName = `${fileNameWithoutFormat}-${Date.now()}${formatFile}`;

    formData.append("files", file, uniqueFileName);
  });

  formData.append("userId", userId);
  formData.append("dealId", dealId);
  formData.append("dealType", dealType);
  formData.append("folderPath", "/report_app_uploads/CP");

  return formData;
};

const useUploadFile = (
  inputRef: React.RefObject<HTMLInputElement | null>,
  userId: string,
  dealId: string,
  dealType: DealType
) => {
  const [files, setFiles] = useState<File[] | null>(null);

  const { getRootProps, isDragActive, getInputProps } = useDropzone({
    onDrop: (acceptedFiles: File[]) => {
      setFiles((prev) => {
        const isExists = prev?.some(
          (file) => file.name === acceptedFiles[0].name
        );
        if (isExists) return prev;
        if (prev) {
          return [...prev, ...acceptedFiles];
        }
        return acceptedFiles;
      });
    },
    multiple: true,
  });

  const { data: ydxDiskInfo } = useGetInfoYandexDisk();

  const diskOccupancy =
    ((ydxDiskInfo?.used_space / 1024 / 1024) * 100) /
    (ydxDiskInfo?.total_space / 1024 / 1024);

  const { mutate, isPending, isSuccess } = useUploadFileYdxDisk();

  const handleUpload = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!files || files.length === 0) return alert("Выберите файлы!");

    const formData = formingDataFiles(files, userId, dealId, dealType);
    mutate(formData);
  };

  const handleClear = () => {
    setFiles(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleSelectFile = (fileName: string) => {
    setFiles((prev) => {
      if (prev) {
        return prev.filter((file) => file.name !== fileName);
      }
      return prev;
    });
  };

  useEffect(() => {
    if (isSuccess) {
      handleClear();
    }
  }, [isSuccess]);

  return {
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
  };
};

export default useUploadFile;
