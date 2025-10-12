import React from "react"
import dynamic from "next/dynamic"
import type { DeletingDealsListItem } from "@/entities/deal/types"
import DelDealSkeleton from "@/entities/deal/ui/Skeletons/DelDealSkeleton"
import WrapperFormDeleteDialog from "@/shared/custom-components/ui/WrapperFormDeleteDialog"

const DelDealListForm = dynamic(() => import("../Forms/DelDealListForm"), {
  ssr: false,
  loading: () => <DelDealSkeleton />,
})

const DelButtonMultiDeals = ({
  deals,
  isTextButton = true,
}: {
  deals: DeletingDealsListItem[]
  isTextButton?: boolean
}) => {
  const [open, setOpen] = React.useState(false)

  return (
    <WrapperFormDeleteDialog isTextButton={isTextButton} open={open} setOpen={setOpen}>
      <DelDealListForm close={() => setOpen(false)} deals={deals} />
    </WrapperFormDeleteDialog>
  )
}

export default DelButtonMultiDeals
