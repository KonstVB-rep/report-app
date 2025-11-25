import { memo } from "react"

type ItemType = {
  name: string
  value: number
}

type ResourceRowProps = {
  item: ItemType
  color: string
}
const ResourceRow = memo(({ item, color }: ResourceRowProps) => (
  <li className="gap-2 flex sm:gap-4 items-center rounded">
    <span
      className="relative py-1 px-2 bg-muted sm:bg-transparent border border-solid rounded w-full sm:min-w-max overflow-hidden"
      style={{ borderColor: color }}
    >
      <span
        className="block absolute top-0 left-0 w-2 h-full opacity-50 rounded"
        style={{ width: `${item.value * 2}px`, backgroundColor: color }}
      ></span>
      {item.name}
    </span>
    <div className="flex sm:hidden gap-2 items-center">
      <span className="py-1 flex-1 h-10 aspect-square bg-muted px-2 border border-solid rounded-md border-primary dark:border-muted flex items-center justify-center shrink-0">
        {item.value}
      </span>
    </div>
  </li>
))

ResourceRow.displayName = "ResourceRow"

export default ResourceRow
