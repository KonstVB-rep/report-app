import type React from "react"
import type { Dispatch, SetStateAction } from "react"
import { animated, useTransition } from "@react-spring/web"
import { CloudUpload, Loader, Trash2, Upload, X } from "lucide-react"
import type { DropzoneInputProps, DropzoneRootProps } from "react-dropzone"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"

type FormUploadFilesProps = {
  inputRef: {
    current: HTMLInputElement | null
  }
  getRootProps: <T extends DropzoneRootProps>(props?: T) => T
  isDragActive: boolean
  getInputProps: <T extends DropzoneInputProps>(props?: T) => T
  files: File[] | null
  handleUpload: (e: React.FormEvent<HTMLFormElement>) => void
  handleClear: () => void
  handleSelectFile: (fileName: string) => void
  isPending: boolean
  setFiles: Dispatch<SetStateAction<File[] | null>>
}

const FormUploadFiles = ({
  getRootProps,
  inputRef,
  isDragActive,
  getInputProps,
  files,
  handleUpload,
  handleClear,
  handleSelectFile,
  isPending,
  setFiles,
}: FormUploadFilesProps) => {
  const transitions = useTransition(files, {
    keys: (file) => file?.name ?? "", // Уникальный ключ для каждого элемента
    from: { opacity: 0, scale: 0.9, transform: "translateY(-10px)" },
    enter: { opacity: 1, scale: 1, transform: "translateY(0)" },
    leave: { opacity: 0, scale: 0.9, transform: "translateY(10px)" },
    config: { duration: 200 },
  })

  return (
    <form className="grid w-full gap-4" onSubmit={handleUpload}>
      <button
        className={`grid h-20 w-full cursor-pointer place-items-center rounded-md border-2 border-dashed p-4 ${isDragActive ? "border-blue-600 bg-muted" : ""} hover:border-blue-600 hover:bg-muted focus-visible:bg-muted`}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault() // предотвращаем скролл при пробеле
            inputRef.current?.click()
          }
        }}
        tabIndex={0}
        {...getRootProps()}
      >
        <Upload className="h-10 w-10 cursor-pointer" />
      </button>

      {files && files.length > 0 ? (
        <ul className="grid max-h-48 gap-2 overflow-auto">
          {transitions((styles, file) =>
            file ? (
              <animated.li
                className="relative grid w-full justify-items-center gap-1 rounded-md border border-dashed p-2 pr-[48px]"
                key={file.name}
                style={styles}
              >
                <Button
                  className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center justify-center rounded-md"
                  onClick={() => handleSelectFile(file.name)}
                  size="icon"
                  title="Удалить из списка"
                  type="button"
                  variant="destructive"
                >
                  <X />
                </Button>

                <p className="break-all text-sm">Имя: {file.name}</p>

                <p className="text-xs text-muted-foreground">
                  Размер: {(file.size / 1024 / 1024).toFixed(3)} MB
                </p>
              </animated.li>
            ) : null,
          )}
        </ul>
      ) : null}

      <div className="flex w-full items-center gap-2">
        <Input
          className="hidden"
          multiple
          ref={inputRef}
          type="file"
          {...getInputProps()}
          onChange={(e) => {
            const selectedFiles = e.target.files
            if (selectedFiles) {
              setFiles(Array.from(selectedFiles))
            }
          }}
        />

        {files && files.length > 0 && (
          <div className="grid w-full grid-cols-2 gap-2">
            <Button className="p-2" type="submit">
              {isPending ? (
                <Loader className="h-5 w-5 animate-spin" />
              ) : (
                <span className="flex items-center gap-2 text-xs">
                  <CloudUpload /> Загрузить
                </span>
              )}
            </Button>

            <Button className="p-2" onClick={handleClear} type="reset" variant="destructive">
              <span className="flex items-center gap-2 text-xs">
                <Trash2 /> Очистить
              </span>
            </Button>
          </div>
        )}
      </div>
    </form>
  )
}

export default FormUploadFiles
