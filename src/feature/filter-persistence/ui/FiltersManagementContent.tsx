"use client"

import { useState } from "react"
import { useDataTableFiltersContext } from "../context/useDataTableFiltersContext"
import { useDisableSavedFilters } from "../hooks/mutate"
import DropFilters from "./DropFilters"
import SavedFiltersList from "./SavedFiltersList"

const FiltersManagementContent = () => {
  const { setColumnFilters, setColumnVisibility } = useDataTableFiltersContext()
  const { mutate: disableSavedFilters } = useDisableSavedFilters()

  const [selectedFilterName, setSelectedFilterName] = useState<string>("")

  const handleClearFilters = () => {
    setColumnFilters([])
    setColumnVisibility({})
    setSelectedFilterName("")
  }

  return (
    <div className="flex items-center gap-2">
      <DropFilters handleClearFilters={handleClearFilters} />
      <SavedFiltersList
        handleClearFilters={handleClearFilters}
        selectedFilterName={selectedFilterName}
        setSelectedFilterName={setSelectedFilterName}
      />
    </div>
  )
}

export default FiltersManagementContent
