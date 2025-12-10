"use client"

import { getAllBots } from "@/entities/tgBot/api"
import { TitlePageBlock } from "@/shared/custom-components/ui/TitlePage"
import BotsTable from "./BotsTable"

const ClientBotsPage = async () => {
  const allBots = await getAllBots()
  return (
    <div className="p-5 grid gap-4 overflow-auto max-h-[94vh]">
      <TitlePageBlock
        infoText="Управление ботами и чатами телеграм. Удаление, добавление и редактирование."
        title="Список ботов"
      />
      <BotsTable bots={allBots} />
    </div>
  )
}

export default ClientBotsPage
