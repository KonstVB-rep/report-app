"use client"

import { Building, FileDigit, Info } from "lucide-react"
import dynamic from "next/dynamic"
import type { DealRetail } from "@/entities/deal/types"
import ManagersListByDeal from "@/entities/deal/ui/ManagersListByDeal"
import RowInfoDealProp from "@/entities/deal/ui/RowInfoDealProp"
import { LoaderCircle } from "@/shared/custom-components/ui/Loaders"
import MotionDivY from "@/shared/custom-components/ui/MotionComponents/MotionDivY"
import TooltipComponent from "@/shared/custom-components/ui/TooltipComponent"
import useNormalizeRetailData from "../lib/hooks/useNormalizeRetailData"
import FinanceInfo from "./FinanceInfo"
import SettingDeal from "./SettingDeal"
import ValueSpan from "./ValueSpan"

const FileList = dynamic(() => import("@/widgets/Files/ui/FileList"), {
  ssr: false,
  loading: () => <LoaderCircle className="h-20 bg-muted rounded-md w-full px-4" />,
})
const PreviewImagesList = dynamic(() => import("@/widgets/Files/ui/PreviewImages"), {
  ssr: false,
  loading: () => <LoaderCircle className="h-20 bg-muted rounded-md w-full px-4" />,
})
const NotFoundDeal = dynamic(() => import("@/entities/deal/ui/NotFoundDeal"), {
  ssr: false,
})

const CardMainContact = dynamic(() => import("@/entities/contact/ui/CardMainContact"), {
  ssr: false,
})
const ContactCardInDealInfo = dynamic(() => import("@/entities/contact/ui/ContactCardInDealInfo"), {
  ssr: false,
})
const IntoDealItem = dynamic(() => import("@/entities/deal/ui/IntoDealItem"), {
  ssr: false,
})

const RetailItemInfo = ({ data }: { data: DealRetail }) => {
  const { dealInfo, dataFinance } = useNormalizeRetailData(data)

  if (!data) return <NotFoundDeal />

  return (
    <MotionDivY className="scrollbar-none grid grid-rows-[auto_auto_1fr_auto] gap-1 p-4 h-auto max-h-[calc(100svh-var(--header-height)-2px)] overflow-auto w-full">
      <div className="flex items-center justify-between rounded-md bg-muted p-2 pb-2">
        <div className="grid gap-1">
          <h1 className="text-2xl first-letter:capitalize">Розница</h1>
          <p className="text-xs">Дата: {data.createdAt?.toLocaleDateString()}</p>
        </div>

        <SettingDeal dealData={data} />
      </div>

      <ManagersListByDeal managers={data.managers} userId={data?.userId || "Не назначен"} />

      <div className="grid grid-cols-1 gap-2 py-2 lg:grid-cols-[1fr_2fr]">
        <div className="grid-rows-auto grid gap-2">
          <div className="grid min-w-64 gap-4">
            <IntoDealItem title={"Объект"}>
              <div className="flex w-full items-center justify-start gap-4 text-lg">
                <Building className="icon-deal_info" size="40" strokeWidth={1} />
                <ValueSpan>{dealInfo.nameObject}</ValueSpan>
              </div>

              <p className="flex flex-col items-center flex-wrap gap-2">
                <span className="text-sm first-letter:capitalize dark:font-light w-full flex items-center gap-4">
                  <FileDigit className="icon-deal_info" size="40" strokeWidth={1} />
                  <ValueSpan>ИНН: {data.inn || "------------"}</ValueSpan>
                </span>
              </p>

              <div className="first-letter:capitalize">
                <div className="flex flex-col  gap-2 justify-start">
                  <p className="flex items-center justify-start gap-4">
                    <Info className="icon-deal_info" size="40" strokeWidth={1} />
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
              <CardMainContact contact={data.contact} email={data.email} phone={data.phone} />
            </IntoDealItem>
          </div>
        </div>

        <div className="grid-rows-auto grid gap-2">
          <div className="flex flex-wrap gap-2">
            <IntoDealItem className="flex-item-contact" title={"Информация о сделке"}>
              <RowInfoDealProp direction="column" value={dealInfo?.nameDeal} />

              <RowInfoDealProp direction="row" label="Дата запроса:" value={dealInfo.dateRequest} />

              <RowInfoDealProp direction="column" label="Направление:" value={dealInfo.direction} />

              <RowInfoDealProp
                direction="column"
                label="Тип поставки:"
                value={dealInfo.deliveryType}
              />
            </IntoDealItem>

            <IntoDealItem className="flex-item-contact" title={"Финансы"}>
              <FinanceInfo data={dataFinance} />
            </IntoDealItem>
          </div>

          {data.additionalContacts?.length > 0 && (
            <IntoDealItem title={"Дополнительные контакты"}>
              <div className="flex h-full flex-wrap gap-2">
                {data.additionalContacts.map((contact) => (
                  <ContactCardInDealInfo contact={contact} key={contact.id} />
                ))}
              </div>
            </IntoDealItem>
          )}
        </div>
      </div>

      <IntoDealItem title={"Комментарии"}>
        <ValueSpan className="first-letter:capitalize">{dealInfo.comments}</ValueSpan>
      </IntoDealItem>

      <div className="flex flex-wrap gap-2">
        <FileList
          data={{
            userId: data.userId,
            dealId: data.id,
            dealType: data.type,
          }}
        />
        <PreviewImagesList
          data={{
            userId: data.userId,
            dealId: data.id,
            dealType: data.type,
          }}
        />
      </div>
    </MotionDivY>
  )
}

export default RetailItemInfo
