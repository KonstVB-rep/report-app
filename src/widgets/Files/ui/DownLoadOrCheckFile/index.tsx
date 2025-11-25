import { FileDown, Loader } from "lucide-react"
import { Button } from "@/shared/components/ui/button"

type DownloadFileProps = {
  className: string
  handleDownloadFile: () => void
  isPending: boolean
  fileName: string
}

const DownLoadOrCheckFile = ({
  className,
  handleDownloadFile,
  isPending,
  fileName,
}: DownloadFileProps) => {
  return (
    <>
      {isPending && (
        <div className="absolute inset-0 z-20 border-2 bordeer-solid border-blue-600 animate-pulse rounded-md" />
      )}
      <div
        className={`gap-2 ${isPending ? "flex bg-black/80" : "hidden"} rounded-md group-hover:flex group-focus-visible:flex ${className}`}
      >
        <Button
          className={`h-10 w-10 p-1 disabled:cursor-not-allowed ${isPending && "animate-bounce opacity-100! scale-125!"}`}
          disabled={isPending}
          onClick={handleDownloadFile}
          title={`Скачать файл - ${fileName}`}
        >
          {isPending ? (
            <Loader className="h-7 w-7 animate-spin" />
          ) : (
            <FileDown className="h-7! w-7!" strokeWidth={1} />
          )}
        </Button>
      </div>
    </>
  )
}

export default DownLoadOrCheckFile
