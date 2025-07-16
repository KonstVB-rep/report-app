import { DealType } from "@prisma/client";

import React, { useState } from "react";

import { FileWarning } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import IntoDealItem from "@/entities/deal/ui/IntoDealItem";
import MotionDivY from "@/shared/ui/MotionComponents/MotionDivY";

import { useGetHrefFilesDealFromDB } from "../../hooks/query";
import getFileNameWithoutUuid from "../../libs/helpers/getFileNameWithoutUuid";
import { getFormatFile } from "../../libs/helpers/getFormatFile";
import ICONS_TYPE_FILE from "../../libs/iconsTypeFile";
import { FileInfo } from "../../types";
import DeleteFile from "../DeleteFile";
import DownLoadOrCheckFile from "../DownLoadOrCheckFile";
import SkeletonFiles from "../SkeletonFiles";

type FileListProps = {
  data: {
    userId: string;
    dealId: string;
    dealType: DealType;
  } | null;
};

const FILE_FORMATS = {
  IMAGE: [
    ".jpg",
    ".jpeg",
    ".png",
    ".gif",
    ".bmp",
    ".tiff",
    ".webp",
    ".svg",
    ".ico",
  ],
  EXCEL: [".xls", ".xlsx", ".csv"],
  PDF: [".pdf"],
  TEXT: [".txt"],
};

const getFileType = (format: string) => {
  if (FILE_FORMATS.IMAGE.includes(format)) return "image";
  if (FILE_FORMATS.EXCEL.includes(format)) return "excel";
  if (FILE_FORMATS.PDF.includes(format)) return "pdf";
  if (FILE_FORMATS.TEXT.includes(format)) return "text";
  return "other";
};

const fileTypeIcons = {
  image: ICONS_TYPE_FILE[".img"](),
  excel: ICONS_TYPE_FILE[".xls"](),
  pdf: ICONS_TYPE_FILE[".pdf"](),
  text: ICONS_TYPE_FILE[".txt"](),
  other: ICONS_TYPE_FILE["default"](),
};

// const imageFormat = [
//   ".jpg",
//   ".jpeg",
//   ".png",
//   ".gif",
//   ".bmp",
//   ".tiff",
//   ".webp",
//   ".svg",
//   ".ico",
// ];
// const excelFormat = [".xls", ".xlsx", ".csv"];
// const pdfFormat = [".pdf"];
// const text = [".txt"];

const FileItem = ({
  file,
  selected,
  onSelect,
}: {
  file: FileInfo;
  selected: boolean;
  onSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  const formatFile = getFormatFile(file.name);
  const fileType = getFileType(formatFile);
  const fileName = getFileNameWithoutUuid(file.name);

  return (
    <motion.li
      layoutId={file.name}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      className="group relative grid w-20 min-w-20 max-w-20 flex-1 gap-1 rounded-md border border-solid p-4 hover:border-blue-700 focus-visible:border-blue-700"
    >
      <p className="flex items-center justify-center">
        {fileTypeIcons[fileType]}
      </p>
      <p className="truncate text-xs">{fileName}</p>
      <div className="absolute inset-0 -z-[1] h-full w-full rounded-md bg-black/80 group-hover:z-[1] group-focus-visible:z-[1]" />
      <DownLoadOrCheckFile
        className="absolute inset-0 z-10 h-full w-full items-center justify-center"
        fileName={fileName}
        localPath={file.localPath}
        name={file.name}
        id={file.name}
        onChange={onSelect}
        checked={selected}
      />
    </motion.li>
  );
};

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
          <MotionDivY keyValue="loading">
            <SkeletonFiles />
          </MotionDivY>
        )}

        {isError && (
          <MotionDivY
            keyValue="error"
            className="flex items-center justify-center gap-2 p-2 text-red-600"
          >
            <FileWarning size="40" strokeWidth={1} className="text-red-600" />
            <span className="text-lg">Ошибка загрузки файлов</span>
          </MotionDivY>
        )}

        {files && files.length > 0 && (
          <MotionDivY keyValue="files">
            {selectedFiles.size > 0 && (
              <DeleteFile
                setSelectedFiles={setSelectedFiles}
                selectedFilesForDelete={selectedFilesForDelete}
                className="absolute right-2 top-2 z-10"
              />
            )}

            <motion.ul layout className="flex flex-wrap gap-2">
              <AnimatePresence>
                {files.map((file) => (
                  <FileItem
                    key={file.name}
                    file={file}
                    selected={selectedFiles.has(file.name)}
                    onSelect={handleSelectFile}
                  />
                ))}
              </AnimatePresence>
              {/* <AnimatePresence>
                {files.map((file) => {
                  const formatFile = getFormatFile(
                    file.name
                  ) as keyof typeof ICONS_TYPE_FILE;

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
                        {isImg && ICONS_TYPE_FILE[".img"]()}
                        {isExcel && ICONS_TYPE_FILE[".xls"]()}
                        {isPdf && ICONS_TYPE_FILE[".pdf"]()}
                        {isText && ICONS_TYPE_FILE[".txt"]()}
                        {anotherFormat && ICONS_TYPE_FILE["default"]()}
                      </p>

                      <p className="truncate text-xs">{fileName}</p>

                      <div className="absolute inset-0 -z-[1] h-full w-full bg-black/80 group-hover:z-[1] group-focus-visible:z-[1] rounded-md" />

                      <DownLoadOrCheckFile
                        className="absolute inset-0 z-10 h-full w-full items-center justify-center"
                        fileName={fileName}
                        localPath={file.localPath}
                        name={file.name}
                        id={file.name}
                        onChange={handleSelectFile}
                        checked={selectedFiles.has(file.name)}
                      />
                    </motion.li>
                  );
                })}
              </AnimatePresence> */}
            </motion.ul>
          </MotionDivY>
        )}
      </AnimatePresence>
    </IntoDealItem>
  );
};

export default FileList;
