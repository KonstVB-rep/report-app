"use client";

import React from "react";

import dynamic from "next/dynamic";
import { useParams } from "next/navigation";

import { Building, ContactRound } from "lucide-react";

import Loading from "@/app/(dashboard)/deal/[dealType]/[dealId]/loading";
import { Separator } from "@/components/ui/separator";
import withAuthGuard from "@/shared/lib/hoc/withAuthGuard";
import { formatterCurrency } from "@/shared/lib/utils";
import FileUploadForm from "@/widgets/Files/ui/UploadFile";

import { useGetProjectById } from "../hooks/query";
import {
  DealTypeLabels,
  DeliveryProjectLabels,
  DirectionProjectLabels,
  StatusProjectLabels,
} from "../lib/constants";
import CardInfo from "./CardInfo";
import ContactCardInDealInfo from "./ContactCardInDealInfo";
import IntoDealItem from "./IntoDealItem";
import DelDealButtonIcon from "./Modals/DelDealButtonIcon";
import EditDealButtonIcon from "./Modals/EditDealButtonIcon";

const FileList = dynamic(() => import("@/widgets/Files/ui/FileList"), {
  ssr: false,
});
const NotFoundDeal = dynamic(() => import("./NotFoundDeal"), { ssr: false });

const ProjectItemInfo = () => {
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
          <div className="grid-rows-auto grid gap-2">
            <div className="grid min-w-72 gap-2">
              <IntoDealItem title={"Объект"}>
                <div className="flex w-full items-start justify-start gap-4 text-lg">
                  <Building size="40" strokeWidth={1} />

                  <p>{deal?.nameObject}</p>
                </div>
              </IntoDealItem>
            </div>
            <div className="grid gap-2">
              <IntoDealItem title={"Основной контакт"}>
                <div className="grid w-full">
                  <div className="flex items-start justify-start gap-4">
                    <ContactRound size="40" strokeWidth={1} />

                    <div className="flex flex-col items-start justify-start text-lg">
                      <CardInfo data={deal.contact} title="Имя" />

                      <CardInfo
                        data={deal.phone}
                        title="Телефон"
                        type="phone"
                      />

                      <CardInfo data={deal.email} title="Email" type="email" />
                    </div>
                  </div>
                </div>
              </IntoDealItem>
            </div>
          </div>
          <div className="grid-rows-auto grid gap-2">
            <div className="flex flex-wrap gap-2">
              <IntoDealItem
                title={"Информация о сделке"}
                className="flex-item-contact"
              >
                <p>
                  <span className="text-sm first-letter:capitalize">
                    Название сделки:{" "}
                  </span>{" "}
                  {deal?.nameDeal}
                </p>

                <p>
                  <span className="text-sm first-letter:capitalize">
                    Тип сделки:{" "}
                  </span>
                  {DealTypeLabels[deal?.type as keyof typeof DealTypeLabels] ||
                    "Нет данных"}
                </p>

                <p>Дата запроса: {deal?.dateRequest?.toLocaleDateString()}</p>
              </IntoDealItem>

              <IntoDealItem title={"Детали"} className="flex-item-contact">
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

              <IntoDealItem title={"Финансы"} className="flex-item-contact">
                <p>
                  Дельта:{" "}
                  <span className="whitespace-nowrap">
                    {deal.delta
                      ? formatterCurrency.format(
                          parseFloat(deal.delta as string)
                        )
                      : "Нет данных"}
                  </span>
                </p>

                <p>
                  Сумма КП:{" "}
                  <span className="whitespace-nowrap">
                    {deal.amountCP
                      ? formatterCurrency.format(
                          parseFloat(deal.amountCP as string)
                        )
                      : "Нет данных"}
                  </span>
                </p>

                <p>
                  Сумма закупки:{" "}
                  <span className="whitespace-nowrap">
                    {deal.amountPurchase
                      ? formatterCurrency.format(
                          parseFloat(deal.amountPurchase as string)
                        )
                      : "Нет данных"}
                  </span>
                </p>

                <p>
                  Сумма работы:{" "}
                  <span className="whitespace-nowrap">
                    {deal.amountWork
                      ? formatterCurrency.format(
                          parseFloat(deal.amountWork as string)
                        )
                      : "Нет данных"}{" "}
                  </span>
                </p>
              </IntoDealItem>
            </div>

            <IntoDealItem
              title={"Дополнительные контакты"}
              className="flex flex-col"
            >
              {deal.additionalContacts && deal.additionalContacts.length > 0 ? (
                <div className="flex h-full flex-wrap gap-2">
                  {deal.additionalContacts.map((contact) => (
                    <ContactCardInDealInfo key={contact.id} contact={contact} />
                  ))}
                </div>
              ) : (
                <p>Нет данных</p>
              )}
            </IntoDealItem>
          </div>
        </div>
        <IntoDealItem title={"Комментарии"}>
          <p className="first-letter:capitalize">
            {deal.comments || "Нет данных"}
          </p>
        </IntoDealItem>

        <IntoDealItem title={"Статус"}>
          <div className="text-xl first-letter:capitalize">
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

export default withAuthGuard(ProjectItemInfo);
