import { useState } from "react"
import useStoreUser from "@/entities/user/store/useStoreUser"
import { useToggleSudscribeChatBot } from "@/feature/telegramBot/hooks/mutate"
import { TOAST } from "@/shared/custom-components/ui/Toast"
import { useGetInfoChat } from "../../calendar/hooks/query"
import { sendNotify } from "../actions/send-notify"

const useChatBot = (botName: string) => {
  const { authUser } = useStoreUser()
  const [isFetch, setIsFetch] = useState(false)

  const { data: bot, isFetching, refetch } = useGetInfoChat(botName)
  const isFetchingRequest = isFetching || isFetch

  const { mutate: updateStatusChatBot } = useToggleSudscribeChatBot()
  const isActiveBot = bot ? bot.isActive : false

  const openTelegramLink = (botName: string, userId: string, chatName?: string) => {
    const startCommand = `${userId}-${botName}-${chatName ?? "default"}`
    const encodedCommand = btoa(startCommand)
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "")
    const url = `https://t.me/${botName}?start=${encodedCommand}`
    window.open(url, "_blank")
  }

  const handleChange = async () => {
    if (!authUser || !bot) return

    try {
      setIsFetch(true)

      // Если чата нет — открываем ссылку на Telegram
      if (!bot.chatId) {
        openTelegramLink(bot.botName, authUser.id)
        return
      }

      // Если чат есть и бот ещё не активен — подписываем на уведомления
      if (!isActiveBot && bot.id && bot.chatId) {
        updateStatusChatBot({
          botId: bot.id,
          chatId: String(bot.chatId),
          isActive: true,
        })
        await sendNotify(
          `Вы успешно подписались на уведомления - ${bot.description}`,
          bot.chatId,
          bot.botName,
        )
      }
    } catch (error) {
      console.error("Ошибка при изменении статуса бота:", error)
      TOAST.ERROR("Не удалось изменить статус бота.")
    } finally {
      setIsFetch(false)
      refetch()
    }
  }

  return { isFetchingRequest, isActiveBot, handleChange }
}

export default useChatBot
