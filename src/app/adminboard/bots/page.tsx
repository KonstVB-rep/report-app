import { Suspense } from "react"
import { getAllBots } from "@/entities/tgBot/api"
import { LoaderCircleInWater } from "@/shared/custom-components/ui/Loaders"
import ClientBotsPage from "./ui/ClientBotsPage"

export const dynamic = "force-dynamic"
// revalidate = 0 не нужен, force-dynamic это уже гарантирует

const BotsPage = async () => {
  const allBots = await getAllBots()

  return (
    <Suspense
      fallback={
        <div className="flex h-[80vh] w-full items-center justify-center">
          <LoaderCircleInWater />
        </div>
      }
    >
      <ClientBotsPage initialBots={allBots} />
    </Suspense>
  )
}

export default BotsPage
