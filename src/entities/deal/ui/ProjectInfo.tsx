"use client";

import React from "react";

import dynamic from "next/dynamic";
import { useParams } from "next/navigation";

import { Building, Info } from "lucide-react";

import Loading from "@/app/(dashboard)/deal/[dealType]/[dealId]/loading";
import { Separator } from "@/components/ui/separator";
import withAuthGuard from "@/shared/lib/hoc/withAuthGuard";
import { formatterCurrency } from "@/shared/lib/utils";
import TooltipComponent from "@/shared/ui/TooltipComponent";
import FileUploadForm from "@/widgets/Files/ui/UploadFile";

import { useGetProjectById } from "../hooks/query";
import {
  DealTypeLabels,
  DeliveryProjectLabels,
  DirectionProjectLabels,
  StatusProjectLabels,
} from "../lib/constants";
import CardMainContact from "./CardMainContact";
import ContactCardInDealInfo from "./ContactCardInDealInfo";
import IntoDealItem from "./IntoDealItem";
import DelDealButtonIcon from "./Modals/DelDealButtonIcon";
import EditDealButtonIcon from "./Modals/EditDealButtonIcon";
import RowInfoDealProp from "./RowInfoDealProp";

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
            <div className="grid min-w-72 gap-4">
              <IntoDealItem title={"Объект"}>
                <div className="grid w-full gap-2">
                  <div className="flex w-full items-start justify-start gap-4 text-lg">
                    <Building
                      size="40"
                      strokeWidth={1}
                      className="icon-deal_info"
                    />

                    <p className="text-md prop-deal-value h-10 px-2 flex-1 zinc-400 dark:text-color-black font-semibold">
                      {deal?.nameObject}
                    </p>
                  </div>

                  <div className="first-letter:capitalize">
                    <div className="flex flex-col items-start gap-2 justify-start">
                      <p className="flex items-center justify-start gap-4">
                        <Info
                          size="40"
                          strokeWidth={1}
                          className="icon-deal_info"
                        />

                        <TooltipComponent content="Статус сделки">
                          <span className="text-md prop-deal-value h-10 px-2 flex-1 zinc-400 dark:text-color-black font-semibold">
                            {StatusProjectLabels[
                              deal?.dealStatus as keyof typeof StatusProjectLabels
                            ] || "Нет данных"}
                          </span>
                        </TooltipComponent>
                      </p>
                    </div>
                  </div>
                </div>
              </IntoDealItem>
            </div>

            <div className="grid gap-2">
              <IntoDealItem title={"Основной контакт"}>
                <CardMainContact
                  contact={deal.contact}
                  phone={deal.phone}
                  email={deal.email}
                />
              </IntoDealItem>
            </div>
          </div>

          <div className="grid-rows-auto grid gap-2">
            <div className="flex flex-wrap gap-2">
              <IntoDealItem
                title={"Информация о сделке"}
                className="flex-item-contact"
              >
                <RowInfoDealProp
                  label="Название сделки:"
                  value={deal?.nameDeal}
                  direction="column"
                />

                <RowInfoDealProp
                  label="Тип сделки:"
                  value={
                    DealTypeLabels[deal?.type as keyof typeof DealTypeLabels] ||
                    "Нет данных"
                  }
                  direction="column"
                />

                <RowInfoDealProp
                  label="Дата запроса:"
                  value={deal?.dateRequest?.toLocaleDateString()}
                  direction="column"
                />
              </IntoDealItem>

              <IntoDealItem title={"Детали"} className="flex-item-contact">
                <RowInfoDealProp
                  label="Направление:"
                  value={
                    DirectionProjectLabels[
                      deal?.direction as keyof typeof DirectionProjectLabels
                    ] || "Нет данных"
                  }
                />

                <RowInfoDealProp
                  label="Тип поставки:"
                  value={
                    DeliveryProjectLabels[
                      deal?.deliveryType as keyof typeof DeliveryProjectLabels
                    ] || "Нет данных"
                  }
                />
              </IntoDealItem>

              <IntoDealItem title={"Финансы"} className="flex-item-contact">
                <RowInfoDealProp
                  label="Дельта:"
                  value={
                    deal.delta
                      ? formatterCurrency.format(
                          parseFloat(deal.delta as string)
                        )
                      : "Нет данных"
                  }
                />

                <RowInfoDealProp
                  label="Сумма КП:"
                  value={
                    deal.amountCP
                      ? formatterCurrency.format(
                          parseFloat(deal.amountCP as string)
                        )
                      : "Нет данных"
                  }
                />

                <RowInfoDealProp
                  label="Сумма закупки:"
                  value={
                    deal.amountPurchase
                      ? formatterCurrency.format(
                          parseFloat(deal.amountPurchase as string)
                        )
                      : "Нет данных"
                  }
                />

                <RowInfoDealProp
                  label="Сумма работ:"
                  value={
                    deal.amountWork
                      ? formatterCurrency.format(
                          parseFloat(deal.amountWork as string)
                        )
                      : "Нет данных"
                  }
                />
              </IntoDealItem>
            </div>

            {deal.additionalContacts && deal.additionalContacts.length > 0 ? (
              <IntoDealItem title={"Дополнительные контакты"}>
                <div className="flex h-full flex-wrap gap-2">
                  {deal.additionalContacts.map((contact) => (
                    <ContactCardInDealInfo key={contact.id} contact={contact} />
                  ))}
                </div>
              </IntoDealItem>
            ) : null}
          </div>
        </div>

        <IntoDealItem title={"Комментарии"}>
          <p className="first-letter:capitalize">
            {deal.comments || "Нет данных"}
          </p>
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

ProjectItemInfo.displayName = "ProjectItemInfo";
