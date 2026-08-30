import React from "react"
import dynamic from "next/dynamic"
import type { DealType } from "@/entities/deal/types"
import DelDealSkeleton from "@/entities/deal/ui/Skeletons/DelDealSkeleton"
import ProtectedByPermissions from "@/shared/custom-components/ui/Protect/ProtectedByPermissions"
import WrapperFormDeleteDialog from "@/shared/custom-components/ui/WrapperFormDeleteDialog"
import { PERMISSIONS } from "@/shared/lib/constants"

const DelDealForm = dynamic(() => import("../Forms/DelDealForm"), {
  ssr: false,
  loading: () => <DelDealSkeleton />,
})

const DelButtonDeal = ({
  id,
  type,
  isTextButton = false,
  clearData,
  withCheckPermissions = true,
}: {
  id: string
  type: DealType
  isTextButton?: boolean
  clearData?: () => void
  withCheckPermissions?: boolean
}) => {
  return (
    <>
      {withCheckPermissions ? (
        <ProtectedByPermissions permission={PERMISSIONS.DEAL_DELETE}>
          <DelButton clearData={clearData} id={id} isTextButton={isTextButton} type={type} />
        </ProtectedByPermissions>
      ) : (
        <DelButton clearData={clearData} id={id} isTextButton={isTextButton} type={type} />
      )}
    </>
  )
}

export default DelButtonDeal

const DelButton = ({
  id,
  type,
  isTextButton = false,
  clearData,
}: {
  id: string
  type: DealType
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
        id={id}
        type={type}
      />
    </WrapperFormDeleteDialog>
  )
}
