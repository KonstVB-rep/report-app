"use client";
import React from "react";
import { useGetProjectById } from "../hooks";
import { useParams } from "next/navigation";
import {
  DealTypeLabels,
  DeliveryProjectLabels,
  DirectionProjectLabels,
} from "../lib/constants";
import DelDealButtonIcon from "./Modals/DelDealButtonIcon";
import EditDealButtonIcon from "./Modals/EditDealButtonIcon";
import NotFoundDeal from "./NotFoundDeal";
import Loading from "@/app/(dashboard)/deal/[dealType]/[dealId]/loading";
import { formatterCurrency } from "@/shared/lib/utils";

const ProjectItemInfo = () => {
  const { dealId } = useParams();

  const { data: project, isLoading } = useGetProjectById(
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
      <div className="flex justify-end gap-2">
        <EditDealButtonIcon id={project.id} type={project.type} />
        <DelDealButtonIcon id={project.id} type={project.type} />
      </div>
      <div className="grid gap-2">
        <h1 className="text-2xl">Название объекта: {project?.nameObject}</h1>
        <p> Дата создания: {project.createdAt.toLocaleDateString()}</p>
      </div>
      <div className="grid-container gap-2 py-2">
        <div className="rounded-md border overflow-hidden">
          <p className="bg-muted p-4">Клиент</p>
          <div className="p-4">
            <p>Название сделки: {project?.nameDeal}</p>
            <p>
              Тип сделки:{" "}
              {DealTypeLabels[project?.type as keyof typeof DealTypeLabels] ||
                "Нет данных"}
            </p>
            <p>Дата запроса: {project?.dateRequest.toLocaleDateString()}</p>
          </div>
        </div>
        <div className="rounded-md border overflow-hidden">
          <p className="bg-muted p-4">Сфера</p>
          <div className="p-4">
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
        </div>
        <div className="rounded-md border overflow-hidden">
          <p className="bg-muted p-4">Финансы</p>
          <div className="p-4">
            <p>
              Дельта:{" "}
              {formatterCurrency.format(parseFloat(project.delta as string)) ||
                "Нет данных"}
            </p>
            <p>
              Сумма КП:{" "}
              {formatterCurrency.format(
                parseFloat(project.amountCP as string)
              ) || "Нет данных"}{" "}
            </p>
            <p>
              Сумма закупки:{" "}
              {project.amountPurchase
                ? formatterCurrency.format(
                    parseFloat(project.amountPurchase as string)
                  )
                : "Нет данных"}{" "}
            </p>
            <p>
              Сумма работы:{" "}
              {project.amountWork
                ? formatterCurrency.format(
                    parseFloat(project.amountWork as string)
                  )
                : "Нет данных"}{" "}
            </p>
          </div>
        </div>
        <div className="rounded-md border overflow-hidden">
          <p className="bg-muted p-4 capitalize">Контакты</p>
          <div className="p-4">
            <div>
              <p>Контактное лицо: </p>
              <p className="pl-4">{project.contact || "Нет данных"}</p>
            </div>
            <p>
              Телефон:{" "}
              <span className="whitespace-nowrap">
                {project.phone || "Нет данных"}
              </span>
            </p>
            <p>Email: {project.email || "Нет данных"}</p>
            <div>
              <p>Дополнительный контакт:{" "}</p>
              <p className="pl-4">{project.additionalContact || "Нет данных"}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="rounded-md border overflow-hidden">
        <p className="bg-muted p-4 capitalize">Комментарий</p>
        <div className="p-4">
          <p>Комментарии: {project.comments || "Нет данных"}</p>
        </div>
      </div>
    </section>
  );
};

export default ProjectItemInfo;
