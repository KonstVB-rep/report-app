import React from "react";

import { BotFormData, ChatFormData } from "@/entities/tgBot/types";
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
import SelectComponent from "@/shared/custom-components/ui/SelectForm/SelectComponent";
import { ActionResponse } from "@/shared/types";

import useChatForm from "../hooks/useChatForm";

type ChatFormProps = {
  title: string;
  description: string;
  bot: BotFormData;
  mutateAsync: (data: FormData) => Promise<ActionResponse<ChatFormData>>;
  state: ActionResponse<ChatFormData>;
  isPending: boolean;
};

const ChatForm = ({
  title,
  description,
  bot,
  mutateAsync,
  state,
  isPending,
}: ChatFormProps) => {
  const {
    actionSubmit,
    getFieldError,
    selectedUser,
    setSelectedUser,
    isActive,
    setIsActive,
    managers,
  } = useChatForm(bot, mutateAsync, state);

  return (
    <Card className="w-full max-w-sm m-auto border-none">
      <CardHeader className="!px-2 !pt-4">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="!p-2">
        <form action={actionSubmit} className="space-y-6" autoComplete="on">
          <div className="grid gap-2 p-2">{bot.botName}</div>
          <SelectComponent
            placeholder="Выберите пользователя"
            options={[...Object.entries(managers)]}
            name="userId"
            value={selectedUser}
            onValueChange={setSelectedUser}
            required
            disabled={isPending}
          />

          {/* <SelectComponent
            placeholder="Название бота..."
            options={[...Object.entries(botsMap)]}
            value={selectedBot} 
        onValueChange={setSelectedBot}
            name="botName"
            required
          /> */}

          <Input
            name={"username"}
            placeholder="Ник..."
            required
            minLength={3}
            defaultValue={state.inputs?.username}
            aria-describedby="username"
            className={getFieldError("username") ? "border-red-500" : ""}
            disabled={isPending}
          />

          {getFieldError("username") && (
            <p id="username" className="text-sm text-red-500">
              {getFieldError("username")}
            </p>
          )}

          <Input
            name={"chatId"}
            placeholder="ID чата..."
            required
            minLength={3}
            defaultValue={state.inputs?.chatId}
            aria-describedby="chatId"
            className={getFieldError("chatId") ? "border-red-500" : ""}
            disabled={isPending}
          />

          {getFieldError("chatId") && (
            <p id="chatId" className="text-sm text-red-500">
              {getFieldError("chatId")}
            </p>
          )}

          <Input
            name={"telegramUserInfoId"}
            placeholder="ID информации о Telegram пользователе..."
            required
            minLength={3}
            defaultValue={state.inputs?.telegramUserInfoId}
            aria-describedby="telegramUserInfoId"
            className={
              getFieldError("telegramUserInfoId") ? "border-red-500" : ""
            }
            disabled={isPending}
          />

          {getFieldError("telegramUserInfoId") && (
            <p id="telegramUserInfoId" className="text-sm text-red-500">
              {getFieldError("telegramUserInfoId")}
            </p>
          )}

          <Input
            name={"chatName"}
            placeholder="Имя чата..."
            required
            minLength={3}
            defaultValue={state.inputs?.chatName}
            aria-describedby="chatName"
            className={getFieldError("chatName") ? "border-red-500" : ""}
            disabled={isPending}
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

export default ChatForm;
