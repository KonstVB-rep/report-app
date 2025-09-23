"use client";

import dynamic from "next/dynamic";

import { Building, Info } from "lucide-react";
import z from "zod";

import Loading from "@/app/dashboard/deal/[departmentId]/[dealType]/[dealId]/loading";
import IntoDealItem from "@/entities/deal/ui/IntoDealItem";
import ManagersListByDeal from "@/entities/deal/ui/ManagersListByDeal";
import RowInfoDealProp from "@/entities/deal/ui/RowInfoDealProp";
import { Separator } from "@/shared/components/ui/separator";
import MotionDivY from "@/shared/custom-components/ui/MotionComponents/MotionDivY";
import ProtectedByDepartmentAffiliation from "@/shared/custom-components/ui/Protect/ProtectedByDepartmentAffiliation";
import TooltipComponent from "@/shared/custom-components/ui/TooltipComponent";
import { useTypedParams } from "@/shared/hooks/useTypedParams";
import withAuthGuard from "@/shared/lib/hoc/withAuthGuard";
import { formatterCurrency } from "@/shared/lib/utils";
import FileUploadForm from "@/widgets/Files/ui/UploadFile";

import { useGetProjectById } from "../api/hooks/query";
import {
  DealTypeLabels,
  DeliveryProjectLabels,
  DirectionProjectLabels,
  StatusProjectLabels,
} from "../lib/constants";

const FileList = dynamic(() => import("@/widgets/Files/ui/FileList"), {
  ssr: false,
});
const NotFoundDeal = dynamic(() => import("@/entities/deal/ui/NotFoundDeal"), {
  ssr: false,
});
const CardMainContact = dynamic(
  () => import("@/entities/contact/ui/CardMainContact"),
  {
    ssr: false,
  }
);
const ContactCardInDealInfo = dynamic(
  () => import("@/entities/contact/ui/ContactCardInDealInfo"),
  {
    ssr: false,
  }
);
const DelButtonDeal = dynamic(
  () => import("@/feature/deals/ui/Modals/DelButtonDeal"),
  { ssr: false }
);
const EditDealButtonIcon = dynamic(
  () => import("@/feature/deals/ui/Modals/EditDealButtonIcon"),
  { ssr: false }
);

const pageParamsSchema = z.object({
  dealId: z.string(),
});

