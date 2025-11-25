import type { BotFormData } from "@/entities/tgBot/types"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card"
import type { ActionResponse } from "@/shared/types"
import BotForm from "./BotForm"

type Props = {
  title: string
  description: string
  state: ActionResponse<BotFormData>
  isPending: boolean
  actionSubmit: (data: FormData) => void
}

const WrapperBotForm = ({ title, description, state, isPending, actionSubmit }: Props) => {
  return (
    <Card className="w-fit max-w-sm m-auto border-none p-0!">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <BotForm actionSubmit={actionSubmit} isPending={isPending} state={state} />
      </CardContent>
    </Card>
  )
}

export default WrapperBotForm
