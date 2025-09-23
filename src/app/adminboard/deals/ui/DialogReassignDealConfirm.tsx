"use client";

import React from "react";

import { DeletingDealsListItem } from "@/entities/deal/types";
import { getManagers } from "@/entities/department/lib/utils";
import { useReassignDeal } from "@/feature/deals/api/hooks/mutate";
import { Button } from "@/shared/components/ui/button";
import { DialogClose } from "@/shared/components/ui/dialog";
import SubmitFormButton from "@/shared/custom-components/ui/Buttons/SubmitFormButton";
import DialogComponent from "@/shared/custom-components/ui/DialogComponent";
import SelectComponent from "@/shared/custom-components/ui/SelectForm/SelectComponent";

const managers = getManagers(true);

const DialogReassignDealConfirm = ({
  deals,
}: {
  deals: DeletingDealsListItem[];
}) => {
  const { mutate, isPending } = useReassignDeal();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const userId = formData.get("userId") as string;

    const data = {
      dealIds: deals.map((deal) => ({
        id: deal.id,
        type: deal.type,
      })),
      newManagerId: userId,
    };

    mutate(data);
  };
  return (
    <DialogComponent
      dialogTitle="Передать сделки другому менеджеру"
      classNameContent="sm:max-w-[400px]"
      trigger={<Button variant="outline">Переназначить</Button>}
    >
      <form className="grid gap-4 py-4" onSubmit={handleSubmit} id="form">
        <p className="text-center">
          Вы точно уверены что хотите перназначить клиентов?
        </p>
        <p className="rounded-xl bg-muted px-4 py-2 text-center text-xl font-bold break-all max-h-60 overflow-y-auto">
          Выбрано: {deals.length} шт.
        </p>
        <SelectComponent
          placeholder="Выберите пользователя"
          options={[...Object.entries(managers)]}
          name="userId"
          required
          disabled={isPending}
        />
        <div className="grid grid-cols-2 gap-2">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Отменить
            </Button>
          </DialogClose>
          <SubmitFormButton
            type="submit"
            isPending={isPending}
            title="Передать"
          />
        </div>
      </form>
    </DialogComponent>
  );
};

export default DialogReassignDealConfirm;
