"use client";

import { UserTelegramChat } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";

import React, { useState } from "react";

import { ChatFormData } from "@/entities/tgBot/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Switch } from "@/shared/components/ui/switch";
import SubmitFormButton from "@/shared/custom-components/ui/Buttons/SubmitFormButton";
import { ActionResponse } from "@/shared/types";

import { useUpdateChatBot } from "../hooks/mutate";

const initialState: ActionResponse<UserTelegramChat> = {
  success: false,
  message: "",
};

export const UpdateUserChatForm = ({ chat }: { chat: UserTelegramChat }) => {
  const queryClient = useQueryClient();

  const [state, setState] = useState(initialState);
  const { mutateAsync, isPending } = useUpdateChatBot(
    (data: ActionResponse<UserTelegramChat>) => {
      setState(data);
      queryClient.invalidateQueries({
        queryKey: ["chats", chat.botId],
      });
    }
  );

  const [isActive, setIsActive] = useState(false);

  const actionSubmit = (data: FormData) => {
    data.append("botId", chat.botId.toString());
    data.append("chatId", chat.chatId.toString());
    data.append("isActive", isActive.toString());
    mutateAsync(data);
  };

  const getFieldError = (
    fieldName: keyof Pick<ChatFormData, "chatName" | "isActive">
  ) => {
    return state?.errors?.properties?.[fieldName]?.errors[0];
  };

  const title = "Изменение чата";
  const description = "Заполните форму для изменения чата";

  return (
    <Card className="w-full max-w-sm m-auto border-none">
      <CardHeader className="px-2! pt-4!">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="p-2!">
        <form action={actionSubmit} className="space-y-6" autoComplete="on">
          <Input
            name={"chatName"}
            placeholder="Имя чата..."
            required
            minLength={3}
            defaultValue={state.inputs?.chatName}
            aria-describedby="chatName"
            className={getFieldError("chatName") ? "border-red-500" : ""}
          />

          {getFieldError("chatName") && (
            <p id="chatName" className="text-sm text-red-500">
              {getFieldError("chatName")}
            </p>
          )}

          <div className="flex items-center space-x-2">
            <Switch
              id="isActive-chat"
              value={isActive ? "true" : "false"}
              onCheckedChange={setIsActive}
            />
            <Label htmlFor="isActive-chat">
              {isActive ? "Активен" : "Не активен"}
            </Label>
          </div>

          <SubmitFormButton
            title="Сохранить"
            isPending={isPending}
            className="ml-auto mr-2 w-max"
          />
        </form>
      </CardContent>
    </Card>
  );
};
