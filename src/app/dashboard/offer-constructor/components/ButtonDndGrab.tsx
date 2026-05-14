import { GripVertical } from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import type { DragHandleProps } from "../lib/types"

const ButtonDndGrab = ({ dragHandleProps }: { dragHandleProps: DragHandleProps }) => {
  return (
    <Button
      className="absolute top-4 -left-10 cursor-grab active:cursor-grabbing p-1 text-muted-foreground hover:bg-muted rounded"
      size="icon"
      title="Перетащить"
      type="button"
      variant="ghost"
      {...dragHandleProps.attributes} // Распаковываем атрибуты
      {...dragHandleProps.listeners}
    >
      <GripVertical size={20} />
    </Button>
  )
}

export default ButtonDndGrab
