import type { Column } from "@tanstack/react-table"
import DebouncedInput from "../DebouncedInput"

const FilterQuery = ({ column }: { column: Column<unknown, unknown> }) => {
  const columnFilterValue = column.getFilterValue()

  return (
    <DebouncedInput
      className="w-36 rounded border shadow"
      onChange={(value: string | number) => column.setFilterValue(value)}
      placeholder={`Search...`}
      type="text"
      value={(columnFilterValue ?? "") as string}
    />
  )
}

export default FilterQuery
