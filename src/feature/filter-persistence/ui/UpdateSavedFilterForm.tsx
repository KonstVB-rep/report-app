import { UserFilter } from "@prisma/client";

import React, { useEffect, useState } from "react";

import { useSearchParams } from "next/navigation";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import SubmitFormButton from "@/shared/custom-components/ui/Buttons/SubmitFormButton";

import { useUpdateFilter } from "../hooks/mutate";

const UpdateSavedFilterForm = ({ filter }: { filter: UserFilter }) => {
  const searchParams = useSearchParams();

  const { mutate, isPending } = useUpdateFilter();

  const [filterName, setFilterName] = useState("");
  const [isUpdateParams, setIsUpdateParams] = useState(false);

  useEffect(() => {
    if (filter?.filterName) {
      setFilterName(filter.filterName);
    }
  }, [filter?.filterName]);

  const handleChange = () => {
    setIsUpdateParams(!isUpdateParams);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!filter?.userId) {
      throw new Error("Не найден идентификатор пользователя фильтра");
    }
    mutate({
      data: {
        id: filter.id,
        userId: filter.userId,
        filterName,
        filterValue: isUpdateParams
          ? searchParams.toString()
          : filter.filterValue,
        isActive: false,
      },
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="sr-only">Изменить фильтр</CardTitle>
        <CardDescription className="sr-only">
          Вы можете изменить фильтр.Нажмите кнопку Изменить
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <form className="grid gap-5" onSubmit={handleSubmit}>
          <Label className="grid gap-4">
            <p className="first-letter:uppercase">наименование фильтра</p>
            <Input
              placeholder="Новое название фильтра"
              value={filterName}
              onChange={(e) => setFilterName(e.target.value)}
            />
          </Label>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="params"
              checked={isUpdateParams}
              onCheckedChange={handleChange}
            />
            <label
              htmlFor="params"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Обновить параметры
            </label>
          </div>
          <SubmitFormButton
            title="Обновить"
            disabled={isPending}
            isPending={isPending}
          />
        </form>
      </CardContent>
    </Card>
  );
};

export default UpdateSavedFilterForm;
