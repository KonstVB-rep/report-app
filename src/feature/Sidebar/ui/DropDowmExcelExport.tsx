import { HEADER_ERTEL_IMAGE } from "@/app/dashboard/offer-constructor/lib/constants"
import { handleOfferToExcel } from "@/app/dashboard/offer-constructor/lib/handleOfferToExcel"
import { handleСalculationToExcel } from "@/app/dashboard/offer-constructor/lib/handleСalculationToExcel"
import { selectData, useOfferStoreTable } from "@/app/dashboard/offer-constructor/store"
import { Button } from "@/shared/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu"

export function DropDowmExcelExport() {
  const data = useOfferStoreTable(selectData)
  const columnSizing = JSON.parse(localStorage.getItem("offer-table_columnSizing") || "{}")
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Excel</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-40">
        <DropdownMenuGroup>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => handleOfferToExcel(data, columnSizing)}
          >
            КП в Excel
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => handleСalculationToExcel(data, HEADER_ERTEL_IMAGE)}
          >
            Расчет в КП
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
