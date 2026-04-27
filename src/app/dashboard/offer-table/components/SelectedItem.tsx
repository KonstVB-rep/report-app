import { Checkbox } from "@/shared/components/ui/checkbox"
import { selectItemStoreId, selectItemStoreIdAction, useOfferStoreTable } from "../store"

const SelectedItem = ({
  id,
  className = "absolute -left-8 top-0",
}: {
  id: string
  className?: string
}) => {
  const selectedChapter = useOfferStoreTable(selectItemStoreId)
  return (
    <Checkbox
      checked={id === selectedChapter}
      onCheckedChange={() => {
        if (id !== selectedChapter) {
          selectItemStoreIdAction(id)
        } else {
          selectItemStoreIdAction("")
        }
      }}
      className={className}
    />
  )
}

export default SelectedItem
