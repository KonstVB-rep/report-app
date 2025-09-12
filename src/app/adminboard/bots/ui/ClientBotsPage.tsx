"use client";

import { BotWithChats } from "@/entities/tgBot/types";
import BotsList from "@/feature/telegramBot/ui/BotsList";
import SubTitlePage from "@/shared/custom-components/ui/SubTitlePage";
import TitlePage from "@/shared/custom-components/ui/TitlePage";

const ClientBotsPage = ({ initialBots }: { initialBots: BotWithChats[] }) => {
  return (
    <div className="p-5 grid gap-4 overflow-auto max-h-[94vh]">
      <TitlePage title="Список ботов" />
      <SubTitlePage text="Управление ботами и чатами телеграм. Удаление, добавление и редактирование." />
      <BotsList bots={initialBots} />
    </div>
  );
};

export default ClientBotsPage;
