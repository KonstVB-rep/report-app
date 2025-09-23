"use client";

import { BotWithChats } from "@/entities/tgBot/types";
import BotsList from "@/feature/telegramBot/ui/BotsList";
import { TitlePageBlock } from "@/shared/custom-components/ui/TitlePage";

import BotsTable from "./BotsTable";

const ClientBotsPage = ({ initialBots }: { initialBots: BotWithChats[] }) => {
  return (
    <div className="p-5 grid gap-4 overflow-auto max-h-[94vh]">
      <TitlePageBlock
        title="Список ботов"
        infoText="Управление ботами и чатами телеграм. Удаление, добавление и редактирование."
      />
      {/* <BotsList bots={initialBots} /> */}
      <BotsTable bots={initialBots} />
    </div>
  );
};

export default ClientBotsPage;
