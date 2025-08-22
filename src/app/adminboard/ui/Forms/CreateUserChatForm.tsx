"use client";

import React, { useActionState, useEffect } from "react";

import { Input } from "@/shared/components/ui/input";
import SubmitFormButton from "@/shared/custom-components/ui/Buttons/SubmitFormButton";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { TOAST } from "@/shared/custom-components/ui/Toast";
import { ActionResponseChat, ChatFormData, saveChat } from "../../actions/user-chat";
import SelectComponent from "@/shared/custom-components/ui/SelectForm/SelectComponent";
import { getManagers } from "@/entities/department/lib/utils";
import { cn } from "@/shared/lib/utils";
import { getAllBots } from "@/feature/createTelegramChatBot/api";


const initialState: ActionResponseChat = {
  success: false,
  message: "",
};

// userId: string; // ID пользователя в вашей системе
//   botName: string;
//   chatId: string; // ID чата в Telegram
//   telegramUserInfoId: string; // ID информации о Telegram пользователе
//   chatName?: string;


const managers = getManagers(false);

export const CreateUserChatForm = () => {
  const [state, formAction, isPending] = useActionState(saveChat, initialState);

  const getFieldError = (fieldName: keyof ChatFormData) => {
    return state?.errors?.properties?.[fieldName]?.errors[0];;
  };
  
  useEffect(() => {
    if (state.success) {
      TOAST.SUCCESS(state.message);
    }
  }, [state.success, state.message]);

  console.log(state,'state')

  return (
    <Card className="w-full max-w-sm m-auto">
       <CardHeader>
        <CardTitle>Создание бота</CardTitle>
        <CardDescription>Заполните форму для создания бота</CardDescription>
      </CardHeader>
      <CardContent>
      <form action={formAction} className="space-y-6" autoComplete="on">
        <SelectComponent
          placeholder="Выберите пользователя"
          options={[...Object.entries(managers)]}
          name={"userId"}
          required
          defaultValue={state.inputs?.userId}
          aria-describedby="userId"
          className={cn("capitalize",getFieldError("userId") ? "border-red-500" : "")}
        />
        {getFieldError("userId") && (
          <p id="userId" className="text-sm text-red-500">
            {getFieldError("userId")}
          </p>
        )}
        <Input
          name={"botName"}
          placeholder="Название бота..."
          required
          minLength={3}
          defaultValue={state.inputs?.botName}
          aria-describedby="botName"
          className={getFieldError("botName") ? "border-red-500" : ""}
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
          className={getFieldError("telegramUserInfoId") ? "border-red-500" : ""}
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
