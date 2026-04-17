import { Checkbox } from "@/shared/components/ui/checkbox"
import { selectItemStoreId, selectItemStoreIdAction, useOfferStore } from "./store"

const SelectedItem = ({
  id,
  className = "absolute -left-8 top-0",
}: {
  id: string
  className?: string
}) => {
  const selectedChapter = useOfferStore(selectItemStoreId)
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
