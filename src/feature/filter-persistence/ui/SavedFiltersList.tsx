"use client"
import { useRouter, usePathname } from "next/navigation"
import { ListFilterPlus } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/shared/components/ui/radio-group"
import { Label } from "@/shared/components/ui/label"

import UserFiltersChange from "./UserFiltersChange"
import HoverCardComponent from "@/shared/custom-components/ui/HoverCard"
import { useSelectFilter, useDisableSavedFilters } from "../hooks/mutate"
import { useGetUserFilters } from "../hooks/query"

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
      // 1. Просто обновляем URL.
      // Хук useDataTableFilters сам распарсит filterValue и применит его к таблице.
      router.replace(`${pathname}?${filter.filterValue}`, { scroll: false })

      // 2. Логика выделения и активности в БД
      selectFilter(filter.id)
      setSelectedFilterName(filter.filterName)
    }
  }

  return (
    <HoverCardComponent title={<ListFilterPlus />} align="end">
      <RadioGroup
        onValueChange={handleFilterChange}
        value={selectedFilterName || "disableSavedFilters"}
        className="grid gap-1 p-2"
      >
        {userFilters.map((filter) => (
          <div className="flex items-center justify-between space-x-2" key={filter.id}>
            <div className="flex items-center gap-2 p-2">
              <RadioGroupItem id={filter.id} value={filter.filterName} />
              <Label htmlFor={filter.id} className="cursor-pointer truncate max-w-36">
                {filter.filterName}
              </Label>
            </div>
            <UserFiltersChange filterId={filter.id} />
          </div>
        ))}
        <div className="flex items-center space-x-2 p-2 border-t mt-1">
          <RadioGroupItem id="disableSavedFilters" value="disableSavedFilters" />
          <Label htmlFor="disableSavedFilters" className="cursor-pointer text-muted-foreground">
            Отключить фильтры
          </Label>
        </div>
      </RadioGroup>
    </HoverCardComponent>
  )
}

export default SavedFiltersList
