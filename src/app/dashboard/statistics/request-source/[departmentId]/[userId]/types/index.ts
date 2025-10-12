import type { AllStatusKeys } from "@/entities/deal/lib/constants"

export type Deal = {
  dateRequest: Date
  resource: string
  dealStatus: AllStatusKeys
}

export type Props = {
  data: {
    deals: Deal[] | []
    totalDealsCount: number
  }
}
