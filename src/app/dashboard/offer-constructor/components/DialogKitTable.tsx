import KitTable from "@/app/dashboard/offer-constructor/components/KitTable"
import { useDeleteFromKit } from "@/app/dashboard/offer-constructor/hooks/mutate"
import type { SerializedEquipmentKitItem } from "@/app/dashboard/offer-constructor/lib/types"
import { Button } from "@/shared/components/ui/button"
import DialogComponent from "@/shared/custom-components/ui/DialogComponent"

const DialogKitTable = ({
  contentsKit,
  id,
}: {
  contentsKit: SerializedEquipmentKitItem[]
  id: string
}) => {
  const { mutate: delFromKit, isPending } = useDeleteFromKit()

  const contentsIds = contentsKit.map((item) => item.itemId)

  const handleDelete = () => {
    if (isPending) return
    delFromKit({ idKit: id, idsKitItem: contentsIds })
  }
  return (
    <DialogComponent
      dialogTitle="Состав комплекта"
      footer={
        contentsKit.length > 1 && (
          <div className="flex flex-wrap gap-2 justify-end">
            <Button disabled={isPending} onClick={handleDelete} variant="default">
              {isPending ? "Идет удаление..." : "Удалить"}
            </Button>
          </div>
        )
      }
      trigger={
        <Button
          className="bg-transparent border-none px-2 py-1.5 h-auto w-full justify-start"
          variant="outline"
        >
          Состав
        </Button>
      }
    >
      <KitTable data={contentsKit} />
    </DialogComponent>
  )
}

export default DialogKitTable
