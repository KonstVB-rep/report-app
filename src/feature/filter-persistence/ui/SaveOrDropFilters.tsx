import { X } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/shared/components/ui/button"
import TooltipComponent from "@/shared/custom-components/ui/TooltipComponent"
import { useDataTableFiltersContext } from "../context/useDataTableFiltersContext"
import SaveFilter from "./SaveFilter"

type SaveOrDropFiltersType = {
  handleClearFilters: () => void
}

const SaveOrDropFilters = ({ handleClearFilters }: SaveOrDropFiltersType) => {
  const searchParams = useSearchParams()
  const { columnFilters, columnVisibility, setSelectedColumns } = useDataTableFiltersContext()
  return (
    <>
      {searchParams.size > 0 && (
        <>
          {columnFilters.length || Object.keys(columnVisibility).length ? <SaveFilter /> : null}
          <TooltipComponent content="Сбросить фильтры">
            <Button
              className="btn_hover"
              onClick={() => {
                handleClearFilters()
                setSelectedColumns([])
              }}
              size={"icon"}
              variant={"destructive"}
            >
              <X />
            </Button>
          </TooltipComponent>
        </>
      )}
    </>
  )
}

export default SaveOrDropFilters
