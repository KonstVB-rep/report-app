import MarketingDealsTable from "./MarketingDealsTable"

interface PageProps {
  params: {
    userId: string
  }
}

export default function Page({ params }: PageProps) {
  return <MarketingDealsTable userId={params.userId} />
}
