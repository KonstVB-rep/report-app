"use client"

import { LoaderCircleInWater } from "@/shared/custom-components/ui/Loaders"

const Loading = () => {
  return (
    <div className="grid p-4 place-items-center h-dvh">
      <LoaderCircleInWater />
    </div>
  )
}

export default Loading
