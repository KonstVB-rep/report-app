"use client";
import React, {  useState } from "react";
import { ActionResponse } from "@/shared/types";
import { useQueryClient } from "@tanstack/react-query";
import ChatForm from "./ChatForm";
import { ChatFormData, BotData } from "@/entities/tgBot/types";
import { useCreateChatBot } from "../hooks/mutate";

const initialState: ActionResponse<ChatFormData> = {
  success: false,
  message: "",
};

export const CreateUserChatForm = ({ bot }: { bot: BotData }) => {
  const queryClient = useQueryClient();

  const [state, setState] = useState(initialState);
  const { mutateAsync, isPending } = useCreateChatBot((data: ActionResponse<ChatFormData>) => {
    setState(data);
    queryClient.invalidateQueries({
        queryKey: ["chats", bot.id],
      });
  });


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
