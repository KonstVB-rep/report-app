"use client";
import React from "react";
import { useGetRetailById } from "../hooks/query";
import { useParams } from "next/navigation";
import {
  DealTypeLabels,
  DeliveryRetailLabels,
  DirectionRetailLabels,
} from "../lib/constants";
import NotFoundDeal from "./NotFoundDeal";
import Loading from "@/app/(dashboard)/deal/[dealType]/[dealId]/loading";
import { formatterCurrency } from "@/shared/lib/utils";
import IntoDealItem from "./IntoDealItem";
import DelDealButtonIcon from "./Modals/DelDealButtonIcon";
import EditDealButtonIcon from "./Modals/EditDealButtonIcon";

const RetailItemInfo = () => {
  const { dealId } = useParams();

  const { data: deal, isLoading } = useGetRetailById(dealId as string, false);

  console.log(deal, "deal");

  if (isLoading) {
    return <Loading />;
  }
  if (!deal) {
    return <NotFoundDeal />;
  }

  return (
    <section className="grid p-4">
      <div className="flex justify-end gap-2">
        <EditDealButtonIcon id={deal.id} type={deal.type} />
        <DelDealButtonIcon id={deal.id} type={deal.type} />
      </div>
      <div className="flex items-start justify-between">
        <div className="grid gap-2">
          <h1 className="text-2xl">Объект: {deal?.nameObject}</h1>
          <p> Дата создания: {deal.createdAt?.toLocaleDateString()}</p>
        </div>
        <div>
          <div className="text-2xl first-letter:capitalize">
            <p>Статус</p>
            <p>{deal.projectStatus}</p>
          </div>
        </div>
      </div>
      <div className="grid-container gap-2 py-2">
        <IntoDealItem title={"Информация о проекте"}>
          <p>Дата запроса: {deal?.dateRequest?.toLocaleDateString()}</p>
          <p>Название сделки: {deal?.nameDeal}</p>
          <p>
            Тип сделки:{" "}
            {DealTypeLabels[deal?.type as keyof typeof DealTypeLabels] ||
              "Нет данных"}
          </p>
        </IntoDealItem>
        <IntoDealItem title={"Детали"}>
          <p>
            Направление:{" "}
            {DirectionRetailLabels[
              deal?.direction as keyof typeof DirectionRetailLabels
            ] || "Нет данных"}
          </p>
          <p>
            Тип поставки:{" "}
            {DeliveryRetailLabels[
              deal?.deliveryType as keyof typeof DeliveryRetailLabels
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
            {formatterCurrency.format(parseFloat(deal.amountCP as string)) ||
              "Нет данных"}{" "}
          </p>
        </IntoDealItem>
        <IntoDealItem title={"Конаткты"}>
          <div>
            <p>Контактное лицо: </p>
            <p className="pl-4"> - {deal.contact || "Нет данных"}</p>
          </div>
          <p>
            Телефон:{" "}
            <span className="whitespace-nowrap">
              {deal.phone || "Нет данных"}
            </span>
          </p>
          <p>Email: {deal.email || "Нет данных"}</p>
          <div>
            <p>Дополнительный контакт: </p>
            <p className="pl-4">{deal.additionalContact || "Нет данных"}</p>
          </div>
        </IntoDealItem>
      </div>
      <IntoDealItem title={"Комментарий"}>
        <p>Комментарии: {deal.comments || "Нет данных"}</p>
      </IntoDealItem>
    </section>
  );
};

export default RetailItemInfo;
