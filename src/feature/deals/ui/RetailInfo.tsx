"use client";

import { Separator } from "@radix-ui/react-separator";

import dynamic from "next/dynamic";

import { Building, Info } from "lucide-react";
import z from "zod";

import Loading from "@/app/dashboard/deal/[departmentId]/[dealType]/[dealId]/loading";
import ManagersListByDeal from "@/entities/deal/ui/ManagersListByDeal";
import RowInfoDealProp from "@/entities/deal/ui/RowInfoDealProp";
import MotionDivY from "@/shared/custom-components/ui/MotionComponents/MotionDivY";
import TooltipComponent from "@/shared/custom-components/ui/TooltipComponent";
import { useTypedParams } from "@/shared/hooks/useTypedParams";
import withAuthGuard from "@/shared/lib/hoc/withAuthGuard";
import FileUploadForm from "@/widgets/Files/ui/UploadFile";

import { useGetRetailById } from "../api/hooks/query";
import useNormalizeRetailData from "../lib/hooks/useNormalizeRetailData";
import FinanceInfo from "./FinanceInfo";
import ValueSpan from "./ValueSpan";

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
const IntoDealItem = dynamic(() => import("@/entities/deal/ui/IntoDealItem"), {
  ssr: false,
});
const DelButtonDeal = dynamic(
  () => import("@/feature/deals/ui/Modals/DelButtonDeal"),
  {
    ssr: false,
  }
);
const EditDealButtonIcon = dynamic(
  () => import("@/feature/deals/ui/Modals/EditDealButtonIcon"),
  { ssr: false }
);

const pageParamsSchema = z.object({
  dealId: z.string(),
});

const RetailItemInfo = () => {
  const { dealId } = useTypedParams(pageParamsSchema);
  const { data: deal, isLoading } = useGetRetailById(dealId, false);

  const { dealInfo, dataFinance } = useNormalizeRetailData(deal);

  if (isLoading) {
    return <Loading />;
  }

  if (!deal) {
    return <NotFoundDeal />;
  }

  return (
    <MotionDivY className="grid gap-2 p-4 max-h-[calc(100svh-var(--header-height)-2px)] overflow-auto">
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
          <DelButtonDeal id={deal.id} type={deal.type} />
        </div>
      </div>

      <Separator />

      <ManagersListByDeal managers={deal.managers} userId={deal.userId} />

      <Separator />

      <div className="grid grid-cols-1 gap-2 py-2 lg:grid-cols-[1fr_2fr]">
        <div className="grid-rows-auto grid gap-2">
          <div className="grid min-w-64 gap-4">
            <IntoDealItem title={"Объект"}>
              <div className="flex w-full items-center justify-start gap-4 text-lg">
                <Building
                  size="40"
                  strokeWidth={1}
                  className="icon-deal_info"
                />
                <ValueSpan>{dealInfo.nameObject}</ValueSpan>
              </div>
              <div className="first-letter:capitalize">
                <div className="flex flex-col  gap-2 justify-start">
                  <p className="flex items-center justify-start gap-4">
                    <Info
                      size="40"
                      strokeWidth={1}
                      className="icon-deal_info"
                    />
                    <TooltipComponent content="Статус сделки">
                      <ValueSpan>{dealInfo.status}</ValueSpan>
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

              <hr className="w-full h-[1px] rounded-lg bg-gray-500" />

              <FinanceInfo data={dataFinance} />
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
        <ValueSpan className="first-letter:capitalize">
          {dealInfo.comments}
        </ValueSpan>
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
