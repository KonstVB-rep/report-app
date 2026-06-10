"use client"
import { ListFilterPlus } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import { Label } from "@/shared/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/shared/components/ui/radio-group"
import HoverCardComponent from "@/shared/custom-components/ui/HoverCard"
import { useDisableSavedFilters, useSelectFilter } from "../hooks/mutate"
import { useGetUserFilters } from "../hooks/query"
import UserFiltersChange from "./UserFiltersChange"

const SavedFiltersList = ({
  handleClearFilters,
  selectedFilterName,
  setSelectedFilterName,
}: {
  handleClearFilters: () => void
  selectedFilterName: string
  setSelectedFilterName: (name: string) => void
}) => {
  const router = useRouter()
  const pathname = usePathname()
  const { data: userFilters = [] } = useGetUserFilters()
  const { mutate: selectFilter } = useSelectFilter()
  const { mutate: disableSavedFilters } = useDisableSavedFilters()

  const handleFilterChange = (filterName: string) => {
    if (filterName === "disableSavedFilters") {
      setSelectedFilterName("disableSavedFilters")
      handleClearFilters()
      disableSavedFilters()
      router.replace(pathname, { scroll: false })
      return
    }

    const filter = userFilters.find((f) => f.filterName === filterName)

    if (filter && filterName !== selectedFilterName) {
      router.replace(`${pathname}?${filter.filterValue}`, { scroll: false })
      selectFilter(filter.id)
      setSelectedFilterName(filter.filterName)
    }
  }

  const isExistSavedFilters = userFilters.length > 0

  if (!isExistSavedFilters) return null

  return (
    <HoverCardComponent align="end" title={<ListFilterPlus />}>
      <RadioGroup
        className="grid gap-1 p-2"
        onValueChange={handleFilterChange}
        value={selectedFilterName || "disableSavedFilters"}
      >
        {userFilters.map((filter) => (
          <div className="flex items-center justify-between space-x-2" key={filter.id}>
            <div className="flex items-center gap-2 p-2">
              <RadioGroupItem id={filter.id} value={filter.filterName} />
              <Label className="cursor-pointer truncate max-w-36" htmlFor={filter.id}>
                {filter.filterName}
              </Label>
            </div>
            <UserFiltersChange filterId={filter.id} />
          </div>
        ))}
        <div className="flex items-center space-x-2 p-2 border-t mt-1">
          <RadioGroupItem id="disableSavedFilters" value="disableSavedFilters" />
          <Label className="cursor-pointer text-muted-foreground" htmlFor="disableSavedFilters">
            Отключить фильтры
          </Label>
        </div>
      </RadioGroup>
    </HoverCardComponent>
  )
}

export default SavedFiltersList
