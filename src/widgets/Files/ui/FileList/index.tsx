import { DealType } from "@prisma/client";
import { animated, useTransition } from "@react-spring/web";

import React, { useState } from "react";

import { FileWarning } from "lucide-react";

import IntoDealItem from "@/entities/deal/ui/IntoDealItem";

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

  const transitions = useTransition(file, {
    keys: (file) => file.name, // Идентификатор для каждого файла
    from: { opacity: 0, transform: "translateY(20px)" },
    enter: { opacity: 1, transform: "translateY(0)" },
    leave: { opacity: 0, transform: "translateY(-20px)" },
    config: { duration: 200, easing: (t) => 1 - Math.pow(1 - t, 3) }, // Эквивалент "easeInOut"
  });

  return transitions((styles, item) => (
    <animated.li
      style={styles} // Применяем стили анимации
      key={item.name}
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
    </animated.li>
  ));
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

  const pendingTransition = useTransition(isPending, {
    from: { opacity: 0, transform: "translateY(20px)" },
    enter: { opacity: 1, transform: "translateY(0)" },
    leave: { opacity: 0, transform: "translateY(-20px)" },
    config: { duration: 200 },
  });

  // Анимация для ошибки
  const errorTransition = useTransition(isError, {
    from: { opacity: 0, transform: "translateY(20px)" },
    enter: { opacity: 1, transform: "translateY(0)" },
    leave: { opacity: 0, transform: "translateY(-20px)" },
    config: { duration: 200 },
  });

  // Анимация для файлов
  const filesTransition = useTransition(files || [], {
    keys: (file) => file?.id ?? file?.name ?? "", // Используем уникальные ключи
    from: { opacity: 0, transform: "translateY(20px)" },
    enter: { opacity: 1, transform: "translateY(0)" },
    leave: { opacity: 0, transform: "translateY(-20px)" },
    config: { duration: 200 },
  });

  if (!files || !files?.length) return null;

  return (
    <IntoDealItem title="Файлы" className="relative">
      {pendingTransition((styles, item) =>
        item ? (
          <animated.div style={styles}>
            <SkeletonFiles />
          </animated.div>
        ) : null
      )}

      {errorTransition((styles, item) =>
        item ? (
          <animated.div
            style={styles}
            className="flex items-center justify-center gap-2 p-2 text-red-600"
          >
            <FileWarning size="40" strokeWidth={1} className="text-red-600" />
            <span className="text-lg">Ошибка загрузки файлов</span>
          </animated.div>
        ) : null
      )}

      {files && files.length > 0 && (
        <animated.div>
          {selectedFiles.size > 0 && (
            <DeleteFile
              setSelectedFiles={setSelectedFiles}
              selectedFilesForDelete={selectedFilesForDelete}
              className="absolute right-2 top-2 z-10"
            />
          )}

          <animated.ul className="flex flex-wrap gap-2">
            {filesTransition((styles, file) =>
              file ? (
                <animated.li style={styles} key={file.id}>
                  {" "}
                  {/* Используем file.id как ключ */}
                  <FileItem
                    file={file}
                    selected={selectedFiles.has(file.name)}
                    onSelect={handleSelectFile}
                  />
                </animated.li>
              ) : null
            )}
          </animated.ul>
        </animated.div>
      )}
    </IntoDealItem>
  );
};

export default FileList;
