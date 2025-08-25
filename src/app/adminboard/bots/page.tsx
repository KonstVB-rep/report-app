import { getAllBots, getAllChatsBot } from '@/feature/createTelegramChatBot/api';
import React from 'react'
import BotsList from '../ui/Bot/ui/BotsList';
import ChatsList from '../ui/ChatsBot/ui/ChatsList';


const BotsPage = async () => {
  try {
    const [allBots, allChats] = await Promise.all([
      getAllBots(),
      getAllChatsBot()
    ]);

    return (
      <div className="p-5 flex flex-wrap gap-5">
         <BotsList bots={allBots} />
         <ChatsList chats={allChats} bots={allBots}/>
      </div>
    );
  } catch (error) {
    console.error("Ошибка загрузки данных:", error);
    return <div>Ошибка загрузки данных</div>;
  }
};

export default BotsPage