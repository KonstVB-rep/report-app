import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import type { DealUnion } from "@/entities/deal/types"
import { Button } from "@/shared/components/ui/button"
import { useRequireAuth } from "@/shared/hooks/useRequireAuth"
import FileUploadForm from "@/widgets/Files/ui/UploadFile"
import DelButtonDeal from "./Modals/DelButtonDeal"
import EditDealButtonIcon from "./Modals/EditDealButtonIcon"

const SettingDeal = <T extends DealUnion>({ dealData }: { dealData: T }) => {
  const [open, setOpen] = useState(false)

  const authUser = useRequireAuth()

  return (
    <div className="flex gap-2 items-center">
      {open && (
        <div className="flex justify-end gap-2">
          <FileUploadForm
            dealId={dealData.id}
            dealType={dealData.type === "RETAIL" ? "RETAIL" : "PROJECT"}
            userId={dealData.userId || authUser.id}
          />
          <EditDealButtonIcon dealInfo={dealData} />
          <DelButtonDeal dealInfo={dealData} />
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
