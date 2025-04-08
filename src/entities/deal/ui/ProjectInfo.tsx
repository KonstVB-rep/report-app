"use client";
import React from "react";
import { useGetProjectById } from "../hooks/query";
import { useParams } from "next/navigation";
import {
  DealTypeLabels,
  DeliveryProjectLabels,
  DirectionProjectLabels,
  StatusProjectLabels,
} from "../lib/constants";
import Loading from "@/app/(dashboard)/deal/[dealType]/[dealId]/loading";
import { formatterCurrency } from "@/shared/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Building, ContactRound } from "lucide-react";
import useRedirectToLoginNotAuthUser from "@/shared/hooks/useRedirectToLoginNotAuthUser";

import dynamic from "next/dynamic";
import FileUploadForm from "@/widgets/Files/ui/UploadFile";
import IntoDealItem from "./IntoDealItem";
import DelDealButtonIcon from "./Modals/DelDealButtonIcon";
import EditDealButtonIcon from "./Modals/EditDealButtonIcon";

const FileList = dynamic(() => import("@/widgets/Files/ui/FileList"), {
  ssr: false,
});
const NotFoundDeal = dynamic(() => import("./NotFoundDeal"), { ssr: false });

const ProjectItemInfo = () => {
  useRedirectToLoginNotAuthUser();

  const { dealId } = useParams();

  const { data: deal, isLoading } = useGetProjectById(dealId as string, false);

  if (isLoading) {
    return <Loading />;
  }

  if (!deal) {
    return <NotFoundDeal />;
  }

  return (
    <section className="grid gap-2 p-4">
      <div className="flex items-center justify-between rounded-md bg-muted p-2 pb-2">
        <div className="grid gap-1">
          <h1 className="text-2xl first-letter:capitalize">проект</h1>

          <p className="text-xs">
            {" "}
            Дата: {deal.createdAt?.toLocaleDateString()}
          </p>
        </div>

        <div className="flex justify-end gap-2">
          <FileUploadForm
            userId={deal.userId}
            dealId={dealId as string}
            dealType="PROJECT"
          />

          <EditDealButtonIcon id={deal.id} type={deal.type} />

          <DelDealButtonIcon id={deal.id} type={deal.type} />
        </div>
      </div>

      <Separator />

      <div className="grid gap-2">
        <div className="grid grid-cols-1 gap-2 py-2 lg:grid-cols-[auto_1fr]">
          <div className="grid gap-4">
            <div className="grid min-w-72 gap-2">
              <IntoDealItem title={"Объект"}>
                <div className="flex w-full items-center justify-start gap-4">
                  <Building size="40" strokeWidth={1} />

                  <p>{deal?.nameObject}</p>
                </div>
              </IntoDealItem>
            </div>
            <div className="grid gap-2">
              <IntoDealItem title={"Контакт"}>
                <div className="grid w-full">
                  <div className="flex items-center justify-start gap-4">
                    <ContactRound size="40" strokeWidth={1} />

                    <div className="flex flex-col items-start justify-start">
                      <p>{deal.contact || "Нет данных"}</p>

                      <p className="whitespace-nowrap">
                        {deal.phone || "Нет данных"}
                      </p>
                    </div>
                  </div>

                  <Separator className="my-2" />

                  <div className="flex flex-col items-start justify-start text-sm">
                    <p>Дополнительный контакт: </p>

                    <p>{deal.additionalContact || "Нет данных"}</p>
                  </div>
                </div>
              </IntoDealItem>
            </div>
          </div>
          <div className="grid-container gap-2">
            <IntoDealItem title={"Информация о сделке"}>
              <p>Название сделки: {deal?.nameDeal}</p>

              <p>
                Тип сделки:{" "}
                {DealTypeLabels[deal?.type as keyof typeof DealTypeLabels] ||
                  "Нет данных"}
              </p>

              <p>Дата запроса: {deal?.dateRequest?.toLocaleDateString()}</p>
            </IntoDealItem>

            <IntoDealItem title={"Детали"}>
              <p>
                Направление:{" "}
                {DirectionProjectLabels[
                  deal?.direction as keyof typeof DirectionProjectLabels
                ] || "Нет данных"}
              </p>

              <p>
                Тип поставки:{" "}
                {DeliveryProjectLabels[
                  deal?.deliveryType as keyof typeof DeliveryProjectLabels
                ] || "Нет данных"}
              </p>
            </IntoDealItem>

            <IntoDealItem title={"Финансы"}>
              <p>
                Дельта:{" "}
                {formatterCurrency.format(parseFloat(deal.delta as string)) ||
                  "Нет данных"}
              </p>

              <p>
                Сумма КП:{" "}
                {formatterCurrency.format(
                  parseFloat(deal.amountCP as string)
                ) || "Нет данных"}{" "}
              </p>

              <p>
                Сумма закупки:{" "}
                {deal.amountPurchase
                  ? formatterCurrency.format(
                      parseFloat(deal.amountPurchase as string)
                    )
                  : "Нет данных"}{" "}
              </p>

              <p>
                Сумма работы:{" "}
                {deal.amountWork
                  ? formatterCurrency.format(
                      parseFloat(deal.amountWork as string)
                    )
                  : "Нет данных"}{" "}
              </p>
            </IntoDealItem>
          </div>
        </div>
        <IntoDealItem title={"Комментарии"}>
          <p className="first-letter:capitalize">
            {deal.comments || "Нет данных"}
          </p>
        </IntoDealItem>

        <IntoDealItem title={"Статус"}>
          <div className="text-2xl first-letter:capitalize">
            <p>
              {StatusProjectLabels[
                deal?.dealStatus as keyof typeof StatusProjectLabels
              ] || "Нет данных"}
            </p>
          </div>
        </IntoDealItem>
      </div>

      <FileList
        data={
          deal && {
            userId: deal?.userId,
            dealId: deal?.id,
            dealType: deal?.type,
          }
        }
      />
    </section>
  );
};

export default ProjectItemInfo;
