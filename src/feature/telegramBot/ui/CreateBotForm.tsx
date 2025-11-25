"use client"

import { useActionState, useEffect } from "react"
import { usePathname } from "next/navigation"
import type { BotFormData } from "@/entities/tgBot/types"
import { TOAST } from "@/shared/custom-components/ui/Toast"
import type { ActionResponse } from "@/shared/types"
import { saveBot } from "../actions/bot"
import WrapperBotForm from "./WrapperBotForm"

const initialState: ActionResponse<BotFormData> = {
  success: false,
  message: "",
}

export const CreateBotForm = () => {
  const [state, formAction, isPending] = useActionState(saveBot, initialState)
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
    <WrapperBotForm
      actionSubmit={actionSubmit}
      description="Заполните форму для создания бота"
      isPending={isPending}
      state={state}
      title="Создание бота"
    />
  )
}
