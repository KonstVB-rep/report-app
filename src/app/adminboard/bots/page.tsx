import React from "react";

import { getAllBots, getAllChatsBot } from "@/feature/telegramChatBot/api";

import BotsList from "../ui/Bot/ui/BotsList";
import ChatsList from "../ui/ChatsBot/ui/ChatsList";

const BotsPage = async () => {
  try {
    const [allBots, allChats] = await Promise.all([
      getAllBots(),
      getAllChatsBot(),
    ]);

    return (
      <div className="p-5 grid [grid-template-columns:repeat(auto-fill,minmax(340px,1fr))] gap-4 overflow-auto max-h-[94vh]">
        <BotsList bots={allBots} />
        <ChatsList chats={allChats} bots={allBots} />
      </div>
    );
  } catch (error) {
    console.error("Ошибка загрузки данных:", error);
    return <div>Ошибка загрузки данных</div>;
  }
};

export default BotsPage;
