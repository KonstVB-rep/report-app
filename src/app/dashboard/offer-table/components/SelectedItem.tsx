import { Checkbox } from "@/shared/components/ui/checkbox"
import { selectSelectedItemId, setSelectedItemId, useOfferStoreTable } from "../store"

const SelectedItem = ({
  id,
  className = "absolute -left-8 top-0",
}: {
  id: string
  className?: string
}) => {
  const selectedChapter = useOfferStoreTable(selectSelectedItemId)
  return (
    <Checkbox
      checked={id === selectedChapter}
      className={className}
      onCheckedChange={() => {
        if (id !== selectedChapter) {
          setSelectedItemId(id)
        } else {
          setSelectedItemId("")
        }
      }}
    />
  )
}

export default SelectedItem
