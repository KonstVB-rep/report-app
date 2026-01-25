import MarketingDealsTable from "./MarketingDealsTable"

interface PageProps {
  params: Promise<{
    userId: string
  }>
}

export default async function Page({ params }: PageProps) {
  const { userId } = await params

  return <MarketingDealsTable userId={userId} />
}
