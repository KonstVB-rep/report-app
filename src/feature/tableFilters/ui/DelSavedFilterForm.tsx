import React from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import SubmitFormButton from "@/shared/ui/Buttons/SubmitFormButton";

import { useDeleteFilter } from "../hooks/mutate";

const DelSavedFilterForm = ({
  filterName,
  filterId,
}: {
  filterName: string;
  filterId: string;
}) => {
  const { mutate, isPending } = useDeleteFilter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate(filterId);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="sr-only">Удалить фильтр</CardTitle>
        <CardDescription className="sr-only">
          Вы можете удалить фильтр.Нажмите кнопку Удалить
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <form action="" className="grid gap-5" onSubmit={handleSubmit}>
          <div className="flex flex-col items-center justify-center space-y-1">
            <p>Вы уверены что хотите удалить фильтр?</p>
            <p className="text-xl font-bold">{filterName}</p>
          </div>
          <SubmitFormButton
            title="Удалить"
            disabled={isPending}
            isPending={isPending}
          />
        </form>
      </CardContent>
    </Card>
  );
};

export default DelSavedFilterForm;