const ProjectItemInfo = () => {
  const { dealId } = useTypedParams(pageParamsSchema);

  const { data: deal, isLoading } = useGetProjectById(dealId, false);

  const statusLabel =
    StatusProjectLabels[deal?.dealStatus as keyof typeof StatusProjectLabels] ||
    "Нет данных";
  const directionLabel =
    DirectionProjectLabels[
      deal?.direction as keyof typeof DirectionProjectLabels
    ] || "Нет данных";
  const deliveryLabel =
    DeliveryProjectLabels[
      deal?.deliveryType as keyof typeof DeliveryProjectLabels
    ] || "Нет данных";
  const typeLabel =
    DealTypeLabels[deal?.type as keyof typeof DealTypeLabels] || "Нет данных";

  if (isLoading) return <Loading />;
  if (!deal) return <NotFoundDeal />;

  const formattedDate = deal.createdAt?.toLocaleDateString() || "Нет данных";
  const formattedDelta = deal.delta
    ? formatterCurrency.format(parseFloat(deal.delta))
    : "Нет данных";
  const formattedCP = deal.amountCP
    ? formatterCurrency.format(parseFloat(deal.amountCP))
    : "Нет данных";
  const formattedPurchase = deal.amountPurchase
    ? formatterCurrency.format(parseFloat(deal.amountPurchase))
    : "Нет данных";
  const formattedWork = deal.amountWork
    ? formatterCurrency.format(parseFloat(deal.amountWork))
    : "Нет данных";

  return (
    <MotionDivY className="grid gap-2 p-4 max-h-[calc(100svh-var(--header-height)-2px)] overflow-auto">
      <div className="flex items-center justify-between rounded-md bg-muted p-2 pb-2">
        <div className="grid gap-1">
          <h1 className="text-2xl first-letter:capitalize">проект</h1>
          <p className="text-xs">Дата: {formattedDate}</p>
        </div>
        <ProtectedByDepartmentAffiliation>
          <div className="flex justify-end gap-2">
            <FileUploadForm
              userId={deal.userId}
              dealId={dealId}
              dealType="PROJECT"
            />
            <EditDealButtonIcon id={deal.id} type={deal.type} />
            <DelButtonDeal id={deal.id} type={deal.type} />
          </div>
        </ProtectedByDepartmentAffiliation>
      </div>

      <Separator />

      <ManagersListByDeal managers={deal.managers} userId={deal.userId} />

      <Separator />

      <div className="grid gap-2">
        <div className="grid grid-cols-1 gap-2 py-2 lg:grid-cols-[auto_1fr]">
          <div className="grid-rows-auto grid gap-2">
            <div className="grid min-w-64 gap-4">
              <IntoDealItem title="Объект">
                <div className="grid w-full gap-2">
                  <div className="flex w-full items-start justify-start gap-4 text-lg">
                    <Building
                      size="40"
                      strokeWidth={1}
                      className="icon-deal_info"
                    />
                    <p className="break-all text-md prop-deal-value min-h-10 px-2 flex-1 bg-stone-300 dark:bg-black">
                      {deal.nameObject}
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
                          <span className="break-all text-md prop-deal-value min-h-10 px-2 flex-1 bg-stone-300 dark:bg-black">
                            {statusLabel}
                          </span>
                        </TooltipComponent>
                      </p>
                    </div>
                  </div>
                </div>
              </IntoDealItem>
            </div>

            <div className="grid gap-2">
              <IntoDealItem title="Основной контакт">
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
                title="Информация о сделке"
                className="flex-item-contact"
              >
                <RowInfoDealProp
                  label="Название сделки:"
                  value={deal.nameDeal}
                  direction="column"
                />
                <RowInfoDealProp
                  label="Тип сделки:"
                  value={typeLabel}
                  direction="column"
                />
                <RowInfoDealProp
                  label="Дата запроса:"
                  value={deal.dateRequest?.toLocaleDateString()}
                  direction="column"
                />
              </IntoDealItem>

              <IntoDealItem title="Детали" className="flex-item-contact">
                <RowInfoDealProp label="Направление:" value={directionLabel} />
                <RowInfoDealProp label="Тип поставки:" value={deliveryLabel} />
              </IntoDealItem>

              <IntoDealItem title="Финансы" className="flex-item-contact">
                <RowInfoDealProp label="Дельта:" value={formattedDelta} />
                <RowInfoDealProp label="Сумма КП:" value={formattedCP} />
                <RowInfoDealProp
                  label="Сумма закупки:"
                  value={formattedPurchase}
                />
                <RowInfoDealProp label="Сумма работ:" value={formattedWork} />
              </IntoDealItem>
            </div>

            {deal.additionalContacts?.length > 0 && (
              <IntoDealItem title="Дополнительные контакты">
                <div className="flex h-full flex-wrap gap-2">
                  {deal.additionalContacts.map((contact) => (
                    <ContactCardInDealInfo key={contact.id} contact={contact} />
                  ))}
                </div>
              </IntoDealItem>
            )}
          </div>
        </div>

        <IntoDealItem title="Комментарии">
          <p className="first-letter:capitalize">
            {deal.comments || "Нет данных"}
          </p>
        </IntoDealItem>
      </div>

      <FileList
        data={{
          userId: deal.userId,
          dealId: deal.id,
          dealType: deal.type,
        }}
      />
    </MotionDivY>
  );
};

export default withAuthGuard(ProjectItemInfo);

ProjectItemInfo.displayName = "ProjectItemInfo";
