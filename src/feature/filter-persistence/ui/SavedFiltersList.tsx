import type React from "react"
import { type SetStateAction, useCallback, useEffect } from "react"
import type { UserFilter } from "@prisma/client"
import type { ColumnFiltersState } from "@tanstack/react-table"
import { ListFilterPlus } from "lucide-react"
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

const SavedFiltersList = ({
  handleClearFilters,
  selectedFilterName,
  setSelectedFilterName,
}: SavedFiltersListType) => {
  const { data: userFilters = [] } = useGetUserFilters()
  console.log(userFilters, "userFilters")

  const { setColumnFilters, setColumnVisibility } = useDataTableFiltersContext()
  const { isPending } = useDisableSavedFilters()
  const { mutate: selectFilter, isPending: isPendingSelect } = useSelectFilter()

  const defaultCheckedFilter = userFilters.find((item) => item.isActive)

  const isRequest = isPending || isPendingSelect

  const filterSelect = useCallback((filter: UserFilter) => {
    const { filterName, filterValue } = filter

    console.log(filterValue, "filterValue")
    if (!filterValue) return

    console.log(selectedFilterName === filterName, "selectedFilterName")

    if (selectedFilterName === filterName) return

    setSelectedFilterName(filterName)

    const queryParams = new URLSearchParams(filterValue)

    console.log(queryParams, "queryParams")

    const filtersStr = decodeURIComponent(queryParams.get("filters") || "")

    console.log(filtersStr, "filtersStr")

    const filtersArr: { id: string; value: unknown }[] = filtersStr
      .split("&")
      .filter(Boolean) // убираем пустые строки
      .map((item) => {
        const [key, value] = item.split("=")
        if (!key) return null

        let parsedValue: unknown

        try {
          // Защита от "undefined", "null" и некорректного JSON
          const decoded = decodeURIComponent(value || "")
          if (!decoded || decoded === "undefined" || decoded === "null") {
            parsedValue = undefined
          } else {
            parsedValue = JSON.parse(decoded)
          }
        } catch (e) {
          console.warn(`Failed to parse filter value for key "${key}":`, value)
          parsedValue = undefined
        }

        return {
          id: key,
          value: parsedValue,
        }
      })
      .filter((item): item is { id: string; value: unknown } => item !== null)

    const hiddenCols = queryParams
      .get("hidden")
      ?.split(",")
      ?.reduce(
        (acc, item) => {
          if (item) acc[item] = false
          return acc
        },
        {} as { [key: string]: boolean },
      )

    setColumnFilters((filtersArr as unknown as ColumnFiltersState) ?? [])
    setColumnVisibility(hiddenCols ?? {})

    selectFilter(filter.id)
  }, [])

  useEffect(() => {
    if (defaultCheckedFilter) {
      filterSelect(defaultCheckedFilter)
    }
  }, [defaultCheckedFilter, filterSelect])

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
            defaultValue={defaultCheckedFilter?.filterName || "disableSavedFilters"}
          >
            {userFilters.map((filter) => {
              return (
                <div className="flex items-center justify-between space-x-2" key={filter.id}>
                  <div className="btn_hover flex w-full items-center gap-2">
                    <RadioGroupItem
                      className="transition-transform duration-150 active:scale-90"
                      disabled={isRequest}
                      id={filter.id}
                      onClick={() => filterSelect(filter)}
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
                disabled={isRequest}
                id="disableSavedFilters"
                onClick={handleClearFilters}
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
