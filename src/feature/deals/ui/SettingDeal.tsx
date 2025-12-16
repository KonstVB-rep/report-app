import { useState } from "react"
import type { DealType } from "@prisma/client"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import FileUploadForm from "@/widgets/Files/ui/UploadFile"
import DelButtonDeal from "./Modals/DelButtonDeal"
import EditDealButtonIcon from "./Modals/EditDealButtonIcon"

const SettingDeal = ({ id, userId, type }: { id: string; userId: string; type: DealType }) => {
  const [open, setOpen] = useState(false)

  return (
    <div className="flex gap-2 items-center">
      {open && (
        <div className="flex justify-end gap-2">
          <FileUploadForm
            dealId={id}
            dealType={type === "RETAIL" ? "RETAIL" : "PROJECT"}
            userId={userId}
          />
          <EditDealButtonIcon id={id} type={type} />
          <DelButtonDeal id={id} type={type} />
        </div>
      )}
      {open ? (
        <Button
          className="btn_hover"
          onClick={() => setOpen(false)}
          size="icon"
          title="Действия открыть"
          variant={"outline"}
        >
          <ChevronRight />
        </Button>
      ) : (
        <Button
          className="btn_hover"
          onClick={() => setOpen(true)}
          size="icon"
          title="Закрыть"
          variant={"outline"}
        >
          <ChevronLeft />
        </Button>
      )}
    </div>
  )
}

export default SettingDeal
