import { RefreshCw } from "lucide-react"
import { Button } from "@/shared/components/ui/button"

const ButtonRefresh = ({ refetch }: { refetch: () => void }) => {
  return (
    <Button
      className="active:scale-95"
      onClick={() => refetch()}
      size="icon"
      title="Обновить"
      variant="outline"
    >
      <RefreshCw />
    </Button>
  )
}

export default ButtonRefresh
