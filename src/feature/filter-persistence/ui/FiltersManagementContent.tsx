"use client"

import { Suspense, useState } from "react"
import { useDataTableFiltersContext } from "../context/useDataTableFiltersContext"
import DropFilters from "./DropFilters"
import SavedFiltersList from "./SavedFiltersList"

const FiltersManagementContent = () => {
  const { setColumnFilters, setColumnVisibility } = useDataTableFiltersContext()

  const [selectedFilterName, setSelectedFilterName] = useState<string>("")

  const handleClearFilters = () => {
    setColumnFilters([])
    setColumnVisibility({})
    setSelectedFilterName("disableSavedFilters")
  }

  return (
    <div className="flex items-center gap-2">
      <DropFilters handleClearFilters={handleClearFilters} />
      <Suspense fallback={<div className="h-9 w-9 animate-pulse bg-stone-200 rounded-full" />}>
        <SavedFiltersList
          handleClearFilters={handleClearFilters}
          selectedFilterName={selectedFilterName}
          setSelectedFilterName={setSelectedFilterName}
        />
      </Suspense>
    </div>
  )
}

export default FiltersManagementContent
