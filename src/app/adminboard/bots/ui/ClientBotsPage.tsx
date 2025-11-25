"use client"

import type { BotWithChats } from "@/entities/tgBot/types"
import { TitlePageBlock } from "@/shared/custom-components/ui/TitlePage"
import BotsTable from "./BotsTable"

const ClientBotsPage = ({ initialBots }: { initialBots: BotWithChats[] }) => {
  return (
    <div className="p-5 grid gap-4 overflow-auto max-h-[94vh]">
      <TitlePageBlock
        infoText="Управление ботами и чатами телеграм. Удаление, добавление и редактирование."
        title="Список ботов"
      />
      <BotsTable bots={initialBots} />
    </div>
  )
}

export default ClientBotsPage
