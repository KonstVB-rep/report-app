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
import DelDealButtonIcon from "./Modals/DelDealButtonIcon";
import EditDealButtonIcon from "./Modals/EditDealButtonIcon";
import NotFoundDeal from "./NotFoundDeal";
import Loading from "@/app/(dashboard)/deal/[dealType]/[dealId]/loading";
import { formatterCurrency } from "@/shared/lib/utils";
import IntoDealItem from "./IntoDealItem";
import { Separator } from "@/components/ui/separator";
import { Building, ContactRound } from "lucide-react";
// import FileUploadForm from "@/widgets/Files/ui/UploadFile";
// import { Button } from "@/components/ui/button";
// import DownloadFile from "@/widgets/Files/ui/DownLoadFile/DownLoadFile";
// import { useGetInfoYandexDisk } from "@/widgets/Files/hooks/query";
// import { Progress } from "@/components/ui/progress";
// import axiosInstance from "@/shared/api/axiosInstance";
import useRedirectToLoginNotAuthUser from "@/shared/hooks/useRedirectToLoginNotAuthUser";

const ProjectItemInfo = () => {
  useRedirectToLoginNotAuthUser();

  const { dealId } = useParams();

  const { data: deal, isLoading } = useGetProjectById(dealId as string, false);

  // const { data: ydxDiskInfo } = useGetInfoYandexDisk();

  if (isLoading) {
    return <Loading />;
  }

  if (!deal) {
    return <NotFoundDeal />;
  }

  return (
    <section className="grid p-4">
      <div className="flex items-center justify-between pb-4">
        <div>
          <h1 className="text-2xl first-letter:capitalize">проект</h1>
        </div>
        <div className="flex justify-end gap-2">
          <EditDealButtonIcon id={deal.id} type={deal.type} />
          <DelDealButtonIcon id={deal.id} type={deal.type} />
        </div>
      </div>
      <Separator />
      <div className="grid grid-cols-1 gap-2 py-2 lg:grid-cols-[auto_1fr]">
        <div>
          <div className="grid min-w-72 gap-2">
            <p className="text-2xl">Объект</p>
            <div className="flex w-full items-center justify-start gap-4 rounded-md border border-solid p-3">
              <Building size="40" strokeWidth={1} />
              <p>{deal?.nameObject}</p>
            </div>
            <p> Дата создания: {deal.createdAt?.toLocaleDateString()}</p>
          </div>
          <div className="grid gap-2">
            <p className="text-2xl">Контакт</p>
            <div className="grid w-full rounded-md border border-solid p-3">
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
              {formatterCurrency.format(parseFloat(deal.amountCP as string)) ||
                "Нет данных"}{" "}
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
        <p>Комментарии: {deal.comments || "Нет данных"}</p>
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
      {/* <div>
        <p>Яндекс диск</p>
        <Progress
          value={ydxDiskInfo?.usedSpace}
          max={ydxDiskInfo?.totalSpace}
          getValueLabel={() => {
            return `${ydxDiskInfo?.usedSpace}/${ydxDiskInfo?.totalSpace}`;
          }}
        />
      </div>
      <Button
        onClick={async () => {
          // const info = await getResourceInfo('report_app_uploads')
          try {
            const response = await axiosInstance.get("/yandex-disk/download", {
              responseType: "blob",
            });

            // Получение Blob из ответа
            const blob = response.data;

            // Создание временной ссылки для скачивания
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "example.txt"; // Название файла, который будет скачан
            document.body.appendChild(a);

            // Имитируем клик по ссылке для начала скачивания
            a.click();

            // Удаляем ссылку после скачивания
            document.body.removeChild(a);
          } catch (error) {
            console.log(error);
          }
        }}
      >
        META INFO
      </Button>
      <DownloadFile />

      <FileUploadForm
        userId={deal.userId}
        dealId={dealId as string}
        dealType="PROJECT"
      /> */}
    </section>
  );
};

export default ProjectItemInfo;
