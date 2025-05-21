"use client";

import { Separator } from "@radix-ui/react-separator";

import React from "react";

import dynamic from "next/dynamic";
import { useParams } from "next/navigation";

import { Building, Info } from "lucide-react";

import Loading from "@/app/(dashboard)/deal/[departmentId]/[dealType]/[dealId]/loading";
import withAuthGuard from "@/shared/lib/hoc/withAuthGuard";
import { formatterCurrency } from "@/shared/lib/utils";
import MotionDivY from "@/shared/ui/MotionComponents/MotionDivY";
import TooltipComponent from "@/shared/ui/TooltipComponent";
import FileUploadForm from "@/widgets/Files/ui/UploadFile";

import { useGetRetailById } from "../hooks/query";
import {
  DealTypeLabels,
  DeliveryRetailLabels,
  DirectionRetailLabels,
  StatusRetailLabels,
} from "../lib/constants";
import RowInfoDealProp from "./RowInfoDealProp";

const FileList = dynamic(() => import("@/widgets/Files/ui/FileList"), {
  ssr: false,
});
const NotFoundDeal = dynamic(() => import("./NotFoundDeal"), { ssr: false });
const CardMainContact = dynamic(() => import("./CardMainContact"), {
  ssr: false,
});
const ContactCardInDealInfo = dynamic(() => import("./ContactCardInDealInfo"), {
  ssr: false,
});
const IntoDealItem = dynamic(() => import("./IntoDealItem"), { ssr: false });
const DelButtonDealInfoPage = dynamic(
  () => import("./Modals/DelButtonDealInfoPage"),
  {
    ssr: false,
  }
);
const EditDealButtonIcon = dynamic(
  () => import("./Modals/EditDealButtonIcon"),
  { ssr: false }
);

const RetailItemInfo = () => {
  const { dealId } = useParams();
  const { data: deal, isLoading } = useGetRetailById(dealId as string, false);

  const dealInfo = {
    nameDeal: deal?.nameDeal,
    nameObject: deal?.nameObject,
    status:
      StatusRetailLabels[deal?.dealStatus as keyof typeof StatusRetailLabels] ||
      "Нет данных",
    dealType: DealTypeLabels[deal?.type as keyof typeof DealTypeLabels],
    dateRequest: deal?.dateRequest?.toLocaleDateString(),
    direction:
      DirectionRetailLabels[
        deal?.direction as keyof typeof DirectionRetailLabels
      ],
    deliveryType:
      DeliveryRetailLabels[
        deal?.deliveryType as keyof typeof DeliveryRetailLabels
      ],
    delta: deal?.delta ? formatterCurrency.format(+deal.delta) : "0,00",
    amountCP: deal?.amountCP
      ? formatterCurrency.format(+deal.amountCP)
      : "0,00",
    comments: deal?.comments || "Нет данных",
  };

  if (isLoading) {
    return <Loading />;
  }

  if (!deal) {
    return <NotFoundDeal />;
  }

  return (
    <MotionDivY className="grid gap-2 p-4">
      <div className="flex items-center justify-between rounded-md bg-muted p-2 pb-2">
        <div className="grid gap-1">
          <h1 className="text-2xl first-letter:capitalize">Розница</h1>
          <p className="text-xs">
            Дата: {deal.createdAt?.toLocaleDateString()}
          </p>
        </div>

        <div className="flex justify-end gap-2">
          <FileUploadForm
            userId={deal.userId}
            dealId={dealId as string}
            dealType="RETAIL"
          />
          <EditDealButtonIcon id={deal.id} type={deal.type} />
          <DelButtonDealInfoPage id={deal.id} type={deal.type} />
        </div>
      </div>

      <Separator />

      <div className="grid grid-cols-1 gap-2 py-2 lg:grid-cols-[auto_1fr]">
        <div className="grid-rows-auto grid gap-2">
          <div className="grid min-w-72 gap-4">
            <IntoDealItem title={"Объект"}>
              <div className="flex w-full items-center justify-start gap-4 text-lg">
                <Building
                  size="40"
                  strokeWidth={1}
                  className="icon-deal_info"
                />
                <p className="text-md prop-deal-value h-10 px-2 flex-1 bg-stone-300 dark:bg-black font-semibold">
                  {dealInfo.nameObject}
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
                      <span className="text-md prop-deal-value h-10 px-2 flex-1 bg-stone-300 dark:bg-black font-semibold">
                        {dealInfo.status}
                      </span>
                    </TooltipComponent>
                  </p>
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
                value={dealInfo?.nameDeal}
                direction="column"
              />
              <RowInfoDealProp
                label="Тип сделки:"
                value={dealInfo.dealType}
                direction="column"
              />
              <RowInfoDealProp
                label="Дата запроса:"
                value={dealInfo.dateRequest}
                direction="column"
              />
            </IntoDealItem>

            <IntoDealItem title={"Детали"} className="flex-item-contact">
              <RowInfoDealProp
                label="Направление:"
                value={dealInfo.direction}
                direction="column"
              />
              <RowInfoDealProp
                label="Тип поставки:"
                value={dealInfo.deliveryType}
                direction="column"
              />
            </IntoDealItem>

            <IntoDealItem title={"Финансы"} className="flex-item-contact">
              <RowInfoDealProp
                label="Дельта:"
                value={dealInfo.delta}
                direction="column"
              />
              <RowInfoDealProp
                label="Сумма КП:"
                value={dealInfo.amountCP}
                direction="column"
              />
            </IntoDealItem>
          </div>

          {deal.additionalContacts?.length > 0 && (
            <IntoDealItem title={"Дополнительные контакты"}>
              <div className="flex h-full flex-wrap gap-2">
                {deal.additionalContacts.map((contact) => (
                  <ContactCardInDealInfo key={contact.id} contact={contact} />
                ))}
              </div>
            </IntoDealItem>
          )}
        </div>
      </div>

      <IntoDealItem title={"Комментарии"}>
        <p className="first-letter:capitalize">{dealInfo.comments}</p>
      </IntoDealItem>

      <FileList
        data={{
          userId: deal?.userId,
          dealId: deal?.id,
          dealType: deal?.type,
        }}
      />
    </MotionDivY>
  );
};

export default withAuthGuard(RetailItemInfo);
