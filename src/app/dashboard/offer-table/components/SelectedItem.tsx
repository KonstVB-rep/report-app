import { Checkbox } from "@/shared/components/ui/checkbox"
import { selectActiveTarget, setSelectActiveTarget, useOfferStoreTable } from "../store"

const SelectedItem = ({
  partId,
  sectionId,
  className = "absolute -left-8 top-0",
}: {
  partId: string
  sectionId?: string
  className?: string
}) => {
  const selectedChapter = useOfferStoreTable(selectActiveTarget)

  return (
    <Checkbox
      checked={partId === selectedChapter?.partId && sectionId === selectedChapter?.sectionId}
      className={className}
      onCheckedChange={() => {
        if (partId) {
          setSelectActiveTarget(partId, sectionId)
        }
      }}
    />
  )
}

export default SelectedItem
