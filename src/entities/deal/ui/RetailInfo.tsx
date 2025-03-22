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
import Loading from "@/app/(dashboard)/summary-table/[dealType]/[userId]/loading";

const RetailItemInfo = () => {
  const { dealId } = useParams();

  const { data: project, isLoading } = useGetRetailById(
    dealId as string,
    false
  );

  if (isLoading) {
    return <Loading />;
  }
  if (!project) {
    return <NotFoundDeal />;
  }

  return (
    <section className="grid p-4">
      <div className="grid gap-2">
        <h1 className="text-2xl">Название объекта: {project?.nameObject}</h1>
        <p> Дата создания: {project.createdAt.toLocaleDateString()}</p>
      </div>
      <div className="grid-container gap-2 py-2">
        <div className="border p-4 rounded-md">
          <p>Дата запроса: {project?.dateRequest.toLocaleDateString()}</p>
          <p>Название сделки: {project?.nameDeal}</p>
          <p>
            Тип сделки:{" "}
            {DealTypeLabels[project?.type as keyof typeof DealTypeLabels] ||
              "Нет данных"}
          </p>
        </div>
        <div className="border p-4 rounded-md">
          <p>
            Направление:{" "}
            {DirectionProjectLabels[
              project?.direction as keyof typeof DirectionProjectLabels
            ] || "Нет данных"}
          </p>
          <p>
            Тип поставки:{" "}
            {DeliveryProjectLabels[
              project?.deliveryType as keyof typeof DeliveryProjectLabels
            ] || "Нет данных"}
          </p>
        </div>
        <div className="border p-4 rounded-md">
          <p>Дельта: {project.delta || "Нет данных"}</p>
          <p>Сумма КП: {project.amountCP || "Нет данных"} </p>
        </div>
        <div className="border p-4 rounded-md">
          <p>Контакт: {project.contact || "Нет данных"}</p>
          <p>Телефон: {project.phone || "Нет данных"}</p>
          <p>Email: {project.email || "Нет данных"}</p>
          <p>
            Дополнительный контакт: {project.additionalContact || "Нет данных"}
          </p>
        </div>
      </div>
      <div className="border p-4 rounded-md">
        <p>Комментарии: {project.comments || "Нет данных"}</p>
      </div>
    </section>
  );
};

export default RetailItemInfo;
