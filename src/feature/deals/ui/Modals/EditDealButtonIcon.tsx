import { useState } from "react"
import { DealType } from "@prisma/client"
import { DialogTrigger } from "@radix-ui/react-dialog"
import { FilePenLine } from "lucide-react"
import dynamic from "next/dynamic"
import type { DealUnion } from "@/entities/deal/types"
import { Button } from "@/shared/components/ui/button"
import { Dialog } from "@/shared/components/ui/dialog"
import TooltipComponent from "@/shared/custom-components/ui/TooltipComponent"

const EditProject = dynamic(() => import("./EditProject"), { ssr: false })
const EditRetail = dynamic(() => import("./EditRetail"), { ssr: false })

const EditDealButtonIcon = ({ dealInfo }: { dealInfo: DealUnion }) => {
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)

  switch (dealInfo.type) {
    case DealType.PROJECT:
      return (
        <Dialog onOpenChange={setOpen} open={open}>
          <TooltipComponent content="Редактировать">
            <DialogTrigger asChild onClick={() => setOpen(true)}>
              <Button className="btn_hover" size="icon" variant={"outline"}>
                <FilePenLine />
              </Button>
            </DialogTrigger>
          </TooltipComponent>
          <EditProject
            close={close}
            isInvalidate
            selectedDataItem={dealInfo}
            titleForm="Редактировать сделку"
          />
        </Dialog>
      )
    case DealType.RETAIL:
      return (
        <Dialog onOpenChange={setOpen} open={open}>
          <TooltipComponent content="Редактировать">
            <DialogTrigger asChild onClick={() => setOpen(true)}>
              <Button className="btn_hover" size="icon" variant={"outline"}>
                <FilePenLine />
              </Button>
            </DialogTrigger>
          </TooltipComponent>
          <EditRetail
            close={close}
            isInvalidate
            selectedDataItem={dealInfo}
            titleForm="Редактировать проект"
          />
        </Dialog>
      )
    default:
      return null
  }
}

export default EditDealButtonIcon
