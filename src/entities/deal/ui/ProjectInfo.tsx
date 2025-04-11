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
import { BookUser, Building, ContactRound } from "lucide-react";
import dynamic from "next/dynamic";
import FileUploadForm from "@/widgets/Files/ui/UploadFile";
import IntoDealItem from "./IntoDealItem";
import DelDealButtonIcon from "./Modals/DelDealButtonIcon";
import EditDealButtonIcon from "./Modals/EditDealButtonIcon";
import withAuthGuard from "@/shared/lib/hoc/withAuthGuard";
import CardInfo from "./CardInfo";

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
          <div className="grid gap-2 grid-rows-2">
            <div className="grid min-w-72 gap-2">
              <IntoDealItem title={"Объект"}>
                <div className="flex w-full items-center justify-start gap-4 text-lg">
                  <Building size="40" strokeWidth={1} />

                  <p>{deal?.nameObject}</p>
                </div>
              </IntoDealItem>
            </div>
            <div className="grid gap-2">
              <IntoDealItem title={"Основной контакт"}>
                <div className="grid w-full">
                  <div className="flex items-center justify-start gap-4">
                    <ContactRound size="40" strokeWidth={1} />

                    <div className="flex flex-col items-start justify-start text-lg">
                      <CardInfo data={deal.contact} title="Имя" />

                      <CardInfo data={deal.phone} title="Телефон" />

                      <CardInfo data={deal.email} title="Email" />
                    </div>
                  </div>
                </div>
              </IntoDealItem>
            </div>
          </div>
          <div className="grid gap-2 grid-rows-2">
            <div className="flex flex-wrap gap-2">
              <IntoDealItem title={"Информация о сделке"} className="flex-item-contact">
                <p>Название сделки: {deal?.nameDeal}</p>

                <p>
                  Тип сделки:{" "}
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

            <IntoDealItem title={"Дополнительные контакты"}>
              {deal.additionalContacts && deal.additionalContacts.length > 0 ? (
                <div className="flex gap-2 divide-x-2 divide-solid divide-muted">
                  {deal.additionalContacts.map((contact) => (
                    <div key={contact.id} className="grid">
                      <div className="flex items-start justify-start gap-4 p-2">
                        <BookUser 
                          size="32"
                          strokeWidth={1}
                          className="flex-shrink-0 pt-1"
                        />

                        <div className="text-md flex flex-col items-start justify-start">
                          <CardInfo data={contact.name} title="Имя" />

                          <CardInfo data={contact.phone} title="Телефон" />

                          <CardInfo data={contact.email} title="Email" />

                          <CardInfo data={contact.position} title="Должность" />
                        </div>
                      </div>
                      {/* {index !== deal.additionalContacts!.length - 1 && (
                        <Separator className="my-2" />
                      )} */}
                    </div>
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

export default withAuthGuard(ProjectItemInfo);
