export type Deal = {
  dateRequest: Date
  resource: string
}

export type Props = {
  data: {
    deals: Deal[] | []
    totalDealsCount: number
  }
}
