"use client"

import { useState } from "react"
import { useDataTableFiltersContext } from "../context/useDataTableFiltersContext"
import { useDisableSavedFilters } from "../hooks/mutate"
import SavedFiltersList from "./SavedFiltersList"
import SaveOrDropFilters from "./SaveOrDropFilters"

const FiltersManagementContent = () => {
  const { setColumnFilters, setColumnVisibility } = useDataTableFiltersContext()
  const { mutate: disableSavedFilters } = useDisableSavedFilters()

  const [selectedFilterName, setSelectedFilterName] = useState<string>("")

  const handleClearFilters = () => {
    setColumnFilters([])
    setColumnVisibility({})
    setSelectedFilterName("")
    disableSavedFilters()
  }

  return (
    <div className="flex items-center gap-2">
      <SaveOrDropFilters handleClearFilters={handleClearFilters} />
      <SavedFiltersList
        handleClearFilters={handleClearFilters}
        selectedFilterName={selectedFilterName}
        setSelectedFilterName={setSelectedFilterName}
      />
    </div>
  )
}

export default FiltersManagementContent
