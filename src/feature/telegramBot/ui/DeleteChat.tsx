import { UserTelegramChat } from "@prisma/client";

import React from "react";

import DeleteDialog from "@/shared/custom-components/ui/DeleteDIalog";

import { useDeleteChat } from "../hooks/mutate";

type DeleteChatProps = {
  data: { chat: UserTelegramChat; botName: string };
  textButtonShow?: boolean;
};

const DeleteChat = ({ data, textButtonShow }: DeleteChatProps) => {
  const { mutate, isPending } = useDeleteChat();
  const { chat, botName } = data;

  if (!chat) {
    return null;
  }

  return (
    <DeleteDialog
      title="Удалить чат"
      description="Вы действительно хотите удалить чат?"
      isPending={isPending}
      mutate={() => mutate({ chatId: chat.chatId, botName })}
      textButtonShow={textButtonShow}
    >
      <>
        <p className="text-center">Вы уверены что хотите удалить чат?</p>
        <p className="grid text-center">
          <span> Чат: </span>
          <span className="text-lg font-bold capitalize break-all">
            {chat.chatName}
          </span>{" "}
          <span>будет удален безвозвратно</span>
        </p>
      </>
    </DeleteDialog>
  );
};

export default DeleteChat;
