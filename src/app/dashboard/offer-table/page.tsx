"use client"

import {
  addPart,
  addSection,
  selectSelectedItemId,
  useOfferStoreTable,
} from "@/app/dashboard/offer-table/store"
import { Button } from "@/shared/components/ui/button"
import OfferContent from "./OfferContent"

const OfferPage = () => {
  const selectedChapter = useOfferStoreTable(selectSelectedItemId)

  return (
    <>
      <div className=" flex gap-1">
        <Button onClick={() => addPart()}>Добавить раздел</Button>
        <Button onClick={() => addSection(selectedChapter)}>Добавить подраздел</Button>
      </div>
      <OfferContent />
    </>
  )
}

export default OfferPage
