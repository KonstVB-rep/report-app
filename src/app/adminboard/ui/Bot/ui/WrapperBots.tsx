import React from "react";

import { getAllBots } from "@/feature/createTelegramChatBot/api";

import BotsList from "./BotsList";

const WrapperBots = async () => {
  const allBots = await getAllBots();

  return (
    <>
      <BotsList bots={allBots} />
    </>
  );
};

export default WrapperBots;
