import type React from "react"
import { useState } from "react"
import type { DealType } from "@prisma/client"
import { animated, useTransition } from "@react-spring/web"
import { FileWarning } from "lucide-react"
import IntoDealItem from "@/entities/deal/ui/IntoDealItem"
import { useDownLoadFile } from "../../hooks/mutate"
import { useGetHrefFilesDealFromDB } from "../../hooks/query"
import getFileNameWithoutUuid from "../../libs/helpers/getFileNameWithoutUuid"
import { getFormatFile } from "../../libs/helpers/getFormatFile"
import ICONS_TYPE_FILE from "../../libs/iconsTypeFile"
import type { FileInfo } from "../../types"
import DeleteFile from "../DeleteFile"
import DownLoadOrCheckFile from "../DownLoadOrCheckFile"
import SkeletonFiles from "../SkeletonFiles"

type FileListProps = {
  data: {
    userId: string
    dealId: string
    dealType: DealType
  } | null
}

const FILE_FORMATS = {
  IMAGE: [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".tiff", ".webp", ".svg", ".ico"],
  EXCEL: [".xls", ".xlsx", ".csv"],
  PDF: [".pdf"],
  TEXT: [".txt"],
}

const getFileType = (format: string) => {
  if (FILE_FORMATS.IMAGE.includes(format)) return "image"
  if (FILE_FORMATS.EXCEL.includes(format)) return "excel"
  if (FILE_FORMATS.PDF.includes(format)) return "pdf"
  if (FILE_FORMATS.TEXT.includes(format)) return "text"
  return "other"
}

const fileTypeIcons = {
  image: ICONS_TYPE_FILE[".img"](),
  excel: ICONS_TYPE_FILE[".xls"](),
  pdf: ICONS_TYPE_FILE[".pdf"](),
  text: ICONS_TYPE_FILE[".txt"](),
  other: ICONS_TYPE_FILE.default(),
}

const FileItem = ({
  file,
  selected,
  onSelect,
}: {
  file: FileInfo
  selected: boolean
  onSelect: (e: React.ChangeEvent<HTMLInputElement>) => void
}) => {
  const formatFile = getFormatFile(file.name)
  const fileType = getFileType(formatFile)
  const fileName = getFileNameWithoutUuid(file.name)

  const { mutate: handleDownload, isPending } = useDownLoadFile()

  const handleDownloadFile = () => {
    handleDownload({ localPath: file.localPath, name: file.name })
  }

  const transitions = useTransition(file, {
    keys: (file) => file.name,
    from: { opacity: 0, transform: "translateY(20px)" },
    enter: { opacity: 1, transform: "translateY(0)" },
    leave: { opacity: 0, transform: "translateY(-20px)" },
    config: { duration: 200, easing: (t) => 1 - (1 - t) ** 3 },
  })

  return transitions((styles, item) => (
    <animated.div
      className="group relative grid w-14 h-full min-w-14 max-w-14 flex-1 gap-1 rounded-md border border-solid p-2 hover:border-blue-700 focus-visible:border-blue-700"
      key={item.name}
      style={styles}
    >
      <p className="flex items-center justify-center group-hover:scale-0 group-focus-visible:scale-0">
        {fileTypeIcons[fileType]}
      </p>

      <p className="truncate text-xs">{fileName}</p>

      <div className="absolute inset-0 -z-1 h-full w-full rounded-md bg-black/80 group-hover:z-1 group-focus-visible:z-2" />

      <DownLoadOrCheckFile
        className="absolute inset-0 z-10 h-full w-full items-center justify-center"
        fileName={fileName}
        handleDownloadFile={handleDownloadFile}
        isPending={isPending}
      />

      {!isPending && (
        <input
          checked={selected}
          className="absolute hidden checked:block group-hover:block group-focus-visible:block -right-1 -top-1 z-11 h-5 w-5 cursor-pointer accent-red-700"
          id={file.name}
          onChange={onSelect}
          type="checkbox"
        />
      )}
    </animated.div>
  ))
}

const FileList = ({ data }: FileListProps) => {
  const { data: files, isPending, isError } = useGetHrefFilesDealFromDB(data ? data : undefined)

  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set())

  const selectedFilesForDelete = (files ?? []).filter((file) => selectedFiles.has(file.name))

  const handleSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileName = e.target.id

    setSelectedFiles((prev) => {
      const updated = new Set(prev)
      if (updated.has(fileName)) {
        updated.delete(fileName)
      } else {
        updated.add(fileName)
      }
      return updated
    })
  }

  const pendingTransition = useTransition(isPending, {
    from: { opacity: 0, transform: "translateY(20px)" },
    enter: { opacity: 1, transform: "translateY(0)" },
    leave: { opacity: 0, transform: "translateY(-20px)" },
    config: { duration: 200 },
  })

  const errorTransition = useTransition(isError, {
    from: { opacity: 0, transform: "translateY(20px)" },
    enter: { opacity: 1, transform: "translateY(0)" },
    leave: { opacity: 0, transform: "translateY(-20px)" },
    config: { duration: 200 },
  })

  const filesTransition = useTransition(files || [], {
    keys: (file) => file?.id ?? file?.name ?? "",
    from: { opacity: 0, transform: "translateY(20px)" },
    enter: { opacity: 1, transform: "translateY(0)" },
    leave: { opacity: 0, transform: "translateY(-20px)" },
    config: { duration: 200 },
  })

  if (!files || !files?.length) return null

  return (
    <IntoDealItem className="relative" title="Файлы">
      {pendingTransition((styles, item) =>
        item ? (
          <animated.div style={styles}>
            <SkeletonFiles />
          </animated.div>
        ) : null,
      )}

      {errorTransition((styles, item) =>
        item ? (
          <animated.div
            className="flex items-center justify-center gap-2 p-2 text-red-600"
            style={styles}
          >
            <FileWarning className="text-red-600" size="40" strokeWidth={1} />

            <span className="text-lg">Ошибка загрузки файлов</span>
          </animated.div>
        ) : null,
      )}

      {files && files.length > 0 && (
        <animated.div>
          {selectedFiles.size > 0 && (
            <DeleteFile
              className="absolute right-2 top-2 z-10"
              selectedFilesForDelete={selectedFilesForDelete}
              setSelectedFiles={setSelectedFiles}
            />
          )}

          <animated.ul className="flex flex-wrap gap-2">
            {filesTransition((styles, file) =>
              file ? (
                <animated.li key={file.id} style={styles}>
                  <FileItem
                    file={file}
                    onSelect={handleSelectFile}
                    selected={selectedFiles.has(file.name)}
                  />
                </animated.li>
              ) : null,
            )}
          </animated.ul>
        </animated.div>
      )}
    </IntoDealItem>
  )
}

export default FileList
