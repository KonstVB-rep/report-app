"use client";

import React, { useActionState, useEffect } from "react";

import { usePathname } from "next/navigation";
import { TOAST } from "@/shared/custom-components/ui/Toast";
import { ActionResponse } from "@/shared/types";


import WrapperBotForm from "./WrapperBotForm";
import { BotFormData } from "@/entities/tgBot/types";
import { saveBot } from "../actions/bot";

const initialState: ActionResponse<BotFormData> = {
  success: false,
  message: "",
};

export const CreateBotForm = () => {
  const [state, formAction, isPending] = useActionState(saveBot, initialState);
  const pathname = usePathname();

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
    <WrapperBotForm
      title="Создание бота"
      description="Заполните форму для создания бота"
      state={state}
      isPending={isPending}
      actionSubmit={actionSubmit}
    />
  );
};
