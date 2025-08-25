import { UserTelegramChat } from "@prisma/client";

import React from "react";

import DeleteDialog from "@/shared/custom-components/ui/DeleteDIalog";

import { useDeleteChat } from "../hooks/mutate";

type DeleteChatProps = {
  chat: UserTelegramChat;
};

const DeleteChat = ({ chat }: DeleteChatProps) => {
  const { mutate, isPending } = useDeleteChat();
  
  return (
    <DeleteDialog
      title="Удалить чат"
      description="Вы действительно хотите удалить чат?"
      isPending={isPending}
      mutate={() => mutate(chat.id)}
    >
      <>
        <p className="text-center">Вы уверены что хотите удалить чат?</p>
        <p className="grid text-center">
          <span> Чат: </span>
          <span className="text-lg font-bold capitalize">
            {chat.chatName}
          </span>{" "}
          <span>будет удален безвозвратно</span>
        </p>
      </>
    </DeleteDialog>
  );
};

export default DeleteChat;
