import React from "react"
import FilterPopover from "../FilterPopover"

export type OptionGroup = {
  label: string
  columnId: string
  options: Record<string, string>
}

type FilterPopoverGroupProps = {
  options: OptionGroup[]
}

const FilterPopoverGroup = React.memo(({ options }: FilterPopoverGroupProps) => {
  return (
    <div className="flex flex-wrap items-center justify-start gap-2 bg-background">
      {options.map((option) => (
        <FilterPopover
          columnId={option.columnId}
          key={option.columnId}
          label={option.label}
          options={option.options}
        />
      ))}
    </div>
  )
})

FilterPopoverGroup.displayName = "FilterPopoverGroup"

export default FilterPopoverGroup
