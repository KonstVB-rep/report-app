import React from "react";

import { getAllBots, getAllChatsBot } from "@/feature/createTelegramChatBot/api";

import { CreateUserChatForm } from "./CreateUserChatForm";
import ChatsList from "./ChatsList";

const WrapperChats = async () => {
  const allBots = await getAllBots();
  const allChats = await getAllChatsBot();

  return (
    <>
      <ChatsList chats={allChats}  />
    </>
  );
};

export default WrapperChats;
