import { DealType } from "@prisma/client";

import React, { useState } from "react";

import { FileWarning } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import IntoDealItem from "@/entities/deal/ui/IntoDealItem";

import { useGetHrefFilesDealFromDB } from "../../hooks/query";
import getFileNameWithoutUuid from "../../libs/helpers/getFileNameWithoutUuid";
import { getFormatFile } from "../../libs/helpers/getFormatFile";
import DeleteFile from "../DeleteFile";
import DownLoadFile from "../DownLoadFile";
import SkeletonFiles from "../SkeletonFiles";
import iconsTypeFile from "./iconsTypeFile";

type FileListProps = {
  data: {
    userId: string;
    dealId: string;
    dealType: DealType;
  } | null;
};

const imageFormat = [
  ".jpg",
  ".jpeg",
  ".png",
  ".gif",
  ".bmp",
  ".tiff",
  ".webp",
  ".svg",
  ".ico",
];
const excelFormat = [".xls", ".xlsx", ".csv"];
const pdfFormat = [".pdf"];
const text = [".txt"];

const FileList = ({ data }: FileListProps) => {
  const {
    data: files,
    isPending,
    isError,
  } = useGetHrefFilesDealFromDB(data ? data : undefined);

  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());

  const selectedFilesForDelete = (files ?? []).filter((file) =>
    selectedFiles.has(file.name)
  );

  const handleSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileName = e.target.id;

    setSelectedFiles((prev) => {
      const updated = new Set(prev);
      if (updated.has(fileName)) {
        updated.delete(fileName);
      } else {
        updated.add(fileName);
      }
      return updated;
    });
  };

  if (!files || !files?.length) return null;

  return (
    <IntoDealItem title="Файлы" className="relative">
      <AnimatePresence mode="wait">
        {isPending && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <SkeletonFiles />
          </motion.div>
        )}

        {isError && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center justify-center gap-2 p-2 text-red-600"
          >
            <FileWarning size="40" strokeWidth={1} className="text-red-600" />
            <span className="text-lg">Ошибка загрузки файлов</span>
          </motion.div>
        )}

        {files && files.length > 0 && (
          <motion.div
            key="files"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            {selectedFiles.size > 0 && (
              <DeleteFile
                setSelectedFiles={setSelectedFiles}
                selectedFilesForDelete={selectedFilesForDelete}
                className="absolute right-2 top-2 z-10"
              />
            )}

            <motion.ul layout className="flex flex-wrap gap-2">
              <AnimatePresence>
                {files.map((file) => {
                  const formatFile = getFormatFile(
                    file.name
                  ) as keyof typeof iconsTypeFile;

                  const isImg = imageFormat.includes(formatFile);
                  const isExcel = excelFormat.includes(formatFile);
                  const isPdf = pdfFormat.includes(formatFile);
                  const isText = text.includes(formatFile);
                  const anotherFormat = !isImg && !isExcel && !isPdf && !isText;

                  const fileName = getFileNameWithoutUuid(file.name);

                  return (
                    <motion.li
                      layout
                      layoutId={file.name}
                      key={file.name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.2, ease: "easeInOut" }}
                      tabIndex={0}
                      className="group flex-1 w-20 min-w-20 max-w-20 relative grid gap-1 rounded-md border border-solid p-4 hover:border-blue-700 focus-visible:border-blue-700"
                    >
                      <p className="flex items-center justify-center">
                        {isImg && iconsTypeFile[".img"]()}
                        {isExcel && iconsTypeFile[".xls"]()}
                        {isPdf && iconsTypeFile[".pdf"]()}
                        {isText && iconsTypeFile[".txt"]()}
                        {anotherFormat && iconsTypeFile["default"]()}
                      </p>

                      <p className="truncate text-xs">{fileName}</p>

                      <div className="absolute inset-0 -z-[1] h-full w-full bg-black/80 group-hover:z-[1] group-focus-visible:z-[1] rounded-md" />

                      <DownLoadFile
                        className="absolute inset-0 z-10 hidden h-full w-full items-center justify-center group-hover:flex group-focus-visible:flex"
                        fileName={fileName}
                        localPath={file.localPath}
                        name={file.name}
                      />

                      <input
                        type="checkbox"
                        id={file.name}
                        onChange={handleSelectFile}
                        checked={selectedFiles.has(file.name)}
                        className="absolute hidden checked:block group-hover:block group-focus-visible:block -right-1 -top-1 z-[11] h-5 w-5 cursor-pointer accent-red-700"
                      />
                    </motion.li>
                  );
                })}
              </AnimatePresence>
            </motion.ul>
          </motion.div>
        )}
      </AnimatePresence>
    </IntoDealItem>
  );
};

export default FileList;
