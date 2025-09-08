import React from "react";

import { BotFormData } from "@/entities/tgBot/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { ActionResponse } from "@/shared/types";

import BotForm from "./BotForm";

type Props = {
  title: string;
  description: string;
  state: ActionResponse<BotFormData>;
  isPending: boolean;
  actionSubmit: (data: FormData) => void;
};

const WrapperBotForm = ({
  title,
  description,
  state,
  isPending,
  actionSubmit,
}: Props) => {
  return (
    <Card className="w-fit max-w-sm m-auto border-none !p-0">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <BotForm
          state={state}
          isPending={isPending}
          actionSubmit={actionSubmit}
        />
      </CardContent>
    </Card>
  );
};

export default WrapperBotForm;
