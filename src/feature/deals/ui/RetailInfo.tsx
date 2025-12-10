"use client"

import { Building, Info } from "lucide-react"
import dynamic from "next/dynamic"
import ManagersListByDeal from "@/entities/deal/ui/ManagersListByDeal"
import RowInfoDealProp from "@/entities/deal/ui/RowInfoDealProp"
import { LoaderCircle, LoaderCircleInWater } from "@/shared/custom-components/ui/Loaders"
import MotionDivY from "@/shared/custom-components/ui/MotionComponents/MotionDivY"
import TooltipComponent from "@/shared/custom-components/ui/TooltipComponent"
import FileUploadForm from "@/widgets/Files/ui/UploadFile"
import { useGetRetailById } from "../api/hooks/query"
import useNormalizeRetailData from "../lib/hooks/useNormalizeRetailData"
import FinanceInfo from "./FinanceInfo"
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
const DelButtonDeal = dynamic(() => import("@/feature/deals/ui/Modals/DelButtonDeal"), {
  ssr: false,
})
const EditDealButtonIcon = dynamic(() => import("@/feature/deals/ui/Modals/EditDealButtonIcon"), {
  ssr: false,
})

const RetailItemInfo = ({ dealId }: { dealId: string }) => {
  const { data: deal, isLoading } = useGetRetailById(dealId, false)

  const { dealInfo, dataFinance } = useNormalizeRetailData(deal)

  if (isLoading) {
    return <LoaderCircleInWater />
  }

  if (!deal) {
    return <NotFoundDeal />
  }

  return (
    <MotionDivY className="grid gap-2 p-4 max-h-[calc(100svh-var(--header-height)-2px)] overflow-auto">
      <div className="flex items-center justify-between rounded-md bg-muted p-2 pb-2">
        <div className="grid gap-1">
          <h1 className="text-2xl first-letter:capitalize">Розница</h1>
          <p className="text-xs">Дата: {deal.createdAt?.toLocaleDateString()}</p>
        </div>

        <div className="flex justify-end gap-2">
          <FileUploadForm dealId={dealId as string} dealType="RETAIL" userId={deal.userId} />
          <EditDealButtonIcon id={deal.id} type={deal.type} />
          <DelButtonDeal id={deal.id} type={deal.type} />
        </div>
      </div>

      <ManagersListByDeal managers={deal.managers} userId={deal.userId} />

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
              <CardMainContact contact={deal.contact} email={deal.email} phone={deal.phone} />
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

          {deal.additionalContacts?.length > 0 && (
            <IntoDealItem title={"Дополнительные контакты"}>
              <div className="flex h-full flex-wrap gap-2">
                {deal.additionalContacts.map((contact) => (
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
            userId: deal.userId,
            dealId: deal.id,
            dealType: deal.type,
          }}
        />
        <PreviewImagesList
          data={{
            userId: deal.userId,
            dealId: deal.id,
            dealType: deal.type,
          }}
        />
      </div>
    </MotionDivY>
  )
}

export default RetailItemInfo
