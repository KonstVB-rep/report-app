import { useState } from "react"
import type { DealFile } from "@prisma/client"
import { FileX } from "lucide-react"
import dynamic from "next/dynamic"
import { Button } from "@/shared/components/ui/button"
import DialogComponent from "@/shared/custom-components/ui/DialogComponent"
import MotionDivY from "@/shared/custom-components/ui/MotionComponents/MotionDivY"
import Overlay from "@/shared/custom-components/ui/Overlay"
import { useDeleteFiles } from "../../hooks/mutate"
import FormDeleteFileSkeleton from "./ui/FormDeleteFileSkeleton"

const FormDeleteFile = dynamic(() => import("./ui/FormDeleteFile"), {
  ssr: false,
  loading: () => <FormDeleteFileSkeleton />,
})

type DeleteFileProps = {
  className?: string
  selectedFilesForDelete: DealFile[]
  setSelectedFiles: React.Dispatch<React.SetStateAction<Set<string>>>
}

const DeleteFile = ({ className, selectedFilesForDelete, setSelectedFiles }: DeleteFileProps) => {
  const [open, setOpen] = useState(false)

  const handleCloseDialog = () => {
    setOpen(false)
    setSelectedFiles(new Set())
  }

  const { mutate, isPending } = useDeleteFiles(handleCloseDialog)

  const handleDeleteFromListSelected = (fileName: string) => {
    setSelectedFiles((prev) => {
      const updated = new Set(prev)
      updated.delete(fileName)
      return updated
    })
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (selectedFilesForDelete.length === 0) return alert("Выберите файлы для удаления!")

    mutate(selectedFilesForDelete)
  }

  return (
    <>
      <Overlay isPending={isPending} />
      <MotionDivY className={`flex gap-2 ${className}`}>
        <DialogComponent
          classNameContent="sm:max-w-[400px]"
          contentTooltip="Удалить выбранные файлы"
          disableClose={isPending}
          onOpenChange={setOpen}
          open={open}
          showX={!isPending}
          trigger={
            <Button className="h-8 w-8 p-1 text-white" disabled={isPending} variant="destructive">
              <FileX className="h-6! w-6!" strokeWidth={1} />
            </Button>
          }
        >
          <FormDeleteFile
            handleDeleteFromListSelected={handleDeleteFromListSelected}
            handleSubmit={handleSubmit}
            isPending={isPending}
            selectedFilesForDelete={selectedFilesForDelete}
          />
        </DialogComponent>
      </MotionDivY>
    </>
  )
}

export default DeleteFile
