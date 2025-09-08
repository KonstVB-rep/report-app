"use client";

import { useQueryClient } from "@tanstack/react-query";

import React, { useState } from "react";

import { BotData, ChatFormData } from "@/entities/tgBot/types";
import { ActionResponse } from "@/shared/types";

import { useCreateChatBot } from "../hooks/mutate";
import ChatForm from "./ChatForm";

const initialState: ActionResponse<ChatFormData> = {
  success: false,
  message: "",
};

export const CreateUserChatForm = ({ bot }: { bot: BotData }) => {
  const queryClient = useQueryClient();

  const [state, setState] = useState(initialState);
  const { mutateAsync, isPending } = useCreateChatBot(
    (data: ActionResponse<ChatFormData>) => {
      setState(data);
      queryClient.invalidateQueries({
        queryKey: ["chats", bot.id],
      });
    }
  );

  return (
    <ChatForm
      title="Создание чата для бота"
      description="Заполните форму для создания чата для бота"
      bot={bot}
      mutateAsync={mutateAsync}
      state={state}
      isPending={isPending}
    />
  );
};
