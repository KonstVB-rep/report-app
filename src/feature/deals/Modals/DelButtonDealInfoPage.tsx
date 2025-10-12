import React from "react"
import { type DealType, PermissionEnum } from "@prisma/client"
import { Trash2 } from "lucide-react"
import dynamic from "next/dynamic"
import { useRouter } from "next/navigation"
import DelDealSkeleton from "@/entities/deal/ui/Skeletons/DelDealSkeleton"
import { Button } from "@/shared/components/ui/button"
import DialogComponent from "@/shared/custom-components/ui/DialogComponent"
import ProtectedByPermissions from "@/shared/custom-components/ui/Protect/ProtectedByPermissions"

const DelDealForm = dynamic(() => import("../ui/Forms/DelDealForm"), {
  ssr: false,
  loading: () => <DelDealSkeleton />,
})

const DelButtonDeal = ({ id, type }: { id: string; type: DealType }) => {
  const router = useRouter()
  const [open, setOpen] = React.useState(false)

  return (
    <ProtectedByPermissions permission={PermissionEnum.DEAL_MANAGEMENT}>
      <DialogComponent
        classNameContent="sm:max-w-[400px]"
        contentTooltip="Удалить"
        dialogTitle="Удалить данные"
        onOpenChange={setOpen}
        open={open}
        trigger={
          <Button size="icon" variant={"destructive"}>
            <Trash2 />
          </Button>
        }
      >
        <DelDealForm
          close={() => {
            setOpen(false)
            router.back()
          }}
          id={id}
          type={type}
        />
      </DialogComponent>
    </ProtectedByPermissions>
  )
}

export default DelButtonDeal
