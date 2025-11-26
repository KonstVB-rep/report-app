import { Info } from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import SubTitlePage from "../SubTitlePage"
import TooltipComponent from "../TooltipComponent"

export const TitlePage = ({ title }: { title: string }) => {
  return <h1 className="text-lg font-bold text-center uppercase">{title}</h1>
}

export const TitlePageBlock = ({
  title,
  subTitle,
  infoText,
}: {
  title: string
  subTitle?: string
  infoText: string
}) => {
  return (
    <div className="py-1 dark:bg-black/50 bg-black/10 rounded relative min-h-9">
      <TitlePage title={title} />
      {subTitle && <SubTitlePage text={subTitle} />}
      <TooltipComponent content={infoText}>
        <Button className="absolute rounded-md top-0 left-0" size="icon" variant="ghost">
          <Info size="20" />
        </Button>
      </TooltipComponent>
    </div>
  )
}
