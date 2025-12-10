"use client"

import { Building, Info, PhoneOutgoing } from "lucide-react"
import dynamic from "next/dynamic"
import IntoDealItem from "@/entities/deal/ui/IntoDealItem"
import ManagersListByDeal from "@/entities/deal/ui/ManagersListByDeal"
import RowInfoDealProp from "@/entities/deal/ui/RowInfoDealProp"
import { LoaderCircle, LoaderCircleInWater } from "@/shared/custom-components/ui/Loaders"
import MotionDivY from "@/shared/custom-components/ui/MotionComponents/MotionDivY"
import ProtectedByDepartmentAffiliation from "@/shared/custom-components/ui/Protect/ProtectedByDepartmentAffiliation"
import TooltipComponent from "@/shared/custom-components/ui/TooltipComponent"
import FileUploadForm from "@/widgets/Files/ui/UploadFile"
import { useGetProjectById } from "../api/hooks/query"
import useNormalizeProjectData from "../lib/hooks/useNormalizeProjectData"
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
const DelButtonDeal = dynamic(() => import("@/feature/deals/ui/Modals/DelButtonDeal"), {
  ssr: false,
})
const EditDealButtonIcon = dynamic(() => import("@/feature/deals/ui/Modals/EditDealButtonIcon"), {
  ssr: false,
})

const ProjectItemInfo = ({ dealId }: { dealId: string }) => {
  const { data: deal, isLoading } = useGetProjectById(dealId, false)

  const { dataFinance, formattedDate, statusLabel, directionLabel, deliveryLabel, typeLabel } =
    useNormalizeProjectData(deal)

  if (isLoading) return <LoaderCircleInWater />
  if (!deal) return <NotFoundDeal />

  return (
    <MotionDivY className="grid gap-1 p-4 max-h-[calc(100svh-var(--header-height)-2px)] overflow-auto w-full">
      <div className="flex items-center justify-between rounded-md bg-muted p-2 pb-2">
        <div className="grid gap-1">
          <h1 className="text-2xl first-letter:capitalize">проект</h1>
          <p className="text-xs">Дата: {formattedDate}</p>
        </div>
        <ProtectedByDepartmentAffiliation>
          <div className="flex justify-end gap-2">
            <FileUploadForm dealId={dealId} dealType="PROJECT" userId={deal.userId} />
            <EditDealButtonIcon id={deal.id} type={deal.type} />
            <DelButtonDeal id={deal.id} type={deal.type} />
          </div>
        </ProtectedByDepartmentAffiliation>
      </div>

      <ManagersListByDeal managers={deal.managers} userId={deal.userId} />

      <div className="grid gap-2">
        {deal?.plannedDateConnection && (
          <div className="flex gap-2 items-center p-2 mt-2 border-blue-500 rounded border-2">
            <PhoneOutgoing className="text-orange-600" />
            <span>
              {" "}
              Плановая дата контакта: {deal?.plannedDateConnection?.toLocaleDateString()}
            </span>
          </div>
        )}
        <div className="grid grid-cols-1 gap-2 py-2 lg:grid-cols-[1fr_2fr]">
          <div className="grid-rows-auto grid gap-2">
            <div className="grid min-w-64 gap-4">
              <IntoDealItem title="Объект">
                <div className="grid w-full gap-2">
                  <div className="flex w-full items-start justify-start gap-4 text-lg">
                    <Building className="icon-deal_info" size="40" strokeWidth={1} />
                    <ValueSpan>{deal.nameObject}</ValueSpan>
                  </div>

                  <div className="first-letter:capitalize">
                    <div className="flex flex-col gap-2 justify-start">
                      <p className="flex items-center justify-start gap-4">
                        <Info className="icon-deal_info" size="40" strokeWidth={1} />
                        <TooltipComponent content="Статус сделки">
                          <ValueSpan>{statusLabel}</ValueSpan>
                        </TooltipComponent>
                      </p>
                    </div>
                  </div>
                </div>
              </IntoDealItem>
            </div>

            <div className="grid gap-2">
              <IntoDealItem title="Основной контакт">
                <CardMainContact contact={deal.contact} email={deal.email} phone={deal.phone} />
              </IntoDealItem>
            </div>
          </div>

          <div className="grid-rows-auto grid gap-2">
            <div className="flex flex-wrap gap-2">
              <IntoDealItem className="flex-item-contact" title="Информация о сделке">
                <RowInfoDealProp
                  direction="column"
                  label="Название сделки:"
                  value={deal.nameDeal}
                />

                <RowInfoDealProp direction="column" label="Тип сделки:" value={typeLabel} />

                <RowInfoDealProp
                  direction="column"
                  label="Дата запроса:"
                  value={deal.dateRequest?.toLocaleDateString()}
                />
              </IntoDealItem>

              <IntoDealItem className="flex-item-contact" title="Детали">
                <RowInfoDealProp label="Направление:" value={directionLabel} />

                <RowInfoDealProp label="Тип поставки:" value={deliveryLabel} />

                <hr className="w-full h-px rounded-lg bg-gray-500" />

                <FinanceInfo data={dataFinance} />
              </IntoDealItem>
            </div>

            {deal.additionalContacts?.length > 0 && (
              <IntoDealItem title="Дополнительные контакты">
                <div className="flex h-full flex-wrap gap-2">
                  {deal.additionalContacts.map((contact) => (
                    <ContactCardInDealInfo contact={contact} key={contact.id} />
                  ))}
                </div>
              </IntoDealItem>
            )}
          </div>
        </div>

        <IntoDealItem title="Комментарии">
          <ValueSpan className="first-letter:capitalize">{deal.comments || "Нет данных"}</ValueSpan>
        </IntoDealItem>
      </div>

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

export default ProjectItemInfo

ProjectItemInfo.displayName = "ProjectItemInfo"
