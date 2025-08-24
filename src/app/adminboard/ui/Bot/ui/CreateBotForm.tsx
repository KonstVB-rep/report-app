"use client";

import React, { useActionState, useEffect } from "react";

import { usePathname } from "next/navigation";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import SubmitFormButton from "@/shared/custom-components/ui/Buttons/SubmitFormButton";
import { TOAST } from "@/shared/custom-components/ui/Toast";
import { ActionResponse } from "@/shared/types";

import { BotFormData, saveBot } from "../../../actions/bot";

const initialState: ActionResponse<BotFormData> = {
  success: false,
  message: "",
};

export const CreateBotForm = () => {
  const [state, formAction, isPending] = useActionState(saveBot, initialState);
  const pathname = usePathname();

  const getFieldError = (fieldName: keyof BotFormData) => {
    return state?.errors?.properties?.[fieldName]?.errors[0];
  };

  useEffect(() => {
    if (state.success) {
      TOAST.SUCCESS(state.message);
    }
  }, [state.success, state.message]);

  const actionSubmit = (data: FormData) => {
    data.append("pathname", pathname);
    formAction(data);
  };

  return (
    <Card className="w-full max-w-sm m-auto border-none">
      <CardHeader>
        <CardTitle>Создание бота</CardTitle>
        <CardDescription>Заполните форму для создания бота</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={actionSubmit} className="space-y-6" autoComplete="on">
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
            name={"description"}
            placeholder="Описание бота..."
            required
            minLength={3}
            defaultValue={state.inputs?.description}
            aria-describedby="description"
            className={getFieldError("description") ? "border-red-500" : ""}
          />

          {getFieldError("description") && (
            <p id="description" className="text-sm text-red-500">
              {getFieldError("description")}
            </p>
          )}

          <Input
            name={"token"}
            placeholder="Токен..."
            required
            minLength={10}
            defaultValue={state.inputs?.token}
            aria-describedby="token"
            className={getFieldError("token") ? "border-red-500" : ""}
          />

          {getFieldError("token") && (
            <p id="token" className="text-sm text-red-500">
              {getFieldError("token")}
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
