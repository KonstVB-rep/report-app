import React from "react";


import { Input } from "@/shared/components/ui/input";
import SubmitFormButton from "@/shared/custom-components/ui/Buttons/SubmitFormButton";
import { ActionResponse } from "@/shared/types";
import { BotFormData } from "@/entities/tgBot/types";


type BotFormProps = {
  state: ActionResponse<BotFormData>;
  isPending: boolean;
  actionSubmit: (data: FormData) => void;
}

const BotForm = ({
  state,
  isPending,
  actionSubmit,
}:BotFormProps) => {
  const getFieldError = (fieldName: keyof BotFormData) => {
    return state?.errors?.properties?.[fieldName]?.errors[0];
  };

  return (
    <form action={actionSubmit} className="space-y-6" autoComplete="on">
      <Input
        name="botName"
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
        name="description"
        placeholder="Описание бота..."
        required
        minLength={5}
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
        name="token"
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
  );
};

export default BotForm;
