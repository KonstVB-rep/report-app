import { FilePen } from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import DialogComponent from "@/shared/custom-components/ui/DialogComponent"
import TabsChangeFilter from "./TabsChangeFilter"

const UserFiltersChange = ({ filterId }: { filterId: string }) => {
  return (
    <DialogComponent
      classNameContent="w-fit z-50"
      contentTooltip="Удалить/обновить фильтр"
      dialogTitle=""
      trigger={
        <Button className="btn_hover w-fit" size={"icon"} variant={"secondary"}>
          <FilePen />
        </Button>
      }
    >
      <TabsChangeFilter filterId={filterId} />
    </DialogComponent>
  )
}

export default UserFiltersChange
