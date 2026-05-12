import { useState } from "react"
import dynamic from "next/dynamic"
import SkeletonSheetEquipment from "@/app/dashboard/offer-constructor/lib/SkeletonSheetEquipment"
import { selectSetSelectedKitId } from "@/app/dashboard/offer-constructor/store/localtemsStore"
import { Button } from "@/shared/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/shared/components/ui/sheet"

const SheetEquipmentBody = dynamic(() => import("./SheetEquipmentBody"), {
  ssr: false,
  loading: () => <SkeletonSheetEquipment />,
})

const SheetEquipment = () => {
  const [open, setOpen] = useState(false)

  const hanleToggleOpen = (value: boolean) => {
    setOpen(value)
    selectSetSelectedKitId(null)
  }
  return (
    <Sheet onOpenChange={hanleToggleOpen} open={open}>
      <SheetTrigger asChild>
        <Button variant="outline">Список оборудования</Button>
      </SheetTrigger>
      <SheetContent className="" side="rightXl">
        <SheetHeader>
          <SheetTitle></SheetTitle>
          <SheetDescription></SheetDescription>
        </SheetHeader>
        <div className="grid flex-1 auto-rows-min gap-3 px-4 h-full overflow-y-auto grid-rows-[auto_1fr_auto]">
          <SheetEquipmentBody />
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default SheetEquipment
