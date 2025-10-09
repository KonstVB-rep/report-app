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

const initialResponse: ActionResponse<UserTelegramChat> = {
  success: false,
  message: "",
};

export const UpdateUserChatForm = ({ chat }: { chat: UserTelegramChat }) => {
  const queryClient = useQueryClient();

  const [chatName, setChatName] = useState(chat.chatName);
  const [isActive, setIsActive] = useState(chat.isActive);
  const [response, setResponse] =
    useState<ActionResponse<UserTelegramChat>>(initialResponse);

  const { mutateAsync, isPending } = useUpdateChatBot((data) => {
    setResponse(data);
    queryClient.invalidateQueries({ queryKey: ["chats", chat.botId] });
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("botId", chat.botId);
    formData.append("chatId", chat.chatId);
    formData.append("chatName", chatName);
    formData.append("isActive", String(isActive));

    await mutateAsync(formData);
  };

  // --- Получение ошибки для поля ---
  const getFieldError = (
    fieldName: keyof Pick<ChatFormData, "chatName" | "isActive">
  ) => response?.errors?.properties?.[fieldName]?.errors?.[0];

  return (
    <Card className="w-full max-w-sm m-auto border-none p-4">
      <CardHeader className="px-2 pt-4">
        <CardTitle>Изменение чата</CardTitle>
        <CardDescription>Заполните форму для изменения чата</CardDescription>
      </CardHeader>

      <CardContent className="p-2">
        <form onSubmit={handleSubmit} className="space-y-6" autoComplete="on">
          <div>
            <Input
              name="chatName"
              placeholder="Имя чата..."
              required
              minLength={3}
              value={chatName}
              onChange={(e) => setChatName(e.target.value)}
              aria-describedby="chatName"
              className={getFieldError("chatName") ? "border-red-500" : ""}
            />

            {getFieldError("chatName") && (
              <p id="chatName" className="text-sm text-red-500 mt-1">
                {getFieldError("chatName")}
              </p>
            )}
          </div>

          {/* === Переключатель активности === */}
          <div className="flex items-center space-x-2">
            <Switch
              id="isActive-chat"
              checked={isActive}
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

          {response.message && (
            <p
              className={`text-sm ${
                response.success ? "text-green-600" : "text-red-600"
              }`}
            >
              {response.message}
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  );
};
