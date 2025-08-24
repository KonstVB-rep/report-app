"use client";

import { TelegramBot } from "@prisma/client";

import React, { useActionState, useEffect } from "react";

import { usePathname } from "next/navigation";

import { ChatFormData, saveChat } from "@/app/adminboard/actions/user-chat";
import { getManagers } from "@/entities/department/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import SubmitFormButton from "@/shared/custom-components/ui/Buttons/SubmitFormButton";
import SelectComponent from "@/shared/custom-components/ui/SelectForm/SelectComponent";
import { TOAST } from "@/shared/custom-components/ui/Toast";
import { cn } from "@/shared/lib/utils";
import { ActionResponse } from "@/shared/types";

const initialState: ActionResponse<ChatFormData> = {
  success: false,
  message: "",
};

const managers = getManagers(false);

export const CreateUserChatForm = ({ bots }: { bots: TelegramBot[] }) => {
  const [state, formAction, isPending] = useActionState(saveChat, initialState);
  const pathname = usePathname();

  const getFieldError = (fieldName: keyof ChatFormData) => {
    return state?.errors?.properties?.[fieldName]?.errors[0];
  };

  const botsMap = bots.reduce<Record<string, string>>((acc, bot) => {
    acc[bot.botName] = bot.botName;
    return acc;
  }, {});

  const actionSubmit = (data: FormData) => {
    data.append("pathname", pathname);
    formAction(data);
  };

  useEffect(() => {
    if (state.success) {
      TOAST.SUCCESS(state.message);
    }
  }, [state.success, state.message]);

  return (
    <Card className="w-full max-w-sm m-auto">
      <CardHeader>
        <CardTitle>Создание чата для бота</CardTitle>
        <CardDescription>Заполните форму для создания чата для бота</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={actionSubmit} className="space-y-6" autoComplete="on">
          <SelectComponent
            placeholder="Выберите пользователя"
            options={[...Object.entries(managers)]}
            name={"userId"}
            required
            defaultValue={state.inputs?.userId}
            aria-describedby="userId"
            className={cn(
              "capitalize",
              getFieldError("userId") ? "border-red-500" : ""
            )}
          />

          {getFieldError("userId") && (
            <p id="userId" className="text-sm text-red-500">
              {getFieldError("userId")}
            </p>
          )}

          <SelectComponent
            placeholder="Название бота..."
            options={[...Object.entries(botsMap)]}
            name={"botName"}
            required
            defaultValue={state.inputs?.userId}
            aria-describedby="botName"
            className={cn(getFieldError("botName") ? "border-red-500" : "")}
          />

          {getFieldError("botName") && (
            <p id="botName" className="text-sm text-red-500">
              {getFieldError("botName")}
            </p>
          )}

          <Input
            name={"chatId"}
            placeholder="ID чата..."
            required
            minLength={3}
            defaultValue={state.inputs?.botName}
            aria-describedby="chatId"
            className={getFieldError("chatId") ? "border-red-500" : ""}
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
            defaultValue={state.inputs?.botName}
            aria-describedby="telegramUserInfoId"
            className={
              getFieldError("telegramUserInfoId") ? "border-red-500" : ""
            }
          />

          {getFieldError("telegramUserInfoId") && (
            <p id="telegramUserInfoId" className="text-sm text-red-500">
              {getFieldError("telegramUserInfoId")}
            </p>
          )}

          <Input
            name={"chatName"}
            placeholder="Название чата..."
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
