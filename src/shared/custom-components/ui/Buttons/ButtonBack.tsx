import { ArrowBigLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/shared/components/ui/button"
import { cn } from "@/shared/lib/utils"

const ButtonBack = ({ className }: { className?: string }) => {
  const router = useRouter()
  return (
    <Button className={cn("w-fit", className)} onClick={() => router.back()} variant="outline">
      <ArrowBigLeft />
      Назад
    </Button>
  )
}

export default ButtonBack
