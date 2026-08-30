import { connection } from "next/server"
import { getAllBots } from "@/entities/tgBot/api"
import { TitlePageBlock } from "@/shared/custom-components/ui/TitlePage"
import BotsTable from "./BotsTable"

export const instant = false

const ClientBotsPage = async () => {
  await connection()

  const allBots = await getAllBots()

  return (
    <div className="p-5 grid gap-4 overflow-auto max-h-[94vh]">
      <TitlePageBlock
        infoText="Управление ботами и чатами телеграм. Удаление, добавление и редактирование."
        title="Список ботов"
      />
      {allBots.length > 0 ? (
        <BotsTable bots={allBots} />
      ) : (
        <div className="grid place-items-center h-64 text-muted-foreground">
          <p className="text-lg">Ботов пока нет</p>
        </div>
      )}
    </div>
  )
}

export default ClientBotsPage
