"use client"

import type { ProjectResponseWithContactsAndFiles } from "@/entities/deal/types"
import { formatterCurrency } from "@/shared/lib/utils"
import {
  DealTypeLabels,
  DeliveryProjectLabels,
  DirectionProjectLabels,
  StatusProjectLabels,
} from "../constants"

const useNormalizeProjectData = (deal: ProjectResponseWithContactsAndFiles | null | undefined) => {
  const statusLabel =
    StatusProjectLabels[deal?.dealStatus as keyof typeof StatusProjectLabels] || "Нет данных"
  const directionLabel =
    DirectionProjectLabels[deal?.direction as keyof typeof DirectionProjectLabels] || "Нет данных"
  const deliveryLabel =
    DeliveryProjectLabels[deal?.deliveryType as keyof typeof DeliveryProjectLabels] || "Нет данных"
  const typeLabel = DealTypeLabels[deal?.type as keyof typeof DealTypeLabels] || "Нет данных"

  const formattedDate = deal?.createdAt?.toLocaleDateString() || "Нет данных"
  const formattedDelta = deal?.delta
    ? formatterCurrency.format(parseFloat(deal.delta))
    : "Нет данных"
  const formattedCP = deal?.amountCP
    ? formatterCurrency.format(parseFloat(deal.amountCP))
    : "Нет данных"
  const formattedPurchase = deal?.amountPurchase
    ? formatterCurrency.format(parseFloat(deal?.amountPurchase))
    : "Нет данных"
  const formattedWork = deal?.amountWork
    ? formatterCurrency.format(parseFloat(deal?.amountWork))
    : "Нет данных"

  const dataFinance = [
    {
      label: "Дельта:",
      value: formattedDelta,
    },
    {
      label: "Сумма КП:",
      value: formattedCP,
    },
    {
      label: "Сумма закупки:",
      value: formattedPurchase,
    },
    {
      label: "Сумма работ:",
      value: formattedWork,
    },
  ]

  return {
    dataFinance,
    formattedDate,
    statusLabel,
    directionLabel,
    deliveryLabel,
    typeLabel,
  }
}

export default useNormalizeProjectData
