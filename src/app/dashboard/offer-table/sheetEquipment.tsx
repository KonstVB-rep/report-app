import { Button } from "@/shared/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/shared/components/ui/sheet"
import { LoaderCircle } from "@/shared/custom-components/ui/Loaders"
import dynamic from "next/dynamic"

const SheetEquipmentBody = dynamic(() => import("./components/SheetEquipmentBody"), {
  ssr: false,
  loading: () => <LoaderCircle />,
})

const SheetEquipment = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Список оборудования</Button>
      </SheetTrigger>
      <SheetContent side="rightXl" className="">
        <SheetHeader>
          <SheetTitle>Выбрать оборудование</SheetTitle>
          <SheetDescription></SheetDescription>
        </SheetHeader>
        <div className="grid flex-1 auto-rows-min gap-3 px-4 h-full">
          <SheetEquipmentBody />
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default SheetEquipment
