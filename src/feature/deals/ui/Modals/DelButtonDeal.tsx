import React from "react"
import { PermissionEnum } from "@prisma/client"
import dynamic from "next/dynamic"
import type { DealUnion } from "@/entities/deal/types"
import DelDealSkeleton from "@/entities/deal/ui/Skeletons/DelDealSkeleton"
import ProtectedByPermissions from "@/shared/custom-components/ui/Protect/ProtectedByPermissions"
import WrapperFormDeleteDialog from "@/shared/custom-components/ui/WrapperFormDeleteDialog"

const DelDealForm = dynamic(() => import("../Forms/DelDealForm"), {
  ssr: false,
  loading: () => <DelDealSkeleton />,
})

const DelButtonDeal = ({
  dealInfo,
  isTextButton = false,
  clearData,
  withCheckPermissions = true,
}: {
  dealInfo: DealUnion
  isTextButton?: boolean
  clearData?: () => void
  withCheckPermissions?: boolean
}) => {
  return (
    <>
      {withCheckPermissions ? (
        <ProtectedByPermissions permission={PermissionEnum.DEAL_MANAGEMENT}>
          <DelButton clearData={clearData} dealInfo={dealInfo} isTextButton={isTextButton} />
        </ProtectedByPermissions>
      ) : (
        <DelButton clearData={clearData} dealInfo={dealInfo} isTextButton={isTextButton} />
      )}
    </>
  )
}

export default DelButtonDeal

const DelButton = ({
  dealInfo,
  isTextButton = false,
  clearData,
}: {
  dealInfo: DealUnion
  isTextButton?: boolean
  clearData?: () => void
}) => {
  const [open, setOpen] = React.useState(false)

  return (
    <WrapperFormDeleteDialog isTextButton={isTextButton} open={open} setOpen={setOpen}>
      <DelDealForm
        close={() => {
          clearData?.()
          setOpen(false)
        }}
        dealInfo={dealInfo}
      />
    </WrapperFormDeleteDialog>
  )
}
