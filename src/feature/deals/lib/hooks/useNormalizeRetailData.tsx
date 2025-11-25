import type { RetailResponseWithContactsAndFiles } from "@/entities/deal/types"
import { formatterCurrency } from "@/shared/lib/utils"
import type {
  typeofDelivery,
  typeofDirections,
  typeofStatus,
} from "@/widgets/deal/model/columns-data-retail"
import {
  DealTypeLabels,
  DeliveryRetailLabels,
  DirectionRetailLabels,
  StatusRetailLabels,
} from "../constants"

const useNormalizeRetailData = (deal: RetailResponseWithContactsAndFiles | null | undefined) => {
  const statusLabel = StatusRetailLabels[deal?.dealStatus as typeofStatus] || "Нет данных"
  const directionLabel = DirectionRetailLabels[deal?.direction as typeofDirections] || "Нет данных"
  const deliveryLabel = DeliveryRetailLabels[deal?.deliveryType as typeofDelivery] || "Нет данных"
  const typeLabel = DealTypeLabels[deal?.type as keyof typeof DealTypeLabels] || "Нет данных"

  const dealInfo = {
    nameDeal: deal?.nameDeal,
    nameObject: deal?.nameObject,
    status: statusLabel,
    dealType: typeLabel,
    dateRequest: deal?.dateRequest?.toLocaleDateString(),
    direction: directionLabel,
    deliveryType: deliveryLabel,
    delta: deal?.delta ? formatterCurrency.format(+deal.delta) : "0,00",
    amountCP: deal?.amountCP ? formatterCurrency.format(+deal.amountCP) : "0,00",
    comments: deal?.comments || "Нет данных",
  }

  const dataFinance = [
    {
      label: "Дельта:",
      value: dealInfo.delta,
    },
    {
      label: "Сумма КП:",
      value: dealInfo.amountCP,
    },
  ]

  return {
    dataFinance,
    dealInfo,
  }
}

export default useNormalizeRetailData
