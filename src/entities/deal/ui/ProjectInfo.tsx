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

const ProjectItemInfo = () => {
  const { dealId } = useParams();

  const { data: project, isLoading } = useGetProjectById(dealId as string, false);

  if (isLoading) {
    return <div>Загрузка...</div>;
  }

  if (!project) {
    return (
        <NotFoundDeal/>
    );
  }

  return (
    <section className="grid p-4">
      <div className="flex gap-2 justify-end">
        {/* <TooltipComponent content="Редактировать">
          <Button size="icon" variant={"outline"}>
            <FilePenLine />
          </Button>
        </TooltipComponent> */}
        {/* <TooltipComponent content="Удалить">
          <Button size="icon" variant={"destructive"}>
            <Trash2 />
          </Button>
        </TooltipComponent> */}
        <EditDealButtonIcon id={project.id} type={project.type} />
        <DelDealButtonIcon id={project.id} type={project.type} />

      </div>
      <div className="grid gap-2">
        <h1 className="text-2xl">Название сделки: {project?.nameDeal}</h1>
        <h2 className="text-2xl">Название объекта: {project?.nameObject}</h2>
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
          <p>
            Сумма закупки:{" "}
            {project.amountPurchase
              ? (project.amountPurchase as string)
              : "Нет данных"}{" "}
          </p>
          <p>
            Сумма работы:{" "}
            {project.amountWork ? (project.amountWork as string) : "Нет данных"}{" "}
          </p>
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

export default ProjectItemInfo;

{
  /* <DelDeal
close={() => setOpenModal(null)}
id={(rowData as Project | Retail).id}
type={(rowData as Project | Retail).type}
/> */
}
