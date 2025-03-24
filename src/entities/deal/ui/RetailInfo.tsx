"use client";
import React from "react";
import { useGetRetailById } from "../hooks";
import { useParams } from "next/navigation";
import {
  DealTypeLabels,
  DeliveryProjectLabels,
  DirectionProjectLabels,
} from "../lib/constants";
import NotFoundDeal from "./NotFoundDeal";
import Loading from "@/app/(dashboard)/deal/[dealType]/[dealId]/loading";
import { formatterCurrency } from "@/shared/lib/utils";

const RetailItemInfo = () => {
  const { dealId } = useParams();

  const { data: retail, isLoading } = useGetRetailById(dealId as string, false);

  if (isLoading) {
    return <Loading />;
  }
  if (!retail) {
    return <NotFoundDeal />;
  }

  return (
    <section className="grid p-4">
      <div className="grid gap-2">
        <h1 className="text-2xl">Название объекта: {retail?.nameObject}</h1>
        <p> Дата создания: {retail.createdAt.toLocaleDateString()}</p>
      </div>
      <div className="grid-container gap-2 py-2">
        <div className="rounded-md border p-4">
          <p>Дата запроса: {retail?.dateRequest.toLocaleDateString()}</p>
          <p>Название сделки: {retail?.nameDeal}</p>
          <p>
            Тип сделки:{" "}
            {DealTypeLabels[retail?.type as keyof typeof DealTypeLabels] ||
              "Нет данных"}
          </p>
        </div>
        <div className="rounded-md border p-4">
          <p>
            Направление:{" "}
            {DirectionProjectLabels[
              retail?.direction as keyof typeof DirectionProjectLabels
            ] || "Нет данных"}
          </p>
          <p>
            Тип поставки:{" "}
            {DeliveryProjectLabels[
              retail?.deliveryType as keyof typeof DeliveryProjectLabels
            ] || "Нет данных"}
          </p>
        </div>
        <div className="rounded-md border p-4">
          <p>
            Дельта:{" "}
            {formatterCurrency.format(parseFloat(retail.delta as string)) ||
              "Нет данных"}
          </p>
          <p>
            Сумма КП:{" "}
            {formatterCurrency.format(parseFloat(retail.amountCP as string)) ||
              "Нет данных"}{" "}
          </p>
        </div>
        <div className="rounded-md border p-4">
          <p>Контакт: {retail.contact || "Нет данных"}</p>
          <p>Телефон: <span className="whitespace-nowrap">{retail.phone || "Нет данных"}</span></p>
          <p>Email: {retail.email || "Нет данных"}</p>
          <p>
            Дополнительный контакт: {retail.additionalContact || "Нет данных"}
          </p>
        </div>
      </div>
      <div className="rounded-md border p-4">
        <p>Комментарии: {retail.comments || "Нет данных"}</p>
      </div>
    </section>
  );
};

export default RetailItemInfo;
