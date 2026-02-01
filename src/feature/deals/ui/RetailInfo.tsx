"use client"

import { Building, Info } from "lucide-react"
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

const CardMainContact = dynamic(() => import("@/entities/contact/ui/CardMainContact"), {
  ssr: false,
})
const ContactCardInDealInfo = dynamic(() => import("@/entities/contact/ui/ContactCardInDealInfo"), {
  ssr: false,
})
const IntoDealItem = dynamic(() => import("@/entities/deal/ui/IntoDealItem"), {
  ssr: false,
})

const RetailItemInfo = ({ dealData }: { dealData: DealRetail }) => {
  const { dealInfo, dataFinance } = useNormalizeRetailData(dealData)

  return (
    <MotionDivY className="grid grid-rows-[auto_auto_1fr_auto] gap-1 p-4 h-auto max-h-[calc(100svh-var(--header-height)-2px)] overflow-auto">
      <div className="flex items-center justify-between rounded-md bg-muted p-2 pb-2">
        <div className="grid gap-1">
          <h1 className="text-2xl first-letter:capitalize">Розница</h1>
          <p className="text-xs">Дата: {dealData.createdAt?.toLocaleDateString()}</p>
        </div>

        <SettingDeal<DealRetail> dealData={dealData} />
      </div>

      <ManagersListByDeal managers={dealData.managers} userId={dealData?.userId || "Не назначен"} />

      <div className="grid grid-cols-1 gap-2 py-2 lg:grid-cols-[1fr_2fr]">
        <div className="grid-rows-auto grid gap-2">
          <div className="grid min-w-64 gap-4">
            <IntoDealItem title={"Объект"}>
              <div className="flex w-full items-center justify-start gap-4 text-lg">
                <Building className="icon-deal_info" size="40" strokeWidth={1} />
                <ValueSpan>{dealInfo.nameObject}</ValueSpan>
              </div>
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
              <CardMainContact
                contact={dealData.contact}
                email={dealData.email}
                phone={dealData.phone}
              />
            </IntoDealItem>
          </div>
        </div>

        <div className="grid-rows-auto grid gap-2">
          <div className="flex flex-wrap gap-2">
            <IntoDealItem className="flex-item-contact" title={"Информация о сделке"}>
              <RowInfoDealProp
                direction="column"
                label="Название сделки:"
                value={dealInfo?.nameDeal}
              />

              <RowInfoDealProp direction="column" label="Тип сделки:" value={dealInfo.dealType} />

              <RowInfoDealProp
                direction="column"
                label="Дата запроса:"
                value={dealInfo.dateRequest}
              />
            </IntoDealItem>

            <IntoDealItem className="flex-item-contact" title={"Детали"}>
              <RowInfoDealProp direction="column" label="Направление:" value={dealInfo.direction} />

              <RowInfoDealProp
                direction="column"
                label="Тип поставки:"
                value={dealInfo.deliveryType}
              />

              <hr className="w-full h-[] rounded-lg bg-gray-500" />

              <FinanceInfo data={dataFinance} />
            </IntoDealItem>
          </div>

          {dealData.additionalContacts?.length > 0 && (
            <IntoDealItem title={"Дополнительные контакты"}>
              <div className="flex h-full flex-wrap gap-2">
                {dealData.additionalContacts.map((contact) => (
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
            userId: dealData.userId,
            dealId: dealData.id,
            dealType: dealData.type,
          }}
        />
        <PreviewImagesList
          data={{
            userId: dealData.userId,
            dealId: dealData.id,
            dealType: dealData.type,
          }}
        />
      </div>
    </MotionDivY>
  )
}

export default RetailItemInfo
