import { useActionState, useEffect } from "react"
import { SquarePen } from "lucide-react"
import { usePathname } from "next/navigation"
import type { BotFormData } from "@/entities/tgBot/types"
import EditDataDialog from "@/shared/custom-components/ui/EditDialog"
import { TOAST } from "@/shared/custom-components/ui/Toast"
import { updateBot } from "../actions/bot"
import WrapperBotForm from "./WrapperBotForm"

const DialogEditBot = ({ bot }: { bot: BotFormData }) => {
  const [state, formAction, isPending] = useActionState(updateBot, {
    success: false,
    message: "",
    inputs: bot,
  })
  const pathname = usePathname()

  useEffect(() => {
    if (state.success) {
      TOAST.SUCCESS(state.message)
    }
  }, [state.success, state.message])

  const actionSubmit = (data: FormData) => {
    data.append("pathname", pathname)
    formAction(data)
  }
  return (
    <EditDataDialog icon={<SquarePen size={40} />} title="Редактировать">
      <WrapperBotForm
        actionSubmit={actionSubmit}
        description="Заполните форму для создания бота"
        isPending={isPending}
        state={state}
        title="Редактировать"
      />
    </EditDataDialog>
  )
}

export default DialogEditBot
