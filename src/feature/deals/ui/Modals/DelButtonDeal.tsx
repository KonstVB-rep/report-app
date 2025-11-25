import React from "react"
import { type DealType, PermissionEnum } from "@prisma/client"
import dynamic from "next/dynamic"
import { useRouter } from "next/navigation"
import DelDealSkeleton from "@/entities/deal/ui/Skeletons/DelDealSkeleton"
import ProtectedByPermissions from "@/shared/custom-components/ui/Protect/ProtectedByPermissions"
import WrapperFormDeleteDialog from "@/shared/custom-components/ui/WrapperFormDeleteDialog"

const DelDealForm = dynamic(() => import("../Forms/DelDealForm"), {
  ssr: false,
  loading: () => <DelDealSkeleton />,
})

const DelButtonDeal = ({
  id,
  type,
  isTextButton = false,
}: {
  id: string
  type: DealType
  isTextButton?: boolean
}) => {
  const router = useRouter()
  const [open, setOpen] = React.useState(false)

  return (
    <ProtectedByPermissions permission={PermissionEnum.DEAL_MANAGEMENT}>
      <WrapperFormDeleteDialog isTextButton={isTextButton} open={open} setOpen={setOpen}>
        <DelDealForm
          close={() => {
            setOpen(false)
            router.back()
          }}
          id={id}
          type={type}
        />
      </WrapperFormDeleteDialog>
    </ProtectedByPermissions>
  )
}

export default DelButtonDeal
