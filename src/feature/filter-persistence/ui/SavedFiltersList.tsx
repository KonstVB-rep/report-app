import type React from "react"
import { type SetStateAction, useCallback, useEffect } from "react"
import type { UserFilter } from "@prisma/client"
import type { ColumnFiltersState } from "@tanstack/react-table"
import { ListFilterPlus } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import { Label } from "@/shared/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/shared/components/ui/radio-group"
import HoverCardComponent from "@/shared/custom-components/ui/HoverCard"
import { useDataTableFiltersContext } from "../context/useDataTableFiltersContext"
import { useDisableSavedFilters, useSelectFilter } from "../hooks/mutate"
import { useGetUserFilters } from "../hooks/query"
import UserFiltersChange from "./UserFiltersChange"

type SavedFiltersListType = {
  handleClearFilters: () => void
  selectedFilterName: string
  setSelectedFilterName: React.Dispatch<SetStateAction<string>>
}

const parseFilterValue = (filterValue: string) => {
  const params = new URLSearchParams(filterValue)

  const filters: ColumnFiltersState = []
  const visibility: Record<string, boolean> = {}

  params.forEach((value, key) => {
    if (key === "hidden") {
      value.split(",").forEach((col) => {
        if (col) visibility[col] = false
      })
    } else {
      try {
        const decoded = decodeURIComponent(value)
        const parsedValue =
          decoded === "undefined" || decoded === "null" ? undefined : JSON.parse(decoded)
        filters.push({ id: key, value: parsedValue })
      } catch {
        filters.push({ id: key, value: decodeURIComponent(value) })
      }
    }
  })

  return { filters, visibility }
}

const SavedFiltersList = ({
  handleClearFilters,
  selectedFilterName,
  setSelectedFilterName,
}: SavedFiltersListType) => {
  const router = useRouter()
  const pathname = usePathname()
  const { data: userFilters = [] } = useGetUserFilters()
  const { setColumnFilters, setColumnVisibility } = useDataTableFiltersContext()

  const { mutate: disableSavedFilters, isPending: isPendingDisable } = useDisableSavedFilters()

  const { mutate: selectFilter, isPending: isPendingSelect } = useSelectFilter()

  const applyFilterToTable = useCallback(
    (filter: UserFilter) => {
      if (!filter.filterValue) return
      const { filters, visibility } = parseFilterValue(filter.filterValue)

      setColumnFilters(filters)
      setColumnVisibility(visibility)
      setSelectedFilterName(filter.filterName)
    },
    [setColumnFilters, setColumnVisibility, setSelectedFilterName],
  )

  const handleFilterChange = (filterName: string) => {
    console.log(filterName, "disableSavedFilters")
    if (filterName === "disableSavedFilters") {
      handleClearFilters()
      router.replace(pathname, { scroll: false })
      disableSavedFilters()
      return
    }

    const filter = userFilters.find((f) => f.filterName === filterName)
    if (filter && filterName !== selectedFilterName) {
      // Пишем в URL только при ручном клике
      router.replace(`${pathname}?${filter.filterValue}`, { scroll: false })
      applyFilterToTable(filter)
      selectFilter(filter.id)
    }
  }

  useEffect(() => {
    const activeFilter = userFilters.find((f) => f.isActive)
    if (activeFilter && selectedFilterName !== activeFilter.filterName) {
      applyFilterToTable(activeFilter)
    }
  }, [userFilters, applyFilterToTable, selectedFilterName])

  return (
    <>
      {userFilters.length > 0 && (
        <HoverCardComponent
          align="end"
          className="stoneborder-stone-solid-600"
          sideOffset={4}
          title={<ListFilterPlus />}
        >
          <RadioGroup
            className="grid gap-1 p-2"
            disabled={isPendingDisable || isPendingSelect}
            onValueChange={handleFilterChange}
            value={selectedFilterName || "disableSavedFilters"}
          >
            {userFilters.map((filter) => {
              return (
                <div className="flex items-center justify-between space-x-2" key={filter.id}>
                  <div className="btn_hover flex w-full items-center gap-2">
                    <RadioGroupItem
                      className="transition-transform duration-150 active:scale-90"
                      id={filter.id}
                      value={filter.filterName}
                    />
                    <Label
                      className="h-full w-full max-w-36 cursor-pointer truncate first-letter:uppercase"
                      htmlFor={filter.id}
                    >
                      {filter.filterName}
                    </Label>
                  </div>
                  <UserFiltersChange filterId={filter.id} />
                </div>
              )
            })}
            <div className="btn_hover flex h-9 w-full items-center space-x-2 py-2">
              <RadioGroupItem
                className="transition-transform duration-150 active:scale-90"
                id="disableSavedFilters"
                value="disableSavedFilters"
              />
              <Label
                className="cursor-pointer first-letter:uppercase"
                htmlFor="disableSavedFilters"
              >
                Отключить фильтры
              </Label>
            </div>
          </RadioGroup>
        </HoverCardComponent>
      )}
    </>
  )
}

export default SavedFiltersList
