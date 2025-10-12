import { useEffect, useState } from "react"
import { getManagers } from "@/entities/department/lib/utils"
import type { BotFormData, ChatFormData } from "@/entities/tgBot/types"
import type { ActionResponse } from "@/shared/types"

const managers = getManagers(false)

const useChatForm = (
  bot: BotFormData,
  mutateAsync: (data: FormData) => Promise<ActionResponse<ChatFormData>>,
  state: ActionResponse<ChatFormData>,
) => {
  const [selectedUser, setSelectedUser] = useState("")
  const [isActive, setIsActive] = useState(false)

  const actionSubmit = (data: FormData) => {
    const [firtstName, lastName] = managers[selectedUser].split(" ")
    data.append("firstName", firtstName)
    data.append("lastName", lastName)
    data.append("userId", selectedUser)
    data.append("botName", bot.botName)
    data.append("isActive", isActive.toString())
    mutateAsync(data)
  }

  const getFieldError = (fieldName: keyof ChatFormData) => {
    return state?.errors?.properties?.[fieldName]?.errors[0]
  }

  useEffect(() => {
    if (state.success) {
      setSelectedUser("")
    }
  }, [state.success])

  return {
    actionSubmit,
    getFieldError,
    selectedUser,
    setSelectedUser,
    isActive,
    setIsActive,
    managers,
  }
}

export default useChatForm
