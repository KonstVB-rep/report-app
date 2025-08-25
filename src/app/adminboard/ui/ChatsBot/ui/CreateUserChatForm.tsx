"use client";

import { TelegramBot } from "@prisma/client";

import React, { useEffect, useState } from "react";

import { usePathname } from "next/navigation";

import { ChatFormData } from "@/app/adminboard/actions/user-chat";
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
import { ActionResponse } from "@/shared/types";
import { useCreateChatBot } from "@/feature/telegramChatBot/hooks/mutate";

const initialState: ActionResponse<ChatFormData> = {
  success: false,
  message: "",
};

const managers = getManagers(false);

export const CreateUserChatForm = ({ bots }: { bots: TelegramBot[] }) => {
  // const [state, formAction, isPending] = useActionState(saveChat, initialState);
  const [state, setState] = useState(initialState);
  const pathname = usePathname();
  const { mutateAsync, isPending } = useCreateChatBot((data: ActionResponse<ChatFormData>) => {
    setState(data);
  });


  const [resetKey, setResetKey] = useState(0);

  const getFieldError = (fieldName: keyof ChatFormData) => {
    return state?.errors?.properties?.[fieldName]?.errors[0];
  };

  const botsMap = bots.reduce<Record<string, string>>((acc, bot) => {
    acc[bot.botName] = bot.botName;
    return acc;
  }, {});

  const actionSubmit = (data: FormData) => {
    data.append("pathname", pathname);
    mutateAsync(data);
  };

  useEffect(() => {
    if (state.success) {
      setResetKey((prev) => prev + 1);
    }
  }, [state]);


  return (
    <Card className="w-full max-w-sm m-auto border-none">
      <CardHeader className="!px-2 !pt-4">
        <CardTitle>Создание чата для бота</CardTitle>
        <CardDescription>
          Заполните форму для создания чата для бота
        </CardDescription>
      </CardHeader>
      <CardContent className="!p-2">
        <form
          action={actionSubmit}
          className="space-y-6"
          autoComplete="on"
        >
          <SelectComponent
            key={`user-${resetKey}`}
            placeholder="Выберите пользователя"
            options={[...Object.entries(managers)]}
            name="userId"
            required
          />

          <SelectComponent
            key={`bot-${resetKey}`}
            placeholder="Название бота..."
            options={[...Object.entries(botsMap)]}
            name="botName"
            required
          />

          <Input
            name={"username"}
            placeholder="Ник..."
            required
            minLength={3}
            defaultValue={state.inputs?.username}
            aria-describedby="username"
            className={getFieldError("username") ? "border-red-500" : ""}
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
