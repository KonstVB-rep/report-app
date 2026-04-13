"use client"

import { ChevronDown } from "lucide-react"
import dynamic from "next/dynamic"
import { Button } from "@/shared/components/ui/button"
import { useDataTableFiltersContext } from "../context/useDataTableFiltersContext"

const FiltersManagementContent = dynamic(() => import("./FiltersManagementContent"), {
  ssr: false,
})

type FilterManagmentProps = {
  openFilters: boolean
  isShow: boolean
}

const FiltersManagement = ({ openFilters, isShow }: FilterManagmentProps) => {
  const { setOpenFilters, columnFilters } = useDataTableFiltersContext()

  if (!isShow) return null

  return (
    <div className="flex flex-1 items-center justify-between gap-2">
      <div className="flex items-center gap-2">
        <Button
          className="flex h-full w-fit justify-start gap-2 px-4"
          onClick={() => setOpenFilters(!openFilters)}
          variant={"ghost"}
        >
          <span>Фильтры</span>{" "}
          <ChevronDown
            className={`h-4 w-4 transition-all duration-200 ${openFilters ? "rotate-180" : ""}`}
          />
        </Button>
        {columnFilters.length > 0 && (
          <div className="flex h-8 w-8 items-center justify-center gap-2 rounded-md border border-solid border-blue-600 bg-muted p-1">
            {columnFilters.length}
          </div>
        )}
      </div>
      <FiltersManagementContent />
    </div>
  )
}

export default FiltersManagement
