import { Table } from "@tanstack/react-table"
import { DataSubSection, OfferTableItem, updateSubSectionTitle } from "../store"
import InputTitle from "./InputTitle"

const OfferSubSection = ({
  table,
  data,
  partId,
  sectionId,
}: {
  table: Table<OfferTableItem>
  data: DataSubSection
  partId: string
  sectionId: string
}) => {
  return (
    <div>
      <div className="w-full">
        <InputTitle
          defaultTitle={data.name}
          updateTitleAction={(title) => updateSubSectionTitle(partId, sectionId, data.id, title)}
          className="bg-blue-900 text-white"
        />
      </div>
    </div>
  )
}

export default OfferSubSection
