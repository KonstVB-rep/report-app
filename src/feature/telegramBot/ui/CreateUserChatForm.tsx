"use client"

import { useState } from "react"
import { useQueryClient } from "@tanstack/react-query"
import type { BotData, ChatFormData } from "@/entities/tgBot/types"
import type { ActionResponse } from "@/shared/types"
import { useCreateChatBot } from "../hooks/mutate"
import ChatForm from "./ChatForm"

const initialState: ActionResponse<ChatFormData> = {
  success: false,
  message: "",
}

export const CreateUserChatForm = ({ bot }: { bot: BotData }) => {
  const queryClient = useQueryClient()

  const [state, setState] = useState(initialState)
  const { mutateAsync, isPending } = useCreateChatBot((data: ActionResponse<ChatFormData>) => {
    setState(data)
    queryClient.invalidateQueries({
      queryKey: ["chats", bot.id],
    })
  })

  return (
    <ChatForm
      bot={bot}
      description="Заполните форму для создания чата для бота"
      isPending={isPending}
      mutateAsync={mutateAsync}
      state={state}
      title="Создание чата для бота"
    />
  )
}
