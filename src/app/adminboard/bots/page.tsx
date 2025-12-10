import { Suspense } from "react"
import { LoaderCircleInWater } from "@/shared/custom-components/ui/Loaders"
import ClientBotsPage from "./ui/ClientBotsPage"

const BotsPage = async () => {
  return (
    <Suspense
      fallback={
        <div className="flex h-[80vh] w-full items-center justify-center">
          <LoaderCircleInWater />
        </div>
      }
    >
      <ClientBotsPage />
    </Suspense>
  )
}

export default BotsPage
