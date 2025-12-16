import type React from "react"
import type { Dispatch, SetStateAction } from "react"
import type { DealType } from "@prisma/client"
import DelDealSkeleton from "@/entities/deal/ui/Skeletons/DelDealSkeleton"
import { Button } from "@/shared/components/ui/button"
import { DialogClose } from "@/shared/components/ui/dialog"
import SubmitFormButton from "@/shared/custom-components/ui/Buttons/SubmitFormButton"
import MotionDivY from "@/shared/custom-components/ui/MotionComponents/MotionDivY"
import Overlay from "@/shared/custom-components/ui/Overlay"
import { useDeleteFiles } from "@/widgets/Files/hooks/mutate"
import { useDelDeal } from "../../api/hooks/mutate"
import { useGetDealById } from "../../api/hooks/query"

type Props = {
  id: string
  type: DealType
  close: Dispatch<SetStateAction<void>>
  clearData?: () => void
}

const DelDealForm = ({ id, type, close, clearData }: Props) => {
  const { data: deal, isPending: isLoadInfoAboutDeal } = useGetDealById(id, type)

  const userId = deal?.userId ?? ""
  const dealFiles = deal?.dealFiles ?? []
  const hasFiles = dealFiles.length > 0

  const { mutate: delDeal, isPending } = useDelDeal(
    () => {
      if (hasFiles) {
        delFiles(dealFiles)
        close()
        return
      } else {
        if (clearData) {
          clearData()
        }
        close()
      }
    },
    type,
    userId,
  )

  const { mutate: delFiles, isPending: isPendingDelete } = useDeleteFiles()

  const isLoading = isPending || isPendingDelete

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    delDeal(id)
  }

  if (isLoadInfoAboutDeal) return <DelDealSkeleton />

  return (
    <MotionDivY>
      <Overlay isPending={isLoading} />
      <form className="grid gap-4 py-4" onSubmit={handleSubmit}>
        <p className="text-center">Вы точно уверены что хотите удалить данные</p>
        <p className="rounded-xl bg-muted px-4 py-2 text-center text-xl font-bold break-all">
          &quot;{deal?.nameObject}&quot;?
        </p>
        <p className="text-center">Их нельзя будет восстановить!</p>
        <div className="grid grid-cols-2 gap-2">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Отменить
            </Button>
          </DialogClose>
          <SubmitFormButton isPending={isLoading} title="Удалить" type="submit" />
        </div>
      </form>
    </MotionDivY>
  )
}

export default DelDealForm
