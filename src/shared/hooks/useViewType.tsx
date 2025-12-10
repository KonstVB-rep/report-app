"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback } from "react"

const useViewType = <T extends string>(defaultValue: T) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const currentView = (searchParams.get("viewType") as T) || defaultValue

  const handleViewChange = useCallback(
    (value: T) => {
      if (value === currentView) return

      const params = new URLSearchParams(searchParams.toString())
      params.set("viewType", value)

      router.push(`${pathname}?${params.toString()}`, { scroll: false })
    },
    [currentView, pathname, router, searchParams],
  )

  return {
    handleViewChange,
    currentView,
  }
}

export default useViewType
