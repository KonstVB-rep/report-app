import { DealType } from "@prisma/client";
import { getFormatFile } from "../../libs/helpers/getFormatFile";
import iconsTypeFile from "./iconsTypeFile";
import IntoDealItem from "@/entities/deal/ui/IntoDealItem";
import { useGetHrefFilesDealFromDB } from "../../hooks/query";
import SkeletonFiles from "../SkeletonFiles";
import { FileWarning } from "lucide-react";
import DownloadOrDeleteFile from "../DownLoadFile/DownloadOrDeleteFile";

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

const FileList = ({ data }: FileListProps) => {
  const {
    data: files,
    isPending,
    isError,
  } = useGetHrefFilesDealFromDB(data ? data : undefined);

  if (isPending) {
    return <SkeletonFiles />;
  }

  if (isError) {
    return (
      <IntoDealItem title={"Файлы"}>
        <p className="flex items-center justify-center gap-2 p-2 text-red-600">
          {" "}
          <FileWarning size="40" strokeWidth={1} className="text-red-600" />
          <span className="text-lg">Ошибка загрузки файлов</span>
        </p>
      </IntoDealItem>
    );
  }

  if (!files.length) return null;

  return (
    <IntoDealItem title={"Файлы"}>
      <ul className="flex flex-wrap gap-2">
        {files.map((file) => {
          const formatFile = getFormatFile(
            file.name
          ) as keyof typeof iconsTypeFile;

          const isImg = imageFormat.includes(formatFile);
          const isExcel = excelFormat.includes(formatFile);
          return (
            <li
              tabIndex={0}
              key={file?.name}
              className="group relative grid max-w-40 gap-1 overflow-hidden rounded-md border border-solid p-4 hover:border-blue-700 focus-visible:border-blue-700"
            >
              <p className="flex items-center justify-center">
                {isImg && iconsTypeFile[".img"]()}
                {isExcel && iconsTypeFile[".xls"]()}
                {iconsTypeFile[formatFile] && iconsTypeFile[formatFile]()}
              </p>

              <p className="truncate text-xs">{file?.name}</p>
              
              <div className="absolute inset-0 -z-[1] h-full w-full bg-black/80 group-hover:z-[1] group-focus-visible:z-[1]"/>
              
              <DownloadOrDeleteFile className="items-center justify-center group-hover:flex hidden group-focus-visible:flex absolute inset-0 h-full w-full z-10" {...file}/>
            </li>
          );
        })}
      </ul>
    </IntoDealItem>
  );
};

export default FileList;
