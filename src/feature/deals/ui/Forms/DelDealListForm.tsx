import type React from "react"
import type { Dispatch, SetStateAction } from "react"
import type { DealFile } from "@prisma/client"
import { useParams } from "next/navigation"
import type { DeletingDealsListItem } from "@/entities/deal/types"
import { Button } from "@/shared/components/ui/button"
import { DialogClose } from "@/shared/components/ui/dialog"
import SubmitFormButton from "@/shared/custom-components/ui/Buttons/SubmitFormButton"
import MotionDivY from "@/shared/custom-components/ui/MotionComponents/MotionDivY"
import Overlay from "@/shared/custom-components/ui/Overlay"
import { useDeleteFiles } from "@/widgets/Files/hooks/mutate"
import { useDelListDeal } from "../../api/hooks/mutate"

type Props = {
  deals: DeletingDealsListItem[]
  close: Dispatch<SetStateAction<void>>
}

const DelDealListForm = ({ deals, close }: Props) => {
  const { departmentId } = useParams()

  const { mutate: delDeals, isPending } = useDelListDeal((dataFiles: DealFile[]) => {
    if (!dataFiles || dataFiles.length === 0) {
      console.log("[YANDEX] У удаляемых сделок нет файлов на Диске. Пропускаем запрос.")
      close()
      return
    }

    mutate(dataFiles)
  }, departmentId as string)

  const { mutate, isPending: isPendingDelete } = useDeleteFiles(() => close)

  const isLoading = isPending || isPendingDelete

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (deals.length && departmentId) delDeals(deals)
  }

  return (
    <MotionDivY>
      <Overlay isPending={isLoading} />
      <form className="grid gap-4 py-4" onSubmit={handleSubmit}>
        <p className="text-center">Вы точно уверены что хотите удалить данные</p>
        <p className="rounded-xl bg-muted px-4 py-2 text-center text-xl font-bold break-all max-h-60 overflow-y-auto">
          {deals.map((deal) => (
            <span className="block" key={deal.id}>
              &quot;{deal?.title}&quot;?
            </span>
          ))}
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

export default DelDealListForm
