"use client"

import { X } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/shared/components/ui/button"
import TooltipComponent from "@/shared/custom-components/ui/TooltipComponent"
import { useDataTableFiltersContext } from "../context/useDataTableFiltersContext"
import SaveFilter from "./SaveFilter"

type DropFiltersType = {
  handleClearFilters: () => void
}

const DropFilters = ({ handleClearFilters }: DropFiltersType) => {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()

  const { columnFilters, columnVisibility, setSelectedColumns, resetFilterStore, includedColumns } =
    useDataTableFiltersContext()

  const handleFullReset = () => {
    handleClearFilters()

    setSelectedColumns([...(includedColumns || [])])

    resetFilterStore()

    const currentParams = new URLSearchParams(window.location.search)
    const cleanParams = new URLSearchParams()

    currentParams.forEach((value, key) => {
      if (key === "viewType" || key === "departmentId" || key === "dealType" || key === "userId") {
        cleanParams.set(key, value)
      }
    })

    const newQuery = cleanParams.toString()
    router.replace(newQuery ? `${pathname}?${newQuery}` : pathname, { scroll: false })
  }

  // Проверяем, есть ли в URL хоть какие-то фильтры (исключая системный viewType)
  const hasActiveFiltersInUrl = Array.from(searchParams.keys()).some(
    (key) => key !== "viewType" && key !== "departmentId" && key !== "dealType" && key !== "userId",
  )

  return (
    <>
      {hasActiveFiltersInUrl || columnFilters.length || Object.keys(columnVisibility).length > 0 ? (
        <>
          {columnFilters.length || Object.keys(columnVisibility).length ? <SaveFilter /> : null}
          <TooltipComponent content="Сбросить фильтры">
            <Button
              className="btn_hover"
              onClick={handleFullReset} // Вызываем наш умный полный сброс
              size={"icon"}
              variant={"destructive"}
            >
              <X />
            </Button>
          </TooltipComponent>
        </>
      ) : null}
    </>
  )
}

export default DropFilters
